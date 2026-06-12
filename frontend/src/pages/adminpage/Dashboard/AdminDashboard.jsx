import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";
import { useAuth } from "../../../auth/AuthContext";
import { adminApi } from "../../../api/api";
import "./AdminDashboard.css";

// ── Static demo data for availability grid (not yet backed by an endpoint) ────
const ROOMS = ["Gutedel", "Bacchus", "Riesling", "Scheurebe", "Burgunder", "Rivaner", "Regent"];

const AVAILABILITY = {
  Gutedel: [0, 1, 1, 0, 0, 0, 1, 0],
  Bacchus: [0, 0, 0, 1, 1, 0, 0, 0],
  Riesling: [0, 0, 0, 0, 1, 1, 0, 0],
  Scheurebe: [0, 0, 2, 2, 2, 0, 0, 0],
  Burgunder: [0, 0, 0, 0, 1, 1, 0, 0],
  Rivaner: [0, 1, 0, 1, 0, 0, 0, 0],
  Regent: [0, 0, 0, 0, 0, 0, 2, 2],
};

const DAYS = [
  { day: "Fri", date: "16 May" },
  { day: "Sat", date: "17 May" },
  { day: "Sun", date: "18 May" },
  { day: "Mon", date: "19 May" },
  { day: "Tue", date: "20 May" },
  { day: "Wed", date: "21 May" },
  { day: "Thu", date: "22 May" },
  { day: "Fri", date: "23 May" },
];

