import { Link } from 'react-router-dom';
import rooms from './roomsData';
import styles from './ZimmerPage.module.css';
import { IMAGES } from '../home/constants';

function ZimmerPage() {
  return (
    <main className={styles.page}>

      {/* ── Page Header ── */}
      <section className={styles.pageHeader}>
        <p className={styles.breadcrumb}>
          <Link to="/">Start</Link>
          <span> / </span>
          <span>Zimmer</span>
        </p>
        <h1 className={styles.pageTitle}>Zimmer</h1>
      </section>

      {/* ── Two Column Layout ── */}
      <div className={styles.twoCol}>

        {/* ── LEFT: Main Content ── */}
        <div className={styles.mainCol}>

          <section className={styles.introSection}>
            <h2 className={styles.sectionTitle}>Unsere individuellen Hotelzimmer</h2>

            {/* Three hero images */}
            <div className={styles.heroImages}>
              <img
                src="https://hotel-villa-elbling.de/wp-content/uploads/2024/09/Hotel-Villa-Elbling-Radebeul-Doppelzimmer-Bacchus-Blick-ins-Zimmer-1024x768.jpg"
                alt="Doppelzimmer Bacchus Hotel Villa Elbling Radebeul"
                className={styles.heroImg}
              />
              <img
                src="https://hotel-villa-elbling.de/wp-content/uploads/2024/10/Wohnbereich-mit-Kamin-Hochzeitssuite-1024x683.jpg"
                alt="Wohnbereich mit Kamin Hochzeitssuite"
                className={styles.heroImg}
              />
              <img
                src="https://hotel-villa-elbling.de/wp-content/uploads/2024/10/Schlafbereich-Weddingsuite-1024x768.jpg"
                alt="Hochzeitssuite Gutedel Schlafbereich"
                className={styles.heroImg}
              />
            </div>

            {/* Intro text */}
            <p className={styles.introText}>
              Die Zimmer unseres Boutique Hotels sind nach den besten Rebsorten des Radebeuler
              Weinbaugebiets benannt. Und sie sind alle genauso einzigartig, aufregend und
              geschmackvoll. Entdecken Sie unsere individuell gestalteten Hotelzimmer und Suiten
              und finden Sie das perfekte Zimmer für Ihren Urlaub in Radebeul.
            </p>

            {/* Overview table */}
            <div className={styles.tableWrapper}>
              <table className={styles.overviewTable}>
                <thead>
                  <tr>
                    <th>Zimmer</th>
                    <th>Besonderheit</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td>
                        <Link to={`/hotelzimmer/${room.id}`} className={styles.tableRoomLink}>
                          {room.name}
                        </Link>
                        <br />
                        <span className={styles.tablePrice}>{room.priceLabel}</span>
                      </td>
                      <td>
                        <ul className={styles.tableHighlights}>
                          {room.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Room Entry Sections ── */}
          <section className={styles.roomsSection}>
            {rooms.map((room, index) => (
              <article key={room.id} className={styles.roomEntry}>
                <div className={styles.roomImages}>
                  {room.heroImages.slice(0, 2).map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={img.alt}
                      className={styles.roomImg}
                    />
                  ))}
                </div>
                <div className={styles.roomText}>
                  <h3 className={styles.roomEntryTitle}>{room.name}</h3>
                  <p className={styles.roomEntryDesc}>{room.description[0]}</p>
                  <Link to={`/hotelzimmer/${room.id}`} className={styles.roomEntryLink}>
                    Entdecken Sie {index === 0 ? 'jetzt Ihre' : 'unser'} {room.shortName} {index === 0 ? 'direkt bei Schloss Wackerbarth' : ''}
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {/* ── Booking CTA ── */}
          <section className={styles.ctaSection}>
            <p className={styles.ctaText}>
              Buchen Sie jetzt Ihren Urlaub im Boutique Hotel Villa Elbling in Radebeul.
              Wir freuen uns auf Sie!
            </p>
            <p className={styles.ctaContact}>
              Telefon für Reservierungen:{' '}
              <a href="tel:01738848118" className={styles.ctaLink}>0173/8848118</a>
            </p>
            <p className={styles.ctaContact}>
              E-Mail:{' '}
              <a href="mailto:info@hotel-villa-elbling.de" className={styles.ctaLink}>
                info@hotel-villa-elbling.de
              </a>
            </p>
          </section>

        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className={styles.sidebarCol}>

          {/* Hosts Box */}
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
              <img
                src={IMAGES.bookingAward}
                alt="Booking.com Traveller Review Awards 2026"
                className={styles.awardImg}
              />
            </div>

            <div className={styles.ratingBadges}>
              <div className={styles.badge}>
                <div className={styles.badgeSite} style={{ color: '#003580' }}>Booking.com</div>
                <div className={styles.badgeScore}>9.2</div>
                <div className={styles.badgeStars}>★★★★★</div>
                <div className={styles.badgeLabel}>verified by Trustindex</div>
              </div>
              <div className={styles.badge}>
                <div className={styles.badgeSite}>
                  <span style={{ color: '#4285f4' }}>G</span>
                  <span style={{ color: '#ea4335' }}>o</span>
                  <span style={{ color: '#fbbc05' }}>o</span>
                  <span style={{ color: '#4285f4' }}>g</span>
                  <span style={{ color: '#34a853' }}>l</span>
                  <span style={{ color: '#ea4335' }}>e</span>
                </div>
                <div className={styles.badgeScore}>5.0</div>
                <div className={styles.badgeStars}>★★★★★</div>
                <div className={styles.badgeLabel}>verified by Trustindex</div>
              </div>
            </div>
            <p className={styles.badgeLabelCenter}>Top bewertet bei Booking und Google</p>
          </div>

          {/* Guest Info */}
          <div className={styles.guestInfo}>
            <h2 className={styles.guestH2}>Gäste-Informationen</h2>
            <p className={styles.guestRow}><span className={styles.guestBold}>Frühstück</span> servieren wir von 8 bis 10 Uhr.</p>
            <p className={styles.guestRow}><span className={styles.guestBold}>Anreise</span> ist ab 14:30 Uhr möglich. Bitte teilen Sie uns Ihre Anreisezeit mit. Für Anreisen nach 17:30 Uhr deponieren wir Ihren Schlüssel im Schlüsselsafe.</p>
            <p className={styles.guestRow}><span className={styles.guestBold}>Abreise</span> ist bis 11 Uhr möglich.</p>
            <p className={styles.guestRow}><span className={styles.guestBold}>Parkplätze</span> stehen kostenfrei zur Verfügung.</p>
          </div>

          {/* Contact */}
          <div className={styles.contactBox}>
            <h2 className={styles.contactH2}>Kontakt</h2>
            <p className={styles.contactP}>Telefon: <a href="tel:01738848118" className={styles.contactLink}>0173/8848118</a></p>
            <p className={styles.contactP}>E-Mail: <a href="mailto:info@hotel-villa-elbling.de" className={styles.contactLink}>info@hotel-villa-elbling.de</a></p>
            <p className={styles.contactP}>Anfahrt: Meißner Straße 326, 01445 Radebeul</p>
            <div className={styles.contactLinks}>
              <Link to="/impressum" className={styles.contactLinkBtn}>Impressum</Link>
              <Link to="/agb" className={styles.contactLinkBtn}>AGB</Link>
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}

export default ZimmerPage;
