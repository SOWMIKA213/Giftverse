import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "./config/api";

const ptypes = [
    {
        id: "birthday",
        title: "Birthday",
        icon: "🎂",
        image: "https://i.pinimg.com/1200x/79/ee/28/79ee2850ca8666bf2242b9c44d5bde07.jpg"
    },
    {
        id: "wedding",
        title: "Wedding",
        icon: "💍",
        image: "https://i.pinimg.com/736x/8d/30/c3/8d30c383848a83624c7367a4120c42e9.jpg"
    },
    {
        id: "anniversary",
        title: "Anniversary",
        icon: "❤️",
        image: "https://i.pinimg.com/1200x/2d/76/3c/2d763cd96a57fbe0f4fc9ad71af614f9.jpg"
    },
    {
        id: "friendship",
        title: "Friendship",
        icon: "🤝",
        image: "https://i.pinimg.com/1200x/63/c0/20/63c02016a7492f8ab52a8db5e7b887c2.jpg"
    },
    {
        id: "personalized",
        title: "Personalized Gifts",
        icon: "✏️",
        image: "https://i.pinimg.com/1200x/10/b3/59/10b3594e1c87cd246e5a341499bc2bc0.jpg"
    },
    {
        id: "jewellery",
        title: "Jewellery & Accessories",
        icon: "💎",
        image: "https://i.pinimg.com/1200x/b4/5e/7f/b45e7f0c8a385d7a88019c1cece34213.jpg"
    },
    {
        id: "romantic",
        title: "Flowers & Romantic Gifts",
        icon: "🌹",
        image: "https://i.pinimg.com/1200x/56/a0/47/56a047bc6a6269093a44e2a6ef33b51c.jpg"
    },
    {
        id: "food",
        title: "Food & Sweet Gifts",
        icon: "🍫",
        image: "https://i.pinimg.com/736x/f0/3e/5d/f03e5de9ab24c11e1185750ad2851df2.jpg"
    },
    {
        id: "toys",
        title: "Cute & Fun Gifts",
        icon: "🧸",
        image: "https://i.pinimg.com/736x/17/90/8f/17908f28109b5e1440923820e424b340.jpg"
    },
    {
        id: "photo",
        title: "Photo & Memory Gifts",
        icon: "📸",
        image: "https://i.pinimg.com/736x/01/42/2f/01422f58e096c43a8d8309dd0c210f31.jpg"
    }
];

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError("");

        fetchProducts()
            .then((data) => {
                if (isMounted) {
                    setProducts(data || []);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message || "Unable to load products. Please try again.");
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="btn" style={{ width: "100%", maxWidth: "none", margin: 0, padding: "30px 25px" }}>
            <h1 style={{ textAlign: "center", color: "darkmagenta", marginBottom: "20px" }}>
                🎁 Shop by Occasion & Category
            </h1>

            {/* Category Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "25px", marginBottom: "40px", width: "100%" }}>
                {ptypes.map((a) => (
                    <div
                        key={a.id}
                        onClick={() => navigate(`/ptypes/${a.id}`)}
                        className="occasion-card"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${a.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "12px",
                            padding: "25px",
                            color: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            minHeight: "180px",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            transition: "transform 0.2s"
                        }}
                    >
                        <div className="card-content">
                            <h2 style={{ color: "#ffffff", fontSize: "22px", margin: "0 0 10px 0", textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}>
                                {a.icon} {a.title}
                            </h2>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/ptypes/${a.id}`);
                                }}
                                style={{
                                    padding: "8px 16px",
                                    background: "darkmagenta",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                Explore Gifts →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Featured Collection Grid */}
            <h2 style={{ color: "darkmagenta", marginBottom: "20px", borderTop: "2px solid #e0e0e0", paddingTop: "30px" }}>
                ⭐ Featured Gifts Collection
            </h2>

            {/* Loading State */}
            {loading && (
                <div style={{ textAlign: "center", padding: "40px", fontSize: "18px", color: "darkmagenta" }}>
                    🔄 Loading products from server...
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div style={{ background: "#f8d7da", color: "#721c24", padding: "15px 20px", borderRadius: "8px", textAlign: "center", marginBottom: "20px", fontWeight: "bold" }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
                <div style={{ textAlign: "center", padding: "50px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ color: "darkmagenta" }}>No products available at the moment.</h3>
                    <p style={{ color: "#666" }}>Please check back later or refresh the page.</p>
                </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
                <div className="product-container">
                    {products.map((prod) => {
                        const prodId = prod._id || prod.id;
                        return (
                            <div className="product-card" key={prodId}>
                                <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="product-list-image"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                                    }}
                                />
                                <h2>{prod.name}</h2>
                                <p className="product-price">Rs. {prod.price}</p>
                                <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                                    <button className="view-btn" onClick={() => navigate(`/product/${prodId}`)}>
                                        View
                                    </button>
                                    <button
                                        className="cart-btn"
                                        onClick={() => navigate("/customizegift", { state: { product: prod } })}
                                        style={{ background: "#7209b7", color: "#fff" }}
                                    >
                                        🎁 Customize
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Products;