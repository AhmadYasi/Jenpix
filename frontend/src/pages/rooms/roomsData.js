// ─────────────────────────────────────────────
//  Image imports (from local assets folder)
// ─────────────────────────────────────────────

// Gutedel
import gutedelHero1   from "../../assets/Schlafbereich-Weddingsuite-1024x768.jpg";
import gutedelHero2   from "../../assets/Wohnbereich-mit-Kamin-Hochzeitssuite-1024x683.jpg";

// Bacchus
import bacchusHero1   from "../../assets/Hotel-Villa-Elbling-Radebeul-Bacchus-Bild-vom-Bett-768x1024.jpg";
import bacchusHero2   from "../../assets/Hotel-Villa-Elbling-Radebeul-Bacchus-Sitzecke-768x1024.jpg";
import bacchusHero3   from "../../assets/Hotel-Villa-Elbling-Radebeul-Badezimmer-Bacchus-mit-Wanne-768x1024.jpg";
import bacchusGal1    from "../../assets/Hotel-Villa-Elbling-Radebeul-Schriftzug-Bacchus-1024x768.jpg";
import bacchusGal2    from "../../assets/Hotel-Villa-Elbling-Radebeul-Sitzecke-Doppelzimmer-Bacchus-quer-1024x768.jpg";

// Riesling
import rieslingHero1  from "../../assets/20241213_145846-1024x577.jpg";
import rieslingHero2  from "../../assets/20241213_145919-1024x577.jpg";
import rieslingGal1   from "../../assets/20241213_134314-1024x577.jpg";
import rieslingGal2   from "../../assets/20241213_135406-1-1024x577.jpg";
import rieslingGal3   from "../../assets/20241213_134608-577x1024.jpg";
import rieslingGal4   from "../../assets/20241213_135337-577x1024.jpg";
import rieslingGal5   from "../../assets/20241213_145851-2-577x1024.jpg";

// Scheurebe
import scheurebeHero1 from "../../assets/20241129_104444-1024x577.jpg";
import scheurebeHero2 from "../../assets/20241129_104618-1024x577.jpg";
import scheurebeGal1  from "../../assets/20241129_104513-577x1024.jpg";
import scheurebeGal2  from "../../assets/20241129_104545-1024x577.jpg";
import scheurebeGal3  from "../../assets/20241129_104633-577x1024.jpg";

// Burgunder
import burgunderHero1 from "../../assets/20250417_094304-1024x577.jpg";
import burgunderHero2 from "../../assets/20250417_094404-1024x577.jpg";
import burgunderGal1  from "../../assets/20250417_094347-4-577x1024.jpg";
import burgunderGal2  from "../../assets/20250417_094537-2-577x1024.jpg";
import burgunderGal3  from "../../assets/20250417_094326-577x1024.jpg";
import burgunderGal4  from "../../assets/20250417_094457-5-1024x577.jpg";
import burgunderGal5  from "../../assets/20250417_094738-4-1024x768.jpg";
import burgunderGal6  from "../../assets/20250417_094615-1-1024x577.jpg";

// Rivaner
import rivanerHero1   from "../../assets/20250513_110024-1024x577.jpg";
import rivanerHero2   from "../../assets/20250513_110520-1024x577.jpg";
import rivanerGal1    from "../../assets/20250513_110122-577x1024.jpg";
import rivanerGal2    from "../../assets/20250513_110141-577x1024.jpg";
import rivanerGal3    from "../../assets/20250513_110156-577x1024.jpg";
import rivanerGal4    from "../../assets/20250513_110202-577x1024.jpg";
import rivanerGal5    from "../../assets/20250513_110257-1-577x1024.jpg";
import rivanerGal6    from "../../assets/20250513_110602-1-1024x577.jpg";

// Regent
import regentHero1    from "../../assets/20250424_125054-1024x577.jpg";
import regentHero2    from "../../assets/20250424_125252-1024x577.jpg";
import regentGal1     from "../../assets/20250424_125120-1.jpg";
import regentGal2     from "../../assets/20250424_125315.jpg";
import regentGal3     from "../../assets/20250424_125408-577x1024.jpg";
import regentGal4     from "../../assets/20250424_125235.jpg";
import regentGal5     from "../../assets/20250424_125230.jpg";
import regentGal6     from "../../assets/20250424_125037-1024x577.jpg";

