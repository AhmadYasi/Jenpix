import React, { useState, useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import "./BookingsPage.css";

// ── Room pricing data ─────────────────────────────────────────────────────────
const ROOM_PRICES = {
  "Gutedel Suite":              { price: 135, breakfast: 18 },
  "Bacchus Doppelzimmer":       { price: 120, breakfast: 18 },
  "Riesling Suite":             { price: 160, breakfast: 18 },
  "Scheurebe Doppelzimmer":     { price: 135, breakfast: 18 },
  "Burgunder Familien Suite":   { price: 160, breakfast: 18 },
  "Rivaner Einzelzimmer":       { price: 110, breakfast: 15 },
  "Regent Suite":               { price: 170, breakfast: 18 },
};

const EXTRA_BED_PRICE = 30;

// ── Demo Data ─────────────────────────────────────────────────────────────────
const INITIAL_BOOKINGS = [
  {
    id: "#VE250516-001", created: "16 May 2026, 09:21",
    name: "Clara Hoffmann", email: "clara.hoffmann@email.com", phone: "+49 171 2345671",
    room: "Riesling Suite", roomSub: "",
    dates: "16 May 2026 – 18 May 2026", nights: 2,
    guests: "2 Adults", source: "Booking.com", sourceType: "booking",
    total: "€320.00", perNight: "€160.00 / night", status: "confirmed",
  },
  {
    id: "#VE250517-002", created: "17 May 2026, 11:43",
    name: "Felix Brandt", email: "felix.brandt@email.com", phone: "+49 172 3456782",
    room: "Gutedel Suite", roomSub: "",
    dates: "17 May 2026 – 20 May 2026", nights: 3,
    guests: "2 Adults", source: "Booking.com", sourceType: "booking",
    total: "€405.00", perNight: "€135.00 / night", status: "confirmed",
  },
  {
    id: "#VE250518-003", created: "18 May 2026, 14:15",
    name: "Mia Steinberg", email: "mia.steinberg@email.com", phone: "+49 173 4567893",
    room: "Bacchus Doppelzimmer", roomSub: "",
    dates: "18 May 2026 – 21 May 2026", nights: 3,
    guests: "2 Adults", source: "Website", sourceType: "website",
    total: "€360.00", perNight: "€120.00 / night", status: "pending",
  },
  {
    id: "#VE250519-004", created: "19 May 2026, 16:02",
    name: "Jonas Richter", email: "jonas.richter@email.com", phone: "+49 174 5678904",
    room: "Burgunder Familien Suite", roomSub: "",
    dates: "19 May 2026 – 22 May 2026", nights: 3,
    guests: "3 Adults, 1 Child", source: "Phone", sourceType: "phone",
    total: "€480.00", perNight: "€160.00 / night", status: "confirmed",
  },
  {
    id: "#VE250520-005", created: "20 May 2026, 10:31",
    name: "Lea Hartmann", email: "lea.hartmann@email.com", phone: "+49 175 6789015",
    room: "Rivaner Einzelzimmer", roomSub: "",
    dates: "20 May 2026 – 21 May 2026", nights: 1,
    guests: "1 Adult", source: "Email", sourceType: "email",
    total: "€110.00", perNight: "€110.00 / night", status: "confirmed",
  },
  {
    id: "#VE250523-006", created: "23 May 2026, 13:05",
    name: "Tobias Vogel", email: "tobias.vogel@email.com", phone: "+49 176 7890126",
    room: "Scheurebe Doppelzimmer", roomSub: "",
    dates: "23 May 2026 – 25 May 2026", nights: 2,
    guests: "2 Adults", source: "Booking.com", sourceType: "booking",
    total: "€270.00", perNight: "€135.00 / night", status: "cancelled",
  },
  {
    id: "#VE250524-007", created: "24 May 2026, 09:11",
    name: "Nina Bauer", email: "nina.bauer@email.com", phone: "+49 177 8901237",
    room: "Regent Suite", roomSub: "",
    dates: "24 May 2026 – 27 May 2026", nights: 3,
    guests: "2 Adults, 2 Children", source: "Website", sourceType: "website",
    total: "€510.00", perNight: "€170.00 / night", status: "pending",
  },
];

const ROOM_LIST   = ["Gutedel Suite","Bacchus Doppelzimmer","Riesling Suite","Scheurebe Doppelzimmer","Burgunder Familien Suite","Rivaner Einzelzimmer","Regent Suite"];
const ROOMS_FILTER = ["All Rooms", ...ROOM_LIST];
const STATUSES    = ["All Status", "confirmed", "pending", "cancelled"];
const SOURCES     = ["All Sources", "Booking.com", "Website", "Phone", "Email"];
const GUEST_OPTS  = ["1 Adult","2 Adults","3 Adults","4 Adults","2 Adults, 1 Child","2 Adults, 2 Children","3 Adults, 1 Child"];
const EXTRA_BEDS  = ["No extra bed", "1 extra bed"];
const SOURCE_OPTS = ["Booking.com", "Website", "Phone", "Email"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function nightsBetween(from, to) {
  if (!from || !to) return 0;
  const diff = new Date(to) - new Date(from);
  return Math.max(0, Math.round(diff / 86400000));
}

function sourceTypeOf(src) {
  if (src === "Booking.com") return "booking";
  if (src === "Phone") return "phone";
  if (src === "Email") return "email";
  return "website";
}

function genId(list) {
  const num = list.length + 1;
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const yy = String(today.getFullYear()).slice(2);
  return `#VE${yy}${mm}${dd}-${String(num).padStart(3, "0")}`;
}

// ── Source Icon ───────────────────────────────────────────────────────────────
function SourceIcon({ type }) {
  if (type === "booking") return <span className="bp-source-icon bp-source-icon--booking">B</span>;
  if (type === "phone") return (
    <span className="bp-source-icon bp-source-icon--phone">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    </span>
  );
  if (type === "email") return (
    <span className="bp-source-icon bp-source-icon--email">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    </span>
  );
  return (
    <span className="bp-source-icon bp-source-icon--website">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    </span>
  );
}

function StatusBadge({ status }) {
  return <span className={`bp-badge bp-badge--${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

// ── New Booking Modal ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "", email: "", phone: "",
  room: "", checkin: "", checkout: "",
  guests: "", extraBed: "No extra bed", notes: "",
  source: "", status: "confirmed",
};

function NewBookingModal({ onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const nights    = nightsBetween(form.checkin, form.checkout);
  const roomData  = ROOM_PRICES[form.room] || null;
  const roomPrice = roomData ? roomData.price * nights : null;
  const breakfast = 0; // optional — not auto-added
  const extraBed  = form.extraBed === "1 extra bed" ? EXTRA_BED_PRICE * nights : 0;
  const total     = roomPrice !== null ? roomPrice + breakfast + extraBed : null;

  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = "Required";
    if (!form.email.trim())    e.email    = "Required";
    if (!form.phone.trim())    e.phone    = "Required";
    if (!form.room)            e.room     = "Required";
    if (!form.checkin)         e.checkin  = "Required";
    if (!form.checkout)        e.checkout = "Required";
    if (!form.guests)          e.guests   = "Required";
    if (!form.source)          e.source   = "Required";
    if (form.checkin && form.checkout && form.checkout <= form.checkin)
      e.checkout = "Must be after check-in";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave(form, nights, total);
    onClose();
  };

  return (
    <div className="nbm-backdrop" onClick={handleBackdrop}>
      <div className="nbm-modal" role="dialog" aria-modal="true" aria-labelledby="nbm-title">

        {/* Header */}
        <div className="nbm-header">
          <div>
            <h2 className="nbm-title" id="nbm-title">New Booking</h2>
            <p className="nbm-sub">Enter guest and booking details.</p>
          </div>
          <button className="nbm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className="nbm-body">

          {/* ── Guest Information ── */}
          <div className="nbm-section">
            <div className="nbm-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Guest Information
            </div>
            <div className="nbm-row nbm-row--3">
              <div className="nbm-field">
                <label className="nbm-label">Guest Name <span className="nbm-req">*</span></label>
                <input className={`nbm-input ${errors.name ? "nbm-input--error" : ""}`} placeholder="Enter full name" value={form.name} onChange={set("name")} />
                {errors.name && <p className="nbm-error">{errors.name}</p>}
              </div>
              <div className="nbm-field">
                <label className="nbm-label">Email Address <span className="nbm-req">*</span></label>
                <input className={`nbm-input ${errors.email ? "nbm-input--error" : ""}`} type="email" placeholder="Enter email address" value={form.email} onChange={set("email")} />
                {errors.email && <p className="nbm-error">{errors.email}</p>}
              </div>
              <div className="nbm-field">
                <label className="nbm-label">Phone Number <span className="nbm-req">*</span></label>
                <input className={`nbm-input ${errors.phone ? "nbm-input--error" : ""}`} placeholder="Enter phone number" value={form.phone} onChange={set("phone")} />
                {errors.phone && <p className="nbm-error">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* ── Booking Details ── */}
          <div className="nbm-section">
            <div className="nbm-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Booking Details
            </div>
            <div className="nbm-row nbm-row--3">
              <div className="nbm-field">
                <label className="nbm-label">Room <span className="nbm-req">*</span></label>
                <select className={`nbm-select ${errors.room ? "nbm-input--error" : ""}`} value={form.room} onChange={set("room")}>
                  <option value="">Select a room</option>
                  {ROOM_LIST.map(r => <option key={r}>{r}</option>)}
                </select>
                {errors.room && <p className="nbm-error">{errors.room}</p>}
              </div>
              <div className="nbm-field">
                <label className="nbm-label">Check-In Date <span className="nbm-req">*</span></label>
                <input className={`nbm-input ${errors.checkin ? "nbm-input--error" : ""}`} type="date" value={form.checkin} onChange={set("checkin")} />
                {errors.checkin && <p className="nbm-error">{errors.checkin}</p>}
              </div>
              <div className="nbm-field">
                <label className="nbm-label">Check-Out Date <span className="nbm-req">*</span></label>
                <input className={`nbm-input ${errors.checkout ? "nbm-input--error" : ""}`} type="date" value={form.checkout} onChange={set("checkout")} min={form.checkin} />
                {errors.checkout && <p className="nbm-error">{errors.checkout}</p>}
              </div>
            </div>
            <div className="nbm-row nbm-row--3">
              <div className="nbm-field">
                <label className="nbm-label">Guests <span className="nbm-req">*</span></label>
                <select className={`nbm-select ${errors.guests ? "nbm-input--error" : ""}`} value={form.guests} onChange={set("guests")}>
                  <option value="">Select number of guests</option>
                  {GUEST_OPTS.map(g => <option key={g}>{g}</option>)}
                </select>
                {errors.guests && <p className="nbm-error">{errors.guests}</p>}
              </div>
              <div className="nbm-field">
                <label className="nbm-label">Extra Bed</label>
                <select className="nbm-select" value={form.extraBed} onChange={set("extraBed")}>
                  {EXTRA_BEDS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="nbm-field">
                <label className="nbm-label">Notes (Optional)</label>
                <textarea className="nbm-textarea" placeholder="Add any special notes..." value={form.notes} onChange={set("notes")} rows={2} />
              </div>
            </div>
          </div>

          {/* ── Source & Status ── */}
          <div className="nbm-section">
            <div className="nbm-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Booking Source &amp; Status
            </div>
            <div className="nbm-row nbm-row--2">
              <div className="nbm-field">
                <label className="nbm-label">Source <span className="nbm-req">*</span></label>
                <select className={`nbm-select ${errors.source ? "nbm-input--error" : ""}`} value={form.source} onChange={set("source")}>
                  <option value="">Select source</option>
                  {SOURCE_OPTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <p className="nbm-hint">Where did this booking come from?</p>
                {errors.source && <p className="nbm-error">{errors.source}</p>}
              </div>
              <div className="nbm-field">
                <label className="nbm-label">Status <span className="nbm-req">*</span></label>
                <select className="nbm-select nbm-select--confirmed" value={form.status} onChange={set("status")}>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <p className="nbm-hint">Current booking status</p>
              </div>
            </div>
          </div>

          {/* ── Price Summary ── */}
          <div className="nbm-price-summary">
            <div className="nbm-price-header">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Price Summary
              <span className="nbm-auto-tag">Automatic</span>
            </div>
            <div className="nbm-price-grid">
              <div className="nbm-price-item">
                <p className="nbm-price-label">Room Price</p>
                <p className="nbm-price-val">
                  {roomPrice !== null ? `€ ${roomPrice.toFixed(2)}` : "€ —"}
                </p>
                {nights > 0 && roomData && (
                  <p className="nbm-price-sub">{nights} night{nights !== 1 ? "s" : ""} × €{roomData.price}</p>
                )}
              </div>
              <div className="nbm-price-item">
                <p className="nbm-price-label">Breakfast</p>
                <p className="nbm-price-val">€ —</p>
                <p className="nbm-price-sub">Not included</p>
              </div>
              <div className="nbm-price-item">
                <p className="nbm-price-label">Extra Bed</p>
                <p className="nbm-price-val">
                  {extraBed > 0 ? `€ ${extraBed.toFixed(2)}` : "€ —"}
                </p>
                {extraBed > 0 && <p className="nbm-price-sub">{nights} × €{EXTRA_BED_PRICE}</p>}
              </div>
              <div className="nbm-price-item nbm-price-item--total">
                <p className="nbm-price-label">Total Price</p>
                <p className="nbm-price-val nbm-price-val--green">
                  {total !== null ? `€ ${total.toFixed(2)}` : "€ —"}
                </p>
              </div>
            </div>
          </div>

        </div>{/* end nbm-body */}

        {/* Footer */}
        <div className="nbm-footer">
          <button className="nbm-btn nbm-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="nbm-btn nbm-btn--save" onClick={handleSave}>Save Booking</button>
        </div>

      </div>
    </div>
  );
}

// ── Bookings Page ─────────────────────────────────────────────────────────────
export default function BookingsPage() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [arrivalFrom, setArrivalFrom] = useState("");
  const [arrivalTo, setArrivalTo] = useState("");
  const [roomFilter, setRoomFilter] = useState("All Rooms");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.phone.includes(q) || b.room.toLowerCase().includes(q);
    const matchRoom   = roomFilter   === "All Rooms"   || b.room === roomFilter;
    const matchStatus = statusFilter === "All Status"  || b.status === statusFilter.toLowerCase();
    const matchSource = sourceFilter === "All Sources" || b.source === sourceFilter;
    return matchSearch && matchRoom && matchStatus && matchSource;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  const totalBookings = bookings.length;
  const confirmed     = bookings.filter(b => b.status === "confirmed").length;
  const pending       = bookings.filter(b => b.status === "pending").length;
  const cancelled     = bookings.filter(b => b.status === "cancelled").length;
  const revenue       = bookings.filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + parseFloat(b.total.replace("€", "").replace(",", "")), 0);

  const handleReset = () => {
    setSearch(""); setArrivalFrom(""); setArrivalTo("");
    setRoomFilter("All Rooms"); setStatusFilter("All Status"); setSourceFilter("All Sources");
    setPage(1);
  };

  const handleSaveBooking = (form, nights, total) => {
    const checkinFmt  = formatDate(form.checkin);
    const checkoutFmt = formatDate(form.checkout);
    const pricePerNight = ROOM_PRICES[form.room]?.price || 0;
    const newBooking = {
      id:         genId(bookings),
      created:    new Date().toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      name:       form.name,
      email:      form.email,
      phone:      form.phone,
      room:       form.room,
      roomSub:    "",
      dates:      `${checkinFmt} – ${checkoutFmt}`,
      nights,
      guests:     form.guests,
      source:     form.source,
      sourceType: sourceTypeOf(form.source),
      total:      total !== null ? `€${total.toFixed(2)}` : "€0.00",
      perNight:   `€${pricePerNight}.00 / night`,
      status:     form.status,
    };
    setBookings(prev => [newBooking, ...prev]);
    setPage(1);
  };

  return (
    <div className="bp-layout">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(c => !c)}
        activePath="/admin/bookings"
      />

      <div className="bp-main">
        {/* ── TOP BAR ── */}
        <header className="bp-topbar">
          <div className="bp-topbar__left">
            <button className="bp-topbar__hamburger" onClick={() => setSidebarCollapsed(c => !c)}>☰</button>
            <div>
              <h1 className="bp-topbar__title">Bookings</h1>
              <p className="bp-topbar__breadcrumb">Dashboard › Bookings</p>
            </div>
          </div>
          <div className="bp-topbar__right">
            <button className="bp-topbar__notif" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="bp-topbar__badge">3</span>
            </button>
            <div className="bp-topbar__user">
              <div className="bp-topbar__avatar">GW</div>
              <div className="bp-topbar__userinfo">
                <span className="bp-topbar__username">Gundel Woite</span>
                <span className="bp-topbar__role">Administrator</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div className="bp-content">

          {/* Page header */}
          <div className="bp-page-header">
            <div>
              <h2 className="bp-page-title">Bookings</h2>
              <p className="bp-page-sub">Manage all reservations and bookings.</p>
            </div>
            <div className="bp-page-actions">
              <button className="bp-btn bp-btn--outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Import Bookings (Excel)
              </button>
              <button className="bp-btn bp-btn--primary" onClick={() => setShowModal(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                New Booking
              </button>
            </div>
          </div>

          {/* ── FILTER BAR ── */}
          <div className="bp-filters">
            <div className="bp-filters__search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" className="bp-filters__input" placeholder="Search by guest name, room, email, phone..."
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <div className="bp-filters__group">
              <div className="bp-filter-field">
                <label className="bp-filter-label">ARRIVAL FROM</label>
                <input type="date" className="bp-filter-date" value={arrivalFrom} onChange={e => setArrivalFrom(e.target.value)} />
              </div>
              <div className="bp-filter-field">
                <label className="bp-filter-label">ARRIVAL TO</label>
                <input type="date" className="bp-filter-date" value={arrivalTo} onChange={e => setArrivalTo(e.target.value)} />
              </div>
              <div className="bp-filter-field">
                <label className="bp-filter-label">ROOM</label>
                <select className="bp-filter-select" value={roomFilter} onChange={e => { setRoomFilter(e.target.value); setPage(1); }}>
                  {ROOMS_FILTER.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="bp-filter-field">
                <label className="bp-filter-label">STATUS</label>
                <select className="bp-filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="bp-filter-field">
                <label className="bp-filter-label">SOURCE</label>
                <select className="bp-filter-select" value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setPage(1); }}>
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button className="bp-filter-reset" onClick={handleReset}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                </svg>
                Reset
              </button>
            </div>
          </div>

          {/* ── TABLE ── */}
          <div className="bp-table-wrap">
            <table className="bp-table">
              <thead>
                <tr>
                  <th>BOOKING ID</th><th>GUEST</th><th>ROOM</th>
                  <th>DATES / NIGHTS</th><th>GUESTS</th><th>SOURCE</th>
                  <th>TOTAL PRICE</th><th>STATUS</th><th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={9} className="bp-table__empty">No bookings found.</td></tr>
                ) : paginated.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <p className="bp-booking-id">{b.id}</p>
                      <p className="bp-booking-created">{b.created}</p>
                    </td>
                    <td>
                      <p className="bp-guest-name">{b.name}</p>
                      <p className="bp-guest-detail">{b.email}</p>
                      <p className="bp-guest-detail">{b.phone}</p>
                    </td>
                    <td>
                      <p className="bp-room-name">{b.room}</p>
                      {b.roomSub && <p className="bp-guest-detail">{b.roomSub}</p>}
                    </td>
                    <td>
                      <p className="bp-dates">{b.dates}</p>
                      <p className="bp-guest-detail">{b.nights} night{b.nights !== 1 ? "s" : ""}</p>
                    </td>
                    <td><p className="bp-guests">{b.guests}</p></td>
                    <td>
                      <div className="bp-source">
                        <SourceIcon type={b.sourceType} />
                        <span>{b.source}</span>
                      </div>
                    </td>
                    <td>
                      <p className="bp-total">{b.total}</p>
                      <p className="bp-guest-detail">{b.perNight}</p>
                    </td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>
                      <div className="bp-actions">
                        <button className="bp-action-view">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          View
                        </button>
                        <button className="bp-action-more" aria-label="More options">⋮</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION ── */}
          <div className="bp-pagination">
            <span className="bp-pagination__info">
              Showing {Math.min((page-1)*perPage+1, filtered.length)} to {Math.min(page*perPage, filtered.length)} of {filtered.length} bookings
            </span>
            <div className="bp-pagination__pages">
              <button className="bp-page-btn" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>‹</button>
              {Array.from({ length: Math.min(totalPages,4) }, (_,i) => i+1).map(p => (
                <button key={p} className={`bp-page-btn ${page===p?"bp-page-btn--active":""}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              {totalPages > 4 && <span className="bp-page-ellipsis">...</span>}
              <button className="bp-page-btn" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}>›</button>
            </div>
            <div className="bp-pagination__perpage">
              <span>10 / page</span>
              <input type="number" className="bp-perpage-input" defaultValue={10} min={1} max={50} />
            </div>
          </div>

          {/* ── STATS FOOTER ── */}
          <div className="bp-stats-footer">
            <div className="bp-stat-foot">
              <div className="bp-stat-foot__icon bp-stat-foot__icon--gray">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <p className="bp-stat-foot__label">Total Bookings</p>
                <p className="bp-stat-foot__value">{totalBookings}</p>
                <p className="bp-stat-foot__sub">All time</p>
              </div>
            </div>
            <div className="bp-stat-foot">
              <div className="bp-stat-foot__icon bp-stat-foot__icon--green">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className="bp-stat-foot__label">Confirmed</p>
                <p className="bp-stat-foot__value">{confirmed}</p>
                <p className="bp-stat-foot__sub">{Math.round((confirmed/totalBookings)*100)}%</p>
              </div>
            </div>
            <div className="bp-stat-foot">
              <div className="bp-stat-foot__icon bp-stat-foot__icon--orange">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <p className="bp-stat-foot__label">Pending</p>
                <p className="bp-stat-foot__value">{pending}</p>
                <p className="bp-stat-foot__sub">{Math.round((pending/totalBookings)*100)}%</p>
              </div>
            </div>
            <div className="bp-stat-foot">
              <div className="bp-stat-foot__icon bp-stat-foot__icon--red">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div>
                <p className="bp-stat-foot__label">Cancelled</p>
                <p className="bp-stat-foot__value">{cancelled}</p>
                <p className="bp-stat-foot__sub">{Math.round((cancelled/totalBookings)*100)}%</p>
              </div>
            </div>
            <div className="bp-stat-foot">
              <div className="bp-stat-foot__icon bp-stat-foot__icon--teal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div>
                <p className="bp-stat-foot__label">Total Revenue</p>
                <p className="bp-stat-foot__value">€{revenue.toLocaleString("de-DE",{minimumFractionDigits:2})}</p>
                <p className="bp-stat-foot__sub">Confirmed bookings</p>
              </div>
            </div>
          </div>

        </div>{/* end bp-content */}
      </div>{/* end bp-main */}

      {/* ── MODAL ── */}
      {showModal && (
        <NewBookingModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveBooking}
        />
      )}

    </div>
  );
}