// ── Stat card config — icons/colors/labels are static, values come from API ───
const STAT_CARD_CONFIG = [
  {
    key: "arrivalsToday",
    label: "Arrivals Today",
    link: "View details",
    color: "green",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 11l-4 4-4-4M12 15V3" />
        <path d="M20 21H4" />
      </svg>
    ),
  },
  {
    key: "departuresToday",
    label: "Departures Today",
    link: "View details",
    color: "orange",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 13l4-4 4 4M12 9v12" />
        <path d="M20 21H4" />
      </svg>
    ),
  },
  {
    key: "occupied",
    label: "Currently Occupied",
    sub: "rooms",
    link: "View details",
    color: "teal",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    key: "upcomingBookings",
    label: "Upcoming Bookings",
    sub: "next 15 days",
    link: "View all bookings",
    color: "blue",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

const QUICK_ACTIONS = [
  {
    label: "New Booking",
    desc: "Create a manual booking",
    color: "green",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    label: "Block Dates / Room",
    desc: "Close room for specific dates",
    color: "green",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Edit Room Prices",
    desc: "Update prices & extras",
    color: "green",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    label: "Sync with Booking.com",
    desc: "Manual sync now",
    color: "green",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="1 4 1 10 7 10" />
        <polyline points="23 20 23 14 17 14" />
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
      </svg>
    ),
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function cellClass(val) {
  if (val === 1) return "ad-avail__cell ad-avail__cell--booked";
  if (val === 2) return "ad-avail__cell ad-avail__cell--closed";
  return "ad-avail__cell ad-avail__cell--free";
}

function StatusBadge({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`ad-badge ad-badge--${status}`}>{label}</span>;
}

function formatDateRange(checkIn, checkOut) {
  const opts = { day: "numeric", month: "short", year: "numeric" };
  const ci = new Date(checkIn).toLocaleDateString("en-GB", opts);
  const co = new Date(checkOut).toLocaleDateString("en-GB", opts);
  return `${ci} – ${co}`;
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi.getDashboardStats(token)
      .then(data => setStats(data))
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, [token]);

  // Build stat card values from fetched stats
  function statValue(key) {
    if (!stats) return "—";
    switch (key) {
      case "arrivalsToday": return String(stats.arrivalsToday);
      case "departuresToday": return String(stats.departuresToday);
      case "occupied": return `${stats.occupiedRooms} / ${stats.totalRooms}`;
      case "upcomingBookings": return String(stats.upcomingBookings);
      default: return "—";
    }
  }

  const recentBookings = stats?.recentBookings || [];

  return (
    <div className="ad-layout">
      {/* ── SIDEBAR (shared component) ──────────────────────────────────── */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      {/* ── MAIN AREA ───────────────────────────────────────────────────── */}
      <div className="ad-main">

        {/* ── TOP BAR ─────────────────────────────────────────────────── */}
        <header className="ad-topbar">
          <div className="ad-topbar__left">
            <button
              className="ad-topbar__hamburger"
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <div>
              <h1 className="ad-topbar__title">Dashboard</h1>
              <p className="ad-topbar__sub">Welcome back, Gundel!</p>
            </div>
          </div>
          <div className="ad-topbar__right">
            <button className="ad-topbar__notif" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="ad-topbar__badge">3</span>
            </button>
            <div className="ad-topbar__user">
              <div className="ad-topbar__avatar">GW</div>
              <div className="ad-topbar__userinfo">
                <span className="ad-topbar__username">Gundel Woite</span>
                <span className="ad-topbar__role">Administrator</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </header>

        {/* ── CONTENT ─────────────────────────────────────────────────── */}
        <div className="ad-content">

          {/* Date row */}
          <div className="ad-date-row">
            <span className="ad-date-row__text">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
            <button className="ad-date-row__icon" aria-label="Open calendar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>
          </div>

          {error && (
            <p style={{ color: "red", padding: "12px 0" }}>{error}</p>
          )}

          {/* ── STAT CARDS ──────────────────────────────────────────────── */}
          <div className="ad-stats">
            {STAT_CARD_CONFIG.map((card) => (
              <div key={card.label} className="ad-stat-card">
                <div className="ad-stat-card__header">
                  <p className="ad-stat-card__label">{card.label}</p>
                  <div className={`ad-stat-card__icon ad-stat-card__icon--${card.color}`}>
                    {card.icon}
                  </div>
                </div>
                <p className="ad-stat-card__value">
                  {loading ? "…" : statValue(card.key)}
                </p>
                {card.sub && <p className="ad-stat-card__sub">{card.sub}</p>}
                <button className="ad-stat-card__link">
                  {card.link} <span>→</span>
                </button>
              </div>
            ))}
          </div>

          {/* ── MIDDLE ROW: Availability + Recent Bookings ───────────────── */}
          <div className="ad-middle">

            {/* AVAILABILITY */}
            <div className="ad-avail">
              <div className="ad-avail__header">
                <h2 className="ad-avail__title">Availability Overview</h2>
                <div className="ad-avail__controls">
                  <button className="ad-avail__calendar-btn">View Calendar</button>
                  <button className="ad-avail__date-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    16 May – 23 May 2026
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="ad-avail__grid-wrap">
                <table className="ad-avail__table">
                  <thead>
                    <tr>
                      <th className="ad-avail__th-room">Room</th>
                      {DAYS.map((d) => (
                        <th key={d.date} className="ad-avail__th-day">
                          <span>{d.day}</span>
                          <span>{d.date}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROOMS.map((room) => (
                      <tr key={room}>
                        <td className="ad-avail__room-name">{room}</td>
                        {AVAILABILITY[room].map((val, i) => (
                          <td key={i} className={cellClass(val)} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="ad-avail__legend">
                <span><span className="ad-legend-dot ad-legend-dot--free" />Available</span>
                <span><span className="ad-legend-dot ad-legend-dot--booked" />Booked</span>
                <span><span className="ad-legend-dot ad-legend-dot--closed" />Closed / Blocked</span>
              </div>

              {/* Manage button */}
              <button className="ad-avail__manage-btn" onClick={() => navigate("/admin/availability")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Manage Availability
              </button>
            </div>

            {/* RECENT BOOKINGS */}
            <div className="ad-recent">
              <div className="ad-recent__header">
                <h2 className="ad-recent__title">Recent Bookings</h2>
                <button className="ad-recent__view-all" onClick={() => navigate("/admin/bookings")}>
                  View all
                </button>
              </div>
              <div className="ad-recent__list">
                {loading ? (
                  <p style={{ padding: "16px", color: "#888" }}>Loading…</p>
                ) : recentBookings.length === 0 ? (
                  <p style={{ padding: "16px", color: "#888" }}>No recent bookings.</p>
                ) : (
                  recentBookings.map((b, i) => (
                    <div key={i} className="ad-recent__item">
                      <div className="ad-recent__info">
                        <p className="ad-recent__name">{b.guestName}</p>
                        <p className="ad-recent__room">{b.roomName}</p>
                        <p className="ad-recent__dates">{formatDateRange(b.checkIn, b.checkOut)}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  ))
                )}
              </div>
              <button className="ad-recent__footer-link" onClick={() => navigate("/admin/bookings")}>
                View all bookings →
              </button>
            </div>
          </div>

          {/* ── QUICK ACTIONS ───────────────────────────────────────────── */}
          <div className="ad-quick">
            <h2 className="ad-quick__title">Quick Actions</h2>
            <div className="ad-quick__grid">
              {QUICK_ACTIONS.map((a) => (
                <button key={a.label} className="ad-quick__card">
                  <div className={`ad-quick__icon ad-quick__icon--${a.color}`}>
                    {a.icon}
                  </div>
                  <div>
                    <p className="ad-quick__label">{a.label}</p>
                    <p className="ad-quick__desc">{a.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>{/* end .ad-content */}
      </div>{/* end .ad-main */}
    </div>
  );
}