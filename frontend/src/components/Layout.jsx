import { Link } from 'react-router-dom';
import Nav from './Nav';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.wrapper}>

      {/* ── Nav ── */}
      <Nav />

      {/* ── Page Content ── */}
      <main className={styles.main}>
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>Villa Elbling Radebeul</h4>
            <p>Ihr Boutique Hotel am Fuße der Weinberge bei Schloss Wackerbarth in Radebeul.</p>
            <p>
              <Link to="/impressum" className={styles.footerLink}>Impressum</Link>
              {' · '}
              <Link to="/agb" className={styles.footerLink}>AGB</Link>
            </p>
            <p className={styles.footerCopy}>Copyright © 2026</p>
          </div>
        </div>
      </footer>

    </div>
  );
}