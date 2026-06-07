import { useNavigate } from "react-router-dom";

export default function PaymentInstructions() {
  const navigate = useNavigate();

  const paymentInfo = {
    whatsapp: "+923226813940",
    jazzcash: "+923226813940",
    accountName: "Shahnaz Akhtar",
    amount: 3500,
    plan: "Pro",
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Payment Instructions</h1>

        <p style={styles.subtitle}>
          Complete your payment to activate your subscription
        </p>

        {/* PLAN BOX */}
        <div style={styles.box}>
          <h2 style={{ margin: 0 }}>{paymentInfo.plan} Plan</h2>
          <p style={styles.amount}>PKR {paymentInfo.amount}</p>
        </div>

        {/* PAYMENT DETAILS */}
        <div style={styles.section}>
          <h3>Payment Details</h3>

          <div style={styles.row}>
            <span>JazzCash Account No:</span>
            <strong>{paymentInfo.jazzcash}</strong>
          </div>

          <div style={styles.row}>
            <span>JazzCash Account Name:</span>
            <strong>{paymentInfo.accountName}</strong>
          </div>

          <div style={styles.row}>
            <span>WhatsApp:</span>
            <strong>{paymentInfo.whatsapp}</strong>
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div style={styles.section}>
          <h3>How to Pay</h3>

          <ol style={styles.list}>
            <li>Send payment to JazzCash number above</li>
            <li>Take a screenshot of payment</li>
            <li>Send screenshot on WhatsApp</li>
            <li>Or upload proof using optional button</li>
          </ol>
        </div>

        {/* NOTE */}
        <div style={styles.note}>
          ⚠️ Your account will be activated after admin verification
        </div>

        {/* BUTTONS */}
        <div style={styles.buttonGroup}>
          <button
            onClick={() => navigate("/app/dashboard")}
            style={styles.primaryButton}
          >
            Continue
          </button>

          <button
            onClick={() => navigate("/app/payment-upload")}
            style={styles.secondaryButton}
          >
            Upload Proof (Optional)
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  title: {
    fontSize: "28px",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "20px",
  },

  box: {
    background: "#eef2ff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  amount: {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "5px",
  },

  section: {
    marginBottom: "20px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },

  list: {
    paddingLeft: "20px",
    lineHeight: "1.8",
  },

  note: {
    background: "#fff7ed",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    color: "#9a3412",
    fontSize: "14px",
  },

  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  primaryButton: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },

  secondaryButton: {
    width: "100%",
    padding: "14px",
    background: "transparent",
    color: "#2563eb",
    border: "1px solid #2563eb",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
};