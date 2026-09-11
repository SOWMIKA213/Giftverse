import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerUser } from "./config/api";

function Login() {
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Target route to return to after login
    const from = location.state?.from || "/home";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter both email and password.");
            return;
        }

        if (isRegisterMode && !name.trim()) {
            setError("Please enter your name for registration.");
            return;
        }

        setLoading(true);

        try {
            const displayName = name.trim() || email.split("@")[0];

            // Send registration request to backend as expected
            const response = await registerUser({
                name: displayName,
                email: email.trim(),
                password: password.trim(),
                phone: phone.trim() || "N/A"
            });

            if (response && response.user) {
                const userObj = response.user;
                const userId = userObj._id;

                // Save registered user mapping locally for instant re-login
                try {
                    const knownUsers = JSON.parse(localStorage.getItem("giftverse_users") || "{}");
                    knownUsers[email.trim().toLowerCase()] = userObj;
                    localStorage.setItem("giftverse_users", JSON.stringify(knownUsers));
                } catch (e) {
                    // Ignore storage errors
                }

                // Set session
                localStorage.setItem("userId", userId);
                localStorage.setItem("user", JSON.stringify(userObj));
                localStorage.setItem("isLoggedIn", "true");
                window.dispatchEvent(new Event("storage"));

                navigate(from, { replace: true });
            } else {
                throw new Error(response.message || "Authentication failed");
            }
        } catch (err) {
            // Handle cases where user already exists on backend
            if (err.message && err.message.toLowerCase().includes("user already exists")) {
                if (isRegisterMode) {
                    setError("User already exists with this email. Please switch to Login mode.");
                } else {
                    // Try looking up locally stored user details if previously registered in this browser session
                    try {
                        const knownUsers = JSON.parse(localStorage.getItem("giftverse_users") || "{}");
                        const matchedUser = knownUsers[email.trim().toLowerCase()];
                        if (matchedUser && matchedUser._id) {
                            localStorage.setItem("userId", matchedUser._id);
                            localStorage.setItem("user", JSON.stringify(matchedUser));
                            localStorage.setItem("isLoggedIn", "true");
                            window.dispatchEvent(new Event("storage"));
                            navigate(from, { replace: true });
                            return;
                        }
                    } catch (e) {
                        // ignore
                    }

                    setError("User already exists on server. If this is your account, please register with your name or use a unique email.");
                }
            } else {
                setError(err.message || "Unable to complete operation. Please check backend connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h1 className="login-heading">
                    {isRegisterMode ? "Create an Account" : "Welcome Back"}
                </h1>
                <p className="login-subheading">
                    {isRegisterMode
                        ? "Register to customize gifts, track orders, and save wishlists."
                        : "Log in to discover, customize, and save your favorite gifts."}
                </p>

                {error && <div className="login-error-alert">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    {isRegisterMode && (
                        <div className="login-form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={isRegisterMode}
                            />
                        </div>
                    )}

                    <div className="login-form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-form-group">
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {isRegisterMode && (
                        <div className="login-form-group">
                            <label htmlFor="phone">Phone Number (Optional)</label>
                            <input
                                type="tel"
                                id="phone"
                                placeholder="Enter contact phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    )}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading
                            ? "Processing..."
                            : isRegisterMode
                            ? "Register Account"
                            : "Login"}
                    </button>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
                    {isRegisterMode ? (
                        <span>
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegisterMode(false);
                                    setError("");
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "darkmagenta",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    textDecoration: "underline"
                                }}
                            >
                                Log in
                            </button>
                        </span>
                    ) : (
                        <span>
                            Don't have an account yet?{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegisterMode(true);
                                    setError("");
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "darkmagenta",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    textDecoration: "underline"
                                }}
                            >
                                Register here
                            </button>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
