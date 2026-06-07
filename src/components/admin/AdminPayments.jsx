import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH PAYMENTS
  // =========================
  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/subscription/admin/payment-proofs`
      );

      const data = await res.json();
      setPayments(data || []);
    } catch (err) {
      console.error("Error loading payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // =========================
  // APPROVE
  // =========================
  const approvePayment = async (id) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/subscription/admin/approve-payment/${id}`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        alert("Payment Approved");
        fetchPayments();
      } else {
        alert("Failed to approve");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // =========================
  // REJECT
  // =========================
  const rejectPayment = async (id) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/subscription/admin/reject-payment/${id}`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        alert("Payment Rejected");
        fetchPayments();
      } else {
        alert("Failed to reject");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // =========================
  // STATUS STYLE
  // =========================
  const statusStyle = (status) => {
    switch (status) {
      case "approved":
        return { color: "green", fontWeight: "bold" };
      case "rejected":
        return { color: "red", fontWeight: "bold" };
      default:
        return { color: "orange", fontWeight: "bold" };
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Payment Panel</h2>

      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No payments found</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Clinic ID</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Proof Method</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.clinic_id}</td>
                  <td>{p.plan}</td>
                  <td>PKR {p.amount}</td>
                  <td style={statusStyle(p.status)}>{p.status}</td>
                  <td>{p.proof_method || "whatsapp"}</td>

                  <td>
                    <button
                      onClick={() => approvePayment(p.id)}
                      style={styles.approveBtn}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectPayment(p.id)}
                      style={styles.rejectBtn}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// =========================
// STYLES
// =========================
const styles = {
  container: {
    padding: "30px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "600",
  },

  tableWrapper: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  approveBtn: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "6px 12px",
    marginRight: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  rejectBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};