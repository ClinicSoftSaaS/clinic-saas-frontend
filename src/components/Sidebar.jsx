import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle = ({ isActive }) => ({
    padding: "10px",
    borderRadius: "8px",
    textDecoration: "none",
    color: isActive ? "white" : "#cbd5e1",
    background: isActive ? "#1d5fa8" : "transparent",
    display: "block",
  });

  return (
    <aside
      style={{
        width: "240px",
        height: "100vh",
        background: "#0b3a6e",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2 style={{ marginBottom: "30px" }}>🏥 ClinicSoft</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* DASHBOARD */}
          <NavLink to="/app/dashboard" style={linkStyle}>
            📊 Dashboard
          </NavLink>

          {/* PATIENTS */}
          {(role === "admin" || role === "doctor") && (
            <NavLink to="/app/patients" style={linkStyle}>
              👤 Patients
            </NavLink>
          )}

          {/* SEARCH */}
          <NavLink to="/app/search" style={linkStyle}>
            🔍 Search Patients
          </NavLink>

          {/* APPOINTMENTS */}
          <NavLink to="/app/appointments" style={linkStyle}>
            📅 Appointments
          </NavLink>

          {/* PRESCRIPTIONS (FIXED NAME) */}
          <NavLink to="/app/prescriptions" style={linkStyle}>
            🧾 Prescriptions
          </NavLink>

          {/* BILLING */}
          {role === "admin" && (
            <NavLink to="/app/billing" style={linkStyle}>
              💳 Billing
            </NavLink>
          )}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          background: "#ef4444",
          border: "none",
          padding: "10px",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </aside>
  );
}