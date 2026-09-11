import React from "react";
import { useNavigate } from "react-router-dom";

const occasionsList = [
    {
        id: "birthday",
        title: "Birthday",
        description: "Celebrate birthdays with sweet & thoughtful personalized gifts.",
        image: "https://i.pinimg.com/1200x/79/ee/28/79ee2850ca8666bf2242b9c44d5bde07.jpg"
    },
    {
        id: "wedding",
        title: "Wedding",
        description: "Elegant keepsakes & luxury gift hampers for newlyweds.",
        image: "https://i.pinimg.com/736x/8d/30/c3/8d30c383848a83624c7367a4120c42e9.jpg"
    },
    {
        id: "anniversary",
        title: "Anniversary",
        description: "Memorable gifts to honor romantic milestones together.",
        image: "https://i.pinimg.com/1200x/2d/76/3c/2d763cd96a57fbe0f4fc9ad71af614f9.jpg"
    },
    {
        id: "friendship",
        title: "Friendship",
        description: "Fun, cute, and meaningful gifts for your best companions.",
        image: "https://i.pinimg.com/1200x/63/c0/20/63c02016a7492f8ab52a8db5e7b887c2.jpg"
    },
    {
        id: "personalized",
        title: "Personalized Gifts",
        description: "Custom engraved and printed gifts made unique for them.",
        image: "https://i.pinimg.com/1200x/10/b3/59/10b3594e1c87cd246e5a341499bc2bc0.jpg"
    },
    {
        id: "jewellery",
        title: "Jewellery & Accessories",
        description: "Sparkling necklaces, bracelets, and stylish fashion pieces.",
        image: "https://i.pinimg.com/1200x/b4/5e/7f/b45e7f0c8a385d7a88019c1cece34213.jpg"
    },
    {
        id: "romantic",
        title: "Flowers & Romance",
        description: "Fresh red roses, love frames, and romantic surprises.",
        image: "https://i.pinimg.com/1200x/56/a0/47/56a047bc6a6269093a44e2a6ef33b51c.jpg"
    },
    {
        id: "food",
        title: "Food & Sweet Treats",
        description: "Delightful artisanal chocolates, cakes, and snack hampers.",
        image: "https://i.pinimg.com/736x/f0/3e/5d/f03e5de9ab24c11e1185750ad2851df2.jpg"
    }
];

function Occasions() {
    const navigate = useNavigate();

    return (
        <div className="page" style={{ padding: "40px 20px", maxWidth: "1100px", margin: "0 auto" }}>
            <h1 className="page-title" style={{ textAlign: "center", color: "darkmagenta", marginBottom: "10px" }}>
                🎉 Shop by Occasions
            </h1>
            <p style={{ textAlign: "center", color: "#666", marginBottom: "35px" }}>
                Find curated gift collections specially selected for every milestone.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
                {occasionsList.map((occ) => (
                    <div
                        key={occ.id}
                        onClick={() => navigate(`/ptypes/${occ.id}`)}
                        style={{
                            background: "#fff",
                            borderRadius: "15px",
                            overflow: "hidden",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                            cursor: "pointer",
                            transition: "transform 0.2s, boxShadow 0.2s",
                            display: "flex",
                            flexDirection: "column"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.boxShadow = "0 8px 25px rgba(139,0,139,0.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
                        }}
                    >
                        <div style={{ height: "200px", overflow: "hidden" }}>
                            <img
                                src={occ.image}
                                alt={occ.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500";
                                }}
                            />
                        </div>
                        <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div>
                                <h2 style={{ color: "darkmagenta", fontSize: "20px", marginBottom: "8px" }}>{occ.title}</h2>
                                <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.4" }}>{occ.description}</p>
                            </div>
                            <button
                                style={{
                                    marginTop: "15px",
                                    padding: "10px 18px",
                                    background: "darkmagenta",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    width: "100%"
                                }}
                            >
                                Explore {occ.title} Gifts →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Occasions;
