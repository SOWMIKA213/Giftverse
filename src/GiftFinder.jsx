import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "./config/api";

function GiftFinder() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedOccasion, setSelectedOccasion] = useState("all");
    const [maxPrice, setMaxPrice] = useState(2000);
    const [searchQuery, setSearchQuery] = useState("");

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
                    setError(err.message || "Unable to load products for Gift Finder");
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchesOccasion =
            selectedOccasion === "all" ||
            (product.occasion && product.occasion.toLowerCase() === selectedOccasion.toLowerCase());

        const matchesPrice = Number(product.price || 0) <= maxPrice;

        const matchesSearch =
            !searchQuery ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.occasion && product.occasion.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesOccasion && matchesPrice && matchesSearch;
    });

    return (
        <div className="page" style={{ padding: "30px 25px", width: "100%", maxWidth: "none", margin: 0 }}>
            <h1 className="page-title" style={{ textAlign: "center", color: "darkmagenta", marginBottom: "10px" }}>
                🔍 Smart Gift Finder
            </h1>
            <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
                Answer a few quick questions to find the ideal gift within your budget!
            </p>

            {/* Filter Controls Box */}
            <div
                style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "15px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                    marginBottom: "35px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                    alignItems: "end"
                }}
            >
                <div>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "darkmagenta" }}>
                        Search Keywords
                    </label>
                    <input
                        type="text"
                        placeholder="Search frame, mug, teddy..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "darkmagenta" }}>
                        Select Occasion
                    </label>
                    <select
                        value={selectedOccasion}
                        onChange={(e) => setSelectedOccasion(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", background: "#fff" }}
                    >
                        <option value="all">All Occasions</option>
                        <option value="birthday">Birthday</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="wedding">Wedding</option>
                        <option value="friendship">Friendship</option>
                        <option value="personalized">Personalized</option>
                        <option value="jewellery">Jewellery</option>
                        <option value="romantic">Romantic</option>
                        <option value="food">Food & Sweets</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "darkmagenta" }}>
                        Max Budget: Rs. {maxPrice}
                    </label>
                    <input
                        type="range"
                        min="200"
                        max="3000"
                        step="100"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        style={{ width: "100%", accentColor: "darkmagenta" }}
                    />
                </div>
            </div>

            {/* Results Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ color: "darkmagenta", fontSize: "22px" }}>
                    Matching Gifts ({filteredProducts.length})
                </h2>
                <button
                    onClick={() => {
                        setSelectedOccasion("all");
                        setMaxPrice(2000);
                        setSearchQuery("");
                    }}
                    style={{ background: "none", border: "none", color: "darkmagenta", cursor: "pointer", textDecoration: "underline", fontWeight: "bold" }}
                >
                    Reset Filters
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div style={{ textAlign: "center", padding: "40px", fontSize: "18px", color: "darkmagenta" }}>
                    🔄 Searching gifts...
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div style={{ background: "#f8d7da", color: "#721c24", padding: "15px", borderRadius: "8px", textAlign: "center", marginBottom: "20px" }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Products Grid */}
            {!loading && !error && filteredProducts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px", background: "#fff", borderRadius: "15px" }}>
                    <h3>No gifts match your criteria.</h3>
                    <p style={{ color: "#666", marginTop: "10px" }}>Try increasing your budget or changing the occasion filter.</p>
                </div>
            ) : (
                !loading && !error && (
                    <div className="product-container">
                        {filteredProducts.map((product) => {
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
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                                        <button className="view-btn" onClick={() => navigate(`/product/${prodId}`)}>
                                            View
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

export default GiftFinder;
