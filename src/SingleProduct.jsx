import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchProductById,
    fetchProducts,
    addToWishlistApi,
    addToCartApi,
    isUserLoggedIn,
    getStoredUserId
} from "./config/api";

function SingleProduct() {
    const { id, productId } = useParams();
    const targetId = id || productId;
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError("");

        if (!targetId) {
            setError("No product ID specified");
            setLoading(false);
            return;
        }

        fetchProductById(targetId)
            .then((data) => {
                if (isMounted) {
                    setProduct(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                fetchProducts()
                    .then((allProds) => {
                        if (isMounted) {
                            const found = (allProds || []).find(
                                (p) => String(p._id) === String(targetId) || String(p.id) === String(targetId)
                            );
                            if (found) {
                                setProduct(found);
                            } else {
                                setError("Product Not Found");
                            }
                            setLoading(false);
                        }
                    })
                    .catch((err) => {
                        if (isMounted) {
                            setError(err.message || "Unable to fetch product details");
                            setLoading(false);
                        }
                    });
            });

        return () => {
            isMounted = false;
        };
    }, [targetId]);

    const requireLogin = () => {
        if (!isUserLoggedIn()) {
            navigate("/login", { state: { from: `/product/${targetId}` } });
            return false;
        }
        return true;
    };

    const addToWishlist = async () => {
        if (!requireLogin()) return;
        const userId = getStoredUserId();
        const prodId = product._id || product.id;

        setActionLoading(true);
        setMessage("");

        try {
            await addToWishlistApi(userId, prodId);
            setMessage("❤️ Added to Wishlist");
            window.dispatchEvent(new Event("storage"));
        } catch (err) {
            if (err.message && err.message.toLowerCase().includes("already in wishlist")) {
                setMessage("❤️ Product already in Wishlist");
            } else {
                setMessage(`⚠️ ${err.message || "Failed to add to wishlist"}`);
            }
        } finally {
            setActionLoading(false);
        }
    };

    const addToCart = async () => {
        if (!requireLogin()) return;
        const userId = getStoredUserId();
        const prodId = product._id || product.id;

        setActionLoading(true);
        setMessage("");

        try {
            await addToCartApi(userId, prodId, 1);
            setMessage("🛒 Added to Cart");
            window.dispatchEvent(new Event("storage"));
        } catch (err) {
            setMessage(`⚠️ ${err.message || "Failed to add to cart"}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleOrderNow = async () => {
        if (!requireLogin()) return;
        await addToCart();
        navigate("/checkout");
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "60px", color: "darkmagenta", fontSize: "18px" }}>
                🔄 Loading product information...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="not-found" style={{ textAlign: "center", padding: "50px" }}>
                <h1>Product Not Found</h1>
                <p style={{ color: "#666", margin: "10px 0" }}>{error || "The product you are looking for does not exist."}</p>
                <button className="order-btn" onClick={() => navigate("/products")} style={{ marginTop: "20px" }}>
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="single-product" style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
            <div className="single-product-card" style={{ display: "flex", gap: "30px", flexWrap: "wrap", background: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "350px", height: "350px", objectFit: "cover", borderRadius: "10px" }}
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                    }}
                />

                <div className="product-info" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h1 style={{ color: "darkmagenta", fontSize: "28px", marginBottom: "10px" }}>{product.name}</h1>
                    <h2 style={{ color: "#d4af37", fontSize: "24px", marginBottom: "15px" }}>Rs. {product.price}</h2>
                    <p style={{ fontSize: "16px", margin: "5px 0" }}>
                        <strong>Occasion:</strong> {product.occasion}
                    </p>
                    <p style={{ color: "#666", marginTop: "10px", lineHeight: "1.5" }}>
                        {product.description || "A beautiful gift designed to make your loved ones feel special."}
                    </p>

                    {message && (
                        <div className="success-message" style={{ background: "#e8f5e9", color: "#2e7d32", padding: "10px", borderRadius: "5px", margin: "15px 0", fontWeight: "bold" }}>
                            {message}
                        </div>
                    )}

                    <div className="product-actions" style={{ display: "flex", gap: "12px", marginTop: "25px", flexWrap: "wrap" }}>
                        <button className="wishlist-btn" onClick={addToWishlist} disabled={actionLoading}>
                            ❤️ Wishlist
                        </button>
                        <button className="cart-btn" onClick={addToCart} disabled={actionLoading}>
                            🛒 Add to Cart
                        </button>
                        <button
                            className="order-btn"
                            onClick={() => navigate("/customizegift", { state: { product } })}
                            style={{ background: "#7209b7" }}
                        >
                            🎁 Customize
                        </button>
                        <button className="order-btn" onClick={handleOrderNow} disabled={actionLoading}>
                            📦 Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleProduct;