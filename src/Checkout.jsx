import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchCart,
    createOrderApi,
    getStoredUserId,
    getStoredUser,
    isUserLoggedIn
} from "./config/api";

function Checkout() {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(true);

    const currentUser = getStoredUser() || {};

    const [name, setName] = useState(currentUser.name || "");
    const [email, setEmail] = useState(currentUser.email || "");
    const [phone, setPhone] = useState(currentUser.phone || "");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isUserLoggedIn()) {
            navigate("/login", { state: { from: "/checkout" } });
            return;
        }

        const userId = getStoredUserId();
        setLoading(true);

        fetchCart(userId)
            .then((data) => {
                setCartData(data || { items: [], totalAmount: 0 });
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Unable to load cart for checkout");
                setLoading(false);
            });
    }, []);

    const cartItems = cartData.items || [];
    const totalCost = cartData.totalAmount || 0;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim() || !address.trim() || !phone.trim()) {
            setError("Please fill in all required shipping details (Name, Address, Phone).");
            return;
        }

        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        const userId = getStoredUserId();
        if (!userId) {
            navigate("/login", { state: { from: "/checkout" } });
            return;
        }

        setIsSubmitting(true);

        // Format items for backend Order schema
        const formattedItems = cartItems.map((item) => {
            const prodObj = item.productId || {};
            return {
                productId: prodObj._id || prodObj.id || item.productId,
                name: prodObj.name || item.name || "Gift Item",
                price: Number(prodObj.price || item.price || 0),
                quantity: Number(item.quantity || 1),
                customization: item.customization || {}
            };
        });

        const orderPayload = {
            userId,
            items: formattedItems,
            shippingAddress: {
                name: name.trim(),
                phone: phone.trim(),
                address: address.trim(),
                city: city.trim() || "N/A",
                state: state.trim() || "N/A",
                pincode: pincode.trim() || "N/A"
            },
            paymentMethod: paymentMethod.toUpperCase(),
            totalAmount: totalCost
        };

        try {
            const response = await createOrderApi(orderPayload);
            if (response && response.order) {
                window.dispatchEvent(new Event("storage"));
                navigate("/orders");
            } else {
                throw new Error("Order creation failed");
            }
        } catch (err) {
            setError(err.message || "Failed to place order. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "60px", color: "darkmagenta", fontSize: "18px" }}>
                🔄 Loading order details...
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="page" style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
                <h1 style={{ color: "darkmagenta" }}>Checkout</h1>
                <p style={{ margin: "20px 0" }}>Your cart is empty. Add items before checking out.</p>
                <button className="order-btn" onClick={() => navigate("/products")}>
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div className="page" style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
            <h1 className="page-title" style={{ textAlign: "center", color: "darkmagenta", marginBottom: "30px" }}>
                💳 Checkout & Shipping
            </h1>

            {error && (
                <div style={{ background: "#f8d7da", color: "#721c24", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontWeight: "bold" }}>
                    {error}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }} className="checkout-grid">
                {/* Shipping Details Form */}
                <form onSubmit={handlePlaceOrder} style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "15px" }}>
                    <h2 style={{ color: "darkmagenta", fontSize: "20px", margin: 0 }}>Shipping Information</h2>

                    <div>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>Full Name *</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>Phone Number *</label>
                        <input
                            type="tel"
                            placeholder="Enter contact phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>Delivery Address *</label>
                        <textarea
                            rows="3"
                            placeholder="Enter detailed delivery address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "Georgia, serif" }}
                            required
                        ></textarea>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                        <div>
                            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "13px" }}>City</label>
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "13px" }}>State</label>
                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px", fontSize: "13px" }}>Pincode</label>
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                            />
                        </div>
                    </div>

                    <h3 style={{ color: "darkmagenta", fontSize: "18px", marginTop: "10px", marginBottom: "5px" }}>Payment Option</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={() => setPaymentMethod("COD")}
                            />
                            💵 Cash on Delivery (COD)
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <input
                                type="radio"
                                name="payment"
                                value="UPI"
                                checked={paymentMethod === "UPI"}
                                onChange={() => setPaymentMethod("UPI")}
                            />
                            📱 UPI / Net Banking
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                            <input
                                type="radio"
                                name="payment"
                                value="CARD"
                                checked={paymentMethod === "CARD"}
                                onChange={() => setPaymentMethod("CARD")}
                            />
                            💳 Credit / Debit Card
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            marginTop: "15px",
                            background: "darkmagenta",
                            color: "#fff",
                            padding: "14px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            border: "none",
                            borderRadius: "8px",
                            cursor: isSubmitting ? "not-allowed" : "pointer"
                        }}
                    >
                        {isSubmitting ? "Processing Order..." : `Place Order (Rs. ${totalCost})`}
                    </button>
                </form>

                {/* Order Summary Sidebar */}
                <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "fit-content" }}>
                    <h2 style={{ color: "darkmagenta", fontSize: "20px", marginBottom: "15px" }}>Items in Order</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "350px", overflowY: "auto", paddingRight: "5px" }}>
                        {cartItems.map((item, idx) => {
                            const prodObj = item.productId || {};
                            const prodName = prodObj.name || item.name || "Gift Item";
                            const prodPrice = prodObj.price || item.price || 0;
                            const prodImg = prodObj.image || item.image || "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";

                            return (
                                <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center", borderBottom: "1px dashed #eee", paddingBottom: "10px" }}>
                                    <img
                                        src={prodImg}
                                        alt={prodName}
                                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: "14px", color: "#333" }}>{prodName}</h4>
                                        <span style={{ fontSize: "12px", color: "#777" }}>Qty: {item.quantity || 1}</span>
                                    </div>
                                    <span style={{ fontWeight: "bold", color: "darkmagenta", fontSize: "14px" }}>
                                        Rs. {prodPrice * (item.quantity || 1)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: "20px", borderTop: "2px solid #f3f0f1", paddingTop: "15px", display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold", color: "darkmagenta" }}>
                        <span>Total Payable:</span>
                        <span>Rs. {totalCost}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
