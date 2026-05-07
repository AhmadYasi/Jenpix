import { Link } from "react-router-dom";
import styles from "./AnfahrtPage.module.css";
import { IMAGES } from "../home/constants";

export default function AnfahrtPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.twoCol}>

          {/* ── LEFT COLUMN ── */}
          <div>
            <p className={styles.breadcrumb}>
              <Link to="/" className={styles.breadcrumbLink}>Start</Link>
              <span> / </span>
              Anfahrt
            </p>

            <h1 className={styles.pageTitle}>Anfahrt</h1>

            <p className={styles.introText}>
              Das Hotel Villa Elbling ist bequem mit dem Auto oder Nah- und
              Fernverkehr zu erreichen.
            </p>

            <p className={styles.addressHighlight}>
              Adresse Hotel Villa Elbling: Meißner Straße 326, 01445 Radebeul
            </p>

            <div className={styles.infoBox}>
              ⚠️ Kurz vor der Villa Elbling auf der Meißnerstraße befindet sich
              ein stationärer Blitzer. Also beachten Sie bitte die
              Geschwindigkeitsbegrenzung von 50 km/h oder lächeln Sie nett für die Kamera.
            </div>

            <div className={styles.directionBlock}>
              <h2 className={styles.directionTitle}>Anreise mit dem Auto</h2>
              <p className={styles.directionText}>
                Die nächstgelegene Autobahnabfahrt der A4 ist Dresden Neustadt.
                Ab hier folgen Sie 6 Kilometer der Kötzschenbrodaer Straße und
                biegen dann rechts ab. Unterfahren Sie die Bahngleise und biegen
                Sie links auf die Meißnerstraße ab. Nun fahren Sie ca. 1 Kilometer
                immer geradeaus – Kurz vor Schloss Wackerbarth befindet sich unsere
                Einfahrt auf der rechten Seite. Parkplätze stehen in ausreichender
                Menge kostenfrei auf dem Grundstück zur Verfügung.
              </p>
            </div>

            <div className={styles.directionBlock}>
              <h2 className={styles.directionTitle}>Anreise mit der Bahn</h2>
              <p className={styles.directionText}>
                Bahnreisende, die von weiter weg zum Hotel Villa Elbling anreisen,
                fahren bis zum Hauptbahnhof Dresden oder Bahnhof Dresden Neustadt
                und steigen hier in die S-Bahn um. Von beiden Bahnhöfen fährt die
                S-Bahn Linie 1 Richtung Meißen ohne Umsteigen bis nach Radebeul
                Kötzschenbroda. Ab hier laufen Sie 10 Minuten bis zur Villa Elbling.
                Es gibt auch eine Straßenbahnverbindung (aktuell Ersatzverkehr mit
                Bus). Die Haltestelle „Schloss Wackerbarth" befindet sich direkt vor der Tür.
              </p>
            </div>

            <div className={styles.mapWrapper}>
              <iframe
                title="Hotel Villa Elbling auf Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2506.4383158!2d13.6444!3d51.1089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4709c9b7c8c5a0c1%3A0x1!2sMei%C3%9Fner+Stra%C3%9Fe+326%2C+01445+Radebeul!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div>
            <div className={styles.hostsBox}>
              <h2 className={styles.hostsH2}>Ihre Gastgeber</h2>
              <img src={IMAGES.hosts} alt="Gundel und Mathias Woite" className={styles.hostsImg} />
              <h3 className={styles.hostsH3}>Herzlich Willkommen im Hotel Villa Elbling!</h3>
              <p className={styles.hostsP}>Wir sind Gundel und Mathias Woite.</p>
              <p className={styles.hostsP}>
                2024 haben wir die alte Villa gekauft und komplett in Eigenleistung
                saniert. Wir begrüßen Sie in unserem individuellen Boutique Hotel am
                Fuße der Weinberge direkt neben Schloss Wackerbarth.
              </p>
              <p className={styles.hostsP}>
                Entdecken Sie unsere liebevoll gestalteten Zimmer – perfekt für Ihre
                Auszeit in Radebeul. Wir sind kein Hotel von der Stange, sondern ein
                Zuhause auf Zeit.
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
