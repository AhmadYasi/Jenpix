import { useState } from "react";
import styles from "./HomePage.module.css";
import { IMAGES, SLIDES, NAV_ITEMS, GUEST_OPTIONS } from "./constants";

export default function HomePage() {
  // ── State ──────────────────────────────────
  const [activeSlide, setActiveSlide] = useState(0);
  const [checkin,     setCheckin]     = useState("");
  const [checkout,    setCheckout]    = useState("");
  const [guests,      setGuests]      = useState("2 Erwachsene");

  // ── Handlers ───────────────────────────────
  function handleSearch() {
    alert(`Searching from ${checkin || "?"} to ${checkout || "?"} for ${guests}`);
  }

  // ── Render ─────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ════════════════════════════════════
          TOP BAR
      ════════════════════════════════════ */}
      <div className={styles.topBar}>
        <a
          href="https://instagram.com"
          className={styles.topBarSocial}
          target="_blank"
          rel="noreferrer"
        >
          &#9426;
        </a>
        <div className={styles.topBarContact}>
          <a href="tel:01738848118" className={styles.topBarLink}>
            📞 0173/8848118
          </a>
          <a href="mailto:info@hotel-villa-elbling.de" className={styles.topBarLink}>
            ✉ info@hotel-villa-elbling.de
          </a>
        </div>
      </div>

      {/* ════════════════════════════════════
          NAVIGATION
      ════════════════════════════════════ */}
      <nav className={styles.nav}>
        <img src={IMAGES.logo} alt="Hotel Villa Elbling" className={styles.logo} />

        <ul className={styles.navLinks}>
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className={styles.navItem}>
              <a
                href="#"
                className={`${styles.navLink} ${item.active ? styles.navLinkActive : ""}`}
              >
                {item.label}
              </a>
            </li>
          ))}

          <li>
            <a href="#" className={styles.navSearch}>🔍</a>
          </li>
          <li>
            <a href="#" className={styles.navCta}>Jetzt anfragen!</a>
          </li>
        </ul>
      </nav>

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <div className={styles.hero}>
        <img src={IMAGES.hero} alt="Villa Elbling" className={styles.heroImg} />
        <div className={styles.heroOverlay}>
          <p className={styles.heroEyebrow}>Willkommen in</p>
          <h1 className={styles.heroTitle}>Villa Elbling</h1>
          <p className={styles.heroSubtitle}>
            Ihre charmante Boutique-Hotel am Fuse der Weinberge in Radebeul bei Dresden
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════
          BOOKING BAR
      ════════════════════════════════════ */}
      <div className={styles.bookingBar}>

        <div className={styles.bookingField}>
          <div className={styles.bookingFieldLabel}>📅 Anreise</div>
          <input
            type="date"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            className={styles.bookingInput}
          />
        </div>

        <div className={styles.bookingField}>
          <div className={styles.bookingFieldLabel}>📅 Abreise</div>
          <input
            type="date"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            className={styles.bookingInput}
          />
        </div>

        <div className={`${styles.bookingField} ${styles.bookingFieldLast}`}>
          <div className={styles.bookingFieldLabel}>👤 Gäste</div>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className={styles.bookingInput}
          >
            {GUEST_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <button className={styles.bookingBtn} onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* ════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════ */}
      <main className={styles.main}>
        <div className={styles.twoCol}>

          {/* ── LEFT COLUMN ─────────────── */}
          <div>

            {/* Carousel */}
            <div className={styles.carousel}>
              <img
                src={SLIDES[activeSlide].src}
                alt={SLIDES[activeSlide].label}
                className={styles.carouselImg}
              />
              <span className={styles.carouselLabel}>
                {SLIDES[activeSlide].label}
              </span>
            </div>

            <div className={styles.carouselDots}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`${styles.dot} ${i === activeSlide ? styles.dotActive : ""}`}
                />
              ))}
            </div>

            {/* Intro Text */}
            <p className={styles.bodyText}>
              Villa Elbling ist Ihr individuelles Boutique Hotel direkt neben Schloss
              Wackerbarth am Fuße der Weinberge in Radebeul.
            </p>
            <p className={styles.bodyText}>
              Das 1900 erbaute Haus wurde 2024 komplett saniert und zum Hotel umgebaut.
              Es erwarten Sie 7 liebevoll gestaltete individuelle Hotelzimmer mit
              besonderem Charme sowie ein erstklassiges Frühstück. In unserem
              weitläufigen Garten können Sie den Tag gemütlich ausklingen lassen.
            </p>
            <p className={styles.bodyText}>
              Die Villa Elbling ist der perfekte Ausgangspunkt für Ihren Urlaub in
              Radebeul – unser Grundstück grenzt an das Erlebnisweingut Schloss
              Wackerbarth. Alle Geschäfte des täglichen Bedarfs sowie den historischen
              Anger von Altkötzschenbroda erreichen Sie in wenigen Gehminuten.
            </p>

            {/* Hotel Rooms Section */}
            <div className={styles.midRow}>
              <div>
                <img src={IMAGES.room1} alt="Hotelzimmer" className={styles.midImg} />
              </div>
              <div>
                <h3 className={styles.midH3}>Unsere Hotelzimmer</h3>
                <p className={styles.midP}>
                  Entdecken Sie unsere individuell gestalteten Hotelzimmer. Von der
                  opulenten Hochzeitssuite bis hin zu gemütlichen Doppelzimmern und
                  praktischen Familienzimmern finden Sie sicher die perfekte Unterkunft
                  für Ihren Urlaub in Radebeul.
                </p>
                <a href="#" className={styles.greenLink}>Unsere Hotelzimmer →</a>
              </div>
            </div>

            {/* Schloss Wackerbarth Section */}
            <div className={styles.midRow}>
              <div>
                <h3 className={styles.midH3}>Schloss Wackerbarth</h3>
                <p className={styles.midP}>
                  Das Grundstück der Villa Elbling grenzt direkt an das
                  Erlebnisweingut Schloss Wackerbarth in Radebeul. Hier erwarten Sie
                  kulinarische Genüsse, spannende Führungen und tolle Veranstaltungen.
                </p>
                <a href="#" className={styles.greenLink}>Schloss Wackerbarth entdecken →</a>
              </div>
              <div>
                <img src={IMAGES.schloss} alt="Schloss Wackerbarth" className={styles.midImg} />
              </div>
            </div>

            {/* CTA */}
            <a href="#" className={styles.ctaBanner}>
              Buchen Sie jetzt Ihr Hotelzimmer für Ihren Urlaub in Radebeul!
            </a>
          </div>

          {/* ── RIGHT COLUMN ────────────── */}
          <div>

            {/* Hosts Box */}
            <div className={styles.hostsBox}>
              <h2 className={styles.hostsH2}>Your hosts</h2>
              <img
                src={IMAGES.hosts}
                alt="Gundel und Mathias Woite"
                className={styles.hostsImg}
              />
              <h3 className={styles.hostsH3}>Welcome to Hotel Villa Elbling!</h3>
              <p className={styles.hostsP}>We are Gundel and Mathias Woite.</p>
              <p className={styles.hostsP}>
                In 2024, we bought the old villa and completely renovated it ourselves.
                We welcome you to our unique boutique hotel at the foot of the vineyards,
                right next to Wackerbarth Castle.
              </p>
              <p className={styles.hostsP}>
                Discover our lovingly designed rooms – perfect for your getaway in
                Radebeul. We're not a run-of-the-mill hotel, but a home away from home.
              </p>
              <p className={styles.hostsP}>We look forward to seeing you!</p>
              <p className={styles.hostsSignature}>The Woite Family</p>

              <div className={styles.awardsRow}>
                <img
                  src={IMAGES.bookingAward}
                  alt="Booking.com Traveller Review Awards 2026"
                  className={styles.awardImg}
                />
              </div>

              {/* Rating Badges */}
              <div className={styles.ratingBadges}>
                <div className={styles.badge}>
                  <div className={styles.badgeSite} style={{ color: "#003580" }}>
                    Booking.com
                  </div>
                  <div className={styles.badgeScore}>9.2</div>
                  <div className={styles.badgeStars}>★★★★★</div>
                  <div className={styles.badgeLabel}>verified by Trustindex</div>
                </div>

                <div className={styles.badge}>
                  <div className={styles.badgeSite}>
                    <span style={{ color: "#4285f4" }}>G</span>
                    <span style={{ color: "#ea4335" }}>o</span>
                    <span style={{ color: "#fbbc05" }}>o</span>
                    <span style={{ color: "#4285f4" }}>g</span>
                    <span style={{ color: "#34a853" }}>l</span>
                    <span style={{ color: "#ea4335" }}>e</span>
                  </div>
                  <div className={styles.badgeScore}>5.0</div>
                  <div className={styles.badgeStars}>★★★★★</div>
                  <div className={styles.badgeLabel}>verified by Trustindex</div>
                </div>
              </div>

              <p className={styles.badgeLabelCenter}>
                Top rated on Booking and Google
              </p>
            </div>

            {/* Guest Information */}
            <div className={styles.guestInfo}>
              <h2 className={styles.guestH2}>Guest Information</h2>
              <p className={styles.guestRow}>
                <span className={styles.guestBold}>We serve breakfast</span> from 8 to 10 a.m.
              </p>
              <p className={styles.guestRow}>
                <span className={styles.guestBold}>Arrival</span> is possible from 2:30 pm.
                Please let us know your arrival time. For arrivals after 5:30 pm, we will
                leave your key in the key safe.
              </p>
              <p className={styles.guestRow}>
                <span className={styles.guestBold}>Departure</span> is possible until 11 a.m.
              </p>
              <p className={styles.guestRow}>
                <span className={styles.guestBold}>Free parking</span> is available.
              </p>
            </div>

            {/* Contact */}
            <div className={styles.contactBox}>
              <h2 className={styles.contactH2}>contact</h2>
              <p className={styles.contactP}>Phone: 0173/8848118</p>
              <p className={styles.contactP}>Email: info@hotel-villa-elbling.de</p>
              <p className={styles.contactP}>Address: Meißner Straße 326, 01445 Radebeul</p>
              <div className={styles.contactLinks}>
                <a href="#" className={styles.contactLink}>Legal Notice</a>
                <a href="#" className={styles.contactLink}>Terms and Conditions</a>
              </div>
            </div>

          </div>
          {/* end RIGHT COLUMN */}

        </div>
      </main>

      {/* ════════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
      <footer className={styles.footer}>
        <div>
          <h4 className={styles.footerH4}>Villa Elbling Radebeul</h4>
          <p className={styles.footerP}>
            Ihr Boutique-Hotel am Fuße der Weinberge direkt neben Schloss Wackerbarth
            in Radebeul.
          </p>
          <p className={styles.footerCopyright}>Copyright © 2026</p>
        </div>

        <div>
          <img
            src="https://img.icons8.com/ios/50/ffffff/checked--v1.png"
            alt="Certified Safe"
            className={styles.footerBadgeImg}
          />
          <p className={styles.footerCertified}>
            Certified safe<br />verified by Trustindex
          </p>
        </div>

        <div>
          <img
            src={IMAGES.traumwohnen}
            alt="Bekannt aus Traumwohnen"
            className={styles.footerTraumImg}
          />
        </div>
      </footer>

    </div>
  );
}
