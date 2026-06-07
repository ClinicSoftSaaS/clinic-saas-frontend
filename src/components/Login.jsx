import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { loginUser } from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  // =========================
  // AUTO REDIRECT IF LOGGED IN
  // =========================
  const existingUser = localStorage.getItem("user");

  if (existingUser) {
    return <Navigate to="/app/dashboard" replace />;
  }

  // =========================
  // STATE
  // =========================
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // INPUT
  // =========================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        username: form.username,
        password: form.password,
      });

      // =========================
      // STRICT TOKEN CHECK
      // =========================
      const token = localStorage.getItem("token");

      if (!token || !data) {
        setError("Login failed. Please try again.");
        return;
      }

      // =========================
      // SAFE USER OBJECT (ONLY REAL FIELDS)
      // =========================
      const user = {
        user_id: data.user_id,
        role: data.role,
        clinic_id: data.clinic_id,
        subscription_status: data.subscription_status || "active",
      };

      localStorage.setItem("user", JSON.stringify(user));

      // =========================
      // REDIRECT LOGIC
      // =========================
      if (data.subscription_status === "expired") {
        navigate("/pricing");
      } else {
        navigate("/app/dashboard");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #f1f5f9, #e0f2fe)",
    }}>
      <div style={{
        width: "380px",
        padding: "35px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #0b3a6e, #1d5fa8)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        color: "white",
      }}>
        <h1 style={{ textAlign: "center" }}>ClinicSoft</h1>

        <p style={{ textAlign: "center", opacity: 0.8 }}>
          Login to your account
        </p>

        <form onSubmit={handleLogin}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
          />

          {error && (
            <p style={{ color: "#ffcccc", fontSize: "14px" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%",
            padding: "12px",
            background: "white",
            color: "#0b3a6e",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
          }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={() => navigate("/register")}
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "10px",
            background: "transparent",
            border: "1px solid white",
            color: "white",
            borderRadius: "10px",
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}