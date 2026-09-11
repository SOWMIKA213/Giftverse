import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    addToCartApi,
    fetchProducts,
    getStoredUserId,
    isUserLoggedIn
} from "./config/api";

const FONT_STYLES = [
    { id: 1, name: "Classic", family: "Georgia, serif" },
    { id: 2, name: "Elegant", family: "'Playfair Display', Georgia, serif" },
    { id: 3, name: "Handwritten", family: "'Caveat', cursive" },
    { id: 4, name: "Cursive", family: "'Dancing Script', cursive" },
    { id: 5, name: "Modern", family: "'Montserrat', sans-serif" },
    { id: 6, name: "Bold", family: "'Impact', 'Comic Neue', sans-serif", weight: "700" },
    { id: 7, name: "Playful", family: "'Comic Neue', 'Comic Sans MS', cursive" },
    { id: 8, name: "Romantic", family: "'Great Vibes', cursive" },
    { id: 9, name: "Minimal", family: "'Inter', sans-serif", weight: "300" },
    { id: 10, name: "Stylish", family: "'Cinzel', serif" }
];

const TEXT_COLORS = [
    { id: 1, name: "Black", hex: "#000000" },
    { id: 2, name: "Red", hex: "#e63946" },
    { id: 3, name: "Blue", hex: "#1d3557" },
    { id: 4, name: "Green", hex: "#2a9d8f" },
    { id: 5, name: "Purple", hex: "#7209b7" },
    { id: 6, name: "Pink", hex: "#ff4d6d" },
    { id: 7, name: "Orange", hex: "#f77f00" },
    { id: 8, name: "Brown", hex: "#6b705c" },
    { id: 9, name: "Gold", hex: "#d4af37" },
    { id: 10, name: "Dark Magenta", hex: "#8b008b" }
];

const GIFT_WRAPS = [
    {
        id: 1,
        name: "Classic Red",
        price: 50,
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238bd34?w=400&q=80",
        bg: "linear-gradient(135deg, #c1121f 0%, #780000 100%)"
    },
    {
        id: 2,
        name: "Elegant Pink",
        price: 60,
        image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=80",
        bg: "linear-gradient(135deg, #ff4d6d 0%, #ff85a1 100%)"
    },
    {
        id: 3,
        name: "Purple Luxury",
        price: 80,
        image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=80",
        bg: "linear-gradient(135deg, #7209b7 0%, #3a0ca3 100%)"
    },
    {
        id: 4,
        name: "Floral Wrap",
        price: 70,
        image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&q=80",
        bg: "linear-gradient(135deg, #2a9d8f 0%, #e9c46a 100%)"
    },
    {
        id: 5,
        name: "Premium Gold",
        price: 100,
        image: "https://images.unsplash.com/photo-1548907040-4d42fcaa3f0a?w=400&q=80",
        bg: "linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)"
    }
];

