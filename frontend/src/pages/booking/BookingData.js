// ─────────────────────────────────────────────
//  Image imports (from local assets folder)
// ─────────────────────────────────────────────
import gutedelImg   from "../../assets/Schlafbereich-Weddingsuite-1024x768.jpg";
import bacchusImg   from "../../assets/Hotel-Villa-Elbling-Radebeul-Doppelzimmer-Bacchus-Blick-ins-Zimmer-1024x768.jpg";
import rieslingImg  from "../../assets/Suite-Riesling-Radebeul-1024x685.jpg";
import scheurebeImg from "../../assets/Badezimmer-fuer-ihren-Wellnessurlaub-1024x810.jpg";
import burgunderImg from "../../assets/Burgunder-Familiensuite.png";
import rivanerImg   from "../../assets/Bett-im-Einzelzimmer-Rivaner-1024x877.jpg";
import regentImg    from "../../assets/Schlafzimmer-Suite-Regent-1024x760.png";

// ─────────────────────────────────────────────
//  ROOMS DATA
// ─────────────────────────────────────────────
export const ROOMS = [
  {
    id: "gutedel",
    name: 'Hochzeitssuite „Gutedel“',
    basePrice: 160,
    image: gutedelImg,
    description: "42 m² Weddingsuite mit getrenntem Wohn- & Schlafbereich, Kamin und Tageslichtbad mit Wanne & Dusche.",
    highlights: ["Kamin inkl. Feuerholz", "Tageslichtbad mit Wanne & Dusche", "Getrennter Wohn- & Schlafbereich"],
    guests: 2,
  },
  {
    id: "bacchus",
    name: 'Doppelzimmer „Bacchus“',
    basePrice: 135,
    image: bacchusImg,
    description: "26 m² Doppelzimmer im englischen Design mit hochwertiger Ausstattung und Tageslichtbad.",
    highlights: ["Tageslichtbad mit Wanne & Dusche", "Englisches Design", "Hochwertige Ausstattung"],
    guests: 2,
  },
  {
    id: "riesling",
    name: 'Suite „Riesling“',
    basePrice: 160,
    image: rieslingImg,
    description: "Großzügige Suite mit getrenntem Wohn- und Schlafbereich und Schlafsofa für bis zu 3 Personen.",
    highlights: ["Getrennter Wohn- & Schlafbereich", "Schlafsofa", "Bis zu 3 Personen"],
    guests: 3,
  },
  {
    id: "scheurebe",
    name: 'Doppelzimmer „Scheurebe“',
    basePrice: 135,
    image: scheurebeImg,
    description: "Doppelzimmer mit Gartenblick, privater Infrarotsauna und Blick auf die Weinberge.",
    highlights: ["Private Infrarotsauna", "Blick auf Weinberge", "Gartenausrichtung"],
    guests: 2,
  },
  {
    id: "burgunder",
    name: 'Familiensuite „Burgunder“',
    basePrice: 160,
    image: burgunderImg,
    description: "Geräumige Familiensuite mit separatem Kinderschlafzimmer und Blick auf Schloss Wackerbarth.",
    highlights: ["Separates Kinderschlafzimmer", "Blick auf Schloss Wackerbarth", "Ideal für Familien"],
    guests: 4,
  },
  {
    id: "rivaner",
    name: 'Einzelzimmer „Rivaner“',
    basePrice: 89,
    image: rivanerImg,
    description: "Gemütliches Einzelzimmer im 2. OG mit Schreibtisch. Ideal für Allein- und Geschäftsreisende.",
    highlights: ["Schreibtisch", "2. Obergeschoss", "Ideal für Alleinreisende"],
    guests: 1,
  },
  {
    id: "regent",
    name: 'Suite „Regent“',
    basePrice: 160,
    image: regentImg,
    description: "Gemütliche Suite in kräftigen Lehmfarben mit herrlichem Blick auf die Radebeuler Weinberge.",
    highlights: ["Blick auf Weinberge", "Getrennter Wohn- & Schlafbereich", "Lehmfarben Design"],
    guests: 2,
  },
];

// ─────────────────────────────────────────────
//  PRICING LOGIC
//  Base price + weekend surcharge + seasonal
//  Replace with real backend data later
// ─────────────────────────────────────────────
export function getPriceForDate(room, date) {
  const d     = new Date(date);
  const month = d.getMonth(); // 0=Jan ... 11=Dec
  const dow   = d.getDay();   // 0=Sun, 6=Sat

  let price = room.basePrice;

  // Weekend surcharge (Fri=5, Sat=6)
  if (dow === 5 || dow === 6) price += 15;

  // High season: June-August
  if (month >= 5 && month <= 7) price += 20;

  // Low season: Nov-Feb
  if (month === 10 || month >= 11 || month <= 1) price -= 15;

  // Small stable daily variation +-5 (seeded by date so it never changes)
  const seed      = d.getDate() + month * 31 + room.basePrice;
  const variation = ((seed * 7) % 11) - 5;
  price += variation;

  return Math.max(price, 50); // floor at 50
}

// ─────────────────────────────────────────────
//  UNAVAILABLE DATES per room  (YYYY-MM-DD)
//  Placeholder data - replace with backend later
// ─────────────────────────────────────────────
const today = new Date();
const yr    = today.getFullYear();
const mo    = String(today.getMonth() + 1).padStart(2, "0");

export const UNAVAILABLE_DATES = {
  gutedel:   [yr + "-" + mo + "-10", yr + "-" + mo + "-11", yr + "-" + mo + "-12", yr + "-" + mo + "-20", yr + "-" + mo + "-21"],
  bacchus:   [yr + "-" + mo + "-05", yr + "-" + mo + "-06", yr + "-" + mo + "-15", yr + "-" + mo + "-16", yr + "-" + mo + "-17"],
  riesling:  [yr + "-" + mo + "-08", yr + "-" + mo + "-09", yr + "-" + mo + "-22", yr + "-" + mo + "-23"],
  scheurebe: [yr + "-" + mo + "-13", yr + "-" + mo + "-14", yr + "-" + mo + "-25", yr + "-" + mo + "-26"],
  burgunder: [yr + "-" + mo + "-03", yr + "-" + mo + "-04", yr + "-" + mo + "-18", yr + "-" + mo + "-19"],
  rivaner:   [yr + "-" + mo + "-07", yr + "-" + mo + "-27", yr + "-" + mo + "-28"],
  regent:    [yr + "-" + mo + "-01", yr + "-" + mo + "-02", yr + "-" + mo + "-24", yr + "-" + mo + "-29"],
};
