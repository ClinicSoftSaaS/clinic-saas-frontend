const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

// ==============================
// CORE API HANDLER (PRODUCTION SAFE)
// ==============================
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  // ✅ ensure single slash consistency
  const cleanEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const res = await fetch(`${BASE_URL}${cleanEndpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = {};

  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }

  // ==============================
  // HANDLE AUTH ERROR
  // ==============================
  if (res.status === 401) {
    console.log("Unauthorized - logging out user");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
    return;
  }

  // ==============================
  // HANDLE OTHER ERRORS
  // ==============================
  if (!res.ok) {
    console.error("API ERROR:", data);
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

// ==============================
// AUTH
// ==============================
export async function loginUser(data) {
  const res = await apiRequest("/api/auth/login", {
    method: "POST",
    body: data,
  });

  if (res?.access_token) {
    localStorage.setItem("token", res.access_token);
    localStorage.setItem("user", JSON.stringify(res));
  }

  return res;
}

export async function registerUser(data) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: data,
  });
}

// ==============================
// PATIENTS
// ==============================
export const getPatients = () => apiRequest("/api/patients/");
export const addPatient = (data) =>
  apiRequest("/api/patients/", {
    method: "POST",
    body: data,
  });

export const searchPatientByPhone = (phone) =>
  apiRequest(`/api/patients/search/phone/${phone}`);

export const searchPatientById = (id) =>
  apiRequest(`/api/patients/search/id/${id}`);

// ==============================
// APPOINTMENTS
// ==============================
export const getAppointments = () => apiRequest("/api/appointments/");

export const addAppointment = (data) =>
  apiRequest("/api/appointments/", {
    method: "POST",
    body: data,
  });

// ==============================
// PRESCRIPTIONS
// ==============================
export const getPrescriptions = () =>
  apiRequest("/api/prescriptions/");

export const addPrescription = (data) =>
  apiRequest("/api/prescriptions/", {
    method: "POST",
    body: data,
  });