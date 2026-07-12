export const DATA_LAST_UPDATED = "Julio 2026";
export const DATA_SOURCES = "Tablas oficiales de Iberia Plus, British Airways Executive Club, Flying Blue, Aeroplan, Asia Miles, Virgin Flying Club y ANA Mileage Club.";

export type Cabin = "economy" | "business" | "first";
export type Alliance = "oneworld" | "star_alliance" | "skyteam" | "independent";

export interface EarnMethod {
  category: "shopping" | "hotel" | "car" | "dining" | "credit_card" | "partner" | "promo";
  label: string;
  detail: string;
  url?: string;
  pointsPer?: string; // e.g. "3 pts/€"
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  airline: string;
  alliance: Alliance;
  logo: string;
  color: string;
  canBuyPoints: boolean;
  buyPointsUrl?: string;
  typicalBonusPercent: number;
  cppValue: number;
  bestFor: string[];
  partnerAirlines: string[];
  cabinsAvailable: Cabin[];
  searchUrl: string;
  difficulty: "easy" | "medium" | "hard";
  rating: number;
  notes: string;
  minRedemption: { route: string; points: number; cabin: Cabin; cashValue: number }[];
  earnMethods: EarnMethod[];
}

export const PROGRAMS: LoyaltyProgram[] = [
  {
    id: "avios",
    name: "Avios",
    airline: "British Airways / Iberia / Vueling",
    alliance: "oneworld",
    logo: "✈️",
    color: "#0047AB",
    canBuyPoints: true,
    buyPointsUrl: "https://www.ba.com/points/buy",
    typicalBonusPercent: 100,
    cppValue: 1.8,
    bestFor: ["Europa a Asia", "Europa a América", "Cathay Pacific First", "Qatar Airways Business"],
    partnerAirlines: ["Cathay Pacific", "Qatar Airways", "American Airlines", "Finnair", "Japan Airlines", "SriLankan"],
    cabinsAvailable: ["economy", "business", "first"],
    searchUrl: "https://www.britishairways.com/en-gb/flights/avios-and-more",
    difficulty: "medium",
    rating: 4.5,
    notes: "Sin fuel surcharges en socios. Mejor valor en rutas largas. Iberia Avios tiene precios distintos. Comprar en promociones del 30-100%.",
    minRedemption: [
      { route: "MAD-NYC", points: 34000, cabin: "business", cashValue: 3200 },
      { route: "LHR-HKG", points: 50000, cabin: "business", cashValue: 4500 },
      { route: "LHR-NRT", points: 67500, cabin: "first", cashValue: 8000 },
    ],
    earnMethods: [
      { category: "shopping", label: "BA Shopping (Reino Unido)", detail: "Tienda online con +500 marcas. H&M, Nike, ASOS, Apple…", url: "https://www.avios.com/gb/en_gb/earn/shopping", pointsPer: "3–10 Avios/£" },
      { category: "shopping", label: "Iberia Plus Tienda", detail: "Compras online en El Corte Inglés, Booking, Amazon y más.", url: "https://tienda.iberia.com", pointsPer: "2–6 Avios/€" },
      { category: "hotel", label: "Hoteles con Avios", detail: "Reserva en Hotels.com, IHG, Marriott o directamente en ba.com/hotels.", url: "https://www.ba.com/hotels", pointsPer: "1–3 Avios/€" },
      { category: "car", label: "Alquiler de coches", detail: "Hertz, Avis, Enterprise con Avios por reserva.", url: "https://www.ba.com/cars", pointsPer: "500–1.500 Avios/reserva" },
      { category: "dining", label: "BA Dining (UK)", detail: "Restaurantes participantes en Reino Unido con la tarjeta registrada.", url: "https://www.avios.com/gb/en_gb/earn/dining", pointsPer: "3–6 Avios/£" },
      { category: "credit_card", label: "Tarjeta American Express BA", detail: "La mejor forma de acumular Avios sin volar. Bienvenida de hasta 30.000 Avios.", url: "https://www.americanexpress.com/es/tarjetas/british-airways/", pointsPer: "1–1.5 Avios/€" },
      { category: "partner", label: "Booking.com", detail: "Reserva hoteles en Booking y acumula Avios si enlazas tu cuenta.", url: "https://www.booking.com", pointsPer: "1 Avios/€ aprox." },
      { category: "promo", label: "Comprar con bonus", detail: "Avios publica promos de 30–100% bonus 4–6 veces al año. Espera a que salga.", url: "https://www.iberia.com/es/iberia-plus/compra-avios/", pointsPer: "+30–100% bonus" },
    ],
  },
  {
    id: "flyingblue",
    name: "Flying Blue",
    airline: "Air France / KLM",
    alliance: "skyteam",
    logo: "💙",
    color: "#003F8A",
    canBuyPoints: true,
    buyPointsUrl: "https://www.flyingblue.com/fr/earn/buy-miles",
    typicalBonusPercent: 50,
    cppValue: 1.5,
    bestFor: ["Europa a África", "Europa a Caribe", "Europa a América del Sur", "Promo Awards 25-50% descuento"],
    partnerAirlines: ["Air France", "KLM", "Kenya Airways", "China Southern", "Delta (limitado)"],
    cabinsAvailable: ["economy", "business", "first"],
    searchUrl: "https://www.flyingblue.com",
    difficulty: "easy",
    rating: 4.0,
    notes: "Promo Awards mensuales con 25-50% descuento. Ideal para rutas AF/KL. Puntos se compran con bonus frecuentes.",
    minRedemption: [
      { route: "AMS-JFK", points: 50000, cabin: "business", cashValue: 3800 },
      { route: "CDG-NRT", points: 75000, cabin: "business", cashValue: 5500 },
      { route: "BCN-GRU", points: 62500, cabin: "business", cashValue: 4200 },
    ],
    earnMethods: [
      { category: "shopping", label: "Flying Blue Shopping", detail: "Portal de compras online con +200 marcas europeas. Zalando, Apple, FNAC…", url: "https://www.flyingblue.com/es/earn/shopping", pointsPer: "2–8 Miles/€" },
      { category: "hotel", label: "Hoteles con Flying Blue", detail: "Reserva en Booking.com, Accor, Marriott y gana Miles.", url: "https://www.flyingblue.com/es/earn/hotels", pointsPer: "1–4 Miles/€" },
      { category: "car", label: "Alquiler de coches", detail: "Europcar, Hertz, Sixt con Flying Blue.", url: "https://www.flyingblue.com/es/earn/cars", pointsPer: "300–800 Miles/reserva" },
      { category: "dining", label: "Flying Blue Dining (FR)", detail: "Restaurantes en Francia y Países Bajos con tarjeta registrada.", url: "https://dining.flyingblue.com", pointsPer: "3 Miles/€" },
      { category: "credit_card", label: "Tarjeta Amex Air France", detail: "Acumula Miles en cada compra. Bonus de bienvenida frecuente.", url: "https://www.airfranceklm.com/es/tarjeta", pointsPer: "1–1.5 Miles/€" },
      { category: "partner", label: "Booking.com", detail: "Vincula tu cuenta Flying Blue y gana Miles en reservas.", url: "https://www.booking.com", pointsPer: "1 Mile/€ aprox." },
      { category: "promo", label: "Promo Awards mensuales", detail: "El primer martes de cada mes salen awards con 25–50% descuento. Acumula para ese día.", pointsPer: "−25–50% en canje" },
    ],
  },
  {
    id: "aeroplan",
    name: "Aeroplan",
    airline: "Air Canada",
    alliance: "star_alliance",
    logo: "🍁",
    color: "#D62B27",
    canBuyPoints: true,
    buyPointsUrl: "https://www.aircanada.com/ca/en/aco/home/aeroplan/points/buy.html",
    typicalBonusPercent: 100,
    cppValue: 1.6,
    bestFor: ["Lufthansa First Class", "Swiss Business", "ANA Business/First", "Singapore Airlines"],
    partnerAirlines: ["Lufthansa", "Swiss", "ANA", "Singapore Airlines", "TAP", "Turkish Airlines", "Ethiopian"],
    cabinsAvailable: ["economy", "business", "first"],
    searchUrl: "https://www.aircanada.com/aeroplan",
    difficulty: "medium",
    rating: 4.8,
    notes: "Acceso a todo Star Alliance incluyendo Lufthansa First. Stopover gratis. Sin fuel surcharges en muchos socios. El mejor programa para Star Alliance.",
    minRedemption: [
      { route: "MAD-FRA-NRT (LH+ANA)", points: 85000, cabin: "business", cashValue: 7000 },
      { route: "MUC-ORD (LH)", points: 55000, cabin: "business", cashValue: 4500 },
      { route: "FRA-NRT (LH First)", points: 87500, cabin: "first", cashValue: 12000 },
    ],
    earnMethods: [
      { category: "shopping", label: "Aeroplan eStore", detail: "Portal de compras con +150 tiendas. Amazon CA, Apple, Nike, Best Buy…", url: "https://www.aircanada.com/ca/en/aco/home/aeroplan/earn/partners/shopping.html", pointsPer: "2–10 pts/CAD" },
      { category: "hotel", label: "Hoteles Aeroplan", detail: "Marriott, Hilton, Accor, IHG y Booking.com vinculado.", url: "https://www.aircanada.com/ca/en/aco/home/aeroplan/earn/partners/hotels.html", pointsPer: "1–5 pts/€" },
      { category: "car", label: "Alquiler de coches", detail: "Avis, Budget, Hertz con Aeroplan en reservas.", url: "https://www.aircanada.com/ca/en/aco/home/aeroplan/earn/partners/cars.html", pointsPer: "500–2.000 pts/reserva" },
      { category: "credit_card", label: "TD / RBC / Amex Canada", detail: "Las mejores tarjetas para acumular Aeroplan fuera de Canadá: Amex MR → Aeroplan 1:1.", pointsPer: "1–2 pts/€" },
      { category: "partner", label: "Booking.com", detail: "Aeroplan es partner de Booking para hoteles en Europa.", url: "https://www.booking.com", pointsPer: "1 pt/€ aprox." },
      { category: "partner", label: "Amazon.ca", detail: "Compras en Amazon Canada acumulan Aeroplan via eStore.", url: "https://www.aircanada.com/ca/en/aco/home/aeroplan/earn/partners/shopping.html", pointsPer: "2 pts/CAD" },
      { category: "promo", label: "Comprar con bonus", detail: "Aeroplan ofrece promos de hasta 100% bonus varias veces al año.", url: "https://www.aircanada.com/ca/en/aco/home/aeroplan/points/buy.html", pointsPer: "+50–100% bonus" },
    ],
  },
  {
    id: "milesandmore",
    name: "Miles & More",
    airline: "Lufthansa Group",
    alliance: "star_alliance",
    logo: "🦅",
    color: "#05164D",
    canBuyPoints: false,
    typicalBonusPercent: 25,
    cppValue: 2.2,
    bestFor: ["Lufthansa First Class", "Swiss First", "Austrian Business", "SWISS Business"],
    partnerAirlines: ["Lufthansa", "Swiss", "Austrian", "Brussels Airlines", "Eurowings"],
    cabinsAvailable: ["economy", "business", "first"],
    searchUrl: "https://www.miles-and-more.com",
    difficulty: "hard",
    rating: 3.5,
    notes: "NO se pueden comprar millas fácilmente. Difícil acumular sin volar LH. Pero el mejor valor para Lufthansa First Class (el producto más exclusivo del mundo).",
    minRedemption: [
      { route: "FRA-JFK (LH First)", points: 87000, cabin: "first", cashValue: 15000 },
      { route: "MUC-NRT (LH Business)", points: 66000, cabin: "business", cashValue: 6000 },
    ],
    earnMethods: [
      { category: "credit_card", label: "Tarjeta Miles & More (DE)", detail: "La única forma práctica de acumular sin volar Lufthansa. Visa y Mastercard disponibles.", url: "https://www.miles-and-more.com/de/en/earn/credit-card.html", pointsPer: "1–1.5 Miles/€" },
      { category: "hotel", label: "Hoteles con M&M", detail: "Marriott Bonvoy → M&M transferencia. También IHG y Accor.", url: "https://www.miles-and-more.com/de/en/earn/hotels.html", pointsPer: "1–3 Miles/€" },
      { category: "car", label: "Alquiler de coches", detail: "Hertz, Europcar, Sixt con Miles & More.", url: "https://www.miles-and-more.com/de/en/earn/car-rental.html", pointsPer: "300–1.500 Miles/reserva" },
      { category: "shopping", label: "M&M WorldShop", detail: "Tienda online oficial con productos y partners Lufthansa Group.", url: "https://www.miles-and-more-worldshop.com", pointsPer: "2–5 Miles/€" },
      { category: "partner", label: "Booking.com", detail: "Partner oficial para hoteles. Acumula M&M en reservas.", url: "https://www.booking.com", pointsPer: "1 Mile/€ aprox." },
    ],
  },
  {
    id: "asiamiles",
    name: "Asia Miles",
    airline: "Cathay Pacific",
    alliance: "oneworld",
    logo: "🐉",
    color: "#006564",
    canBuyPoints: true,
    buyPointsUrl: "https://www.cathaypacific.com/cx/en_ES/cathay/asia-miles/buy-miles.html",
    typicalBonusPercent: 50,
    cppValue: 1.7,
    bestFor: ["Cathay Pacific Business/First", "Japan Airlines Business", "Finnair Business"],
    partnerAirlines: ["Cathay Pacific", "Japan Airlines", "Finnair", "British Airways", "American Airlines"],
    cabinsAvailable: ["economy", "business", "first"],
    searchUrl: "https://www.asiamiles.com",
    difficulty: "medium",
    rating: 4.2,
    notes: "Excelente para Cathay Pacific First (uno de los mejores productos del mundo). Comprar en promociones frecuentes.",
    minRedemption: [
      { route: "MAD-HKG (CX)", points: 60000, cabin: "business", cashValue: 5500 },
      { route: "LHR-HKG (CX First)", points: 100000, cabin: "first", cashValue: 10000 },
    ],
    earnMethods: [
      { category: "shopping", label: "Asia Miles Shop", detail: "Portal de compras online con marcas asiáticas y globales.", url: "https://www.asiamiles.com/en/earn/shopping.html", pointsPer: "2–8 Miles/HKD" },
      { category: "hotel", label: "Hoteles con Asia Miles", detail: "IHG, Marriott, Hilton y Booking.com como partner.", url: "https://www.asiamiles.com/en/earn/hotels.html", pointsPer: "1–4 Miles/€" },
      { category: "car", label: "Alquiler de coches", detail: "Avis, Budget, Hertz con Asia Miles.", url: "https://www.asiamiles.com/en/earn/cars.html", pointsPer: "400–1.000 Miles/reserva" },
      { category: "dining", label: "Asia Miles Dining", detail: "Restaurantes participantes en Hong Kong y Asia con tarjeta vinculada.", url: "https://dining.asiamiles.com", pointsPer: "3–5 Miles/HKD" },
      { category: "partner", label: "Booking.com", detail: "Partner oficial. Reserva hoteles y acumula Asia Miles.", url: "https://www.booking.com", pointsPer: "1 Mile/€ aprox." },
      { category: "promo", label: "Comprar con bonus", detail: "Asia Miles hace promos de 30–50% bonus con cierta frecuencia.", url: "https://www.cathaypacific.com/cx/en_ES/cathay/asia-miles/buy-miles.html", pointsPer: "+30–50% bonus" },
    ],
  },
  {
    id: "virginatlantic",
    name: "Flying Club",
    airline: "Virgin Atlantic",
    alliance: "independent",
    logo: "💃",
    color: "#E10A2C",
    canBuyPoints: true,
    buyPointsUrl: "https://www.virginatlantic.com/miles/buy-miles",
    typicalBonusPercent: 100,
    cppValue: 1.9,
    bestFor: ["Delta One Business (imposible con puntos Delta)", "ANA First Class", "Air France Business"],
    partnerAirlines: ["Delta", "ANA", "Air France", "KLM", "Singapore Airlines"],
    cabinsAvailable: ["economy", "business", "first"],
    searchUrl: "https://www.virginatlantic.com/flying-club",
    difficulty: "medium",
    rating: 4.6,
    notes: "EL SECRETO MEJOR GUARDADO: único programa para canjear Delta One Business con puntos. Delta no permite canjear sus propios puntos en Business fácilmente.",
    minRedemption: [
      { route: "JFK-LHR (DL One)", points: 50000, cabin: "business", cashValue: 4500 },
      { route: "NRT-LAX (ANA First)", points: 95000, cabin: "first", cashValue: 13000 },
    ],
    earnMethods: [
      { category: "shopping", label: "Virgin Red Rewards", detail: "Plataforma de rewards de Virgin Group. Compras, juegos, experiencias.", url: "https://www.virgin.com/virgin-red", pointsPer: "2–10 Miles/£" },
      { category: "hotel", label: "Hoteles con Flying Club", detail: "Marriott Bonvoy → Virgin Miles transferencia 3:1. También IHG.", url: "https://www.virginatlantic.com/flying-club/earn-miles/hotels", pointsPer: "1–3 Miles/£" },
      { category: "car", label: "Alquiler de coches", detail: "Hertz y Enterprise con Virgin Flying Club.", url: "https://www.virginatlantic.com/flying-club/earn-miles/car-hire", pointsPer: "500–1.500 Miles/reserva" },
      { category: "credit_card", label: "Tarjeta Virgin Atlantic (UK)", detail: "Mastercard Virgin con bonus de bienvenida y acumulación diaria.", url: "https://uk.virginmoney.com/credit-cards/virgin-atlantic/", pointsPer: "1–1.5 Miles/£" },
      { category: "partner", label: "Booking.com", detail: "Partner de hoteles. Acumula Flying Club Miles en reservas.", url: "https://www.booking.com", pointsPer: "1 Mile/£ aprox." },
      { category: "promo", label: "Comprar con bonus", detail: "Virgin hace promos frecuentes de hasta 100% bonus. Sigue su newsletter.", url: "https://www.virginatlantic.com/miles/buy-miles", pointsPer: "+30–100% bonus" },
    ],
  },
  {
    id: "anamiles",
    name: "ANA Mileage Club",
    airline: "ANA All Nippon Airways",
    alliance: "star_alliance",
    logo: "🗾",
    color: "#003087",
    canBuyPoints: false,
    typicalBonusPercent: 0,
    cppValue: 2.8,
    bestFor: ["ANA First Class", "Lufthansa Business", "United Polaris Business"],
    partnerAirlines: ["ANA", "Lufthansa", "Swiss", "United", "Air Canada"],
    cabinsAvailable: ["economy", "business", "first"],
    searchUrl: "https://www.ana.co.jp/en/us/amc/",
    difficulty: "hard",
    rating: 4.7,
    notes: "Mejor valor CPP de todos. No se compran directamente — se transfieren desde Amex Membership Rewards o Chase Ultimate Rewards. ANA First Class es el producto #1 del mundo.",
    minRedemption: [
      { route: "JFK-NRT (ANA First)", points: 55000, cabin: "first", cashValue: 14000 },
      { route: "FRA-NRT (ANA Business)", points: 75000, cabin: "business", cashValue: 7000 },
    ],
    earnMethods: [
      { category: "credit_card", label: "Amex Membership Rewards → ANA", detail: "La vía principal: Amex MR se transfiere a ANA 1:1. La mejor transferencia del mercado.", url: "https://www.americanexpress.com/es/recompensas/membership-rewards/", pointsPer: "1:1 transfer" },
      { category: "credit_card", label: "Chase Ultimate Rewards → ANA (USA)", detail: "Otra fuente premium. Chase Sapphire → ANA 1:1.", pointsPer: "1:1 transfer" },
      { category: "hotel", label: "Marriott Bonvoy → ANA", detail: "Transferencia Marriott a ANA a ratio 3:1 (con bonus de 5.000 por cada 60.000).", pointsPer: "3 Marriott = 1 ANA Mile" },
      { category: "partner", label: "Booking.com", detail: "ANA es partner de Booking para hoteles. Acumula en reservas seleccionadas.", url: "https://www.booking.com", pointsPer: "1 Mile/€ aprox." },
    ],
  },
];

