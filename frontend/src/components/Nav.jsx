import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IMAGES } from "../pages/home/constants";
import styles from "./Nav.module.css";

const NAV_ITEMS = [
  { label: "Willkommen", path: "/" },
  { label: "Zimmer \u25BE",   path: "/zimmer" },
  { label: "Radebeul \u25BE", path: "/radebeul" },
  { label: "Anfahrt",    path: "/anfahrt" },
  { label: "Buchen",     path: "/buchen" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  function isActive(path) {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }

  return (
    <>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <a href="https://instagram.com" className={styles.topBarSocial} target="_blank" rel="noreferrer">
          &#9426;
        </a>
        <div className={styles.topBarContact}>
          <a href="tel:01738848118" className={styles.topBarLink}>📞 0173/8848118</a>
          <a href="mailto:info@hotel-villa-elbling.de" className={styles.topBarLink}>✉ info@hotel-villa-elbling.de</a>
        </div>
      </div>

      {/* ── Nav bar ── */}
      <nav className={styles.nav}>
        <Link to="/">
          <img src={IMAGES.logo} alt="Hotel Villa Elbling" className={styles.logo} />
        </Link>

        {/* Desktop links */}
        <ul className={styles.navLinks}>
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className={styles.navItem}>
              <Link
                to={item.path}
                className={`${styles.navLink} ${isActive(item.path) ? styles.navLinkActive : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li><button className={styles.navSearch}>🔍</button></li>
          <li>
            <Link to="/buchen" className={styles.navCta}>Jetzt anfragen!</Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü öffnen"
        >
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.lineTop    : ""}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.lineMiddle : ""}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.lineBottom : ""}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        <ul className={styles.mobileNavLinks}>
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className={styles.mobileNavItem}>
              <Link
                to={item.path}
                className={`${styles.mobileNavLink} ${isActive(item.path) ? styles.mobileNavLinkActive : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className={styles.mobileNavItem}>
            <Link to="/buchen" className={styles.mobileNavCta} onClick={() => setMenuOpen(false)}>
              Jetzt anfragen!
            </Link>
          </li>
        </ul>
      </div>

      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
    </>
  );
}