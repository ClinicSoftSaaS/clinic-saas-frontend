import { useState } from "react";

import {
  getPatients,
  getAppointments,
  getPrescriptions
} from "../api/api";

export default function Search() {

  // ================= STATE =================
  const [phone, setPhone] = useState("");
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= STYLES =================
  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    padding: "10px 15px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    background: "#2c3e50",
    color: "white"
  };

  const cardStyle = {
    background: "linear-gradient(135deg, #1e293b, #334155)",
    color: "white",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "20px"
  };

  // ================= SEARCH =================
  const handleSearch = async () => {

    try {
      setLoading(true);
      setError("");

      const data = await getPatients();

      const list = Array.isArray(data) ? data : [];

      const matches = list.filter(
        (p) => String(p.phone).trim() === phone.trim()
      );

      if (matches.length === 0) {
        setPatients([]);
        setPatient(null);
        setAppointments([]);
        setPrescriptions([]);
        setError("Patient not found");
        return;
      }

      setPatients(matches);

      const selected = matches[0];
      setPatient(selected);

      const appointmentsData = await getAppointments();

      const filteredAppointments = (appointmentsData || []).filter(
        (a) => Number(a.patient_id) === Number(selected.id)
      );

      setAppointments(filteredAppointments);

      const prescriptionsData = await getPrescriptions();

      const filteredPrescriptions = (prescriptionsData || []).filter(
        (p) => Number(p.patient_id) === Number(selected.id)
      );

      setPrescriptions(filteredPrescriptions);

    } catch (err) {
      console.error("SEARCH ERROR:", err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ================= SELECT PATIENT =================
  const selectPatient = async (p) => {

    setPatient(p);

    const appointmentsData = await getAppointments();

    setAppointments(
      (appointmentsData || []).filter(
        (a) => Number(a.patient_id) === Number(p.id)
      )
    );

    const prescriptionsData = await getPrescriptions();

    setPrescriptions(
      (prescriptionsData || []).filter(
        (x) => Number(x.patient_id) === Number(p.id)
      )
    );
  };

  // ================= PRINT =================
  const handlePrint = () => {
    window.print();
  };

  // ================= DOWNLOAD =================
  const handleDownload = () => {

    if (!patient) return;

    const text =
      "Patient Report\n\n" +
      "Name: " + patient.name + "\n" +
      "Phone: " + patient.phone + "\n" +
      "Age: " + patient.age + "\n\n" +
      "Appointments:\n" +
      appointments.map((a) => "- " + a.date).join("\n") +
      "\n\nPrescriptions:\n" +
      prescriptions.map((p) => "- " + p.medicines).join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "patient_report.txt";
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ color: "#1e293b" }}>
        🔍 Search Patient
      </h2>

      <input
        style={inputStyle}
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button style={buttonStyle} onClick={handleSearch}>
        {loading ? "Searching..." : "Search"}
      </button>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {/* MULTIPLE PATIENTS */}
      {patients.length > 1 && (
        <div style={{ marginTop: "15px" }}>
          <h3>Select Patient:</h3>

          {patients.map((p) => (
            <div
              key={p.id}
              onClick={() => selectPatient(p)}
              style={{
                padding: "8px",
                margin: "5px 0",
                background: "#e2e8f0",
                cursor: "pointer",
                borderRadius: "6px"
              }}
            >
              {p.name} - {p.phone} (ID: {p.id})
            </div>
          ))}
        </div>
      )}

      {/* PATIENT INFO */}
      {patient && (
        <div style={cardStyle}>

          <h3>👤 Patient</h3>
          <p>Name: {patient.name}</p>
          <p>Phone: {patient.phone}</p>
          <p>Age: {patient.age}</p>

          <button style={buttonStyle} onClick={handlePrint}>
            🖨 Print
          </button>

          <button style={buttonStyle} onClick={handleDownload}>
            📄 Download
          </button>

          <h3>📅 Appointments</h3>

          {appointments.length === 0 ? (
            <p>No appointments</p>
          ) : (
            appointments.map((a) => (
              <div key={a.id}>
                🗓 {new Date(a.date).toLocaleString()}
              </div>
            ))
          )}

          <h3>💊 Prescriptions</h3>

          {prescriptions.length === 0 ? (
            <p>No prescriptions</p>
          ) : (
            prescriptions.map((p) => (
              <div key={p.id}>
                💊 {p.medicines}
                <br />
                📝 {p.notes}
              </div>
            ))
          )}

        </div>
      )}

    </div>
  );
}