// Shared
import teamImage      from "../../assets/Gruesse-vom-Team-Villa-Elbling-lang.png";

const rooms = [
  {
    id: 'hochzeitssuite-gutedel',
    name: 'Hochzeitssuite „Gutedel"',
    shortName: 'Hochzeitssuite',
    subtitle: 'Hochzeitssuite für zwei',
    price: '160€',
    priceLabel: '160€/Nacht inkl. Frühstück',
    size: '42 m²',
    highlights: [
      'Getrennter Wohn- und Schlafbereich',
      'Kamin inkl. Feuerholz',
      'Tageslichtbad mit Wanne & Dusche',
    ],
    description: [
      'Unsere 42 Quadratmeter große Weddingsuite ist auf die höchsten Ansprüche von Brautpaaren ausgerichtet und besticht durch ein großartiges Design, viel Platz, einem gemütlichen Wohnraum mit Kamin und vielen weiteren Annehmlichkeiten.',
    ],
    amenities: [
      'Getrennter Wohn- und Schlafbereich',
      'Gemütliches Doppelbett 180cm breit',
      'Kamin inkl. Feuerholz',
      'Tageslichtbad mit Wanne & Dusche',
      'Flatscreen TV',
      'Üppiges Frühstücksbuffet in unserem gemütlichen Frühstücksraum',
      'Kostenfreie Parkplätze direkt auf dem Grundstück',
      'Weitläufiger Garten zum gemütlichen Verweilen',
    ],
    priceDetails:
      'Die Übernachtung in der Hochzeitssuite „Gutedel" kostet 160€ pro Nacht. Enthalten sind das großzügige Frühstücksbuffet für zwei Personen sowie der Parkplatz auf dem Grundstück.',
    extraPricing: null,
    heroImages: [
      { url: gutedelHero1, alt: 'Hochzeitssuite Gutedel Schlafbereich' },
      { url: gutedelHero2, alt: 'Hochzeitssuite Wohnbereich mit Kamin' },
    ],
    galleryImages: [],
    teamImage: teamImage,
  },
  {
    id: 'doppelzimmer-bacchus',
    name: 'Doppelzimmer „Bacchus"',
    shortName: 'Doppelzimmer Bacchus',
    subtitle: null,
    price: '135€',
    priceLabel: '135€/Nacht inkl. Frühstück',
    size: '26 m²',
    highlights: ['Tageslichtbad mit Wanne & Dusche'],
    description: [
      'Unser 26 Quadratmeter großes Doppelzimmer Bacchus befindet sich im ersten Obergeschoss der Villa Elbling. Es besteht aus einem Vorzimmer mit Garderobe, einem modernen Tageslichtbad sowie einem gemütlichen Schlafraum.',
      'Das Schlafzimmer im englischen Stil ist mit ökologischen Lehmfarben und aufregender Tapete gestaltet. Die beruhigenden kräftigen Grüntöne, die im Doppelzimmer Bacchus sowohl an den Wänden als auch der Decke zum Einsatz kommen, bilden eine aufregende und zugleich harmonische Einheit mit der üppigen Designtapete. Der wunderschöne Eichenparkettboden aus nachhaltiger Forstwirtschaft rundet das Bild ab.',
      'Unsere modernen Schallschutzfenster verbannen die Geschäftigkeit der Meißner Straße nach draußen. Die Lage in direkter Nachbarschaft zum Erlebnisweingut Schloss Wackerbarth ist der perfekte Ausgangspunkt für Ihren Urlaub in Radebeul.',
    ],
    amenities: [
      'Gemütliches Doppelbett 180cm breit',
      'Außergewöhnlich gestaltetes Doppelzimmer',
      'Geräumiges modernes Tageslichtbad mit Wanne und Dusche',
      'Flatscreen TV',
      'Üppiges Frühstücksbuffet in unserem gemütlichen Frühstücksraum',
      'Kostenfreie Parkplätze direkt auf dem Grundstück',
      'Weitläufiger Garten zum gemütlichen Verweilen',
    ],
    priceDetails:
      'Die Übernachtung im Doppelzimmer „Bacchus" kostet 135€ pro Nacht. Enthalten sind das großzügige Frühstücksbuffet für zwei Personen sowie der Parkplatz auf dem Grundstück.',
    extraPricing: null,
    heroImages: [
      { url: bacchusHero1, alt: 'Doppelzimmer Bacchus Bett' },
      { url: bacchusHero2, alt: 'Doppelzimmer Bacchus Sitzecke' },
      { url: bacchusHero3, alt: 'Doppelzimmer Bacchus Badezimmer mit Wanne' },
    ],
    galleryImages: [
      { url: bacchusGal1, alt: 'Schriftzug Bacchus' },
      { url: bacchusGal2, alt: 'Sitzecke Doppelzimmer Bacchus' },
    ],
    teamImage: teamImage,
  },
  {
    id: 'suite-riesling',
    name: 'Suite „Riesling"',
    shortName: 'Suite Riesling',
    subtitle: 'Suite „Riesling" für maximal 3 Personen',
    price: '160€',
    priceLabel: '160€/Nacht inkl. Frühstück',
    size: '32 m²',
    highlights: ['Getrennter Wohn- und Schlafbereich', 'Schlafsofa'],
    description: [
      'Unsere 32 Quadratmeter große Suite Riesling bietet Ihnen einen außergewöhnlichen Rückzugsort, der durch sein innovatives Design und durchdachte Details besticht. Die großzügige Suite ist in zwei separate Bereiche unterteilt: ein großes Schlafzimmer und ein gemütlicher Wohnbereich.',
      'Der Wohnraum ist mit einem komfortablen Schlafsofa ausgestattet, das bei Bedarf eine zusätzliche Aufbettung ermöglicht und so den Aufenthalt für Familie oder Freunde noch angenehmer gestaltet. Das außergewöhnliche Design der Suite setzt auf helle Lehmfarben kombiniert mit aufregenden Tapeten, die eine harmonische, aber zugleich lebendige Atmosphäre schaffen.',
      'Unsere Suite vereint einen Hauch Luxus mit einzigartigem Design und schafft so den idealen Rahmen für einen unvergesslichen Aufenthalt in Radebeul.',
    ],
    amenities: [
      'Großes Doppelbett 180cm breit',
      'Gemütliches Wohnzimmer mit Möglichkeit zur Aufbettung',
      'Außergewöhnliches Gestaltungskonzept',
      'Modernes Tageslichtbad mit Dusche',
      'Flatscreen TV',
      'Üppiges Frühstücksbuffet in unserem gemütlichen Frühstücksraum',
      'Kostenfreie Parkplätze direkt auf dem Grundstück',
      'Weitläufiger Garten zum gemütlichen Verweilen',
    ],
    priceDetails:
      'Die Übernachtung in der Suite „Riesling" kostet 160€ pro Nacht für zwei Personen. Enthalten sind das großzügige Frühstücksbuffet für zwei Personen sowie der Parkplatz auf dem Grundstück. Für die Unterbringung einer 3. Person fallen pro Nacht folgende Kosten an:',
    extraPricing: [
      'Aufbettung Erwachsener (ab 18 Jahre) inkl. Frühstück 45€',
      'Aufbettung Kind (6 bis 18 Jahre) inkl. Frühstück 30€',
      'Aufbettung Kind (unter 6) 17€',
    ],
    heroImages: [
      { url: rieslingHero1, alt: 'Schlafbereich Suite Riesling' },
      { url: rieslingHero2, alt: 'Wohn- und Schlafbereich Suite Riesling' },
    ],
    galleryImages: [
      { url: rieslingGal1, alt: 'Wohnbereich Suite Riesling' },
      { url: rieslingGal2, alt: 'Zimmerdetail Goldener Globus' },
      { url: rieslingGal3, alt: 'Tageslichtbad Suite Riesling' },
      { url: rieslingGal4, alt: 'Wohnbereich mit Schlafsofa' },
      { url: rieslingGal5, alt: 'Großes Doppelbett Suite Riesling' },
    ],
    teamImage: null,
  },
  {
    id: 'doppelzimmer-scheurebe',
    name: 'Doppelzimmer „Scheurebe"',
    shortName: 'Doppelzimmer Scheurebe',
    subtitle: 'Doppelzimmer „Scheurebe" mit Sauna',
    price: '135€',
    priceLabel: '135€/Nacht inkl. Frühstück',
    size: '22 m²',
    highlights: ['Private Infrarotsauna', 'Schlafzimmer mit Blick auf Weinberge'],
    description: [
      'Dieses 22 Quadratmeter große Doppelzimmer liegt im ersten Obergeschoss der Villa Elbling zur Gartenseite und besticht durch seine grandiose Aussicht auf die Radebeuler Weinberge.',
      'Schon beim Betreten des Doppelzimmers Scheurebe sticht dem Besucher die außergewöhnliche Designtapete mit floralem Muster ins Auge. Auch der Rest des Zimmers ist mit hochwertigen Materialien und ökologischer Lehmfarbe gestaltet. Der wunderschöne Eichenparkettboden aus nachhaltiger Forstwirtschaft rundet das Bild ab.',
      'Besonderes Highlight dieses Zimmers ist die private Infrarotsauna. Diese befindet sich im großzügigen modernen Badezimmer und steht Ihnen ganz exklusiv zur Verfügung. Genießen Sie die wohlige und therapeutische Wärme in der Infrarotsauna nach einem langen Urlaubstag in Radebeul!',
    ],
    amenities: [
      'Gemütliches Doppelbett 180cm breit',
      'Außergewöhnlich gestaltetes Doppelzimmer',
      'Geräumiges modernes Tageslichtbad mit Dusche und Infrarotsauna',
      'Flatscreen TV',
      'Üppiges Frühstücksbuffet in unserem gemütlichen Frühstücksraum',
      'Kostenfreie Parkplätze direkt auf dem Grundstück',
      'Weitläufiger Garten zum gemütlichen Verweilen',
    ],
    priceDetails:
      'Die Übernachtung im Doppelzimmer „Scheurebe" kostet 135€ pro Nacht. Enthalten sind das großzügige Frühstücksbuffet für zwei Personen, der Parkplatz auf dem Grundstück sowie die private Nutzung der Infrarotsauna.',
    extraPricing: null,
    heroImages: [
      { url: scheurebeHero1, alt: 'Badezimmer Doppelzimmer Scheurebe' },
      { url: scheurebeHero2, alt: 'Schlafbereich Doppelzimmer Scheurebe' },
    ],
    galleryImages: [
      { url: scheurebeGal1, alt: 'Selbstgebauter Waschtisch Scheurebe' },
      { url: scheurebeGal2, alt: 'Infrarotsauna Wellnessurlaub Radebeul' },
      { url: scheurebeGal3, alt: 'Schrank Zimmer Scheurebe' },
    ],
    teamImage: teamImage,
  },
  {
    id: 'familiensuite-burgunder',
    name: 'Familiensuite „Burgunder"',
    shortName: 'Familiensuite Burgunder',
    subtitle: 'Familienzimmer für bis zu 4 Personen',
    price: '160€',
    priceLabel: '160€/Nacht inkl. Frühstück',
    size: null,
    highlights: [
      'Separates Kinderschlafzimmer für bis zu 2 Kinder',
      'Blick auf Schloss Wackerbarth',
    ],
    description: [
      'Unsere im 2. Obergeschoss gelegene Familiensuite ist perfekt auf die Bedürfnisse von Familien zugeschnitten. Die Suite verfügt über ein gemütliches Elternschlafzimmer mit Sitzecke für bis zu vier Personen und ein zusätzliches separates Kinderschlafzimmer.',
      'Das gemütliche Kinderschlafzimmer ist ausgestattet mit einem 90×200 großen Bett, welches optional für ein zweites Kind ausgezogen und erweitert werden kann. Das Nachtlicht mit Timerfunktion, die kindergesicherten Steckdosen sowie eine Kiste mit Bausteinen machen das kleine Schlafzimmer zu einem sicheren und gemütlichen Ort für Ihre Kids.',
      'Beide Schlafzimmer sowie das helle Tageslichtbad bieten einen herrlichen Blick über den Garten und auf Schloss Wackerbarth.',
      'Gestaltet mit außergewöhnlichen Tapeten, ökologischen Lehmfarben und einem hochwertigen Echtholzparkett aus nachhaltigem Anbau ist die Familiensuite ein absoluter Wohlfühlort für Ihren Familienurlaub in Radebeul.',
    ],
    amenities: [
      'Gemütliches 180cm Bett im Elternschlafzimmer',
      'Sitzecke für die ganze Familie',
      'Flatscreen TV',
      'Eigenes Kinderschlafzimmer mit bis zu 2 Betten 90x200cm',
      'Ruhige Lage und Blick über den Garten',
      'Helles Tageslichtbad',
      'Außergewöhnliches Design',
      'Üppiges Frühstücksbuffet in unserem gemütlichen Frühstücksraum',
      'Kostenfreie Parkplätze direkt auf dem Grundstück',
      'Weitläufiger Garten zum gemütlichen Verweilen',
    ],
    priceDetails:
      'Die Übernachtung in unserer Familienzimmers „Burgunder" kostet 160€ pro Nacht. Enthalten sind das großzügige Frühstücksbuffet für zwei Erwachsene und ein Kind sowie der Parkplatz auf dem Grundstück.',
    extraPricing: [
      'Unterbringung eines zweiten Kindes inkl. Frühstück 30€ pro Tag',
      'Kinder unter 6 Jahren 17€',
    ],
    heroImages: [
      { url: burgunderHero1, alt: 'Familiensuite Burgunder' },
      { url: burgunderHero2, alt: 'Familiensuite Burgunder Wohnbereich' },
    ],
    galleryImages: [
      { url: burgunderGal1, alt: 'Familiensuite Detail' },
      { url: burgunderGal2, alt: 'Kinderschlafzimmer Burgunder' },
      { url: burgunderGal3, alt: 'Familiensuite Burgunder' },
      { url: burgunderGal4, alt: 'Familiensuite Burgunder Übersicht' },
      { url: burgunderGal5, alt: 'Familiensuite Burgunder Bad' },
      { url: burgunderGal6, alt: 'Familiensuite Burgunder Schlafzimmer' },
    ],
    teamImage: null,
  },
  {
    id: 'einzelzimmer-rivaner',
    name: 'Einzelzimmer „Rivaner"',
    shortName: 'Einzelzimmer Rivaner',
    subtitle: null,
    price: '89€',
    priceLabel: '89€/Nacht inkl. Frühstück',
    size: '17 m²',
    highlights: ['Gemütliches Einzelzimmer mit Schreibtisch'],
    description: [
      'Das im 2. Obergeschoss liegende Einzelzimmer bietet mit 17 Quadratmetern ausreichend Platz für Ihren Urlaub in Radebeul. Das lichtdurchflutete Zimmer ist mit ökologischen Lehmfarben in aufregenden Farbtönen gestaltet und wird von einer floralen Tapete und dem Echtholzparkett aus nachhaltiger Forstwirtschaft wundervoll ergänzt.',
    ],
    amenities: [
      'Gemütliches Einzelbett 90×200',
      'Flatscreen TV',
      'Außergewöhnlich gestaltetes Hotelzimmer',
      'Neu gebautes Badezimmer mit großer Dusche',
      'Üppiges Frühstücksbuffet in unserem gemütlichen Frühstücksraum',
      'Kostenfreie Parkplätze direkt auf dem Grundstück',
      'Weitläufiger Garten zum gemütlichen Verweilen',
    ],
    priceDetails:
      'Die Übernachtung in unserem Einzelzimmer Rivaner kostet 89€ pro Nacht. Enthalten ist unser leckeres hausgemachtes Frühstück für eine Person.',
    extraPricing: null,
    heroImages: [
      { url: rivanerHero1, alt: 'Einzelzimmer Rivaner' },
      { url: rivanerHero2, alt: 'Einzelzimmer Rivaner Übersicht' },
    ],
    galleryImages: [
      { url: rivanerGal1, alt: 'Einzelzimmer Rivaner Detail' },
      { url: rivanerGal2, alt: 'Einzelzimmer Rivaner Detail 2' },
      { url: rivanerGal3, alt: 'Einzelzimmer Rivaner Detail 3' },
      { url: rivanerGal4, alt: 'Einzelzimmer Rivaner Detail 4' },
      { url: rivanerGal5, alt: 'Einzelzimmer Rivaner Detail 5' },
      { url: rivanerGal6, alt: 'Einzelzimmer Rivaner Übersicht 2' },
    ],
    teamImage: null,
  },
  {
    id: 'suite-regent',
    name: 'Suite „Regent"',
    shortName: 'Suite Regent',
    subtitle: 'Großzügige Suite mit Blick auf die Weinberge',
    price: '160€',
    priceLabel: '160€/Nacht inkl. Frühstück',
    size: null,
    highlights: ['Getrennter Wohn- und Schlafbereich', 'Blick auf die Weinberge'],
    description: [
      'Die außergewöhnlich gestaltete Suite Regent im 2. Obergeschoss vereint Gemütlichkeit, Komfort und Geräumigkeit. Die Suite mit großem Wohnzimmer und separatem Schlafzimmer ist mit kräftigen ökologischen Lehmfarben gestaltet, die durch die opulenten Tapeten und den Echtholzfußboden aus nachhaltiger Forstwirtschaft perfekt ergänzt werden.',
      'Im geräumigen Wohnzimmer finden Sie eine gemütliche Sitzecke mit Schlafsofa und Flatscreen-TV sowie eine historische Schminkanrichte. Auf dem goldenen Servierwagen stehen Ihnen ausgewählte Weine für einen gemütlichen Abend zur Verfügung. Das helle Tageslichtbad mit großem Doppelwaschtisch bietet viel Platz und Komfort.',
      'Im angrenzenden Schlafzimmer haben Sie einen fantastischen Blick auf die Radebeuler Weinberge sowie den Jakobstein.',
    ],
    amenities: [
      'Großes Doppelbett 280cm breit',
      'Ruhig gelegenes Schlafzimmer mit fantastischer Aussicht',
      'Außergewöhnliche Gestaltung',
      'Gemütliche Sitzecke mit Schlafsofa',
      'Flatscreen-TV',
      'Highspeed Internet',
      'Tageslichtbad mit Doppelwaschtisch',
      'Üppiges Frühstücksbuffet in unserem gemütlichen Frühstücksraum',
      'Kostenfreie Parkplätze direkt auf dem Grundstück',
      'Weitläufiger Garten zum gemütlichen Verweilen',
    ],
    priceDetails:
      'Die Übernachtung in der Suite „Regent" kostet 160€ pro Nacht. Enthalten sind das großzügige Frühstücksbuffet für zwei Personen sowie der Parkplatz auf dem Grundstück. Für die Unterbringung eines 3. Gastes fallen pro Nacht folgende Kosten an:',
    extraPricing: [
      'Aufbettung Erwachsener (ab 18 Jahre) inkl. Frühstück 45€',
      'Aufbettung Kind (6 bis 18 Jahre) inkl. Frühstück 30€',
      'Aufbettung Kind (unter 6) 17€',
    ],
    heroImages: [
      { url: regentHero1, alt: 'Suite Regent Wohnbereich' },
      { url: regentHero2, alt: 'Suite Regent Schlafzimmer' },
    ],
    galleryImages: [
      { url: regentGal1, alt: 'Suite Regent Detail' },
      { url: regentGal2, alt: 'Suite Regent Detail 2' },
      { url: regentGal3, alt: 'Suite Regent Detail 3' },
      { url: regentGal4, alt: 'Suite Regent Detail 4' },
      { url: regentGal5, alt: 'Suite Regent Detail 5' },
      { url: regentGal6, alt: 'Suite Regent Übersicht' },
    ],
    teamImage: null,
  },
];

export default rooms;
