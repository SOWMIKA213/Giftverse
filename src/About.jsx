import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
    const navigate = useNavigate();

    return (
        <div className="about-page-container">
            <div className="about-header-section">
                <h1 className="about-main-heading">About Lovely Gifts</h1>
                <p className="about-tagline">Making Every Moment & Milestone Special</p>
            </div>

            <div className="about-card-section">
                {/* About Us Section */}
                <div className="about-card">
                    <h2 className="about-card-title">📖 About Us</h2>
                    <p className="about-card-text">
                        Lovely Gifts is a premier online gifting platform dedicated to bringing joy, warmth,
                        and love to every occasion. We believe that thoughtful gifts have the power to create
                        unforgettable memories and strengthen bonds with your loved ones. Whether it's a birthday,
                        anniversary, wedding, or just a spontaneous surprise, we provide a curated collection
                        of high-quality gifts crafted with care.
                    </p>
                </div>

                {/* What We Offer Section */}
                <div className="about-card">
                    <h2 className="about-card-title">🎁 What We Offer</h2>
                    <ul className="about-list">
                        <li><strong>Occasion-Based Gifts:</strong> Special gift collections for Birthdays, Weddings, Anniversaries, Friendship Day, and Holidays.</li>
                        <li><strong>Personalized Customization:</strong> Live customization tool allowing custom recipient names, heart-felt messages, font styles, colors, and luxury gift wrapping.</li>
                        <li><strong>Jewellery & Accessories:</strong> Elegant fashion pieces and sparkling keepsake items.</li>
                        <li><strong>Sweets & Treats:</strong> Gourmet chocolates, cakes, and delight hampers.</li>
                    </ul>
                </div>

                {/* Why Choose Us Section */}
                <div className="about-card">
                    <h2 className="about-card-title">⭐ Why Choose Us</h2>
                    <div className="about-features-grid">
                        <div className="about-feature-item">
                            <h3>🚚 Fast & Safe Delivery</h3>
                            <p>Reliable shipping ensuring your gift arrives on time in pristine condition.</p>
                        </div>
                        <div className="about-feature-item">
                            <h3>🎀 Premium Packaging</h3>
                            <p>Beautiful luxury gift wrapping that makes unwrapping an unforgettably romantic experience.</p>
                        </div>
                        <div className="about-feature-item">
                            <h3>❤️ Made With Love</h3>
                            <p>Hand-picked, premium products designed to convey your genuine emotions.</p>
                        </div>
                        <div className="about-feature-item">
                            <h3>✏️ Live Customization</h3>
                            <p>Instant live previews of your personalized gift designs before placing an order.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="about-action-banner">
                <h2>Ready to Spread Joy?</h2>
                <p>Discover our latest collection or design your custom gift box today.</p>
                <div className="about-buttons">
                    <button className="about-primary-btn" onClick={() => navigate("/products")}>
                        Explore Gifts
                    </button>
                    <button className="about-secondary-btn" onClick={() => navigate("/customizegift")}>
                        🎁 Customize a Gift
                    </button>
                </div>
            </div>
        </div>
    );
}

export default About;
