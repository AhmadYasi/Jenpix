import React, { useState } from "react";
import "./adminLogin.css";

// ── Nav items (same as guest site — all links go back to public pages) ────────
const NAV_ITEMS = [
  { label: "Welcome",    href: "/",            active: false },
  { label: "Room",       href: "/rooms",        dropdown: true },
  { label: "Radebeul",   href: "/radebeul",     dropdown: true },
  { label: "Directions", href: "/directions"   },
  { label: "Book",       href: "/book"         },
];

// ── Background image (swap with a real hotel room photo) ─────────────────────
const BG_IMAGE =
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=85";

export default function AdminLogin() {
  const [username,    setUsername]    = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [rememberMe,  setRememberMe]  = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Bitte füllen Sie alle Felder aus.");
      return;
    }

    setLoading(true);
    // TODO: replace with real auth call
    setTimeout(() => {
      setLoading(false);
      // Demo: hardcoded credentials — replace with real API
      if (username === "admin" && password === "admin123") {
        window.location.href = "/admin/dashboard";
      } else {
        setError("Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.");
      }
    }, 800);
  };

  return (
    <div className="al-root">

     
      {/* ── NAVIGATION ─────────────────────────────────────────────────────── */}
      <nav className="al-nav">
        <a href="/" className="al-nav__logo-link" aria-label="Back to Villa Elbling">
          <div className="al-nav__logo">
            <span className="al-nav__logo-name">Villa Elbling</span>
            <span className="al-nav__logo-sub">Hotel · Bed &amp; Breakfast</span>
          </div>
        </a>

        <button
          className="al-nav__hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <ul className={`al-nav__links ${menuOpen ? "al-nav__links--open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className={item.dropdown ? "al-nav__has-sub" : ""}>
              <a
                className={`al-nav__link${item.active ? " al-nav__link--active" : ""}`}
                href={item.href}
              >
                {item.label}
                {item.dropdown && " ▾"}
              </a>
            </li>
          ))}
          <li>
            <button
              className="al-nav__link al-nav__link--btn"
              aria-label="Search"
              onClick={() => {}}
            >
              🔍
            </button>
          </li>
        </ul>

        {/* CTA hidden on admin page — uncomment if you want it */}
        {/* <a className="al-nav__cta" href="/book">Jetzt anfragen!</a> */}
      </nav>

      {/* ── BREADCRUMB ─────────────────────────────────────────────────────── */}
      <div className="al-breadcrumb">
        <span className="al-breadcrumb__label">Admin Login</span>
        <span className="al-breadcrumb__path">
          <a href="/">Start</a>
          <span className="al-breadcrumb__sep"> / </span>
          <span>Admin Login</span>
        </span>
      </div>

      {/* ── HERO SECTION with LOGIN CARD ───────────────────────────────────── */}
      <div className="al-hero" style={{ backgroundImage: `url(${BG_IMAGE})` }}>
        <div className="al-hero__overlay" />

        <div className="al-card" role="main">

          {/* Logo */}
          <div className="al-card__logo">
            <div className="al-card__logo-circle">
              <span className="al-card__logo-name">Villa Elbling</span>
              <span className="al-card__logo-sub">Radebeul · Alltägt· schembend</span>
            </div>
          </div>

          <h1 className="al-card__title">Admin Login</h1>
          <p className="al-card__subtitle">
            Bitte melden Sie sich an, um auf den<br />
            Administrationsbereich zuzugreifen.
          </p>

          {/* Error message */}
          {error && (
            <div className="al-card__error" role="alert">
              ⚠ {error}
            </div>
          )}

          {/* LOGIN FORM */}
          <form className="al-form" onSubmit={handleLogin} noValidate>

            {/* Username */}
            <div className="al-form__field">
              <span className="al-form__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="username"
                type="text"
                className="al-form__input"
                placeholder="Benutzername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                aria-label="Benutzername"
              />
            </div>

            {/* Password */}
            <div className="al-form__field">
              <span className="al-form__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className="al-form__input"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-label="Passwort"
              />
              <button
                type="button"
                className="al-form__eye"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Passwort verbergen" : "Passwort anzeigen"}
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Remember me + Forgot password */}
            <div className="al-form__row">
              <label className="al-form__remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  aria-label="Angemeldet bleiben"
                />
                <span>Angemeldet bleiben</span>
              </label>
              <button
                type="button"
                className="al-form__forgot"
                onClick={() => alert("Bitte kontaktieren Sie den Systemadministrator.")}
              >
                Passwort vergessen?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`al-form__submit ${loading ? "al-form__submit--loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <span className="al-form__spinner" aria-hidden="true" />
              ) : (
                "Anmelden"
              )}
            </button>

          </form>
        </div>
      </div>

      {/* ── SECURITY NOTE ──────────────────────────────────────────────────── */}
      <div className="al-security">
        <div className="al-security__icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <p className="al-security__text">
          Dieser Bereich ist nur für autorisierte Mitarbeiter von Hotel Villa Elbling.
        </p>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="al-footer">
        <div className="al-footer__grid">
          <div className="al-footer__brand">
            <h4>Villa Elbling Radebeul</h4>
            <div className="al-footer__brand-line" />
            <p>Ihr Boutique-Hotel am Fuße der Weinberge nahe Schloss Wackerbarth in Radebeul.</p>
          </div>
          <div className="al-footer__badges">
            <div className="al-footer__certified">
              <span className="al-footer__certified-check">✅</span>
              <span>Certified safe</span>
              <small>Verified by: Trustindex</small>
            </div>
            <div className="al-footer__wohnen">
              <span className="al-footer__wohnen-top">BEKANNT AUS</span>
              <strong>TRAUM<br />WOHNEN</strong>
            </div>
          </div>
        </div>
        <div className="al-footer__copy">
          <span>Copyright © 2026</span>
          <button
            className="al-footer__scroll-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            ↑
          </button>
        </div>
      </footer>
    </div>
  );
}