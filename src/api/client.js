const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/* =========================
   TOKEN HELPERS
========================= */
const getToken = () => localStorage.getItem("token");

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

/* =========================
   NORMALIZE URL (FIX 307 ISSUE)
========================= */
const normalizeUrl = (url) => {
  if (!url) return url;

  // avoid double slash except http(s)://
  if (url.startsWith("http")) return url;

  // ensure single leading slash
  let clean = url.startsWith("/") ? url : `/${url}`;

  // enforce trailing slash (FASTAPI FIX)
  if (!clean.endsWith("/")) clean += "/";

  return clean;
};

/* =========================
   CORE REQUEST HANDLER
========================= */
async function request(endpoint, options = {}) {
  const token = getToken();

  const url = `${BASE_URL}${normalizeUrl(endpoint)}`;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    method: options.method || "GET",
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(url, config);

    // =========================
    // AUTO HANDLE JSON
    // =========================
    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    // =========================
    // AUTH ERROR HANDLING
    // =========================
    if (res.status === 401) {
      console.error("401 Unauthorized - logging out");
      clearAuth();
      return;
    }

    // =========================
    // GLOBAL ERROR HANDLING
    // =========================
    if (!res.ok) {
      const error = new Error(data.detail || "API Request Failed");
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error("API ERROR:", err.message);
    throw err;
  }
}

/* =========================
   AUTH API
========================= */
export const loginUser = async (payload) => {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: payload,
  });

  if (data?.access_token) {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify({
      user_id: data.user_id,
      role: data.role,
      clinic_id: data.clinic_id,
      subscription_status: data.subscription_status,
    }));
  }

  return data;
};

export const registerUser = (payload) =>
  request("/api/auth/register", {
    method: "POST",
    body: payload,
  });

/* =========================
   PATIENTS API
========================= */
export const getPatients = () => request("/api/patients/");
export const addPatient = (data) =>
  request("/api/patients/", {
    method: "POST",
    body: data,
  });

export const searchPatientByPhone = (phone) =>
  request(`/api/patients/search/phone/${phone}/`);

export const searchPatientById = (id) =>
  request(`/api/patients/search/id/${id}/`);

/* =========================
   APPOINTMENTS API
========================= */
export const getAppointments = () => request("/api/appointments/");
export const addAppointment = (data) =>
  request("/api/appointments/", {
    method: "POST",
    body: data,
  });

/* =========================
   PRESCRIPTIONS API
========================= */
export const getPrescriptions = () =>
  request("/api/prescriptions/");

export const addPrescription = (data) =>
  request("/api/prescriptions/", {
    method: "POST",
    body: data,
  });