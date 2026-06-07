import { useEffect, useState } from "react";
import { getPatients, addPatient, searchPatientByPhone } from "../api/api";

export default function PatientDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: ""
  });

  const [search, setSearch] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleAdd = async () => {
    try {
      await addPatient({
        name: form.name,
        phone: form.phone,
        age: Number(form.age)
      });

      setForm({ name: "", phone: "", age: "" });
      loadPatients();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!search) return loadPatients();

    try {
      const result = await searchPatientByPhone(search);
      setPatients([result]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>👤 Patients</h2>

      {/* FORM */}
      <div style={{ marginBottom: "20px" }}>

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

        <button onClick={handleAdd}>
          Add Patient
        </button>

      </div>

      {/* SEARCH */}
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

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Age</th>
            </tr>
          </thead>

          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="4">No patients found</td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.phone}</td>
                  <td>{p.age}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      )}

    </div>
  );
}