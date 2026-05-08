import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

// ── Nav items — add new pages here only, sidebar updates everywhere ──────────
const NAV_ITEMS = [
  {
    label: "Dashboard",
    path:  "/admin/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: "Bookings",
    path:  "/admin/bookings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8"  y1="2" x2="8"  y2="6"/>
        <line x1="3"  y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: "Availability",
    path:  "/admin/availability",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8"  y1="2" x2="8"  y2="6"/>
        <line x1="3"  y1="10" x2="21" y2="10"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
      </svg>
    ),
  },
  {
    label: "Rooms & Prices",
    path:  "/admin/rooms",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Sync Status",
    path:  "/admin/sync",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"/>
        <polyline points="23 20 23 14 17 14"/>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
      </svg>
    ),
  },
  {
    label: "Settings",
    path:  "/admin/settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

// ── AdminSidebar ─────────────────────────────────────────────────────────────
// Props:
//   collapsed  (bool)   – controlled from parent if you want to toggle externally
//   onCollapse (fn)     – callback when toggle button is clicked
export default function AdminSidebar({ collapsed = false, onCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Internal collapse state (used only when parent doesn't control it)
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = onCollapse ? collapsed : internalCollapsed;
  const handleCollapseToggle = () => {
    if (onCollapse) onCollapse();
    else setInternalCollapsed((c) => !c);
  };

  const handleLogout = () => {
    // TODO: clear auth token / session here
    navigate("/admin");
  };

  return (
    <aside className={`as-sidebar ${isCollapsed ? "as-sidebar--collapsed" : ""}`}>

      {/* ── LOGO ──────────────────────────────────────────────────────────── */}
      <div className="as-logo">
        <div className="as-logo__circle">
          <svg width="36" height="36" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="28" stroke="#c9a96e" strokeWidth="1.5"/>
            <text x="50%" y="38%" dominantBaseline="middle" textAnchor="middle"
              fontFamily="Georgia,serif" fontSize="9" fill="#c9a96e" letterSpacing="1">
              VILLA
            </text>
            <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle"
              fontFamily="Georgia,serif" fontSize="11" fill="#c9a96e" fontWeight="bold" letterSpacing="1">
              ELBLING
            </text>
          </svg>
        </div>
        {!isCollapsed && (
          <div className="as-logo__text">
            <span className="as-logo__name">Villa Elbling</span>
            <span className="as-logo__sub">Radebeul · Alles · Weinbergut</span>
          </div>
        )}
      </div>

      {/* ── NAV LINKS ─────────────────────────────────────────────────────── */}
      <nav className="as-nav" aria-label="Admin navigation">
        <ul className="as-nav__list">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <button
                  className={`as-nav__item ${isActive ? "as-nav__item--active" : ""}`}
                  onClick={() => navigate(item.path)}
                  title={isCollapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="as-nav__icon">{item.icon}</span>
                  {!isCollapsed && <span className="as-nav__label">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── DIVIDER ───────────────────────────────────────────────────────── */}
      <div className="as-divider" />

      {/* ── LOGOUT ────────────────────────────────────────────────────────── */}
      <button
        className="as-logout"
        onClick={handleLogout}
        title={isCollapsed ? "Logout" : undefined}
      >
        <span className="as-nav__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </span>
        {!isCollapsed && <span className="as-nav__label">Logout</span>}
      </button>

      {/* ── VILLA ILLUSTRATION + TAGLINE ──────────────────────────────────── */}
      {!isCollapsed && (
        <div className="as-villa">
          <div className="as-villa__illustration" aria-hidden="true">
            {/* Simple SVG illustration of a house / villa */}
            <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="60" width="140" height="55" rx="2" fill="none" stroke="#c9a96e" strokeWidth="1"/>
              <polygon points="30,60 100,15 170,60" fill="none" stroke="#c9a96e" strokeWidth="1"/>
              <rect x="85" y="75" width="30" height="40" fill="none" stroke="#c9a96e" strokeWidth="1"/>
              <rect x="40" y="70" width="20" height="20" fill="none" stroke="#c9a96e" strokeWidth="0.8"/>
              <rect x="140" y="70" width="20" height="20" fill="none" stroke="#c9a96e" strokeWidth="0.8"/>
              <line x1="0" y1="115" x2="200" y2="115" stroke="#c9a96e" strokeWidth="0.5"/>
              <ellipse cx="30"  cy="115" rx="18" ry="6" fill="none" stroke="#c9a96e" strokeWidth="0.5"/>
              <ellipse cx="170" cy="115" rx="18" ry="6" fill="none" stroke="#c9a96e" strokeWidth="0.5"/>
            </svg>
          </div>
          <p className="as-villa__name">Villa Elbling Radebeul</p>
          <p className="as-villa__desc">
            Boutique-Hotel am Fuße der Weinberge<br />in Radebeul bei Dresden.
          </p>
        </div>
      )}

      {/* ── COLLAPSE TOGGLE ───────────────────────────────────────────────── */}
      <button
        className="as-collapse-btn"
        onClick={handleCollapseToggle}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        {isCollapsed ? "›" : "‹"}
      </button>

    </aside>
  );
}