function CustomizeGift() {
    const location = useLocation();
    const navigate = useNavigate();

    // Passed product base if any
    const baseProduct = location.state?.product;

    const [resolvedProductId, setResolvedProductId] = useState(baseProduct?._id || baseProduct?.id || null);
    const [basePrice, setBasePrice] = useState(baseProduct ? Number(baseProduct.price) : 500);

    // Form State
    const [recipientName, setRecipientName] = useState("");
    const [message, setMessage] = useState("");
    const [selectedFont, setSelectedFont] = useState(FONT_STYLES[0]);
    const [selectedColor, setSelectedColor] = useState(TEXT_COLORS[0]);
    const [selectedWrap, setSelectedWrap] = useState(GIFT_WRAPS[0]);

    // Validation and Success State
    const [validationError, setValidationError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!resolvedProductId) {
            // Fetch first available product from backend to use valid MongoDB ObjectId
            fetchProducts()
                .then((prods) => {
                    if (prods && prods.length > 0) {
                        setResolvedProductId(prods[0]._id || prods[0].id);
                        if (!baseProduct) {
                            setBasePrice(Number(prods[0].price) || 500);
                        }
                    }
                })
                .catch(() => {
                    // Ignore
                });
        }
    }, [resolvedProductId, baseProduct]);

    const wrapPrice = selectedWrap ? selectedWrap.price : 0;
    const totalCost = basePrice + wrapPrice;

    // Handle Add to Cart
    const handleAddToCart = async () => {
        setValidationError("");
        setSuccessMessage("");

        if (!isUserLoggedIn()) {
            navigate("/login", { state: { from: "/customizegift" } });
            return;
        }

        if (!recipientName.trim()) {
            setValidationError("Please enter the recipient's name before adding to cart.");
            return;
        }

        if (!message.trim()) {
            setValidationError("Please enter a personalized message before adding to cart.");
            return;
        }

        if (!resolvedProductId) {
            setValidationError("Unable to identify product for customization. Please try selecting a product again.");
            return;
        }

        const userId = getStoredUserId();
        setLoading(true);

        // Format customization payload for backend schema:
        // recipientName, message, fontStyle, textColor, giftWrap (Boolean), wrapPrice (Number)
        const customizationPayload = {
            recipientName: recipientName.trim(),
            message: message.trim(),
            fontStyle: selectedFont.name,
            textColor: selectedColor.name,
            giftWrap: true,
            wrapPrice: Number(wrapPrice)
        };

        try {
            await addToCartApi(userId, resolvedProductId, 1, customizationPayload);
            setSuccessMessage("🎉 Customized gift successfully added to your cart!");
            window.dispatchEvent(new Event("storage"));
        } catch (err) {
            setValidationError(err.message || "Failed to add gift to cart. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="customize-gift-container" style={{ padding: "30px 20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 className="page-main-heading" style={{ textAlign: "center", color: "darkmagenta", fontSize: "34px", marginBottom: "30px" }}>
                Customize Your Gift
            </h1>

            {/* Validation & Success Alerts */}
            {validationError && (
                <div style={{ background: "#f8d7da", color: "#721c24", padding: "14px 20px", borderRadius: "10px", borderLeft: "6px solid #dc3545", marginBottom: "25px", fontWeight: "bold" }}>
                    ⚠️ {validationError}
                </div>
            )}

            {successMessage && (
                <div style={{ background: "#d4edda", color: "#155724", padding: "16px 20px", borderRadius: "10px", borderLeft: "6px solid #28a745", marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{successMessage}</span>
                    <button
                        onClick={() => navigate("/cart")}
                        style={{ background: "#28a745", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                    >
                        View Cart →
                    </button>
                </div>
            )}

            {/* Main Responsive Grid: Left (Form Options) & Right (Preview) */}
            <div className="customize-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "35px", alignItems: "start" }}>

                {/* Left Side: Customization Options */}
                <div className="custom-options-panel" style={{ background: "#ffffff", padding: "30px", borderRadius: "18px", boxShadow: "0 6px 20px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "30px" }}>

                    {/* 1. NAME */}
                    <div className="custom-section">
                        <h2 style={{ color: "darkmagenta", fontSize: "20px", marginBottom: "12px", borderBottom: "2px solid #f3f0f1", paddingBottom: "6px" }}>
                            Name
                        </h2>
                        <input
                            type="text"
                            placeholder="Enter recipient name"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 15px",
                                borderRadius: "8px",
                                border: "2px solid #e0e0e0",
                                fontSize: "16px",
                                outline: "none",
                                transition: "borderColor 0.2s"
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "darkmagenta")}
                            onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                        />
                    </div>

                    {/* 2. MESSAGE */}
                    <div className="custom-section">
                        <h2 style={{ color: "darkmagenta", fontSize: "20px", marginBottom: "12px", borderBottom: "2px solid #f3f0f1", paddingBottom: "6px" }}>
                            Message
                        </h2>
                        <textarea
                            rows="3"
                            placeholder="Enter your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 15px",
                                borderRadius: "8px",
                                border: "2px solid #e0e0e0",
                                fontSize: "15px",
                                fontFamily: "Georgia, serif",
                                outline: "none",
                                resize: "vertical"
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "darkmagenta")}
                            onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                        ></textarea>
                    </div>

                    {/* 3. FONT STYLE */}
                    <div className="custom-section">
                        <h2 style={{ color: "darkmagenta", fontSize: "20px", marginBottom: "12px", borderBottom: "2px solid #f3f0f1", paddingBottom: "6px" }}>
                            Font Style
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                            {FONT_STYLES.map((font) => {
                                const isSelected = selectedFont.id === font.id;
                                return (
                                    <button
                                        key={font.id}
                                        type="button"
                                        onClick={() => setSelectedFont(font)}
                                        style={{
                                            padding: "10px 12px",
                                            borderRadius: "8px",
                                            border: isSelected ? "2px solid darkmagenta" : "1px solid #ddd",
                                            background: isSelected ? "rgba(139, 0, 139, 0.08)" : "#fafafa",
                                            color: isSelected ? "darkmagenta" : "#333",
                                            fontFamily: font.family,
                                            fontWeight: font.weight || "normal",
                                            fontSize: "15px",
                                            cursor: "pointer",
                                            textAlign: "center",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        {font.id}. {font.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 4. TEXT COLOR */}
                    <div className="custom-section">
                        <h2 style={{ color: "darkmagenta", fontSize: "20px", marginBottom: "12px", borderBottom: "2px solid #f3f0f1", paddingBottom: "6px" }}>
                            Text Color
                        </h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                            {TEXT_COLORS.map((color) => {
                                const isSelected = selectedColor.id === color.id;
                                return (
                                    <button
                                        key={color.id}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        title={color.name}
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "50%",
                                            backgroundColor: color.hex,
                                            border: isSelected ? "3px solid darkmagenta" : "2px solid #ffffff",
                                            boxShadow: isSelected ? "0 0 0 2px darkmagenta" : "0 2px 5px rgba(0,0,0,0.15)",
                                            cursor: "pointer",
                                            transition: "transform 0.15s"
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                                    />
                                );
                            })}
                        </div>
                        <p style={{ marginTop: "8px", fontSize: "13px", color: "#666" }}>
                            Selected Color: <strong>{selectedColor.name}</strong>
                        </p>
                    </div>

                    {/* 5. GIFT WRAP */}
                    <div className="custom-section">
                        <h2 style={{ color: "darkmagenta", fontSize: "20px", marginBottom: "12px", borderBottom: "2px solid #f3f0f1", paddingBottom: "6px" }}>
                            Gift Wrap
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "12px" }}>
                            {GIFT_WRAPS.map((wrap) => {
                                const isSelected = selectedWrap.id === wrap.id;
                                return (
                                    <div
                                        key={wrap.id}
                                        onClick={() => setSelectedWrap(wrap)}
                                        style={{
                                            border: isSelected ? "2px solid darkmagenta" : "1px solid #e0e0e0",
                                            borderRadius: "10px",
                                            padding: "10px",
                                            background: isSelected ? "rgba(139, 0, 139, 0.05)" : "#ffffff",
                                            cursor: "pointer",
                                            textAlign: "center",
                                            transition: "all 0.2s",
                                            boxShadow: isSelected ? "0 4px 12px rgba(139,0,139,0.15)" : "none"
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "75px",
                                                borderRadius: "6px",
                                                overflow: "hidden",
                                                marginBottom: "8px",
                                                background: wrap.bg,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#fff",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            <img
                                                src={wrap.image}
                                                alt={wrap.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        </div>
                                        <h4 style={{ fontSize: "14px", margin: "4px 0", color: "#333" }}>{wrap.name}</h4>
                                        <p style={{ fontSize: "13px", fontWeight: "bold", color: "darkmagenta", margin: 0 }}>₹{wrap.price}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 6. TOTAL COST & 7. ADD TO CART */}
                    <div
                        className="custom-total-bar"
                        style={{
                            borderTop: "2px solid #f3f0f1",
                            paddingTop: "20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "15px"
                        }}
                    >
                        <div>
                            <h3 style={{ color: "#777", fontSize: "14px", margin: 0 }}>Total Cost</h3>
                            <div style={{ fontSize: "26px", fontWeight: "bold", color: "darkmagenta" }}>
                                ₹{totalCost}
                            </div>
                            <span style={{ fontSize: "12px", color: "#888" }}>
                                (Base: ₹{basePrice} + Wrap: ₹{wrapPrice})
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={loading}
                            style={{
                                background: "darkmagenta",
                                color: "#ffffff",
                                padding: "14px 28px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                border: "none",
                                borderRadius: "8px",
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: "0 4px 12px rgba(139,0,139,0.3)",
                                transition: "all 0.2s"
                            }}
                        >
                            {loading ? "Adding to Cart..." : "🛒 Add to Cart"}
                        </button>
                    </div>

                </div>

                {/* Right Side: PREVIEW */}
                <div
                    className="custom-preview-panel"
                    style={{
                        position: "sticky",
                        top: "20px",
                        background: "#ffffff",
                        padding: "30px",
                        borderRadius: "18px",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <h2 style={{ color: "darkmagenta", fontSize: "22px", marginBottom: "20px", textAlign: "center" }}>
                        🎁 Gift Preview
                    </h2>

                    {/* Preview Wrapper Visual Box */}
                    <div
                        style={{
                            width: "100%",
                            minHeight: "320px",
                            borderRadius: "16px",
                            padding: "25px",
                            background: selectedWrap.bg,
                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative"
                        }}
                    >
                        {/* Ribbon Overlay */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                width: "40px",
                                background: "rgba(255, 255, 255, 0.25)",
                                backdropFilter: "blur(4px)",
                                borderLeft: "1px solid rgba(255,255,255,0.4)",
                                borderRight: "1px solid rgba(255,255,255,0.4)"
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                height: "40px",
                                background: "rgba(255, 255, 255, 0.25)",
                                backdropFilter: "blur(4px)",
                                borderTop: "1px solid rgba(255,255,255,0.4)",
                                borderBottom: "1px solid rgba(255,255,255,0.4)"
                            }}
                        />

                        {/* Gift Card Inside Ribbon */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 2,
                                background: "#ffffff",
                                borderRadius: "12px",
                                padding: "30px 25px",
                                width: "85%",
                                textAlign: "center",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                            }}
                        >
                            <span style={{ fontSize: "28px" }}>🎁</span>

                            <div style={{ marginTop: "15px" }}>
                                <h3
                                    style={{
                                        fontFamily: selectedFont.family,
                                        fontWeight: selectedFont.weight || "normal",
                                        color: selectedColor.hex,
                                        fontSize: "24px",
                                        marginBottom: "12px",
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {recipientName.trim() ? recipientName : "Recipient Name"}
                                </h3>

                                <p
                                    style={{
                                        fontFamily: selectedFont.family,
                                        fontWeight: selectedFont.weight || "normal",
                                        color: selectedColor.hex,
                                        fontSize: "18px",
                                        lineHeight: "1.5",
                                        fontStyle: "italic",
                                        margin: 0,
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {message.trim() ? `"${message}"` : `"Personalized Message"`}
                                </p>
                            </div>

                            <div style={{ marginTop: "20px", borderTop: "1px dashed #ddd", paddingTop: "10px", fontSize: "12px", color: "#888" }}>
                                Wrapped with <strong>{selectedWrap.name}</strong>
                            </div>
                        </div>
                    </div>

                    <p style={{ marginTop: "20px", color: "#777", fontSize: "13px", textAlign: "center" }}>
                        * Live preview updates in real-time as you type and customize options.
                    </p>
                </div>

            </div>
        </div>
    );
}

export default CustomizeGift;