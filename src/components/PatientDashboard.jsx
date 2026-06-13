import { useEffect, useState } from "react";
import { getPatients, addPatient, searchPatientByPhone } from "../api/api";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PatientDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
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
        age: Number(form.age),
        gender: form.gender,
        address: form.address,
      });

      setForm({
        name: "",
        phone: "",
        age: "",
        gender: "",
        address: "",
      });

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

  // ================= EXPORT EXCEL =================
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(patients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    XLSX.writeFile(workbook, "patients.xlsx");
  };

  // ================= DOWNLOAD PDF =================
  const downloadPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["ID", "Name", "Phone", "Age", "Gender", "Address"]],
      body: patients.map((p) => [
        p.id,
        p.name,
        p.phone,
        p.age,
        p.gender,
        p.address,
      ]),
    });

    doc.save("patients.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👤 Patients</h2>

      {/* ACTION BUTTONS */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={exportExcel} style={{ marginRight: "10px" }}>
          Export Excel
        </button>

        <button onClick={downloadPDF} style={{ marginRight: "10px" }}>
          Download PDF
        </button>

        <button onClick={() => window.print()}>
          Print
        </button>
      </div>

      {/* ADD PATIENT FORM */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <button onClick={handleAdd}>Add Patient</button>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Search by phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>
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
              <th>Gender</th>
              <th>Address</th>
            </tr>
          </thead>

          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="6">No patients found</td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.phone}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.address}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}