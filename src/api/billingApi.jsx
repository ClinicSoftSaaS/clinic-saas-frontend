const BASE_URL = import.meta.env.VITE_API_URL;

// ==============================
// SAFE POST
// ==============================
async function post(url, body) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

// ==============================
// STRIPE CHECKOUT
// ==============================
export const createStripeCheckout = (clinicId, plan) => {
  return post("/api/subscription/create-checkout-session", {
    clinic_id: clinicId,
    plan,
  });
};

// ==============================
// MANUAL PAYMENT
// ==============================
export const createManualPayment = (clinicId, plan, amount) => {
  return post("/api/subscription/manual-payment", {
    clinic_id: clinicId,
    plan,
    amount,
  });
};

// ==============================
// HISTORY (SAFE)
// ==============================
export const getBillingHistory = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/subscription/history`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const text = await res.text();

    try {
      return text ? JSON.parse(text) : [];
    } catch {
      return [];
    }
  } catch {
    return [];
  }
};