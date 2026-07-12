export interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
  aliases: string[]; // alternate names users might type
}

export const AIRPORTS: Airport[] = [
  // Spain
  { code: "MAD", city: "Madrid", country: "España", name: "Aeropuerto Barajas", aliases: ["madrid", "barajas"] },
  { code: "BCN", city: "Barcelona", country: "España", name: "Aeropuerto El Prat", aliases: ["barcelona", "prat"] },
  { code: "AGP", city: "Málaga", country: "España", name: "Aeropuerto de Málaga", aliases: ["malaga", "málaga"] },
  { code: "PMI", city: "Palma de Mallorca", country: "España", name: "Aeropuerto de Palma", aliases: ["palma", "mallorca", "ibiza"] },
  { code: "VLC", city: "Valencia", country: "España", name: "Aeropuerto de Valencia", aliases: ["valencia"] },
  { code: "SVQ", city: "Sevilla", country: "España", name: "Aeropuerto de Sevilla", aliases: ["sevilla", "seville"] },
  { code: "BIO", city: "Bilbao", country: "España", name: "Aeropuerto de Bilbao", aliases: ["bilbao"] },
  // UK
  { code: "LHR", city: "Londres", country: "Reino Unido", name: "Heathrow", aliases: ["london", "londres", "heathrow"] },
  { code: "LGW", city: "Londres", country: "Reino Unido", name: "Gatwick", aliases: ["gatwick", "london gatwick"] },
  { code: "STN", city: "Londres", country: "Reino Unido", name: "Stansted", aliases: ["stansted"] },
  { code: "MAN", city: "Manchester", country: "Reino Unido", name: "Manchester Airport", aliases: ["manchester"] },
  { code: "EDI", city: "Edimburgo", country: "Reino Unido", name: "Edinburgh Airport", aliases: ["edinburgh", "edimburgo"] },
  // France
  { code: "CDG", city: "París", country: "Francia", name: "Charles de Gaulle", aliases: ["paris", "parís", "charles de gaulle", "cdg"] },
  { code: "ORY", city: "París", country: "Francia", name: "Orly", aliases: ["orly", "paris orly"] },
  { code: "NCE", city: "Niza", country: "Francia", name: "Côte d'Azur", aliases: ["nice", "niza"] },
  { code: "LYS", city: "Lyon", country: "Francia", name: "Saint-Exupéry", aliases: ["lyon"] },
  // Germany
  { code: "FRA", city: "Frankfurt", country: "Alemania", name: "Frankfurt Airport", aliases: ["frankfurt", "fraport"] },
  { code: "MUC", city: "Múnich", country: "Alemania", name: "Munich Airport", aliases: ["munich", "múnich", "münchen"] },
  { code: "BER", city: "Berlín", country: "Alemania", name: "Brandenburg", aliases: ["berlin", "berlín", "berlin airport"] },
  { code: "DUS", city: "Düsseldorf", country: "Alemania", name: "Düsseldorf Airport", aliases: ["dusseldorf", "düsseldorf"] },
  // Netherlands
  { code: "AMS", city: "Ámsterdam", country: "Países Bajos", name: "Schiphol", aliases: ["amsterdam", "ámsterdam", "schiphol"] },
  // Switzerland
  { code: "ZRH", city: "Zúrich", country: "Suiza", name: "Zurich Airport", aliases: ["zurich", "zúrich", "zürich"] },
  { code: "GVA", city: "Ginebra", country: "Suiza", name: "Geneva Airport", aliases: ["geneva", "ginebra", "genève"] },
  // Austria
  { code: "VIE", city: "Viena", country: "Austria", name: "Vienna International", aliases: ["vienna", "viena", "wien"] },
  // Italy
  { code: "FCO", city: "Roma", country: "Italia", name: "Fiumicino", aliases: ["rome", "roma", "fiumicino"] },
  { code: "MXP", city: "Milán", country: "Italia", name: "Malpensa", aliases: ["milan", "milán", "malpensa"] },
  { code: "VCE", city: "Venecia", country: "Italia", name: "Marco Polo", aliases: ["venice", "venecia", "venezia"] },
  // Belgium
  { code: "BRU", city: "Bruselas", country: "Bélgica", name: "Brussels Airport", aliases: ["brussels", "bruselas", "bruxelles"] },
  // Scandinavia
  { code: "CPH", city: "Copenhague", country: "Dinamarca", name: "Copenhagen Airport", aliases: ["copenhagen", "copenhague", "københavn"] },
  { code: "ARN", city: "Estocolmo", country: "Suecia", name: "Arlanda", aliases: ["stockholm", "estocolmo", "arlanda"] },
  { code: "OSL", city: "Oslo", country: "Noruega", name: "Gardermoen", aliases: ["oslo"] },
  { code: "HEL", city: "Helsinki", country: "Finlandia", name: "Helsinki-Vantaa", aliases: ["helsinki"] },
  // Portugal
  { code: "LIS", city: "Lisboa", country: "Portugal", name: "Humberto Delgado", aliases: ["lisbon", "lisboa"] },
  { code: "OPO", city: "Oporto", country: "Portugal", name: "Francisco de Sá Carneiro", aliases: ["porto", "oporto"] },
  // Ireland
  { code: "DUB", city: "Dublín", country: "Irlanda", name: "Dublin Airport", aliases: ["dublin", "dublín"] },
  // Greece
  { code: "ATH", city: "Atenas", country: "Grecia", name: "Eleftherios Venizelos", aliases: ["athens", "atenas", "athina"] },
  // Turkey
  { code: "IST", city: "Estambul", country: "Turquía", name: "Istanbul Airport", aliases: ["istanbul", "estambul"] },
  // USA
  { code: "JFK", city: "Nueva York", country: "EEUU", name: "John F. Kennedy", aliases: ["new york", "nueva york", "jfk", "nyc"] },
  { code: "EWR", city: "Nueva York", country: "EEUU", name: "Newark Liberty", aliases: ["newark", "nueva york newark"] },
  { code: "LGA", city: "Nueva York", country: "EEUU", name: "LaGuardia", aliases: ["laguardia"] },
  { code: "LAX", city: "Los Ángeles", country: "EEUU", name: "LAX", aliases: ["los angeles", "los ángeles", "lax"] },
  { code: "SFO", city: "San Francisco", country: "EEUU", name: "San Francisco Int'l", aliases: ["san francisco", "sf"] },
  { code: "ORD", city: "Chicago", country: "EEUU", name: "O'Hare", aliases: ["chicago", "o'hare", "ohare"] },
  { code: "MIA", city: "Miami", country: "EEUU", name: "Miami International", aliases: ["miami"] },
  { code: "BOS", city: "Boston", country: "EEUU", name: "Logan International", aliases: ["boston", "logan"] },
  { code: "IAD", city: "Washington DC", country: "EEUU", name: "Dulles International", aliases: ["washington", "washington dc", "dulles"] },
  { code: "DFW", city: "Dallas", country: "EEUU", name: "Dallas Fort Worth", aliases: ["dallas", "dfw"] },
  { code: "ATL", city: "Atlanta", country: "EEUU", name: "Hartsfield-Jackson", aliases: ["atlanta"] },
  { code: "SEA", city: "Seattle", country: "EEUU", name: "Seattle-Tacoma", aliases: ["seattle"] },
  // Canada
  { code: "YYZ", city: "Toronto", country: "Canadá", name: "Pearson International", aliases: ["toronto"] },
  { code: "YVR", city: "Vancouver", country: "Canadá", name: "Vancouver International", aliases: ["vancouver"] },
  { code: "YUL", city: "Montreal", country: "Canadá", name: "Trudeau International", aliases: ["montreal"] },
  // Japan
  { code: "NRT", city: "Tokio", country: "Japón", name: "Narita", aliases: ["tokyo", "tokio", "narita"] },
  { code: "HND", city: "Tokio", country: "Japón", name: "Haneda", aliases: ["haneda", "tokio haneda"] },
  { code: "KIX", city: "Osaka", country: "Japón", name: "Kansai", aliases: ["osaka", "kyoto", "kansai"] },
  // China / Hong Kong
  { code: "HKG", city: "Hong Kong", country: "Hong Kong", name: "Hong Kong International", aliases: ["hong kong", "hongkong"] },
  { code: "PEK", city: "Pekín", country: "China", name: "Capital International", aliases: ["beijing", "pekin", "pekín"] },
  { code: "PVG", city: "Shanghái", country: "China", name: "Pudong International", aliases: ["shanghai", "shanghái"] },
  // Singapore
  { code: "SIN", city: "Singapur", country: "Singapur", name: "Changi Airport", aliases: ["singapore", "singapur", "changi"] },
  // Thailand
  { code: "BKK", city: "Bangkok", country: "Tailandia", name: "Suvarnabhumi", aliases: ["bangkok"] },
  // South Korea
  { code: "ICN", city: "Seúl", country: "Corea del Sur", name: "Incheon", aliases: ["seoul", "seúl", "incheon"] },
  // India
  { code: "DEL", city: "Nueva Delhi", country: "India", name: "Indira Gandhi", aliases: ["delhi", "nueva delhi", "new delhi"] },
  { code: "BOM", city: "Bombay", country: "India", name: "Chhatrapati Shivaji", aliases: ["mumbai", "bombay"] },
  // Malaysia
  { code: "KUL", city: "Kuala Lumpur", country: "Malasia", name: "KLIA", aliases: ["kuala lumpur"] },
  // Indonesia
  { code: "CGK", city: "Yakarta", country: "Indonesia", name: "Soekarno-Hatta", aliases: ["jakarta", "yakarta"] },
  // Philippines
  { code: "MNL", city: "Manila", country: "Filipinas", name: "Ninoy Aquino", aliases: ["manila"] },
  // Taiwan
  { code: "TPE", city: "Taipéi", country: "Taiwán", name: "Taoyuan International", aliases: ["taipei", "taipéi"] },
  // Middle East
  { code: "DXB", city: "Dubái", country: "EAU", name: "Dubai International", aliases: ["dubai", "dubái"] },
  { code: "AUH", city: "Abu Dabi", country: "EAU", name: "Zayed International", aliases: ["abu dhabi", "abu dabi"] },
  { code: "DOH", city: "Doha", country: "Qatar", name: "Hamad International", aliases: ["doha"] },
  { code: "RUH", city: "Riad", country: "Arabia Saudí", name: "King Khalid", aliases: ["riyadh", "riad"] },
  { code: "KWI", city: "Kuwait", country: "Kuwait", name: "Kuwait International", aliases: ["kuwait"] },
  { code: "BAH", city: "Manama", country: "Baréin", name: "Bahrain International", aliases: ["bahrain", "manama"] },
  { code: "AMM", city: "Amán", country: "Jordania", name: "Queen Alia", aliases: ["amman", "amán"] },
  { code: "BEY", city: "Beirut", country: "Líbano", name: "Rafic Hariri", aliases: ["beirut"] },
  // Latin America
  { code: "GRU", city: "São Paulo", country: "Brasil", name: "Guarulhos", aliases: ["sao paulo", "são paulo", "guarulhos"] },
  { code: "GIG", city: "Río de Janeiro", country: "Brasil", name: "Galeão", aliases: ["rio de janeiro", "río de janeiro", "rio"] },
  { code: "EZE", city: "Buenos Aires", country: "Argentina", name: "Ezeiza", aliases: ["buenos aires", "ezeiza"] },
  { code: "BOG", city: "Bogotá", country: "Colombia", name: "El Dorado", aliases: ["bogota", "bogotá"] },
  { code: "LIM", city: "Lima", country: "Perú", name: "Jorge Chávez", aliases: ["lima"] },
  { code: "SCL", city: "Santiago", country: "Chile", name: "Arturo Merino Benítez", aliases: ["santiago", "santiago de chile"] },
  { code: "MEX", city: "Ciudad de México", country: "México", name: "Benito Juárez", aliases: ["mexico city", "ciudad de mexico", "cdmx", "df"] },
  { code: "PTY", city: "Ciudad de Panamá", country: "Panamá", name: "Tocumen", aliases: ["panama", "panamá", "tocumen"] },
  { code: "MDE", city: "Medellín", country: "Colombia", name: "José María Córdova", aliases: ["medellin", "medellín"] },
  { code: "CCS", city: "Caracas", country: "Venezuela", name: "Simón Bolívar", aliases: ["caracas"] },
  // Africa
  { code: "JNB", city: "Johannesburgo", country: "Sudáfrica", name: "O.R. Tambo", aliases: ["johannesburg", "johannesburgo", "joburg"] },
  { code: "CPT", city: "Ciudad del Cabo", country: "Sudáfrica", name: "Cape Town Int'l", aliases: ["cape town", "ciudad del cabo"] },
  { code: "NBO", city: "Nairobi", country: "Kenia", name: "Jomo Kenyatta", aliases: ["nairobi"] },
  { code: "CMN", city: "Casablanca", country: "Marruecos", name: "Mohammed V", aliases: ["casablanca"] },
  { code: "CAI", city: "El Cairo", country: "Egipto", name: "Cairo International", aliases: ["cairo", "el cairo"] },
  { code: "LOS", city: "Lagos", country: "Nigeria", name: "Murtala Muhammed", aliases: ["lagos"] },
  { code: "ACC", city: "Acra", country: "Ghana", name: "Kotoka International", aliases: ["accra", "acra"] },
  { code: "ADD", city: "Adís Abeba", country: "Etiopía", name: "Bole International", aliases: ["addis ababa", "adis abeba"] },
  // Oceania
  { code: "SYD", city: "Sídney", country: "Australia", name: "Kingsford Smith", aliases: ["sydney", "sídney"] },
  { code: "MEL", city: "Melbourne", country: "Australia", name: "Melbourne Airport", aliases: ["melbourne"] },
  { code: "BNE", city: "Brisbane", country: "Australia", name: "Brisbane Airport", aliases: ["brisbane"] },
  { code: "PER", city: "Perth", country: "Australia", name: "Perth Airport", aliases: ["perth"] },
  { code: "AKL", city: "Auckland", country: "Nueva Zelanda", name: "Auckland Airport", aliases: ["auckland"] },
];

export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();

  return AIRPORTS.filter(a =>
    a.code.toLowerCase().startsWith(q) ||
    a.city.toLowerCase().includes(q) ||
    a.country.toLowerCase().includes(q) ||
    a.aliases.some(alias => alias.includes(q))
  ).slice(0, 6);
}
