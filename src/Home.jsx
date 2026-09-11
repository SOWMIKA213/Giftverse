import React from "react";
import { useNavigate } from "react-router-dom";
import home from "./assets/home.png";
import ann from "./assets/ann.jpg";
import bday from "./assets/bday.jpg";
import friend from "./assets/friend.jpg";
import grad from "./assets/grad.jpg";
import velen from "./assets/velen.jpg";
import wedd from "./assets/wedd.jpg";

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="hero">
                <img src={home} alt="Thoughtful Gifts Banner" />
                <div className="hero-text">
                    <p className="tag">THOUGHTFUL GIFTS</p>
                    <h1>Make Every Moment Special</h1>
                    <p>Find the perfect gift for your loved ones</p>
                    <button onClick={() => navigate("/products")}>Explore Gifts</button>
                </div>
            </div>

            <div className="brands">
                <button onClick={() => navigate("/customizegift")}>🎁 Customize Gifts</button>
                <button onClick={() => navigate("/ptypes/personalized")}>👤 Personalized Gifts</button>
                <button onClick={() => navigate("/ptypes/jewellery")}>💎 Jewellery & Accessories</button>
                <button onClick={() => navigate("/ptypes/romantic")}>🌹 Flowers & Romantic Gifts</button>
                <button onClick={() => navigate("/ptypes/food")}>🎂 Food & Sweet Gifts</button>
                <button onClick={() => navigate("/ptypes/toys")}>🧸 Toy Gifts</button>
                <button onClick={() => navigate("/ptypes/photo")}>📸 Photo Gifts</button>
                <button onClick={() => navigate("/products")}>💄 Beauty & SelfCare</button>
                <button onClick={() => navigate("/products")}>💻 Tech Gifts</button>
            </div>

            <div className="head">
                <h1><b>🎁 Shop by Occasion</b></h1>
            </div>

            <div className="shop">
                <div className="shops" onClick={() => navigate("/ptypes/birthday")} style={{ cursor: "pointer" }}>
                    <img src={bday} alt="Birthday" />
                    <button onClick={(e) => { e.stopPropagation(); navigate("/ptypes/birthday"); }}>Birthday</button>
                </div>
                <div className="shops" onClick={() => navigate("/ptypes/anniversary")} style={{ cursor: "pointer" }}>
                    <img src={ann} alt="Anniversary" />
                    <button onClick={(e) => { e.stopPropagation(); navigate("/ptypes/anniversary"); }}>Anniversary</button>
                </div>
                <div className="shops" onClick={() => navigate("/ptypes/wedding")} style={{ cursor: "pointer" }}>
                    <img src={wedd} alt="Weddings" />
                    <button onClick={(e) => { e.stopPropagation(); navigate("/ptypes/wedding"); }}>Wedding</button>
                </div>
                <div className="shops" onClick={() => navigate("/ptypes/valentines")} style={{ cursor: "pointer" }}>
                    <img src={velen} alt="Valentines" />
                    <button onClick={(e) => { e.stopPropagation(); navigate("/ptypes/valentines"); }}>Valentine's Day</button>
                </div>
                <div className="shops" onClick={() => navigate("/ptypes/friendship")} style={{ cursor: "pointer" }}>
                    <img src={friend} alt="friend" />
                    <button onClick={(e) => { e.stopPropagation(); navigate("/ptypes/friendship"); }}>Friendship</button>
                </div>
                <div className="shops" onClick={() => navigate("/ptypes/graduation")} style={{ cursor: "pointer" }}>
                    <img src={grad} alt="Graduation" />
                    <button onClick={(e) => { e.stopPropagation(); navigate("/ptypes/graduation"); }}>Graduation</button>
                </div>
            </div>

            <div className="choose">
                <h1>Why Choose Us?</h1>
            </div>

            <div className="features">
                <div className="feat">
                    <h3>🚚 Fast Delivery</h3>
                    <p>Quick & safe delivery</p>
                </div>
                <div className="feat">
                    <h3>🎁 Beautiful Packaging</h3>
                    <p>Premium gift-ready packaging</p>
                </div>
                <div className="feat">
                    <h3>❤️ Made With Love</h3>
                    <p>Special gifts for special people</p>
                </div>
                <div className="feat" onClick={() => navigate("/customizegift")} style={{ cursor: "pointer" }}>
                    <h3>✏️ Personalized</h3>
                    <p>Customize your gift</p>
                </div>
            </div>

            <footer className="foot">
                <div className="page">
                    <h1>Lovely Gifts</h1>
                    <h3>Gifts for Every Heart</h3>
                    <h4>Making every moment special</h4>
                </div>
                <div className="contact">
                    <h1>Contact Us</h1>
                    <p>📞 +91 9874563210</p>
                    <p>📧 support@lovelygifts.com</p>
                    <p>📍 Bangalore, Karnataka, India</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;