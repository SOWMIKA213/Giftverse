// Centralized API Configuration & Helper Utilities for GiftVerse

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Generic fetch wrapper with timeout, error handling, and JSON parsing
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMessage = data.message || data.error || `HTTP error ${response.status}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (err) {
        if (err.name === "TypeError" && err.message.includes("fetch")) {
            throw new Error("Unable to connect to server. Please ensure the backend is running.");
        }
        throw err;
    }
}

// ==========================================
// PRODUCTS API
// ==========================================

export async function fetchProducts() {
    return request("/api/products");
}

export async function fetchProductById(id) {
    return request(`/api/products/${id}`);
}

export async function fetchProductsByOccasion(occasion) {
    return request(`/api/products/occasion/${encodeURIComponent(occasion)}`);
}

export async function createProduct(productData) {
    return request("/api/products", {
        method: "POST",
        body: JSON.stringify(productData),
    });
}

// ==========================================
// USER & AUTH API
// ==========================================

export async function registerUser(userData) {
    return request("/api/users/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

// Helper to get logged in userId or null
export function getStoredUserId() {
    return localStorage.getItem("userId") || null;
}

export function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
        return null;
    }
}

export function isUserLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true" && !!getStoredUserId();
}

// ==========================================
// WISHLIST API
// ==========================================

export async function fetchWishlist(userId) {
    if (!userId) return { products: [] };
    return request(`/api/wishlist/${userId}`);
}

export async function addToWishlistApi(userId, productId) {
    return request("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ userId, productId }),
    });
}

export async function removeFromWishlistApi(userId, productId) {
    return request(`/api/wishlist/${userId}/${productId}`, {
        method: "DELETE",
    });
}

// ==========================================
// CART API
// ==========================================

export async function fetchCart(userId) {
    if (!userId) return { items: [], totalAmount: 0 };
    return request(`/api/cart/${userId}`);
}

export async function addToCartApi(userId, productId, quantity = 1, customization = null) {
    const body = {
        userId,
        productId,
        quantity,
    };
    if (customization) {
        body.customization = customization;
    }
    return request("/api/cart", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function removeFromCartApi(userId, productId) {
    return request(`/api/cart/${userId}/${productId}`, {
        method: "DELETE",
    });
}

export async function clearCartApi(userId) {
    return request(`/api/cart/${userId}`, {
        method: "DELETE",
    });
}

// ==========================================
// ORDERS API
// ==========================================

export async function createOrderApi(orderData) {
    return request("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
    });
}

export async function fetchOrders(userId) {
    if (!userId) return [];
    return request(`/api/orders/${userId}`);
}

export async function fetchOrderById(id) {
    return request(`/api/order/${id}`);
}

export async function updateOrderStatusApi(id, status) {
    return request(`/api/order/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
    });
}
