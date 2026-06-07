import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Pricing() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSelectPlan = async (plan) => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/subscription/select-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinic_id: user.clinic_id,
          plan: plan,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // IMPORTANT: go to instructions page (NOT dashboard)
        navigate("/app/payment-instructions", {
          state: data,
        });
      } else {
        alert(data.detail || "Failed to create payment request");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "40px" }}>

      <div style={{ border: "1px solid #ccc", padding: "20px" }}>
        <h2>Basic Plan</h2>
        <p>PKR 2000</p>
        <button onClick={() => handleSelectPlan("basic")}>
          Choose Basic
        </button>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "20px" }}>
        <h2>Pro Plan</h2>
        <p>PKR 3500</p>
        <button onClick={() => handleSelectPlan("pro")}>
          Choose Pro
        </button>
      </div>

    </div>
  );
}