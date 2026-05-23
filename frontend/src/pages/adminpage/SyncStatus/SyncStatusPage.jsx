import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import "./SyncStatusPage.css";

// ── Demo Data ─────────────────────────────────────────────────────────────────
const SYNC_ACTIVITY = [
  { id:1, datetime:"15 May 2025, 08:42", type:"Full Sync",           status:"success", details:"All data synchronized successfully",  records:"24 updated"  },
  { id:2, datetime:"15 May 2025, 08:12", type:"Availability Update", status:"success", details:"Availability for 7 rooms updated",     records:"7 updated"   },
  { id:3, datetime:"15 May 2025, 07:42", type:"Reservation Import",  status:"success", details:"3 new reservations imported",           records:"3 imported"  },
  { id:4, datetime:"15 May 2025, 07:12", type:"Rates Update",        status:"success", details:"Room rates and prices updated",         records:"7 updated"   },
  { id:5, datetime:"15 May 2025, 06:42", type:"Full Sync",           status:"success", details:"All data synchronized successfully",    records:"18 updated"  },
  { id:6, datetime:"15 May 2025, 06:12", type:"Availability Update", status:"success", details:"Availability for 5 rooms updated",     records:"5 updated"   },
  { id:7, datetime:"15 May 2025, 05:42", type:"Reservation Import",  status:"warning", details:"1 reservation could not be imported",  records:"2 imported"  },
  { id:8, datetime:"15 May 2025, 05:12", type:"Full Sync",           status:"success", details:"All data synchronized successfully",    records:"22 updated"  },
];

const OVERVIEW_ITEMS = [
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label:"Rooms",        value:"7 / 7", sub:"Synchronized"    },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label:"Rates & Prices", value:"7 / 7", sub:"Synchronized"    },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label:"Availability",   value:"7 / 7", sub:"Synchronized"    },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label:"Reservations",  value:"12",    sub:"Imported today"  },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, label:"Restrictions",  value:"2",     sub:"Active"          },
];

