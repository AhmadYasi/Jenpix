import Nav from "../../components/Nav";
import styles from "../home/HomePage.module.css";

export default function RadebulPage() {
  return (
    <div className={styles.page}>
      <Nav />

      <main className={styles.main}>
        <div className={styles.twoCol}>

          {/* LEFT COLUMN */}
          <div>
            <h2 className={styles.midH3}>Radebeul entdecken</h2>
            <p className={styles.bodyText}>
              Radebeul ist eine charmante Stadt am Fuße der Weinberge, direkt neben Dresden.
              Die Villa Elbling ist der perfekte Ausgangspunkt für Ihren Urlaub in Radebeul.
            </p>

            <div className={styles.midRow}>
              <div>
                <h3 className={styles.midH3}>Schloss Wackerbarth</h3>
                <p className={styles.midP}>
                  Europas erstes Erlebnisweingut liegt direkt neben unserem Hotel.
                  Genießen Sie Weinführungen, kulinarische Events und wunderschöne Gartenanlagen.
                </p>
                <a href="https://www.schloss-wackerbarth.de" target="_blank" rel="noreferrer" className={styles.greenLink}>
                  Mehr erfahren →
                </a>
              </div>
            </div>

            <div className={styles.midRow}>
              <div>
                <h3 className={styles.midH3}>Karl May Museum</h3>
                <p className={styles.midP}>
                  Der Schriftsteller Karl May lebte seit 1888 in Radebeul. Im Karl May Museum
                  in der Villa Shatterhand finden Sie Exponate aus seinem Leben und seinen Werken.
                  Geöffnet Di–So von 10 bis 18 Uhr.
                </p>
              </div>
            </div>

            <div className={styles.midRow}>
              <div>
                <h3 className={styles.midH3}>Bismarckturm & Weinberge</h3>
                <p className={styles.midP}>
                  Erklimmen Sie die 397 Stufen des Bismarckturms und genießen Sie einen
                  herrlichen Blick auf das Elbtal. Der Turm gehört zum Denkmalschutzgebiet
                  historische Weinberglandschaft Radebeul.
                </p>
              </div>
            </div>

            <div className={styles.midRow}>
              <div>
                <h3 className={styles.midH3}>Dampfschifffahrt auf der Elbe</h3>
                <p className={styles.midP}>
                  Genießen Sie einen Ausflug auf der Elbe mit der Sächsischen Dampfschiffahrt.
                  Der Fähranleger in Radebeul ist nur 1,7 km vom Hotel entfernt — zu Fuß in
                  ca. 30 Minuten erreichbar.
                </p>
                <a href="https://www.saechsische-dampfschiffahrt.de" target="_blank" rel="noreferrer" className={styles.greenLink}>
                  Fahrplan ansehen →
                </a>
              </div>
            </div>

            <div className={styles.midRow}>
              <div>
                <h3 className={styles.midH3}>Kultur & Veranstaltungen</h3>
                <p className={styles.midP}>
                  In Radebeul ist immer etwas los! Highlights sind das Herbst- und Weinfest
                  in Altkötzschenbroda, der Weihnachtsmarkt sowie die Karl May Festtage.
                  Die Landesbühne bietet ganzjährig Musiktheater, Schauspiel und Tanz.
                </p>
              </div>
            </div>

            <div className={styles.midRow}>
              <div>
                <h3 className={styles.midH3}>Wellness in Radebeul</h3>
                <p className={styles.midP}>
                  Entspannen Sie in der Umgebung mit zahlreichen Wellness-Angeboten.
                  Unser Zimmer Scheurebe verfügt über eine private Infrarotsauna.
                  Auf Wunsch bieten wir Ayurveda-Massagen direkt in Ihrem Zimmer an.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div>
            <div className={styles.contactBox}>
              <h2 className={styles.contactH2}>Kontakt & Anreise</h2>
              <p className={styles.contactP}>📍 Meißner Straße 326, 01445 Radebeul</p>
              <p className={styles.contactP}>📞 0173/8848118</p>
              <p className={styles.contactP}>✉️ info@hotel-villa-elbling.de</p>
            </div>

            <div className={styles.guestInfo}>
              <h2 className={styles.guestH2}>Radebeul auf einen Blick</h2>
              <p className={styles.guestRow}><span className={styles.guestBold}>Schloss Wackerbarth</span> – direkt angrenzend</p>
              <p className={styles.guestRow}><span className={styles.guestBold}>Karl May Museum</span> – Di–So, 10–18 Uhr</p>
              <p className={styles.guestRow}><span className={styles.guestBold}>Bismarckturm</span> – 397 Stufen, toller Ausblick</p>
              <p className={styles.guestRow}><span className={styles.guestBold}>Fähranleger Elbe</span> – 1,7 km vom Hotel</p>
              <p className={styles.guestRow}><span className={styles.guestBold}>Landesbühne</span> – 3 km vom Hotel</p>
              <p className={styles.guestRow}><span className={styles.guestBold}>Volkssternwarte</span> – kurzer Spaziergang durch die Weinberge</p>
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
      </footer>
    </div>
  );
}