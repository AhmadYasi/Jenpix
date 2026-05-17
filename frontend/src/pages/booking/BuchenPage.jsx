import { useState } from "react";
import styles from "./BuchenPage.module.css";
import BookingCalendar from "./BookingCalendar";

// ── Nav links ─────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home",           href: "/" },
  { label: "Rooms & Prices", href: "/rooms" },
  { label: "About Us",       href: "/about" },
  { label: "Gallery",        href: "/gallery" },
  { label: "Things to Do",   href: "/radebeul" },
  { label: "Contact",        href: "/contact" },
];

export default function BuchenPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleConfirm(bookingData) {
    // TODO: wire up your confirmation popup / email here
    console.log("Booking confirmed:", bookingData);
    alert(
      `Buchungsanfrage gesendet!\n\nZimmer: ${bookingData.room?.name}\nGast: ${bookingData.guest?.name}\nE-Mail: ${bookingData.guest?.email}`
    );
  }

  return (
    <div className={styles.page}>
      

      {/* ── MOBILE DRAWER ─────────────────────────────────────────────────── */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        <ul className={styles.mobileNavLinks}>
          {NAV_LINKS.map(link => (
            <li key={link.label} className={styles.mobileNavItem}>
              <a
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/buchen" className={styles.mobileNavCta}>Book Now</a>
      </div>
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}



      {/* ── MAIN ──────────────────────────────────────────────────────────── */}
      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <a href="/" className={styles.breadcrumbLink}>Start</a>
          <span className={styles.breadcrumbSep}> / </span>
          <span>Buchen</span>
        </div>

        {/* The 3-step booking flow — completely unchanged */}
        <BookingCalendar onConfirm={handleConfirm} />
      </main>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
      <div className={styles.trustBar}>
        {[
          {
            icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
            title: "Best Price Guarantee",
            desc:  "You won't find a better price anywhere.",
          },
          {
            icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
            title: "Free Cancellation",
            desc:  "Cancel up to 7 days before arrival.",
          },
          {
            icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
            title: "Secure Booking",
            desc:  "Your data is safe with us.",
          },
          {
            icon: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12 19.79 19.79 0 0 1 1.06 3.33 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
            title: "Need Help?",
            desc:  "Contact us anytime.",
          },
        ].map(item => (
          <div key={item.title} className={styles.trustItem}>
            <div className={styles.trustIcon}>{item.icon}</div>
            <div>
              <p className={styles.trustTitle}>{item.title}</p>
              <p className={styles.trustDesc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div>
          <h4 className={styles.footerH4}>Villa Elbling Radebeul</h4>
          <p className={styles.footerP}>Ihr Boutique-Hotel am Fuße der Weinberge nahe Schloss Wackerbarth in Radebeul.</p>
          <p className={styles.footerCopyright}>Copyright © 2026</p>
        </div>
        <div>
          <p className={styles.footerCertified}>✅ Certified safe · Verified by Trustindex</p>
        </div>
        <div className={styles.footerWohnen}>
          <span className={styles.footerWohnenTop}>BEKANNT AUS</span>
          <strong className={styles.footerWohnenName}>TRAUM WOHNEN</strong>
        </div>
      </footer>

    </div>
  );
}