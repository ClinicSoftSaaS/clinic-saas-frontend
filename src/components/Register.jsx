import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================
  const [form, setForm] = useState({
    clinic_name: "",
    email: "",
    username: "",
    password: "",
    role: "admin",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // REGISTER
  // =========================
  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.clinic_name ||
      !form.email ||
      !form.username ||
      !form.password
    ) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        clinic_name: form.clinic_name,
        email: form.email,
        username: form.username,
        password: form.password,
        role: "admin",
      });

      alert("Clinic registered successfully!");

      navigate("/login");

    } catch (err) {
      console.error(err);

      setError(
        err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #f1f5f9, #e0f2fe)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "35px",
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, #0b3a6e, #1d5fa8)",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.15)",
          color: "white",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          ClinicSoft
        </h1>

        <p
          style={{
            textAlign: "center",
            opacity: 0.85,
            marginBottom: "25px",
          }}
        >
          Start your 7-Day Free Trial
        </p>

        <form onSubmit={handleRegister}>
          {/* CLINIC NAME */}
          <input
            type="text"
            name="clinic_name"
            placeholder="Clinic Name"
            value={form.clinic_name}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Clinic Email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* USERNAME */}
          <input
            type="text"
            name="username"
            placeholder="Admin Username"
            value={form.username}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
          />

          {error && (
            <p
              style={{
                color: "#ffd4d4",
                marginBottom: "12px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#0b3a6e",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Clinic"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "12px",
            background: "transparent",
            border: "1px solid white",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Back To Login
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  boxSizing: "border-box",
};