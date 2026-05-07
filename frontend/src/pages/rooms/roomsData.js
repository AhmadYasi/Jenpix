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
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/10/Schlafbereich-Weddingsuite-1024x768.jpg',
        alt: 'Hochzeitssuite Gutedel Schlafbereich',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/10/Wohnbereich-mit-Kamin-Hochzeitssuite-1024x683.jpg',
        alt: 'Hochzeitssuite Wohnbereich mit Kamin',
      },
    ],
    galleryImages: [],
    teamImage:
      'https://hotel-villa-elbling.de/wp-content/uploads/2024/04/Gruesse-vom-Team-Villa-Elbling-lang.png',
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
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/09/Hotel-Villa-Elbling-Radebeul-Bacchus-Bild-vom-Bett-768x1024.jpg',
        alt: 'Doppelzimmer Bacchus Bett',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/09/Hotel-Villa-Elbling-Radebeul-Bacchus-Sitzecke-768x1024.jpg',
        alt: 'Doppelzimmer Bacchus Sitzecke',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/09/Hotel-Villa-Elbling-Radebeul-Badezimmer-Bacchus-mit-Wanne-768x1024.jpg',
        alt: 'Doppelzimmer Bacchus Badezimmer mit Wanne',
      },
    ],
    galleryImages: [
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/09/Hotel-Villa-Elbling-Radebeul-Schriftzug-Bacchus-1024x768.jpg',
        alt: 'Schriftzug Bacchus',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/09/Hotel-Villa-Elbling-Radebeul-Sitzecke-Doppelzimmer-Bacchus-quer-1024x768.jpg',
        alt: 'Sitzecke Doppelzimmer Bacchus',
      },
    ],
    teamImage:
      'https://hotel-villa-elbling.de/wp-content/uploads/2024/04/Gruesse-vom-Team-Villa-Elbling-lang.png',
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
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241213_145846-1024x577.jpg',
        alt: 'Schlafbereich Suite Riesling',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241213_145919-1024x577.jpg',
        alt: 'Wohn- und Schlafbereich Suite Riesling',
      },
    ],
    galleryImages: [
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241213_134314-1024x577.jpg',
        alt: 'Wohnbereich Suite Riesling',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241213_135406-1-1024x577.jpg',
        alt: 'Zimmerdetail Goldener Globus',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241213_134608-577x1024.jpg',
        alt: 'Tageslichtbad Suite Riesling',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241213_135337-577x1024.jpg',
        alt: 'Wohnbereich mit Schlafsofa',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241213_145851-2-577x1024.jpg',
        alt: 'Großes Doppelbett Suite Riesling',
      },
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
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241129_104444-1024x577.jpg',
        alt: 'Badezimmer Doppelzimmer Scheurebe',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241129_104618-1024x577.jpg',
        alt: 'Schlafbereich Doppelzimmer Scheurebe',
      },
    ],
    galleryImages: [
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241129_104513-577x1024.jpg',
        alt: 'Selbstgebauter Waschtisch Scheurebe',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241129_104545-1024x577.jpg',
        alt: 'Infrarotsauna Wellnessurlaub Radebeul',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2024/12/20241129_104633-577x1024.jpg',
        alt: 'Schrank Zimmer Scheurebe',
      },
    ],
    teamImage:
      'https://hotel-villa-elbling.de/wp-content/uploads/2024/04/Gruesse-vom-Team-Villa-Elbling-lang.png',
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
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250417_094304-1024x577.jpg',
        alt: 'Familiensuite Burgunder',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250417_094404-1024x577.jpg',
        alt: 'Familiensuite Burgunder Wohnbereich',
      },
    ],
    galleryImages: [
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250417_094347-4-577x1024.jpg',
        alt: 'Familiensuite Detail',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250417_094537-2-577x1024.jpg',
        alt: 'Kinderschlafzimmer Burgunder',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250417_094326-577x1024.jpg',
        alt: 'Familiensuite Burgunder',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250417_094457-5-1024x577.jpg',
        alt: 'Familiensuite Burgunder Übersicht',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250417_094738-4-1024x768.jpg',
        alt: 'Familiensuite Burgunder Bad',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250417_094615-1-1024x577.jpg',
        alt: 'Familiensuite Burgunder Schlafzimmer',
      },
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
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250513_110024-1024x577.jpg',
        alt: 'Einzelzimmer Rivaner',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250513_110520-1024x577.jpg',
        alt: 'Einzelzimmer Rivaner Übersicht',
      },
    ],
    galleryImages: [
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250513_110122-577x1024.jpg',
        alt: 'Einzelzimmer Rivaner Detail',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250513_110141-577x1024.jpg',
        alt: 'Einzelzimmer Rivaner Detail 2',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250513_110156-577x1024.jpg',
        alt: 'Einzelzimmer Rivaner Detail 3',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250513_110202-577x1024.jpg',
        alt: 'Einzelzimmer Rivaner Detail 4',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250513_110257-1-577x1024.jpg',
        alt: 'Einzelzimmer Rivaner Detail 5',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250513_110602-1-1024x577.jpg',
        alt: 'Einzelzimmer Rivaner Übersicht 2',
      },
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
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250424_125054-1024x577.jpg',
        alt: 'Suite Regent Wohnbereich',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250424_125252-1024x577.jpg',
        alt: 'Suite Regent Schlafzimmer',
      },
    ],
    galleryImages: [
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250424_125120-1.jpg',
        alt: 'Suite Regent Detail',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250424_125315.jpg',
        alt: 'Suite Regent Detail 2',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250424_125408-577x1024.jpg',
        alt: 'Suite Regent Detail 3',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250424_125235.jpg',
        alt: 'Suite Regent Detail 4',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250424_125230.jpg',
        alt: 'Suite Regent Detail 5',
      },
      {
        url: 'https://hotel-villa-elbling.de/wp-content/uploads/2025/05/20250424_125037-1024x577.jpg',
        alt: 'Suite Regent Übersicht',
      },
    ],
    teamImage: null,
  },
];

export default rooms;
