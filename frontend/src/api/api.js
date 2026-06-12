// ─────────────────────────────────────────────
//  Central API client
//  All HTTP calls go through here — no component calls fetch directly
// ─────────────────────────────────────────────

const BASE_URL = "http://localhost:8080";

// ─────────────────────────────────────────────
//  Core fetch wrapper
// ─────────────────────────────────────────────
async function request(method, path, body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${path}`, config);

  // No content responses (e.g. DELETE 204)
  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    // Prefer a field-level validation message when present,
    // otherwise fall back to the general error/message.
    let message =
      data?.error || data?.message || "An unexpected error occurred";
    if (data?.fieldErrors && typeof data.fieldErrors === "object") {
      const firstField = Object.values(data.fieldErrors)[0];
      if (firstField) message = firstField;
    }
    throw new Error(message);
  }

  return data;
}

// ─────────────────────────────────────────────
//  Public endpoints (no auth required)
// ─────────────────────────────────────────────
export const publicApi = {
  getRooms: () => request("GET", "/api/rooms"),

  getAvailability: (checkIn, checkOut, guests) =>
    request(
      "GET",
      `/api/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
    ),

  createBooking: (bookingData) => request("POST", "/api/bookings", bookingData),
};

// ─────────────────────────────────────────────
//  Admin endpoints (auth required — token passed in)
// ─────────────────────────────────────────────
export const adminApi = {
  // Auth
  login: (credentials) => request("POST", "/api/admin/auth/login", credentials),

  logout: (token) => request("POST", "/api/admin/auth/logout", null, token),

  // Dashboard
  getDashboardStats: (token) =>
    request("GET", "/api/admin/dashboard/stats", null, token),

  // Bookings
  getBookings: (token, { status, source, roomId } = {}) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (source) params.append("source", source);
    if (roomId) params.append("roomId", roomId);
    const query = params.toString() ? `?${params.toString()}` : "";
    return request("GET", `/api/admin/bookings${query}`, null, token);
  },

  getBookingById: (token, id) =>
    request("GET", `/api/admin/bookings/${id}`, null, token),

  createBooking: (token, data) =>
    request("POST", "/api/admin/bookings", data, token),

  updateBookingStatus: (token, id, status) =>
    request("PATCH", `/api/admin/bookings/${id}/status`, { status }, token),

  updateBooking: (token, id, data) =>
    request("PATCH", `/api/admin/bookings/${id}`, data, token),

  // Blocked dates
  getBlockedDates: (token, { from, to } = {}) => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const query = params.toString() ? `?${params.toString()}` : "";
    return request("GET", `/api/admin/blocked-dates${query}`, null, token);
  },

  blockDates: (token, data) =>
    request("POST", "/api/admin/blocked-dates", data, token),

  unblockDates: (token, id) =>
    request("DELETE", `/api/admin/blocked-dates/${id}`, null, token),

  // Rooms
  getRooms: (token) => request("GET", "/api/admin/rooms", null, token),

  updateRoom: (token, id, data) =>
    request("PUT", `/api/admin/rooms/${id}`, data, token),
};
