import PricingCard from "../components/PricingCard";
import { createStripeCheckout, createManualPayment } from "../api/billing";

export default function Billing() {

  const clinicId = localStorage.getItem("clinic_id");

  const handleStripe = async (plan) => {
    const res = await createStripeCheckout(clinicId, plan);
    if (res.checkout_url) {
      window.location.href = res.checkout_url;
    }
  };

  const handleManual = async (plan, amount) => {
    const res = await createManualPayment(clinicId, plan, amount);
    alert(res.message);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Upgrade Your Plan</h1>

      <div style={{ display: "flex", gap: "20px" }}>

        <PricingCard
          title="Basic"
          price="19.99"
          users="2"
          onSelect={() => handleStripe("basic")}
        />

        <PricingCard
          title="Pro"
          price="29.99"
          users="5"
          onSelect={() => handleStripe("pro")}
        />

      </div>

      <hr style={{ margin: "40px 0" }} />

      <h2>Manual Payment (Pakistan)</h2>

      <button
        onClick={() => handleManual("basic", 5000)}
        style={{ marginRight: "10px" }}
      >
        Pay Basic (PKR 5000)
      </button>

      <button
        onClick={() => handleManual("pro", 8000)}
      >
        Pay Pro (PKR 8000)
      </button>
    </div>
  );
}