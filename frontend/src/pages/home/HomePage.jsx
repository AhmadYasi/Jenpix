import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import { IMAGES, SLIDES } from "./constants";
import Nav from "../../components/Nav";

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className={styles.page}>
      <Nav />

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
                <Link to="/buchen" className={styles.greenLink}>Unsere Hotelzimmer →</Link>
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
              <h2 className={styles.hostsH2}>Your hosts</h2>
              <img src={IMAGES.hosts} alt="Gundel und Mathias Woite" className={styles.hostsImg} />
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
              <p className={styles.badgeLabelCenter}>Top rated on Booking and Google</p>
            </div>

            <div className={styles.guestInfo}>
              <h2 className={styles.guestH2}>Guest Information</h2>
              <p className={styles.guestRow}><span className={styles.guestBold}>We serve breakfast</span> from 8 to 10 a.m.</p>
              <p className={styles.guestRow}><span className={styles.guestBold}>Arrival</span> is possible from 2:30 pm. Please let us know your arrival time. For arrivals after 5:30 pm, we will leave your key in the key safe.</p>
              <p className={styles.guestRow}><span className={styles.guestBold}>Departure</span> is possible until 11 a.m.</p>
              <p className={styles.guestRow}><span className={styles.guestBold}>Free parking</span> is available.</p>
            </div>

            <div className={styles.contactBox}>
              <h2 className={styles.contactH2}>contact</h2>
              <p className={styles.contactP}>Phone: 0173/8848118</p>
              <p className={styles.contactP}>Email: info@hotel-villa-elbling.de</p>
              <p className={styles.contactP}>Address: Meißner Straße 326, 01445 Radebeul</p>
              <div className={styles.contactLinks}>
                <button className={styles.contactLink}>Legal Notice</button>
                <button className={styles.contactLink}>Terms and Conditions</button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className={styles.footer}>
        <div>
          <h4 className={styles.footerH4}>Villa Elbling Radebeul</h4>
          <p className={styles.footerP}>Ihr Boutique-Hotel am Fuße der Weinberge direkt neben Schloss Wackerbarth in Radebeul.</p>
          <p className={styles.footerCopyright}>Copyright © 2026</p>
        </div>
        <div>
          <img src="https://img.icons8.com/ios/50/ffffff/checked--v1.png" alt="Certified Safe" className={styles.footerBadgeImg} />
          <p className={styles.footerCertified}>Certified safe<br />verified by Trustindex</p>
        </div>
        <div>
          <img src={IMAGES.traumwohnen} alt="Bekannt aus Traumwohnen" className={styles.footerTraumImg} />
        </div>
      </footer>
    </div>
  );
}