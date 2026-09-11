import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchOrders,
    fetchProductById,
    createOrderApi,
    getStoredUserId,
    getStoredUser,
    isUserLoggedIn
} from "./config/api";

function Orders() {
    const { id, productId } = useParams();
    const targetId = id || productId;
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // For single quick order flow
    const [singleProduct, setSingleProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!isUserLoggedIn()) {
            navigate("/login", { state: { from: "/orders" } });
            return;
        }

        const userId = getStoredUserId();
        let isMounted = true;
        setLoading(true);
        setError("");

        // If targetId is provided, check if it's a quick order for a product
        if (targetId) {
            fetchProductById(targetId)
                .then((prod) => {
                    if (isMounted && prod) {
                        setSingleProduct(prod);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    // Ignore product fetch error and load user orders
                });
        }

        fetchOrders(userId)
            .then((data) => {
                if (isMounted) {
                    setOrders(data || []);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message || "Failed to fetch orders from server");
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [targetId]);

    const handleConfirmSingleOrder = async () => {
        if (!singleProduct) return;
        const userId = getStoredUserId();
        if (!userId) {
            navigate("/login", { state: { from: `/order/${targetId}` } });
            return;
        }

        const currentUser = getStoredUser() || {};
        setActionLoading(true);
        setMessage("");

        const prodId = singleProduct._id || singleProduct.id;
        const orderPayload = {
            userId,
            items: [
                {
                    productId: prodId,
                    name: singleProduct.name,
                    price: Number(singleProduct.price),
                    quantity: Number(quantity),
                    customization: {}
                }
            ],
            shippingAddress: {
                name: currentUser.name || "Customer",
                phone: currentUser.phone || "N/A",
                address: "Default Delivery Address",
                city: "N/A",
                state: "N/A",
                pincode: "N/A"
            },
            paymentMethod: "COD",
            totalAmount: Number(singleProduct.price) * Number(quantity)
        };

        try {
            await createOrderApi(orderPayload);
            setMessage("🎉 Order Placed Successfully!");
            window.dispatchEvent(new Event("storage"));
            setTimeout(() => {
                setSingleProduct(null);
                navigate("/orders");
            }, 1500);
        } catch (err) {
            setMessage(`⚠️ ${err.message || "Failed to place order"}`);
        } finally {
            setActionLoading(false);
        }
    };

    if (singleProduct && targetId) {
        return (
            <div className="page" style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto", background: "#fff", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "center" }}>
                <h1 style={{ color: "darkmagenta", marginBottom: "20px" }}>📦 Quick Order</h1>

                {message && (
                    <div className="success-message" style={{ background: "#e8f5e9", color: "#2e7d32", padding: "12px", borderRadius: "8px", marginBottom: "15px", fontWeight: "bold" }}>
                        {message}
                    </div>
                )}

                <img
                    src={singleProduct.image}
                    alt={singleProduct.name}
                    style={{ width: "220px", height: "220px", objectFit: "cover", borderRadius: "10px", margin: "0 auto 15px auto" }}
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                    }}
                />

                <h2 style={{ color: "darkmagenta" }}>{singleProduct.name}</h2>
                <h3 style={{ color: "#d4af37", margin: "10px 0" }}>Rs. {singleProduct.price}</h3>

                <div style={{ margin: "20px 0", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                    <label style={{ fontWeight: "bold" }}>Quantity:</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ width: "70px", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px", textAlign: "center" }}
                    />
                </div>

                <p style={{ fontWeight: "bold", fontSize: "18px", color: "darkmagenta", marginBottom: "20px" }}>
                    Total: Rs. {singleProduct.price * quantity}
                </p>

                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button className="order-btn" onClick={() => navigate("/products")} style={{ background: "#f8f9fa", color: "darkmagenta", border: "1px solid darkmagenta" }}>
                        Cancel
                    </button>
                    <button className="order-btn" onClick={handleConfirmSingleOrder} disabled={actionLoading} style={{ background: "darkmagenta", color: "#fff" }}>
                        Confirm Order
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page" style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
            <h1 className="page-title" style={{ textAlign: "center", color: "darkmagenta", marginBottom: "20px" }}>
                📦 My Orders
            </h1>

            {loading && (
                <div style={{ textAlign: "center", padding: "40px", fontSize: "18px", color: "darkmagenta" }}>
                    🔄 Loading your orders...
                </div>
            )}

            {!loading && error && (
                <div style={{ background: "#f8d7da", color: "#721c24", padding: "15px", borderRadius: "8px", textAlign: "center", marginBottom: "20px" }}>
                    ⚠️ {error}
                </div>
            )}

            {!loading && !error && orders.length === 0 ? (
                <div className="empty-box" style={{ textAlign: "center", background: "#fff", padding: "50px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                    <h2>No Orders Found</h2>
                    <p style={{ margin: "15px 0", color: "#666" }}>You haven't placed any orders yet.</p>
                    <button className="order-btn" onClick={() => navigate("/products")}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                !loading && !error && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {orders.map((ord, idx) => {
                            const displayId = (ord._id || ord.orderId || `ORD-${idx}`).substring(0, 10).toUpperCase();
                            const orderDate = ord.createdAt
                                ? new Date(ord.createdAt).toLocaleDateString()
                                : ord.date || "Recently";

                            return (
                                <div
                                    key={ord._id || idx}
                                    style={{
                                        background: "#fff",
                                        padding: "20px",
                                        borderRadius: "12px",
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                                        borderLeft: "5px solid darkmagenta"
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
                                        <div>
                                            <h3 style={{ margin: 0, color: "darkmagenta" }}>Order #{displayId}</h3>
                                            <span style={{ fontSize: "13px", color: "#777" }}>Placed on: {orderDate}</span>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "5px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>
                                                {ord.status || "Pending"}
                                            </span>
                                            <p style={{ margin: "5px 0 0 0", fontWeight: "bold", color: "#d4af37" }}>
                                                Total: Rs. {ord.totalAmount}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {ord.items && ord.items.map((item, itemIdx) => {
                                            const prodObj = item.productId || {};
                                            const prodImg = prodObj.image || item.image || "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                                            const prodName = prodObj.name || item.name || "Gift Item";
                                            const prodPrice = item.price || prodObj.price || 0;

                                            return (
                                                <div key={itemIdx} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                                    <img
                                                        src={prodImg}
                                                        alt={prodName}
                                                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                                                        onError={(e) => {
                                                            e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                                                        }}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <h4 style={{ margin: 0, color: "#333" }}>{prodName}</h4>
                                                        <p style={{ margin: "2px 0", fontSize: "13px", color: "#666" }}>
                                                            Qty: {item.quantity || 1} x Rs. {prodPrice}
                                                        </p>
                                                        {item.customization && item.customization.recipientName && (
                                                            <p style={{ margin: "2px 0", fontSize: "12px", color: "darkmagenta" }}>
                                                                Recipient: {item.customization.recipientName}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
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

export default Orders;