export interface RouteCompatibility {
  origin: string;
  destination: string;
  cabin: Cabin;
  programs: {
    programId: string;
    airline: string;
    pointsNeeded: number;
    cashEquivalent: number;
    savingsPct: number;
    bookingTip: string;
  }[];
}

// Key routes with program compatibility
export const ROUTE_PROGRAMS: Record<string, { programId: string; airline: string; pointsNeeded: number; cashEquivalent: number; bookingTip: string }[]> = {
  "MAD-JFK-business": [
    { programId: "avios", airline: "Iberia", pointsNeeded: 34000, cashEquivalent: 3200, bookingTip: "Usar Iberia Avios, no BA Avios. Buscar en iberia.com" },
    { programId: "flyingblue", airline: "Air France vía CDG", pointsNeeded: 50000, cashEquivalent: 3800, bookingTip: "Buscar Promo Awards en Flying Blue" },
    { programId: "aeroplan", airline: "Lufthansa vía FRA", pointsNeeded: 55000, cashEquivalent: 4200, bookingTip: "Aeroplan accede a Lufthansa sin fuel surcharges" },
  ],
  "MAD-NRT-business": [
    { programId: "avios", airline: "JAL vía LHR", pointsNeeded: 67500, cashEquivalent: 6500, bookingTip: "JAL Business en Oneworld con Avios. Sin fuel surcharges." },
    { programId: "aeroplan", airline: "ANA vía FRA", pointsNeeded: 85000, cashEquivalent: 7000, bookingTip: "ANA Business via Aeroplan, stopover gratis en Frankfurt" },
    { programId: "flyingblue", airline: "Air France vía CDG", pointsNeeded: 75000, cashEquivalent: 5500, bookingTip: "Air France A380 upper deck en CDG-NRT" },
  ],
  "MAD-DXB-business": [
    { programId: "avios", airline: "Qatar Airways vía DOH", pointsNeeded: 40000, cashEquivalent: 4000, bookingTip: "Qatar Qsuites con Avios — uno de los mejores productos del mundo" },
    { programId: "flyingblue", airline: "Air France vía CDG", pointsNeeded: 45000, cashEquivalent: 3500, bookingTip: "AF La Première o Business vía Paris" },
  ],
  "BCN-BKK-business": [
    { programId: "avios", airline: "Cathay Pacific vía HKG", pointsNeeded: 50000, cashEquivalent: 5000, bookingTip: "Cathay Business via Hong Kong con Avios" },
    { programId: "aeroplan", airline: "Thai Airways vía BKK", pointsNeeded: 55000, cashEquivalent: 4800, bookingTip: "Thai Royal Silk Business" },
  ],
};

export function getProgramById(id: string): LoyaltyProgram | undefined {
  return PROGRAMS.find(p => p.id === id);
}

export function getProgramsForRoute(origin: string, destination: string, cabin: Cabin) {
  const key = `${origin}-${destination}-${cabin}`;
  return ROUTE_PROGRAMS[key] || [];
}

export function calculateCostToBuyPoints(programId: string, pointsNeeded: number, bonusPct: number = 0): number {
  const program = getProgramById(programId);
  if (!program || !program.canBuyPoints) return 0;
  // Average buy price ~0.012 EUR per point before bonus
  const basePricePerPoint = 0.012;
  const effectivePoints = pointsNeeded * (1 + bonusPct / 100);
  const cost = (pointsNeeded / effectivePoints) * pointsNeeded * basePricePerPoint;
  return Math.round(cost);
}
