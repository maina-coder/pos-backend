import { useState } from "react";
import PasswordInput from "./PasswordInput";
import { API_BASE_URL } from "../../utils/constants";

/**
 * Login Screen Component
 * Aligned with useAuth hook and Django REST framework
 */
export default function LoginScreen({ login }) {
  // ================================
  // FORM STATES
  // ================================
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ================================
  // UI STATES
  // ================================
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================================
  // LOGIN HANDLER
  // ================================
  async function handleLogin() {
    // Prevent empty submissions
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      /**
       * Send login credentials to Django backend.
       * Uses absolute string construction or fixes the /api duplicate suffix path.
       */
      const cleanBaseUrl = API_BASE_URL.endsWith("/api") 
        ? API_BASE_URL 
        : `${API_BASE_URL}/api`;

    const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username,
    password,
  }),
});

      const data = await res.json();

      /**
       * Handle backend validation errors
       */
      if (!res.ok) {
        throw new Error(
          data.detail ||
          data.error ||
          "Invalid username or password."
        );
      }

      /**
       * Login success
       * Formats the payload to match what your useAuth hook expects
       */
      login(username, data.token);

    } catch (err) {
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  // ================================
  // JSX RENDER BLOCK
  // ================================
  return (
    <div className="login-page">
      {/* LEFT BRANDING SIDE */}
      <div className="login-brand">
        <div className="brand-icon">🖥️</div>
        <h1 className="brand-name">Deveronig Digital Electronics Ltd</h1>
        <p className="brand-tagline">Manual Bargaining POS System</p>
        <ul className="brand-features">
          <li>Fast sales processing</li>
          <li>Thermal receipt printing</li>
          <li>Secure token authentication</li>
          <li>Live sales tracking</li>
          <li>East Africa time support</li>
        </ul>
      </div>

      {/* RIGHT LOGIN CARD */}
      <div className="login-form-panel">
        <div className="login-card">
          <h2 className="login-title">Staff Login</h2>
          <p className="login-subtitle">Sign in to continue</p>

          {/* ERROR ALERT */}
          {error && <div className="alert-error">{error}</div>}

          {/* USERNAME */}
          <div className="field-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {/* PASSWORD */}
          <div className="field-group">
            <label className="form-label">Password</label>
            <PasswordInput
              value={password}
              placeholder="Enter password"
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="btn-primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}