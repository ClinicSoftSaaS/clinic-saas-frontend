import { useEffect, useState } from "react";

import {
  getPatients,
  addAppointment
} from "../api/api";

export default function AddAppointment() {

  // =========================
  // STATE
  // =========================
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patient_id: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // FIXED USER (DOCTOR)
  // =========================
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const doctorId = user?.id;

  // =========================
  // LOAD PATIENTS
  // =========================
  const loadPatients = async () => {

    try {
      setError("");

      const data = await getPatients();

      setPatients(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
      setError("Error loading patients");
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // =========================
  // SUBMIT APPOINTMENT
  // =========================
  const submitAppointment = async () => {

    if (!form.patient_id || !form.date) {
      setError("Select patient and date");
      return;
    }

    if (!doctorId) {
      setError("Doctor not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        patient_id: Number(form.patient_id),
        doctor_id: Number(doctorId),
        date: new Date(form.date).toISOString(),
      };

      await addAppointment(payload);

      setForm({
        patient_id: "",
        date: "",
      });

      alert("Appointment created ✔");

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create appointment");

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: "20px" }}>

      <h2>Add Appointment</h2>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* PATIENT DROPDOWN */}
      <select
        value={form.patient_id}
        onChange={(e) =>
          setForm({ ...form, patient_id: e.target.value })
        }
      >
        <option value="">Select Patient</option>

        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} - {p.phone} (ID: {p.id})
          </option>
        ))}

      </select>

      <br /><br />

      {/* DATE */}
      <input
        type="datetime-local"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      <br /><br />

      {/* BUTTON */}
      <button
        onClick={submitAppointment}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Appointment"}
      </button>

    </div>
  );
}