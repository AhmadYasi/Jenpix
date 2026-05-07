import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import { IMAGES, SLIDES } from "./constants";

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.twoCol}>

          {/* ── LEFT COLUMN ── */}
          <div>
            <div className={styles.carousel}>
              <img
                src={SLIDES[activeSlide].src}
                alt={SLIDES[activeSlide].label}
                className={styles.carouselImg}
              />
              <span className={styles.carouselLabel}>{SLIDES[activeSlide].label}</span>
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
                <Link to="/hotelzimmer" className={styles.greenLink}>Unsere Hotelzimmer →</Link>
              </div>
            </div>

            <div className={styles.midRow}>
              <div>
                <h3 className={styles.midH3}>Schloss Wackerbarth</h3>
                <p className={styles.midP}>
                  Das Grundstück der Villa Elbling grenzt direkt an das
                  Erlebnisweingut Schloss Wackerbarth in Radebeul. Hier erwarten Sie
                  kulinarische Genüsse, spannende Führungen und tolle Veranstaltungen.
                </p>
                <a
                  href="https://www.schloss-wackerbarth.de"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.greenLink}
                >
                  Schloss Wackerbarth entdecken →
                </a>
              </div>
              <div>
                <img src={IMAGES.schloss} alt="Schloss Wackerbarth" className={styles.midImg} />
              </div>
            </div>

            <Link to="/buchen" className={styles.ctaBanner}>
              Buchen Sie jetzt Ihr Hotelzimmer für Ihren Urlaub in Radebeul!
            </Link>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div>
            <div className={styles.hostsBox}>
              <h2 className={styles.hostsH2}>Ihre Gastgeber</h2>
              <img src={IMAGES.hosts} alt="Gundel und Mathias Woite" className={styles.hostsImg} />
              <h3 className={styles.hostsH3}>Herzlich Willkommen im Hotel Villa Elbling!</h3>
              <p className={styles.hostsP}>Wir sind Gundel und Mathias Woite.</p>
              <p className={styles.hostsP}>
                2024 haben wir die alte Villa gekauft und komplett in Eigenleistung saniert.
                Wir begrüßen Sie in unserem individuellen Boutique Hotel am Fuße der Weinberge
                direkt neben Schloss Wackerbarth.
              </p>
              <p className={styles.hostsP}>
                Entdecken Sie unsere liebevoll gestalteten Zimmer – perfekt für Ihre Auszeit
                in Radebeul. Wir sind kein Hotel von der Stange, sondern ein Zuhause auf Zeit.
              </p>
              <p className={styles.hostsP}>Wir freuen uns auf Sie!</p>
              <p className={styles.hostsSignature}>Ihre Familie Woite</p>

              <div className={styles.awardsRow}>
                <img src={IMAGES.bookingAward} alt="Booking.com Traveller Review Awards 2026" className={styles.awardImg} />
              </div>

              <div className={styles.ratingBadges}>
                <div className={styles.badge}>
                  <div className={styles.badgeSite} style={{ color: "#003580" }}>Booking.com</div>
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
              <p className={styles.badgeLabelCenter}>Top bewertet bei Booking und Google</p>
            </div>

            <div className={styles.guestInfo}>
              <h2 className={styles.guestH2}>Gäste-Informationen</h2>
              <p className={styles.guestRow}><span className={styles.guestBold}>Frühstück</span> servieren wir von 8 bis 10 Uhr.</p>
              <p className={styles.guestRow}><span className={styles.guestBold}>Anreise</span> ist ab 14:30 Uhr möglich. Bitte teilen Sie uns Ihre Anreisezeit mit. Für Anreisen nach 17:30 Uhr deponieren wir Ihren Schlüssel im Schlüsselsafe.</p>
              <p className={styles.guestRow}><span className={styles.guestBold}>Abreise</span> ist bis 11 Uhr möglich.</p>
              <p className={styles.guestRow}><span className={styles.guestBold}>Parkplätze</span> stehen kostenfrei zur Verfügung.</p>
            </div>

            <div className={styles.contactBox}>
              <h2 className={styles.contactH2}>Kontakt</h2>
              <p className={styles.contactP}>Telefon: 0173/8848118</p>
              <p className={styles.contactP}>E-Mail: info@hotel-villa-elbling.de</p>
              <p className={styles.contactP}>Anfahrt: Meißner Straße 326, 01445 Radebeul</p>
              <div className={styles.contactLinks}>
                <button className={styles.contactLink}>Impressum</button>
                <button className={styles.contactLink}>AGB</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
