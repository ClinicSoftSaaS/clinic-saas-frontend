import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import MainLayout from "./components/MainLayout";
import PaymentUpload from "./components/PaymentUpload";
import PaymentInstructions from "./components/PaymentInstructions";
import AdminPayments from "./components/admin/AdminPayments";
export default function App() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* MAIN APP (layout wrapper) */}
      <Route path="/app/*" element={<MainLayout />} />

      {/* APP PAGES */}
      <Route path="/app/payment-instructions" element={<PaymentInstructions />} />
      <Route path="/app/payment-upload" element={<PaymentUpload />} />
      <Route path="/app/admin-payments" element={<AdminPayments />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}