// ── Status Badge ──────────────────────────────────────────────────────────────
function SyncBadge({ status }) {
  return <span className={`ss-badge ss-badge--${status}`}>{status.charAt(0).toUpperCase()+status.slice(1)}</span>;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SyncStatusPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activity, setActivity] = useState(SYNC_ACTIVITY);

  const visibleActivity = showAll ? activity : activity.slice(0, 5);

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      const now = new Date();
      const formatted = now.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) + ", " +
        now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
      setActivity(prev => [{
        id: Date.now(), datetime: formatted, type:"Full Sync",
        status:"success", details:"All data synchronized successfully", records:"24 updated"
      }, ...prev]);
    }, 2200);
  };

  return (
    <div className="ss-layout">
      <AdminSidebar collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed(c => !c)} activePath="/admin/sync" />

      <div className="ss-main">

        {/* ── TOP BAR ── */}
        <header className="ss-topbar">
          <div className="ss-topbar__left">
            <button className="ss-topbar__hamburger" onClick={() => setSidebarCollapsed(c => !c)}>☰</button>
            <div>
              <h1 className="ss-topbar__title">Sync Status</h1>
              <p className="ss-topbar__sub">Monitor the connection and synchronization between Villa Elbling website and Booking.com.</p>
            </div>
          </div>
          <div className="ss-topbar__right">
            <div className="ss-topbar__date">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div className="ss-topbar__user">
              <div className="ss-topbar__avatar">GW</div>
              <div className="ss-topbar__userinfo">
                <span className="ss-topbar__username">Gundel Woite</span>
                <span className="ss-topbar__role">Hotel Owner</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </header>

        <div className="ss-content">

          {/* ── CONNECTION BANNER ── */}
          <div className="ss-connection-banner">
            {/* Left: Booking.com brand + status */}
            <div className="ss-connection-brand">
              <p className="ss-booking-logo">Booking<span>.com</span></p>
              <div className="ss-connection-status">
                <span className="ss-connected-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Connected
                </span>
                <p className="ss-connection-desc">Your account is connected and syncing successfully.</p>
                <button className="ss-manage-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  Manage Connection
                </button>
              </div>
            </div>

            <div className="ss-banner-divider"/>

            {/* Stat: Last Sync */}
            <div className="ss-banner-stat">
              <div className="ss-banner-stat__icon ss-banner-stat__icon--green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="ss-banner-stat__label">Last Successful Sync</p>
              <p className="ss-banner-stat__val">15 May 2025, 08:42</p>
              <p className="ss-banner-stat__sub">23 minutes ago</p>
            </div>

            {/* Stat: Auto Sync */}
            <div className="ss-banner-stat">
              <div className="ss-banner-stat__icon ss-banner-stat__icon--blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/>
                  <polyline points="23 20 23 14 17 14"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
              </div>
              <p className="ss-banner-stat__label">Auto Sync</p>
              <p className="ss-banner-stat__val">Every 30 minutes</p>
              <p className="ss-banner-stat__sub">Next: 09:30</p>
            </div>

            {/* Stat: Total Syncs */}
            <div className="ss-banner-stat">
              <div className="ss-banner-stat__icon ss-banner-stat__icon--purple">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="ss-banner-stat__label">Total Syncs Today</p>
              <p className="ss-banner-stat__val">28</p>
              <p className="ss-banner-stat__sub">All successful</p>
            </div>

            {/* Stat: Errors */}
            <div className="ss-banner-stat">
              <div className="ss-banner-stat__icon ss-banner-stat__icon--orange">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <p className="ss-banner-stat__label">Sync Errors</p>
              <p className="ss-banner-stat__val">0</p>
              <p className="ss-banner-stat__sub">Last 7 days</p>
            </div>
          </div>

          {/* ── MIDDLE ROW ── */}
          <div className="ss-middle">

            {/* ── LEFT: Sync Overview ── */}
            <div className="ss-card ss-card--overview">
              <h2 className="ss-card__title">Sync Overview</h2>
              <div className="ss-overview-list">
                {OVERVIEW_ITEMS.map((item, i) => (
                  <div key={i} className="ss-overview-item">
                    <span className="ss-overview-icon">{item.icon}</span>
                    <span className="ss-overview-label">{item.label}</span>
                    <div className="ss-overview-right">
                      <span className="ss-overview-value">{item.value}</span>
                      <span className="ss-overview-sub">{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={`ss-sync-btn ${syncing ? "ss-sync-btn--syncing" : ""}`}
                onClick={handleSyncNow}
                disabled={syncing}
              >
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={syncing ? "ss-spin" : ""}
                >
                  <polyline points="1 4 1 10 7 10"/>
                  <polyline points="23 20 23 14 17 14"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
                {syncing ? "Syncing..." : "Sync Now"}
              </button>
              <p className="ss-sync-hint">Manually sync all data with Booking.com</p>
            </div>

            {/* ── RIGHT: Last Sync Summary + Activity ── */}
            <div className="ss-right-col">

              {/* Last Sync Summary */}
              <div className="ss-card ss-card--summary">
                <div className="ss-card__header">
                  <h2 className="ss-card__title">Last Sync Summary</h2>
                  <button className="ss-text-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    View Sync Details
                  </button>
                </div>
                <div className="ss-summary-body">
                  <div className="ss-summary-status">
                    <div className="ss-summary-check">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <p className="ss-summary-ok">All data is up to date</p>
                      <p className="ss-summary-ok-sub">Last sync completed successfully.</p>
                      <p className="ss-summary-ok-time">15 May 2025, 08:42</p>
                    </div>
                  </div>
                  <div className="ss-summary-stats">
                    {[
                      { label:"Rooms Updated",         val:"0", note:"No changes" },
                      { label:"Rates Updated",         val:"0", note:"No changes" },
                      { label:"Availability Updated",  val:"0", note:"No changes" },
                      { label:"Reservations Imported", val:"3", note:"New bookings" },
                    ].map(s => (
                      <div key={s.label} className="ss-summary-stat">
                        <p className="ss-summary-stat__label">{s.label}</p>
                        <p className="ss-summary-stat__val">{s.val}</p>
                        <p className="ss-summary-stat__note">{s.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Sync Activity */}
              <div className="ss-card ss-card--activity">
                <div className="ss-card__header">
                  <h2 className="ss-card__title">Recent Sync Activity</h2>
                  <button className="ss-text-btn">View All Activity</button>
                </div>
                <table className="ss-activity-table">
                  <thead>
                    <tr>
                      <th>DATE &amp; TIME</th>
                      <th>TYPE</th>
                      <th>STATUS</th>
                      <th>DETAILS</th>
                      <th>RECORDS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleActivity.map(row => (
                      <tr key={row.id}>
                        <td className="ss-td-date">{row.datetime}</td>
                        <td className="ss-td-type">{row.type}</td>
                        <td><SyncBadge status={row.status} /></td>
                        <td className="ss-td-details">{row.details}</td>
                        <td className="ss-td-records">{row.records}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!showAll && activity.length > 5 && (
                  <div className="ss-load-more">
                    <button className="ss-load-btn" onClick={() => setShowAll(true)}>
                      Load More
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                  </div>
                )}
              </div>

            </div>{/* end ss-right-col */}

            {/* ── FAR RIGHT: Sync Settings ── */}
            <div className="ss-card ss-card--settings">
              <h2 className="ss-card__title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Sync Settings
              </h2>

              <div className="ss-settings-list">
                {[
                  { label:"Auto Sync",          val:"Every 30 minutes" },
                  { label:"Sync Time Window",   val:"00:00 – 23:59"    },
                  { label:"Conflict Resolution",val:"Use Booking.com data" },
                ].map(s => (
                  <div key={s.label} className="ss-setting-row">
                    <div>
                      <p className="ss-setting-label">{s.label}</p>
                      <p className="ss-setting-val">{s.val}</p>
                    </div>
                    <button className="ss-edit-btn">Edit</button>
                  </div>
                ))}
              </div>

              <div className="ss-settings-divider"/>

              <p className="ss-actions-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Actions
              </p>

              <div className="ss-actions-list">
                {[
                  { label:"Sync Now",        sub:"Manually sync all data",  icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg> },
                  { label:"View Sync Logs",  sub:"Detailed sync history",   icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
                  { label:"Test Connection", sub:"Check connection status",  icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
                ].map(a => (
                  <button key={a.label} className="ss-action-row">
                    <span className="ss-action-icon">{a.icon}</span>
                    <div className="ss-action-text">
                      <p className="ss-action-label">{a.label}</p>
                      <p className="ss-action-sub">{a.sub}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                ))}
              </div>
            </div>

          </div>{/* end ss-middle */}
        </div>
      </div>
    </div>
  );
}