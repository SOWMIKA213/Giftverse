import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchWishlist,
    removeFromWishlistApi,
    addToCartApi,
    getStoredUserId,
    isUserLoggedIn
} from "./config/api";

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const loadWishlistData = async () => {
        if (!isUserLoggedIn()) {
            navigate("/login", { state: { from: "/wishlist" } });
            return;
        }

        const userId = getStoredUserId();
        setLoading(true);
        setError("");

        try {
            const data = await fetchWishlist(userId);
            // Backend returns: { _id, userId, products: [{ productId: { _id, name, price, image... } }] }
            const rawProducts = (data && data.products) || [];
            // Extract populated product documents safely
            const validItems = rawProducts
                .map((item) => item.productId)
                .filter((p) => p && (p._id || p.id));
            setWishlistItems(validItems);
        } catch (err) {
            setError(err.message || "Failed to load wishlist. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWishlistData();
    }, []);

    // REMOVE WISHLIST ITEM
    const removeWishlist = async (productId) => {
        const userId = getStoredUserId();
        if (!userId) return;

        try {
            await removeFromWishlistApi(userId, productId);
            setMessage("❌ Removed from Wishlist");
            setWishlistItems((prev) => prev.filter((item) => String(item._id || item.id) !== String(productId)));
            window.dispatchEvent(new Event("storage"));
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage(`⚠️ ${err.message || "Failed to remove item"}`);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    // ADD TO CART
    const addToCart = async (product) => {
        if (!isUserLoggedIn()) {
            navigate("/login", { state: { from: "/wishlist" } });
            return;
        }

        const userId = getStoredUserId();
        const productId = product._id || product.id;

        try {
            await addToCartApi(userId, productId, 1);
            setMessage("🛒 Product added to Cart");
            window.dispatchEvent(new Event("storage"));
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage(`⚠️ ${err.message || "Failed to add to cart"}`);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    return (
        <div className="wishlist-container">
            <h1 className="wishlist-title">💖 My Wishlist</h1>

            {message && <div className="wishlist-alert">{message}</div>}

            {loading && (
                <div style={{ textAlign: "center", padding: "40px", fontSize: "18px", color: "darkmagenta" }}>
                    🔄 Loading your wishlist...
                </div>
            )}

            {!loading && error && (
                <div style={{ background: "#f8d7da", color: "#721c24", padding: "15px", borderRadius: "8px", textAlign: "center", margin: "20px 0" }}>
                    ⚠️ {error}
                </div>
            )}

            {!loading && !error && wishlistItems.length === 0 ? (
                <div className="wishlist-empty-card">
                    <div className="wishlist-empty-icon">💖</div>
                    <h2 className="wishlist-empty-heading">My Wishlist</h2>
                    <p className="wishlist-empty-text">Your Wishlist is Empty</p>
                    <button
                        className="wishlist-shop-btn"
                        onClick={() => navigate("/products")}
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                !loading && !error && (
                    <div className="wishlist-grid">
                        {wishlistItems.map((product) => {
                            const prodId = product._id || product.id;
                            return (
                                <div className="wishlist-card" key={prodId}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="wishlist-card-image"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                                        }}
                                    />
                                    <div>
                                        <h2 className="wishlist-card-title">{product.name}</h2>
                                        <h3 className="wishlist-card-price">Rs. {product.price}</h3>
                                        {product.occasion && (
                                            <p className="wishlist-card-desc" style={{ fontSize: "13px", color: "#666" }}>
                                                Occasion: {product.occasion}
                                            </p>
                                        )}
                                    </div>

                                    <div className="wishlist-card-actions">
                                        <button
                                            className="wishlist-remove-btn"
                                            onClick={() => removeWishlist(prodId)}
                                        >
                                            ❌ Remove
                                        </button>
                                        <button
                                            className="wishlist-cart-btn"
                                            onClick={() => addToCart(product)}
                                        >
                                            🛒 Add to Cart
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

export default Wishlist;