import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchProductsByOccasion,
    fetchProducts,
    fetchProductById,
    addToWishlistApi,
    addToCartApi,
    isUserLoggedIn,
    getStoredUserId
} from "./config/api";

// ======================================================
// PRODUCT LIST - Occasion products
// ======================================================

export function ProductList() {
    const { occasionId } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const normalizedOccasion = (occasionId || "").toLowerCase();
    const displayTitle = occasionId ? occasionId.charAt(0).toUpperCase() + occasionId.slice(1) : "All";

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError("");

        // First try occasion endpoint
        fetchProductsByOccasion(normalizedOccasion)
            .then((data) => {
                if (isMounted) {
                    if (Array.isArray(data) && data.length > 0) {
                        setProducts(data);
                        setLoading(false);
                    } else {
                        // Fallback fetch all and filter case-insensitively
                        fetchProducts()
                            .then((allProds) => {
                                if (isMounted) {
                                    const filtered = (allProds || []).filter((p) => {
                                        if (!p.occasion) return false;
                                        const occ = p.occasion.toLowerCase();
                                        return occ === normalizedOccasion || occ.includes(normalizedOccasion) || normalizedOccasion.includes(occ);
                                    });
                                    setProducts(filtered);
                                    setLoading(false);
                                }
                            })
                            .catch((err) => {
                                if (isMounted) {
                                    setError(err.message || "Unable to load products");
                                    setLoading(false);
                                }
                            });
                    }
                }
            })
            .catch(() => {
                // Fallback fetch all and filter
                fetchProducts()
                    .then((allProds) => {
                        if (isMounted) {
                            const filtered = (allProds || []).filter((p) => {
                                if (!p.occasion) return false;
                                const occ = p.occasion.toLowerCase();
                                return occ === normalizedOccasion || occ.includes(normalizedOccasion) || normalizedOccasion.includes(occ);
                            });
                            setProducts(filtered);
                            setLoading(false);
                        }
                    })
                    .catch((err) => {
                        if (isMounted) {
                            setError(err.message || "Unable to load products");
                            setLoading(false);
                        }
                    });
            });

        return () => {
            isMounted = false;
        };
    }, [normalizedOccasion]);

    return (
        <div className="products-page">
            <h1 className="occasion-title">{displayTitle} Gifts</h1>

            {loading && (
                <div style={{ textAlign: "center", padding: "40px", fontSize: "18px", color: "darkmagenta" }}>
                    🔄 Loading {displayTitle} gifts...
                </div>
            )}

            {!loading && error && (
                <div style={{ background: "#f8d7da", color: "#721c24", padding: "15px", borderRadius: "8px", textAlign: "center", margin: "20px 0" }}>
                    ⚠️ {error}
                </div>
            )}

            {!loading && !error && products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                    <h2>No gifts found for this occasion.</h2>
                    <button className="order-btn" onClick={() => navigate("/products")} style={{ marginTop: "20px" }}>
                        View All Products
                    </button>
                </div>
            ) : (
                !loading && !error && (
                    <div className="product-container">
                        {products.map((product) => {
                            const prodId = product._id || product.id;
                            return (
                                <div className="product-card" key={prodId}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-list-image"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                                        }}
                                    />
                                    <h2>{product.name}</h2>
                                    <p className="product-price">Rs. {product.price}</p>
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                                        <button
                                            className="view-btn"
                                            onClick={() => navigate(`/product/${prodId}`)}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            className="cart-btn"
                                            onClick={() => navigate("/customizegift", { state: { product } })}
                                            style={{ background: "#7209b7", color: "#fff" }}
                                        >
                                            🎁 Customize
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
}

// ======================================================
// PRODUCT DETAILS
// ======================================================

function ProductDetails() {
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

        if (!targetId) {
            // If no ID passed in URL, fetch first available product or display empty
            fetchProducts()
                .then((data) => {
                    if (isMounted) {
                        if (data && data.length > 0) {
                            setProduct(data[0]);
                        } else {
                            setError("Product not found");
                        }
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    if (isMounted) {
                        setError(err.message || "Unable to fetch product");
                        setLoading(false);
                    }
                });
            return;
        }

        setLoading(true);
        setError("");

        fetchProductById(targetId)
            .then((data) => {
                if (isMounted) {
                    setProduct(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                // If ID didn't match directly, search in products list
                fetchProducts()
                    .then((allProds) => {
                        if (isMounted) {
                            const found = (allProds || []).find(
                                (p) => String(p._id) === String(targetId) || String(p.id) === String(targetId)
                            );
                            if (found) {
                                setProduct(found);
                            } else {
                                setError("Product not found");
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
            navigate("/login", { state: { from: `/product/${targetId || ""}` } });
            return false;
        }
        return true;
    };

    // ADD TO WISHLIST
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

    // ADD TO CART
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

    // ORDER NOW
    const orderNow = async () => {
        if (!requireLogin()) return;
        await addToCart();
        navigate("/checkout");
    };

    // CUSTOMIZE THIS GIFT
    const customizeGift = () => {
        navigate("/customizegift", { state: { product } });
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "60px", color: "darkmagenta", fontSize: "18px" }}>
                🔄 Loading product details...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="not-found" style={{ textAlign: "center", padding: "50px" }}>
                <h2>Product Not Found</h2>
                <p style={{ color: "#666", margin: "10px 0" }}>{error || "The requested product does not exist."}</p>
                <button className="order-btn" onClick={() => navigate("/products")}>
                    Go to Products
                </button>
            </div>
        );
    }

    return (
        <div className="details-page">
            <div className="details-card">
                {/* PRODUCT IMAGE */}
                <div className="details-image-box">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="details-image"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                        }}
                    />
                </div>

                {/* PRODUCT DETAILS */}
                <div className="details-info">
                    <h1>{product.name}</h1>
                    <h2 className="details-price">Rs. {product.price}</h2>
                    <p>
                        <strong>Occasion:</strong> {product.occasion}
                    </p>
                    <p className="details-description">
                        {product.description || "A lovely high-quality gift crafted for your special moments."}
                    </p>

                    {/* MESSAGE */}
                    {message && <div className="success-message">{message}</div>}

                    {/* BUTTONS */}
                    <div className="details-buttons" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                        <button className="wishlist-btn" onClick={addToWishlist} disabled={actionLoading}>
                            ❤️ Wishlist
                        </button>

                        <button className="cart-btn" onClick={addToCart} disabled={actionLoading}>
                            🛒 Add to Cart
                        </button>

                        <button className="order-btn" onClick={customizeGift} style={{ background: "#7209b7" }}>
                            🎁 Customize Gift
                        </button>

                        <button className="order-btn" onClick={orderNow} disabled={actionLoading}>
                            📦 Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;