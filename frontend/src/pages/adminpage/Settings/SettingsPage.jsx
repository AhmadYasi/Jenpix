import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import "./SettingsPage.css";

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <div className="st-section">
      <div className="st-section__head">
        <h2 className="st-section__title">{title}</h2>
        {description && <p className="st-section__desc">{description}</p>}
      </div>
      <div className="st-section__body">{children}</div>
    </div>
  );
}

// ── Field row ─────────────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div className="st-field">
      <div className="st-field__label-wrap">
        <label className="st-field__label">{label}</label>
        {hint && <p className="st-field__hint">{hint}</p>}
      </div>
      <div className="st-field__control">{children}</div>
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`st-toggle ${checked ? "st-toggle--on" : ""}`}
    >
      <span className="st-toggle__thumb" />
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("hotel");
  const [saved, setSaved] = useState(false);

  // ── Hotel Profile ──
  const [hotel, setHotel] = useState({
    name:       "Villa Elbling",
    email:      "info@hotel-villa-elbling.de",
    phone:      "0173/8848118",
    address:    "Meißner Straße 326",
    city:       "Radebeul",
    zip:        "01445",
    country:    "Germany",
    website:    "https://hotel-villa-elbling.de",
    checkIn:    "14:30",
    checkOut:   "11:00",
    currency:   "EUR",
    language:   "German",
  });

  // ── Notifications ──
  const [notif, setNotif] = useState({
    newBooking:      true,
    bookingCancelled:true,
    paymentReceived: true,
    syncErrors:      true,
    dailySummary:    false,
    marketingUpdates:false,
  });

  // ── Security ──
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
    twoFactor:       false,
    sessionTimeout:  "60",
  });
  const [pwError, setPwError] = useState("");

  // ── Booking Rules ──
  const [rules, setRules] = useState({
    minStay:        "1",
    maxStay:        "30",
    advanceBooking: "365",
    instantConfirm: true,
    breakfastDefault: false,
    cancellationPolicy: "flexible",
  });

  const setH = (k) => (e) => setHotel(p => ({ ...p, [k]: e.target.value }));
  const setN = (k) => (v)  => setNotif(p => ({ ...p, [k]: v }));
  const setS = (k) => (e)  => setSecurity(p => ({ ...p, [k]: typeof e === "boolean" ? e : e.target.value }));
  const setR = (k) => (e)  => setRules(p => ({ ...p, [k]: typeof e === "boolean" ? e : e.target.value }));

  const handleSave = () => {
    if (activeTab === "security") {
      if (security.newPassword && security.newPassword !== security.confirmPassword) {
        setPwError("Passwords do not match."); return;
      }
      setPwError("");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const TABS = [
    { key:"hotel",         label:"Hotel Profile",    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { key:"notifications", label:"Notifications",    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
    { key:"booking",       label:"Booking Rules",    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { key:"security",      label:"Security",         icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  ];

  return (
    <div className="st-layout">
      <AdminSidebar collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed(c => !c)} activePath="/admin/settings" />

      <div className="st-main">
        {/* Top Bar */}
        <header className="st-topbar">
          <div className="st-topbar__left">
            <button className="st-topbar__hamburger" onClick={() => setSidebarCollapsed(c => !c)}>☰</button>
            <div>
              <h1 className="st-topbar__title">Settings</h1>
              <p className="st-topbar__sub">Manage your hotel profile, preferences and account settings.</p>
            </div>
          </div>
          <div className="st-topbar__right">
            <div className="st-topbar__user">
              <div className="st-topbar__avatar">GW</div>
              <div className="st-topbar__userinfo">
                <span className="st-topbar__username">Gundel Woite</span>
                <span className="st-topbar__role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className="st-content">
          <div className="st-inner">

            {/* ── Sidebar Tabs ── */}
            <nav className="st-tabs">
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={`st-tab ${activeTab === t.key ? "st-tab--active" : ""}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </nav>

            {/* ── Tab Content ── */}
            <div className="st-panel">

              {/* ── HOTEL PROFILE ── */}
              {activeTab === "hotel" && (
                <>
                  <Section title="Hotel Information" description="Basic details shown to guests and used across the system.">
                    <Field label="Hotel Name">
                      <input className="st-input" value={hotel.name} onChange={setH("name")} />
                    </Field>
                    <Field label="Email Address" hint="Used for guest communications and notifications.">
                      <input className="st-input" type="email" value={hotel.email} onChange={setH("email")} />
                    </Field>
                    <Field label="Phone Number">
                      <input className="st-input" value={hotel.phone} onChange={setH("phone")} />
                    </Field>
                    <Field label="Website">
                      <input className="st-input" value={hotel.website} onChange={setH("website")} />
                    </Field>
                  </Section>

                  <div className="st-divider" />

                  <Section title="Address">
                    <Field label="Street Address">
                      <input className="st-input" value={hotel.address} onChange={setH("address")} />
                    </Field>
                    <div className="st-row">
                      <Field label="City">
                        <input className="st-input" value={hotel.city} onChange={setH("city")} />
                      </Field>
                      <Field label="Postal Code">
                        <input className="st-input" value={hotel.zip} onChange={setH("zip")} />
                      </Field>
                    </div>
                    <Field label="Country">
                      <select className="st-input st-select" value={hotel.country} onChange={setH("country")}>
                        <option>Germany</option>
                        <option>Austria</option>
                        <option>Switzerland</option>
                      </select>
                    </Field>
                  </Section>

                  <div className="st-divider" />

                  <Section title="Operations" description="Check-in/out times and regional settings.">
                    <div className="st-row">
                      <Field label="Check-in Time" hint="Earliest guest arrival.">
                        <input className="st-input" type="time" value={hotel.checkIn} onChange={setH("checkIn")} />
                      </Field>
                      <Field label="Check-out Time" hint="Latest guest departure.">
                        <input className="st-input" type="time" value={hotel.checkOut} onChange={setH("checkOut")} />
                      </Field>
                    </div>
                    <div className="st-row">
                      <Field label="Currency">
                        <select className="st-input st-select" value={hotel.currency} onChange={setH("currency")}>
                          <option value="EUR">EUR – Euro</option>
                          <option value="USD">USD – US Dollar</option>
                          <option value="GBP">GBP – British Pound</option>
                        </select>
                      </Field>
                      <Field label="Language">
                        <select className="st-input st-select" value={hotel.language} onChange={setH("language")}>
                          <option>German</option>
                          <option>English</option>
                          <option>French</option>
                        </select>
                      </Field>
                    </div>
                  </Section>
                </>
              )}

              {/* ── NOTIFICATIONS ── */}
              {activeTab === "notifications" && (
                <>
                  <Section title="Email Notifications" description="Choose which events trigger an email to the admin.">
                    {[
                      { key:"newBooking",       label:"New Booking",        hint:"When a new reservation is made."             },
                      { key:"bookingCancelled", label:"Booking Cancelled",  hint:"When a guest cancels their reservation."     },
                      { key:"paymentReceived",  label:"Payment Received",   hint:"When a payment is confirmed."                },
                      { key:"syncErrors",       label:"Sync Errors",        hint:"When a Booking.com sync fails."              },
                      { key:"dailySummary",     label:"Daily Summary",      hint:"A daily overview of bookings and occupancy." },
                      { key:"marketingUpdates", label:"Product Updates",    hint:"News and updates from Villa Elbling admin."  },
                    ].map(n => (
                      <Field key={n.key} label={n.label} hint={n.hint}>
                        <Toggle checked={notif[n.key]} onChange={setN(n.key)} />
                      </Field>
                    ))}
                  </Section>
                </>
              )}

              {/* ── BOOKING RULES ── */}
              {activeTab === "booking" && (
                <>
                  <Section title="Stay Rules" description="Define the minimum and maximum stay lengths guests can book.">
                    <div className="st-row">
                      <Field label="Minimum Stay (nights)" hint="Shortest stay guests can book.">
                        <input className="st-input st-input--sm" type="number" min="1" value={rules.minStay} onChange={setR("minStay")} />
                      </Field>
                      <Field label="Maximum Stay (nights)" hint="Longest stay guests can book.">
                        <input className="st-input st-input--sm" type="number" min="1" value={rules.maxStay} onChange={setR("maxStay")} />
                      </Field>
                    </div>
                    <Field label="Advance Booking Window (days)" hint="How far in advance guests can book.">
                      <input className="st-input st-input--sm" type="number" min="1" value={rules.advanceBooking} onChange={setR("advanceBooking")} />
                    </Field>
                  </Section>

                  <div className="st-divider" />

                  <Section title="Booking Behaviour">
                    <Field label="Instant Confirmation" hint="Automatically confirm bookings without manual review.">
                      <Toggle checked={rules.instantConfirm} onChange={(v) => setR("instantConfirm")({ target:{value:v} })} />
                    </Field>
                    <Field label="Breakfast Included by Default" hint="Pre-select breakfast when guests book.">
                      <Toggle checked={rules.breakfastDefault} onChange={(v) => setR("breakfastDefault")({ target:{value:v} })} />
                    </Field>
                  </Section>

                  <div className="st-divider" />

                  <Section title="Cancellation Policy">
                    <Field label="Policy Type" hint="Applied to all rooms unless overridden per room.">
                      <select className="st-input st-select" value={rules.cancellationPolicy} onChange={setR("cancellationPolicy")}>
                        <option value="flexible">Flexible – Full refund up to 24h before</option>
                        <option value="moderate">Moderate – Full refund up to 5 days before</option>
                        <option value="strict">Strict – 50% refund up to 7 days before</option>
                        <option value="non-refundable">Non-refundable</option>
                      </select>
                    </Field>
                  </Section>
                </>
              )}

              {/* ── SECURITY ── */}
              {activeTab === "security" && (
                <>
                  <Section title="Change Password" description="Choose a strong password you don't use anywhere else.">
                    <Field label="Current Password">
                      <input className="st-input" type="password" placeholder="Enter current password" value={security.currentPassword} onChange={setS("currentPassword")} />
                    </Field>
                    <Field label="New Password">
                      <input className="st-input" type="password" placeholder="Enter new password" value={security.newPassword} onChange={setS("newPassword")} />
                    </Field>
                    <Field label="Confirm New Password">
                      <input className={`st-input ${pwError ? "st-input--err" : ""}`} type="password" placeholder="Repeat new password" value={security.confirmPassword} onChange={setS("confirmPassword")} />
                      {pwError && <p className="st-err">{pwError}</p>}
                    </Field>
                  </Section>

                  <div className="st-divider" />

                  <Section title="Session & Access">
                    <Field label="Two-Factor Authentication" hint="Add an extra layer of security to your account.">
                      <Toggle checked={security.twoFactor} onChange={(v) => setSecurity(p => ({...p, twoFactor: v}))} />
                    </Field>
                    <Field label="Session Timeout (minutes)" hint="Automatically log out after inactivity.">
                      <select className="st-input st-select st-input--sm" value={security.sessionTimeout} onChange={setS("sessionTimeout")}>
                        <option value="30">30 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="120">2 hours</option>
                        <option value="480">8 hours</option>
                      </select>
                    </Field>
                  </Section>

                  <div className="st-divider" />

                  <Section title="Danger Zone">
                    <div className="st-danger-card">
                      <div>
                        <p className="st-danger-card__title">Log out of all devices</p>
                        <p className="st-danger-card__desc">End all active sessions across all browsers and devices.</p>
                      </div>
                      <button className="st-danger-btn">Log Out All</button>
                    </div>
                  </Section>
                </>
              )}

              {/* ── Save Bar ── */}
              <div className="st-save-bar">
                {saved && (
                  <span className="st-saved-msg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Changes saved
                  </span>
                )}
                <button className="st-btn st-btn--ghost" onClick={() => setActiveTab(activeTab)}>Cancel</button>
                <button className="st-btn st-btn--primary" onClick={handleSave}>Save Changes</button>
              </div>

            </div>{/* end st-panel */}
          </div>
        </div>
      </div>
    </div>
  );
}