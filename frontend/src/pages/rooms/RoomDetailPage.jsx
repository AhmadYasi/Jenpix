import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import rooms from './roomsData';
import styles from './RoomDetailPage.module.css';
import { IMAGES } from '../home/constants';

function RoomDetailPage() {
  const { roomId } = useParams();
  const room = rooms.find((r) => r.id === roomId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roomId]);

  // Shared sidebar component
  const Sidebar = () => (
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
  );

  // 404 – room not found
  if (!room) {
    return (
      <main className={styles.page}>
        <section className={styles.pageHeader}>
          <p className={styles.breadcrumb}>
            <Link to="/">Start</Link>
            <span> / </span>
            <Link to="/hotelzimmer">Zimmer</Link>
          </p>
          <h1 className={styles.pageTitle}>Zimmer nicht gefunden</h1>
        </section>
        <div className={styles.twoCol}>
          <div className={styles.mainCol}>
            <p>Das gesuchte Zimmer existiert leider nicht.</p>
            <Link to="/hotelzimmer" className={styles.backLink}>
              ← Zurück zur Zimmerübersicht
            </Link>
          </div>
          <Sidebar />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>

      {/* ── Page Header ── */}
      <section className={styles.pageHeader}>
        <p className={styles.breadcrumb}>
          <Link to="/">Start</Link>
          <span> / </span>
          <Link to="/hotelzimmer">Zimmer</Link>
          <span> / </span>
          <span>{room.name}</span>
        </p>
        <h1 className={styles.pageTitle}>{room.name}</h1>
      </section>

      {/* ── Two Column Layout ── */}
      <div className={styles.twoCol}>

        {/* ── LEFT: Main Content ── */}
        <div className={styles.mainCol}>

          {/* Room Title + Subtitle */}
          <section className={styles.roomHeader}>
            <h2 className={styles.roomTitle}>{room.name}</h2>
            {room.subtitle && (
              <p className={styles.roomSubtitle}><strong>{room.subtitle}</strong></p>
            )}
          </section>

          {/* Hero Images */}
          <section className={styles.heroImages}>
            {room.heroImages.map((img, i) => (
              <img key={i} src={img.url} alt={img.alt} className={styles.heroImg} />
            ))}
          </section>

          {/* Description */}
          <section className={styles.descriptionSection}>
            {room.description.map((para, i) => (
              <p key={i} className={styles.descParagraph}>{para}</p>
            ))}
          </section>

          {/* Amenities */}
          <section className={styles.amenitiesSection}>
            <p className={styles.amenitiesIntro}>Sie können sich freuen auf:</p>
            <ul className={styles.amenitiesList}>
              {room.amenities.map((item, i) => (
                <li key={i} className={styles.amenityItem}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Price Details */}
          <section className={styles.priceSection}>
            <p className={styles.priceText}>{room.priceDetails}</p>
            {room.extraPricing && (
              <ul className={styles.extraPricingList}>
                {room.extraPricing.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
          </section>

          {/* Booking CTA */}
          <section className={styles.bookingCta}>
            <p className={styles.bookingText}>
              Buchen Sie jetzt {room.shortName} unter{' '}
              <a href="tel:01738848118" className={styles.ctaLink}>0173/8848118</a>
              {' '}oder{' '}
              <a href="mailto:info@hotel-villa-elbling.de" className={styles.ctaLink}>
                info@hotel-villa-elbling.de
              </a>
            </p>
            <p className={styles.bookingTagline}>Wir freuen uns auf Sie!</p>
            <Link to="/buchen" className={styles.bookButton}>
              Jetzt anfragen!
            </Link>
          </section>

          {/* Gallery */}
          {room.galleryImages.length > 0 && (
            <section className={styles.gallery}>
              {room.galleryImages.map((img, i) => (
                <img key={i} src={img.url} alt={img.alt} className={styles.galleryImg} />
              ))}
            </section>
          )}

          {/* Team Sign-off */}
          {room.teamImage && (
            <div className={styles.teamImage}>
              <img
                src={room.teamImage}
                alt="Liebe Grüße vom Team Villa Elbling"
                className={styles.teamImg}
              />
            </div>
          )}

        </div>

        {/* ── RIGHT: Sidebar ── */}
        <Sidebar />

      </div>

    </main>
  );
}

export default RoomDetailPage;
