import Sidebar from "./Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Dashboard";
import PatientDashboard from "./PatientDashboard";
import Appointments from "./Appointments";
import Pricing from "./Pricing";
import Search from "./Search";
import Prescriptions from "./Prescription"; // IMPORTANT FILE NAME FIX

export default function MainLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<PatientDashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="billing" element={<Pricing />} />
          <Route path="search" element={<Search />} />
          <Route path="prescriptions" element={<Prescriptions />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}