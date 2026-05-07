import { Link } from "react-router-dom";
import styles from "./BuchenPage.module.css";
import BookingCalendar from "./BookingCalendar";

export default function BuchenPage() {
  function handleConfirm(bookingData) {
    // TODO: wire up your popup form here
    console.log("Booking confirmed:", bookingData);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>Start</Link>
          <span> / </span>
          Buchen
        </div>

        <BookingCalendar onConfirm={handleConfirm} />
      </main>
    </div>
  );
}
