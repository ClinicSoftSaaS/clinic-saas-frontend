import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getPatients,
  getAppointments
} from "../api/api";

export default function Dashboard() {

  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // TRIAL CHECK
  // =========================
  useEffect(() => {
    const trialEnd = localStorage.getItem("trial_end");

    if (trialEnd) {
      const endDate = new Date(trialEnd);
      const now = new Date();

      if (endDate < now) {
        navigate("/billing");
      }
    }
  }, [navigate]);

  // =========================
  // AUTH CHECK (IMPORTANT FIX)
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        // ❌ STOP if no token
        if (!token) {
          navigate("/login");
          return;
        }

        const patientsData = await getPatients();
        const appointmentsData = await getAppointments();

        setPatients(Array.isArray(patientsData) ? patientsData : []);
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);

      } catch (err) {

        console.error("DASHBOARD ERROR:", err);

        // =========================
        // AUTO LOGOUT ON TOKEN ERROR
        // =========================
        if (
          err.message?.includes("401") ||
          err.message?.includes("Invalid token")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        setError(err.message || "Failed to load dashboard data");

      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, [navigate]);

  // =========================
  // STYLE
  // =========================
  const cardStyle = {
    background: "linear-gradient(135deg, #1e293b, #334155)",
    color: "white",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
    flex: 1,
    minWidth: "220px",
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>Dashboard Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>
        📊 Dashboard Overview
      </h2>

      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
      }}>

        <div style={cardStyle}>
          <h3>👤 Patients</h3>
          <h1>{patients.length}</h1>
        </div>

        <div style={cardStyle}>
          <h3>📅 Appointments</h3>
          <h1>{appointments.length}</h1>
        </div>

        <div style={cardStyle}>
          <h3>🧾 Prescriptions</h3>
          <h1>--</h1>
        </div>

      </div>

    </div>
  );
}