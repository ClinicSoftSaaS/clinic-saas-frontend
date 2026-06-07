import { useEffect, useState } from "react";
import { getAppointments, addAppointment } from "../api/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patient_id: "",
    date: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // =========================
  // SAFE LOAD (WITH GUARD)
  // =========================
  const loadAppointments = async () => {
    try {
      setError("");

      const data = await getAppointments();
      const list = Array.isArray(data) ? data : [];

      setAppointments(list);
      setFiltered(list);

    } catch (err) {
      setError(err.message || "Failed to load appointments");
    }
  };

  // =========================
  // LOAD ONLY IF USER EXISTS
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    loadAppointments();
  }, []);

  // =========================
  // SEARCH
  // =========================
  const handleSearch = () => {
    if (!search) {
      setFiltered(appointments);
      return;
    }

    const result = appointments.filter((a) =>
      String(a.patient_id).includes(search)
    );

    setFiltered(result);
  };

  // =========================
  // ADD
  // =========================
  const handleAdd = async () => {
    if (!form.patient_id || !form.date) {
      setError("Please fill all fields");
      return;
    }

    try {
      setError("");

      await addAppointment({
        patient_id: Number(form.patient_id),

        // ✅ FIXED: use correct key from login
        doctor_id: user.user_id,

        date: form.date,
      });

      setForm({ patient_id: "", date: "" });
      loadAppointments();

    } catch (err) {
      setError(err.message || "Error adding appointment");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={pageStyle}>

      <h2 style={titleStyle}>📅 Appointments</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* SEARCH */}
      <div style={cardStyle}>
        <h3>Search</h3>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Search by Patient ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />

          <button onClick={handleSearch} style={btnStyle}>
            Search
          </button>
        </div>
      </div>

      {/* ADD */}
      <div style={cardStyle}>
        <h3>➕ Add Appointment</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            placeholder="Patient ID"
            value={form.patient_id}
            onChange={(e) =>
              setForm({ ...form, patient_id: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="datetime-local"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            style={inputStyle}
          />

          <button onClick={handleAdd} style={btnStyle}>
            Add Appointment
          </button>
        </div>
      </div>

      {/* LIST */}
      <div style={gridStyle}>
        {filtered.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          filtered.map((a) => (
            <div key={a.id} style={cardItem}>

              <h3 style={{ marginBottom: "10px" }}>
                🗓 Appointment #{a.id}
              </h3>

              <p style={textStyle}>
                👤 Patient ID: {a.patient_id}
              </p>

              <p style={textStyle}>
                🧑‍⚕️ Doctor ID: {a.doctor_id}
              </p>

              <p style={textStyle}>
                📅 {new Date(a.date).toLocaleString()}
              </p>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

/* =========================
   STYLES
========================= */

const pageStyle = {
  padding: "20px",
  background: "#f1f5f9",
  minHeight: "100vh",
};

const titleStyle = {
  marginBottom: "15px",
  color: "#0b3a6e",
};

const cardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "15px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
};

const btnStyle = {
  padding: "10px 15px",
  background: "#0b3a6e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "15px",
};

const cardItem = {
  background: "linear-gradient(135deg, #1e293b, #334155)",
  color: "white",
  padding: "15px",
  borderRadius: "12px",
};

const textStyle = {
  margin: "6px 0",
  opacity: 0.9,
};