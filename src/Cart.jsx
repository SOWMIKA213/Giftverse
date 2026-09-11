import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchCart,
    addToCartApi,
    removeFromCartApi,
    getStoredUserId,
    isUserLoggedIn
} from "./config/api";

function Cart() {
    const { productId, id } = useParams();
    const targetId = productId || id;
    const navigate = useNavigate();

    const [cartData, setCartData] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const loadCart = async () => {
        if (!isUserLoggedIn()) {
            navigate("/login", { state: { from: "/cart" } });
            return;
        }

        const userId = getStoredUserId();
        setLoading(true);
        setError("");

        try {
            // Handle targetId parameter if present (e.g. /cart/:productId)
            if (targetId) {
                await addToCartApi(userId, targetId, 1);
            }

            const data = await fetchCart(userId);
            setCartData(data || { items: [], totalAmount: 0 });
        } catch (err) {
            setError(err.message || "Failed to load cart. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, [targetId]);

    const handleQuantityChange = async (prodId, delta) => {
        const userId = getStoredUserId();
        if (!userId || actionLoading) return;

        setActionLoading(true);

        try {
            if (delta < 0) {
                // Find item quantity
                const item = cartData.items.find((i) => {
                    const idVal = i.productId?._id || i.productId;
                    return String(idVal) === String(prodId);
                });

                if (item && item.quantity <= 1) {
                    await removeItem(prodId);
                    setActionLoading(false);
                    return;
                }
            }

            const updatedRes = await addToCartApi(userId, prodId, delta);
            setCartData(updatedRes.cart || { items: [], totalAmount: 0 });
            window.dispatchEvent(new Event("storage"));
            await loadCart();
        } catch (err) {
            setMessage(`⚠️ ${err.message || "Failed to update quantity"}`);
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setActionLoading(false);
        }
    };

    const removeItem = async (prodId) => {
        const userId = getStoredUserId();
        if (!userId) return;

        setActionLoading(true);

        try {
            const res = await removeFromCartApi(userId, prodId);
            setCartData(res.cart || { items: [], totalAmount: 0 });
            setMessage("Item removed from cart");
            window.dispatchEvent(new Event("storage"));
            setTimeout(() => setMessage(""), 3000);
            await loadCart();
        } catch (err) {
            setMessage(`⚠️ ${err.message || "Failed to remove item"}`);
            setTimeout(() => setMessage(""), 3000);
        } finally {
            setActionLoading(false);
        }
    };

    const totalAmount = cartData.totalAmount || 0;

    return (
        <div className="page" style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto" }}>
            <h1 className="page-title" style={{ textAlign: "center", color: "darkmagenta", marginBottom: "20px" }}>
                🛒 Your Shopping Cart
            </h1>

            {message && (
                <div style={{ background: "#fff3cd", color: "#856404", padding: "10px", borderRadius: "5px", textAlign: "center", marginBottom: "15px" }}>
                    {message}
                </div>
            )}

            {loading && (
                <div style={{ textAlign: "center", padding: "40px", fontSize: "18px", color: "darkmagenta" }}>
                    🔄 Loading shopping cart...
                </div>
            )}

            {!loading && error && (
                <div style={{ background: "#f8d7da", color: "#721c24", padding: "15px", borderRadius: "8px", textAlign: "center", marginBottom: "20px" }}>
                    ⚠️ {error}
                </div>
            )}

            {!loading && !error && (!cartData.items || cartData.items.length === 0) ? (
                <div className="empty-box" style={{ textAlign: "center", background: "#fff", padding: "50px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                    <h2>Your Cart is Currently Empty</h2>
                    <p style={{ margin: "15px 0", color: "#666" }}>Explore our thoughtful collection of gifts or design your own!</p>
                    <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
                        <button className="order-btn" onClick={() => navigate("/products")}>
                            Browse Products
                        </button>
                        <button className="order-btn" onClick={() => navigate("/customizegift")} style={{ background: "#7209b7" }}>
                            🎁 Customize a Gift
                        </button>
                    </div>
                </div>
            ) : (
                !loading && !error && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
                        <div className="cart-list" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {cartData.items.map((item, index) => {
                                const prodObj = item.productId || {};
                                const prodId = prodObj._id || prodObj.id || item.productId;
                                const prodName = prodObj.name || item.name || "Gift Item";
                                const prodPrice = prodObj.price || item.price || 0;
                                const prodImg = prodObj.image || item.image || "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                                const cust = item.customization || {};

                                return (
                                    <div
                                        key={prodId || index}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "20px",
                                            background: "#fff",
                                            padding: "20px",
                                            borderRadius: "12px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                            flexWrap: "wrap"
                                        }}
                                    >
                                        <img
                                            src={prodImg}
                                            alt={prodName}
                                            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                                            }}
                                        />

                                        <div style={{ flex: 1, minWidth: "200px" }}>
                                            <h3 style={{ color: "darkmagenta", margin: "0 0 5px 0" }}>{prodName}</h3>
                                            <p style={{ fontWeight: "bold", color: "#d4af37", margin: "0 0 5px 0" }}>
                                                Rs. {prodPrice}
                                            </p>

                                            {/* Display customization details if present */}
                                            {cust && (cust.recipientName || cust.message) && (
                                                <div style={{ background: "#f8f9fa", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", marginTop: "5px", color: "#444" }}>
                                                    {cust.recipientName && <p style={{ margin: "2px 0" }}><strong>Recipient:</strong> {cust.recipientName}</p>}
                                                    {cust.message && <p style={{ margin: "2px 0" }}><strong>Message:</strong> "{cust.message}"</p>}
                                                    {cust.fontStyle && <p style={{ margin: "2px 0" }}><strong>Font:</strong> {cust.fontStyle}</p>}
                                                    {cust.textColor && <p style={{ margin: "2px 0" }}><strong>Color:</strong> {cust.textColor}</p>}
                                                    {cust.giftWrap && <p style={{ margin: "2px 0" }}><strong>Gift Wrap:</strong> Yes (+Rs. {cust.wrapPrice || 0})</p>}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <button
                                                onClick={() => handleQuantityChange(prodId, -1)}
                                                disabled={actionLoading}
                                                style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid darkmagenta", background: "#fff", color: "darkmagenta", cursor: "pointer", fontWeight: "bold" }}
                                            >
                                                -
                                            </button>
                                            <span style={{ fontSize: "16px", fontWeight: "bold" }}>{item.quantity || 1}</span>
                                            <button
                                                onClick={() => handleQuantityChange(prodId, 1)}
                                                disabled={actionLoading}
                                                style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid darkmagenta", background: "#fff", color: "darkmagenta", cursor: "pointer", fontWeight: "bold" }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div style={{ minWidth: "90px", textAlign: "right" }}>
                                            <p style={{ fontWeight: "bold", fontSize: "16px", color: "darkmagenta" }}>
                                                Rs. {prodPrice * (item.quantity || 1)}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => removeItem(prodId)}
                                            disabled={actionLoading}
                                            style={{ background: "#ff4d6d", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
                                        >
                                            ❌ Remove
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div
                            style={{
                                background: "#fff",
                                padding: "25px",
                                borderRadius: "12px",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                                marginTop: "10px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px"
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
                                <h2 style={{ color: "darkmagenta", margin: 0 }}>Order Summary</h2>
                                <h3 style={{ color: "darkmagenta", margin: 0 }}>Total: Rs. {totalAmount}</h3>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                                <button
                                    className="order-btn"
                                    onClick={() => navigate("/products")}
                                    style={{ background: "#f8f9fa", color: "darkmagenta", border: "1px solid darkmagenta" }}
                                >
                                    ← Continue Shopping
                                </button>
                                <button
                                    className="order-btn"
                                    onClick={() => navigate("/checkout")}
                                    style={{ background: "darkmagenta", color: "#fff", padding: "12px 30px", fontSize: "16px" }}
                                >
                                    Proceed to Checkout →
                                </button>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export default Cart;