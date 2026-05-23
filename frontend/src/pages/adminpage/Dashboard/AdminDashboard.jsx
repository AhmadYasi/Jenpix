import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import "./AdminDashboard.css";

// ── Demo data ────────────────────────────────────────────────────────────────
const ROOMS = ["Gutedel", "Bacchus", "Riesling", "Scheurebe", "Burgunder", "Rivaner", "Regent"];

// Availability grid: 0 = available, 1 = booked, 2 = closed/blocked
const AVAILABILITY = {
  Gutedel:   [0, 1, 1, 0, 0, 0, 1, 0],
  Bacchus:   [0, 0, 0, 1, 1, 0, 0, 0],
  Riesling:  [0, 0, 0, 0, 1, 1, 0, 0],
  Scheurebe: [0, 0, 2, 2, 2, 0, 0, 0],
  Burgunder: [0, 0, 0, 0, 1, 1, 0, 0],
  Rivaner:   [0, 1, 0, 1, 0, 0, 0, 0],
  Regent:    [0, 0, 0, 0, 0, 0, 2, 2],
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

const RECENT_BOOKINGS = [
  { name: "Laura Schmidt",  room: "Riesling Suite",          dates: "16 May – 18 May 2026", status: "confirmed" },
  { name: "Thomas Müller",  room: "Gutedel Suite",           dates: "17 May – 20 May 2026", status: "confirmed" },
  { name: "Anna Weber",     room: "Bacchus Doppelzimmer",    dates: "18 May – 21 May 2026", status: "pending"   },
  { name: "Peter Klein",    room: "Burgunder Familien Suite", dates: "19 May – 22 May 2026", status: "confirmed" },
  { name: "Sophie Wagner",  room: "Rivaner Einzelzimmer",    dates: "20 May – 21 May 2026", status: "confirmed" },
];

const STAT_CARDS = [
  {
    label: "Arrivals Today",
    value: "1",
    link:  "View details",
    color: "green",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 11l-4 4-4-4M12 15V3"/>
        <path d="M20 21H4"/>
      </svg>
    ),
  },
  {
    label: "Departures Today",
    value: "2",
    link:  "View details",
    color: "orange",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 13l4-4 4 4M12 9v12"/>
        <path d="M20 21H4"/>
      </svg>
    ),
  },
  {
    label: "Currently Occupied",
    value: "4 / 7",
    sub:   "rooms",
    link:  "View details",
    color: "teal",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Upcoming Bookings",
    value: "5",
    sub:   "next 7 days",
    link:  "View all bookings",
    color: "blue",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8"  y1="2" x2="8"  y2="6"/>
        <line x1="3"  y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
];

const QUICK_ACTIONS = [
  {
    label: "New Booking",
    desc:  "Create a manual booking",
    color: "green",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8"  y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    label: "Block Dates / Room",
    desc:  "Close room for specific dates",
    color: "green",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8"  y1="2" x2="8"  y2="6"/>
        <line x1="3"  y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: "Edit Room Prices",
    desc:  "Update prices & extras",
    color: "green",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    label: "Sync with Booking.com",
    desc:  "Manual sync now",
    color: "green",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="1 4 1 10 7 10"/>
        <polyline points="23 20 23 14 17 14"/>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
      </svg>
    ),
  },
];

// ── Helper ───────────────────────────────────────────────────────────────────
function cellClass(val) {
  if (val === 1) return "ad-avail__cell ad-avail__cell--booked";
  if (val === 2) return "ad-avail__cell ad-avail__cell--closed";
  return "ad-avail__cell ad-avail__cell--free";
}

function StatusBadge({ status }) {
  return (
    <span className={`ad-badge ad-badge--${status}`}>
      {status === "confirmed" ? "Confirmed" : "Pending"}
    </span>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
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
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </header>

        {/* ── CONTENT ─────────────────────────────────────────────────── */}
        <div className="ad-content">

          {/* Date row */}
          <div className="ad-date-row">
            <span className="ad-date-row__text">Friday, 16 May 2026</span>
            <button className="ad-date-row__icon" aria-label="Open calendar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
            </button>
          </div>

          {/* ── STAT CARDS ──────────────────────────────────────────────── */}
          <div className="ad-stats">
            {STAT_CARDS.map((card) => (
              <div key={card.label} className="ad-stat-card">
                <div className="ad-stat-card__header">
                  <p className="ad-stat-card__label">{card.label}</p>
                  <div className={`ad-stat-card__icon ad-stat-card__icon--${card.color}`}>
                    {card.icon}
                  </div>
                </div>
                <p className="ad-stat-card__value">{card.value}</p>
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
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8"  y1="2" x2="8"  y2="6"/>
                      <line x1="3"  y1="10" x2="21" y2="10"/>
                    </svg>
                    16 May – 23 May 2026
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
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
                <span><span className="ad-legend-dot ad-legend-dot--free"/>Available</span>
                <span><span className="ad-legend-dot ad-legend-dot--booked"/>Booked</span>
                <span><span className="ad-legend-dot ad-legend-dot--closed"/>Closed / Blocked</span>
              </div>

              {/* Manage button */}
              <button className="ad-avail__manage-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8"  y1="2" x2="8"  y2="6"/>
                  <line x1="3"  y1="10" x2="21" y2="10"/>
                </svg>
                Manage Availability
              </button>
            </div>

            {/* RECENT BOOKINGS */}
            <div className="ad-recent">
              <div className="ad-recent__header">
                <h2 className="ad-recent__title">Recent Bookings</h2>
                <button className="ad-recent__view-all">View all</button>
              </div>
              <div className="ad-recent__list">
                {RECENT_BOOKINGS.map((b, i) => (
                  <div key={i} className="ad-recent__item">
                    <div className="ad-recent__info">
                      <p className="ad-recent__name">{b.name}</p>
                      <p className="ad-recent__room">{b.room}</p>
                      <p className="ad-recent__dates">{b.dates}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
              <button className="ad-recent__footer-link">
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