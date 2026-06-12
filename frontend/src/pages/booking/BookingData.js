// ─────────────────────────────────────────────
//  ROOM PRESENTATION DATA (static)
//  Live pricing / occupancy / capacity / status now come from the API
//  (GET /api/rooms). This file only holds presentation bits the API
//  does not store: image, description, highlights — keyed by room number.
//
//  Source of truth for PRICES is now the database (Room_Features.xlsx → DB).
//  Do NOT hardcode prices here anymore.
// ─────────────────────────────────────────────
export const ROOM_PRESENTATION = {
  1: {
    id: "gutedel",
    image:
      "https://hotel-villa-elbling.de/wp-content/uploads/2024/10/Schlafbereich-Weddingsuite-1024x768.jpg",
    description:
      "42 m² Weddingsuite mit getrenntem Wohn- & Schlafbereich, Kamin und Tageslichtbad mit Wanne & Dusche.",
    highlights: [
      "Kamin inkl. Feuerholz",
      "Tageslichtbad mit Wanne & Dusche",
      "Getrennter Wohn- & Schlafbereich",
    ],
  },
  3: {
    id: "bacchus",
    image:
      "https://hotel-villa-elbling.de/wp-content/uploads/2024/09/Hotel-Villa-Elbling-Radebeul-Doppelzimmer-Bacchus-Blick-ins-Zimmer-1024x768.jpg",
    description:
      "26 m² Doppelzimmer im englischen Design mit hochwertiger Ausstattung und Tageslichtbad.",
    highlights: [
      "Tageslichtbad mit Wanne & Dusche",
      "Englisches Design",
      "Hochwertige Ausstattung",
    ],
  },
  4: {
    id: "riesling",
    image:
      "https://hotel-villa-elbling.de/wp-content/uploads/2024/12/Suite-Riesling-Radebeul-1024x685.jpg",
    description:
      "Großzügige Suite mit getrenntem Wohn- und Schlafbereich und Schlafsofa für bis zu 3 Personen.",
    highlights: [
      "Getrennter Wohn- & Schlafbereich",
      "Schlafsofa",
      "Bis zu 3 Personen",
    ],
  },
  5: {
    id: "scheurebe",
    image:
      "https://hotel-villa-elbling.de/wp-content/uploads/2024/12/Badezimmer-fuer-ihren-Wellnessurlaub-1024x810.jpg",
    description:
      "Doppelzimmer mit Gartenblick, privater Infrarotsauna und Blick auf die Weinberge.",
    highlights: [
      "Private Infrarotsauna",
      "Blick auf Weinberge",
      "Gartenausrichtung",
    ],
  },
  6: {
    id: "burgunder",
    image:
      "https://hotel-villa-elbling.de/wp-content/uploads/2025/05/Burgunder-Familiensuite.png",
    description:
      "Geräumige Familiensuite mit separatem Kinderschlafzimmer und Blick auf Schloss Wackerbarth.",
    highlights: [
      "Separates Kinderschlafzimmer",
      "Blick auf Schloss Wackerbarth",
      "Ideal für Familien",
    ],
  },
  7: {
    id: "rivaner",
    image:
      "https://hotel-villa-elbling.de/wp-content/uploads/2025/05/Bett-im-Einzelzimmer-Rivaner-1024x877.jpg",
    description:
      "Gemütliches Einzelzimmer im 2. OG mit Schreibtisch. Ideal für Allein- und Geschäftsreisende.",
    highlights: ["Schreibtisch", "2. Obergeschoss", "Ideal für Alleinreisende"],
  },
  8: {
    id: "regent",
    image:
      "https://hotel-villa-elbling.de/wp-content/uploads/2025/05/Schlafzimmer-Suite-Regent-1024x760.png",
    description:
      "Gemütliche Suite in kräftigen Lehmfarben mit herrlichem Blick auf die Radebeuler Weinberge.",
    highlights: [
      "Blick auf Weinberge",
      "Getrennter Wohn- & Schlafbereich",
      "Lehmfarben Design",
    ],
  },
};

// Type label fallback (API returns lowercase "suite"/"double"/"single")
const TYPE_LABEL = { suite: "Suite", double: "Double", single: "Single" };

// ─────────────────────────────────────────────
//  BREAKFAST
//  Breakfast = €13 per person per night, charged for standard occupancy.
//  (Confirmed by owner, June 2026.)
// ─────────────────────────────────────────────
export const BREAKFAST_PER_PERSON = 13;

// ─────────────────────────────────────────────
//  Merge a single API room with its static presentation data.
//  Produces the shape the booking UI expects (keeps roomNo, maxGuests, etc.)
// ─────────────────────────────────────────────
export function mergeRoom(apiRoom) {
  const pres = ROOM_PRESENTATION[apiRoom.roomNumber] || {};
  return {
    // identity
    id: pres.id || `room-${apiRoom.roomNumber}`,
    uuid: apiRoom.id,
    roomNo: apiRoom.roomNumber,
    name: apiRoom.name,
    type: TYPE_LABEL[apiRoom.type] || apiRoom.type,

    // pricing / occupancy (LIVE from API — source of truth)
    priceWithoutBreakfast: Number(apiRoom.priceWithoutBreakfast),
    breakfastPrice: Number(apiRoom.breakfastPrice),
    priceWithBreakfast: Number(apiRoom.priceWithBreakfast),
    standardOccupancy: apiRoom.standardOccupancy,
    maxGuests: apiRoom.maxGuests,
    occupancyNote: apiRoom.occupancyNote || "",
    extraBed: !!apiRoom.extraBedAllowed,
    status: apiRoom.status || "active",

    // presentation (static)
    image: pres.image || "",
    description: pres.description || apiRoom.description || "",
    highlights: pres.highlights || [],
  };
}

// Merge + sort a list of API rooms by room number.
export function mergeRooms(apiRooms) {
  return apiRooms.map(mergeRoom).sort((a, b) => a.roomNo - b.roomNo);
}

// ─────────────────────────────────────────────
//  PRICE HELPERS — operate on the merged room shape
//  Local calculation only; backend recalculates server-side on submission.
// ─────────────────────────────────────────────
export function getPriceForRoom(room, includeBreakfast) {
  return includeBreakfast
    ? room.priceWithBreakfast
    : room.priceWithoutBreakfast;
}

export function calcTotalPrice(room, nights, includeBreakfast) {
  return getPriceForRoom(room, includeBreakfast) * nights;
}
