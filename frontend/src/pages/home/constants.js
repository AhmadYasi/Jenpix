// ─────────────────────────────────────────────
//  Image imports (from local assets folder)
// ─────────────────────────────────────────────
import bacchusHero    from "../../assets/Hotel-Villa-Elbling-Radebeul-Doppelzimmer-Bacchus-Blick-ins-Zimmer-700x300.jpg";
import bacchusRoom    from "../../assets/Hotel-Villa-Elbling-Radebeul-Doppelzimmer-Bacchus-Blick-ins-Zimmer-1024x768.jpg";
import schloss        from "../../assets/Schloss-Wackerbarth_Belvedere-e1719987491646-1024x483.jpg";
import hosts          from "../../assets/Haus-Elbling-Gastgeber-Gundel-und-MAthias.jpg";
import logo           from "../../assets/cropped-Logo-Villa-Elbling-lang-1.png";
import slide2         from "../../assets/20241213_145919-scaled-700x300.jpg";
import slide3         from "../../assets/20250417_094429-scaled-700x300.jpg";
import slide4         from "../../assets/Schlafbereich-Weddingsuite-700x300.jpg";
import bookingAward   from "../../assets/Instagram-Stickers-White_RA-2026-300x94.png";
import traumwohnen    from "../../assets/bekanntaus_Traumwohnen-300x300.png";

// ─────────────────────────────────────────────
//  All image references used across the website
// ─────────────────────────────────────────────
export const IMAGES = {
  hero:         bacchusHero,
  room1:        bacchusRoom,
  schloss,
  hosts,
  logo,
  slide1:       bacchusHero,
  slide2,
  slide3,
  slide4,
  bookingAward,
  traumwohnen,
};

// ─────────────────────────────────────────────
//  Carousel slides data
// ─────────────────────────────────────────────
export const SLIDES = [
  { src: IMAGES.slide1, label: "Doppelzimmer „Bacchus“",     href: "#" },
  { src: IMAGES.slide2, label: "Suite „Riesling“",            href: "#" },
  { src: IMAGES.slide3, label: "Familiensuite „Burgunder“",  href: "#" },
  { src: IMAGES.slide4, label: "Hochzeitssuite „Gutedel“",   href: "#" },
];

// ─────────────────────────────────────────────
//  Navigation items
// ─────────────────────────────────────────────
export const NAV_ITEMS = [
  { label: "Willkommen", active: true },
  { label: "Zimmer ▾" },
  { label: "Radebeul ▾" },
  { label: "Anfahrt" },
  { label: "Buchen" },
];

// ─────────────────────────────────────────────
//  Guest selector options
// ─────────────────────────────────────────────
export const GUEST_OPTIONS = [
  "1 Erwachsener",
  "2 Erwachsene",
  "3 Erwachsene",
  "4 Erwachsene",
];
