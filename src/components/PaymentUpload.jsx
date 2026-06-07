import { useState } from "react";

export default function PaymentUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload-payment`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Payment proof uploaded successfully!");
        setFile(null);
      } else {
        setMessage(data.detail || "Upload failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px" }}>
      <h2>Upload Payment Proof</h2>

      <input type="file" onChange={handleFileChange} />

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && (
        <p style={{ marginTop: "15px", color: "blue" }}>{message}</p>
      )}
    </div>
  );
}