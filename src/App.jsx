import React from "react";
import {
    Routes,
    Route,
    BrowserRouter,
    Navigate
} from "react-router-dom";

import Navbar from "./Navbar";
import Home from "./Home";
import Products from "./Products";
import ProductDetails, { ProductList } from "./ProductDetails";
import SingleProduct from "./SingleProduct";
import CustomizeGift from "./CustomizeGift";
import Wishlist from "./Wishlist";
import Cart from "./Cart";
import Orders from "./Orders";
import Checkout from "./Checkout";
import Occasions from "./Occasions";
import GiftFinder from "./GiftFinder";
import About from "./About";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

import "./index.css";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/productdetails" element={<Products />} />
                <Route path="/occasions" element={<Occasions />} />
                <Route path="/giftfinder" element={<GiftFinder />} />
                <Route path="/gift-finder" element={<GiftFinder />} />
                <Route path="/ptypes/:occasionId" element={<ProductList />} />
                <Route path="/product/:id" element={<SingleProduct />} />
                <Route path="/customizegift" element={<CustomizeGift />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                    path="/wishlist"
                    element={
                        <ProtectedRoute>
                            <Wishlist />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cart/:productId"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/order/:id"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;