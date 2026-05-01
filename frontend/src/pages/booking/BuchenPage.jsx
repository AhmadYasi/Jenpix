import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./BuchenPage.module.css";
import { IMAGES } from "../home/constants";
import Nav from "../../components/Nav";
import BookingCalendar from "./BookingCalendar";

export default function BuchenPage() {
  function handleConfirm(bookingData) {
    // TODO: wire up your popup form here
    console.log("Booking confirmed:", bookingData);
  }

  return (
    <div className={styles.page}>
      <Nav />

      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>Start</Link>
          <span> / </span>
          Buchen
        </div>

        <BookingCalendar onConfirm={handleConfirm} />
      </main>

      <footer className={styles.footer}>
        <div>
          <h4 className={styles.footerH4}>Villa Elbling Radebeul</h4>
          <p className={styles.footerP}>Ihr Boutique Hotel am Fuße der Weinberge bei Schloss Wackerbarth in Radebeul.</p>
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