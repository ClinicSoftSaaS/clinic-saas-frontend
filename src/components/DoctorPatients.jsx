import { useEffect, useState } from "react";

import {
  getPatients,
  getAppointments,
  getPrescriptions,
  addPatient
} from "../api/api";

export default function DoctorPatients() {

  // =========================
  // STATE
  // =========================
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: ""
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;
  const userId = user?.id;

  // =========================
  // LOAD PATIENTS
  // =========================
  const loadPatients = async () => {

    try {
      setError("");

      const data = await getPatients();

      const list = Array.isArray(data) ? data : [];

      setPatients(list);
      setFilteredPatients(list);

    } catch (err) {
      console.error(err);
      setError("Failed to load patients");
    }
  };

  // =========================
  // INIT
  // =========================
  useEffect(() => {

    const init = async () => {

      try {
        setLoading(true);

        if (role === "patient") {

          const data = await getPatients();

          const list = Array.isArray(data) ? data : [];

          const me = list.find((p) => Number(p.id) === Number(userId));

          setPatients(me ? [me] : []);
          setFilteredPatients(me ? [me] : []);

        } else {
          await loadPatients();
        }

      } catch (err) {
        console.error(err);
        setError("Initialization failed");

      } finally {
        setLoading(false);
      }
    };

    init();

  }, []);

  // =========================
  // SEARCH
  // =========================
  const handleSearch = () => {

    if (!search) {
      setFilteredPatients(patients);
      return;
    }

    const result = patients.filter((p) =>
      String(p.phone).includes(search)
    );

    setFilteredPatients(result);
  };

  // =========================
  // ADD PATIENT
  // =========================
  const handleAddPatient = async () => {

    try {

      const payload = {
        name: form.name,
        phone: form.phone,
        age: Number(form.age)
      };

      await addPatient(payload);

      setForm({ name: "", phone: "", age: "" });

      await loadPatients();

    } catch (err) {
      console.error(err);
      setError("Failed to add patient");
    }
  };

  // =========================
  // LOAD DETAILS
  // =========================
  const loadPatientDetails = async (patient) => {

    setSelectedPatient(patient);

    try {

      const [aData, pData] = await Promise.all([
        getAppointments(),
        getPrescriptions()
      ]);

      setAppointments(
        (aData || []).filter(
          (a) => Number(a.patient_id) === Number(patient.id)
        )
      );

      setPrescriptions(
        (pData || []).filter(
          (p) => Number(p.patient_id) === Number(patient.id)
        )
      );

    } catch (err) {
      console.error(err);
      setError("Failed to load patient details");
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Loading patients...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>

      <h2>🧑‍⚕️ Patients</h2>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* SEARCH */}
      {role === "doctor" && !selectedPatient && (
        <div style={{ marginBottom: "20px" }}>

          <input
            placeholder="Search by phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={handleSearch}>
            Search
          </button>

        </div>
      )}

      {/* ADD PATIENT */}
      {role === "doctor" && !selectedPatient && (
        <div style={{
          background: "#f1f5f9",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px"
        }}>

          <h3>➕ Add Patient</h3>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            placeholder="Age"
            value={form.age}
            onChange={(e) =>
              setForm({ ...form, age: e.target.value })
            }
          />

          <button onClick={handleAddPatient}>
            Add Patient
          </button>

        </div>
      )}

      {/* PATIENT LIST */}
      {!selectedPatient && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "15px"
        }}>

          {filteredPatients.length === 0 ? (
            <p>No patients found</p>
          ) : (
            filteredPatients.map((p) => (
              <div key={p.id} style={{
                background: "linear-gradient(135deg, #1e293b, #334155)",
                color: "white",
                padding: "15px",
                borderRadius: "12px"
              }}>

                <h3>👤 {p.name}</h3>
                <p>📞 {p.phone}</p>
                <p>🎂 Age: {p.age}</p>

                <button
                  onClick={() => loadPatientDetails(p)}
                  style={{ marginTop: "10px" }}
                >
                  View Details
                </button>

              </div>
            ))
          )}

        </div>
      )}

      {/* DETAILS */}
      {selectedPatient && (
        <div>

          <button onClick={() => setSelectedPatient(null)}>
            ← Back
          </button>

          <h2>{selectedPatient.name}</h2>

          <h3>📅 Appointments</h3>

          {appointments.map(a => (
            <div key={a.id}>
              🗓 {a.date}
            </div>
          ))}

          <h3>💊 Prescriptions</h3>

          {[...prescriptions]
            .sort((a, b) => b.id - a.id)
            .map(p => (
              <div key={p.id}>
                💊 {p.medicines}
                <br />
                📝 {p.notes}
              </div>
            ))
          }

        </div>
      )}

    </div>
  );
}