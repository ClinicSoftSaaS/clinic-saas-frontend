import { useEffect, useState } from "react";

import {
  getPatients,
  getPrescriptions,
  addPrescription
} from "../api/api";

export default function Prescription() {

  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patient_id: "",
    medicines: "",
    notes: ""
  });

  // =========================
  // USER (FIXED)
  // =========================
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ FIX: correct field
  const doctorId = user.user_id;

  // =========================
  // LOAD DATA
  // =========================
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const patientsData = await getPatients();
      const prescriptionsData = await getPrescriptions();

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setPrescriptions(Array.isArray(prescriptionsData) ? prescriptionsData : []);

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // ADD PRESCRIPTION
  // =========================
  const handleSubmit = async () => {

    if (!form.patient_id || !form.medicines) {
      setError("Please select patient and enter medicines");
      return;
    }

    // 🔥 FIX: proper doctor validation
    if (!doctorId) {
      setError("Doctor session invalid. Please login again.");
      return;
    }

    // 🔥 OPTIONAL SAFETY CHECK
    if (user.role !== "admin" && user.role !== "doctor") {
      setError("Unauthorized role for prescription module");
      return;
    }

    try {

      const payload = {
        patient_id: Number(form.patient_id),
        doctor_id: Number(doctorId),
        medicines: form.medicines,
        notes: form.notes
      };

      await addPrescription(payload);

      setForm({
        patient_id: "",
        medicines: "",
        notes: ""
      });

      loadData();

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save prescription");
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Loading prescriptions...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>

      <h2>💊 Prescriptions</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* FORM */}
      <div style={{
        padding: "15px",
        background: "#f4f6f8",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>

        <h3>Add Prescription</h3>

        <select
          value={form.patient_id}
          onChange={(e) =>
            setForm({ ...form, patient_id: e.target.value })
          }
        >
          <option value="">Select Patient</option>

          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - {p.phone}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          placeholder="Medicines"
          value={form.medicines}
          onChange={(e) =>
            setForm({ ...form, medicines: e.target.value })
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
          style={{
            width: "100%",
            padding: "10px",
            height: "80px"
          }}
        />

        <br /><br />

        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 15px",
            background: "#1e293b",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          ➕ Save Prescription
        </button>

      </div>

      {/* LIST */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "15px"
      }}>

        {prescriptions.length === 0 ? (
          <p>No prescriptions found</p>
        ) : (
          prescriptions.map((p) => (
            <div key={p.id} style={{
              background: "linear-gradient(135deg, #1e293b, #334155)",
              color: "white",
              padding: "15px",
              borderRadius: "12px"
            }}>

              <h3>💊 Prescription #{p.id}</h3>

              <p>👤 Patient ID: {p.patient_id}</p>
              <p>🧑‍⚕️ Doctor ID: {p.doctor_id}</p>

              <div style={{
                marginTop: "10px",
                padding: "8px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.1)"
              }}>
                💊 {p.medicines}
              </div>

              {p.notes && (
                <p style={{ marginTop: "8px" }}>
                  📝 {p.notes}
                </p>
              )}

            </div>
          ))
        )}

      </div>

    </div>
  );
}