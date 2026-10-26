
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api.js";
import "../styles/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await apiRequest("/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (!data.token) {
        throw new Error("Login response mein token nahi mila.");
      }

      const adminUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      if (adminUser.role?.toUpperCase() !== "ADMIN") {
        throw new Error("This account does not have admin access.");
      }

      localStorage.setItem("civicToken", data.token);
      localStorage.setItem(
        "civicCurrentUser",
        JSON.stringify(adminUser)
      );

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Admin login failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <Link to="/" className="admin-login-brand">
          CivicConnect
        </Link>

        <h1>Admin Login</h1>

        <p className="admin-login-subtitle">
          Sign in to review and manage citizen reports.
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-login-field">
            <label htmlFor="admin-email">Admin email</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@civicconnect.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="admin-login-error">{error}</p>
          )}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>

        <Link to="/login" className="admin-citizen-link">
          Citizen login
        </Link>
      </div>
    </main>
  );
}

export default AdminLogin;
