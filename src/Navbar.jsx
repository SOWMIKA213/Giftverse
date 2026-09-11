import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    fetchCart,
    fetchWishlist,
    getStoredUserId,
    isUserLoggedIn
} from "./config/api";

function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    const checkAuthAndCounts = async () => {
        const loggedInStatus = isUserLoggedIn();
        setIsLoggedIn(loggedInStatus);

        if (!loggedInStatus) {
            setCartCount(0);
            setWishlistCount(0);
            return;
        }

        const userId = getStoredUserId();
        if (!userId) return;

        try {
            const [cartRes, wishlistRes] = await Promise.all([
                fetchCart(userId).catch(() => ({ items: [] })),
                fetchWishlist(userId).catch(() => ({ products: [] }))
            ]);

            const items = (cartRes && cartRes.items) || [];
            const totalCartQty = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
            setCartCount(totalCartQty);

            const prods = (wishlistRes && wishlistRes.products) || [];
            setWishlistCount(prods.length);
        } catch (e) {
            // Keep existing counts if temporary network failure
        }
    };

    useEffect(() => {
        checkAuthAndCounts();
        window.addEventListener("storage", checkAuthAndCounts);
        const interval = setInterval(checkAuthAndCounts, 3000);
        return () => {
            window.removeEventListener("storage", checkAuthAndCounts);
            clearInterval(interval);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setCartCount(0);
        setWishlistCount(0);
        window.dispatchEvent(new Event("storage"));
        navigate("/login");
    };

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <Link to="/home" className="logo-link">
                    <h1>Lovely Gifts</h1>
                    <h2>Gifts for Every Heart</h2>
                </Link>
            </div>
            <nav className="nav-links">
                <NavLink to="/home" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                    Home
                </NavLink>
                <NavLink to="/giftfinder" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                    GiftFinder
                </NavLink>
                <NavLink to="/occasions" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                    Occasions
                </NavLink>
                <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                    Products
                </NavLink>
                <NavLink to="/productdetails" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                    ProductDetails
                </NavLink>
                <NavLink to="/customizegift" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                    CustomizeGift
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                    About
                </NavLink>

                {!isLoggedIn ? (
                    <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                        Login
                    </NavLink>
                ) : (
                    <>
                        <NavLink to="/wishlist" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                            Wishlist {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
                        </NavLink>
                        <NavLink to="/cart" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                            Cart {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
                        </NavLink>
                        <NavLink to="/orders" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                            Orders
                        </NavLink>
                        <button onClick={handleLogout} className="nav-item nav-logout-btn">
                            Logout
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Navbar;
