"use client";

import { useState } from "react";
import Link from "next/link";
import { Plane, Search, Plus, Trash2, ChevronDown, ArrowRight, AlertCircle, Loader, Shield, Clock, Hotel, ExternalLink } from "lucide-react";
import { PROGRAMS, DATA_LAST_UPDATED, DATA_SOURCES } from "@/lib/programs-data";
import AirportInput from "@/components/AirportInput";

type Cabin = "business" | "first" | "economy";
type SearchMode = "oneway" | "roundtrip" | "multicity";

interface Segment { id: number; origin: string; destination: string; date: string; }

interface SearchResult {
  programId: string; programName: string; airline: string;
  origin: string; destination: string; date: string; cabin: Cabin;
  pointsNeeded: number; cashEquivalent: number; savingsPct: number;
  seatsAvailable: number; canBuyPoints: boolean; buyCost: number;
  bookingTip: string; difficulty: "easy" | "medium" | "hard";
}

const AIRPORT_REGION: Record<string, string> = {
  MAD:"europe",BCN:"europe",LHR:"europe",LGW:"europe",CDG:"europe",ORY:"europe",
  AMS:"europe",FRA:"europe",MUC:"europe",ZRH:"europe",VIE:"europe",FCO:"europe",
  MXP:"europe",BRU:"europe",CPH:"europe",ARN:"europe",OSL:"europe",HEL:"europe",
  LIS:"europe",DUB:"europe",MAN:"europe",EDI:"europe",ATH:"europe",IST:"europe",
  GVA:"europe",NCE:"europe",LYS:"europe",BER:"europe",DUS:"europe",OPO:"europe",
  JFK:"north_america",EWR:"north_america",LGA:"north_america",BOS:"north_america",
  MIA:"north_america",ORD:"north_america",LAX:"north_america",SFO:"north_america",
  IAD:"north_america",DFW:"north_america",ATL:"north_america",SEA:"north_america",
  YYZ:"north_america",YVR:"north_america",YUL:"north_america",
  NRT:"asia",HND:"asia",KIX:"asia",HKG:"asia",SIN:"asia",BKK:"asia",
  KUL:"asia",CGK:"asia",ICN:"asia",PEK:"asia",PVG:"asia",DEL:"asia",
  BOM:"asia",MNL:"asia",TPE:"asia",CAN:"asia",CMB:"asia",
  DXB:"middle_east",AUH:"middle_east",DOH:"middle_east",RUH:"middle_east",
  KWI:"middle_east",BAH:"middle_east",AMM:"middle_east",BEY:"middle_east",
  GRU:"latam",GIG:"latam",EZE:"latam",BOG:"latam",LIM:"latam",
  SCL:"latam",MEX:"latam",PTY:"latam",MDE:"latam",CCS:"latam",
  JNB:"africa",CPT:"africa",NBO:"africa",CMN:"africa",CAI:"africa",
  LOS:"africa",ACC:"africa",ADD:"africa",
  SYD:"oceania",MEL:"oceania",BNE:"oceania",AKL:"oceania",PER:"oceania",
};

type RouteEntry = { programId: string; programName: string; airline: string; points: number; cash: number; tip: string };

const REGIONAL_DATA: Record<string, RouteEntry[]> = {
  "europe-north_america": [
    { programId:"avios",        programName:"Iberia Avios",      airline:"Iberia / BA",             points:34000,  cash:3200, tip:"Iberia Avios es más barato que BA Avios para NY. Busca en iberia.com o ba.com." },
    { programId:"flyingblue",   programName:"Flying Blue",       airline:"Air France / KLM",        points:50000,  cash:3800, tip:"Promo Awards en flyingblue.com — primer martes del mes, 25‑50% descuento." },
    { programId:"aeroplan",     programName:"Aeroplan",          airline:"Lufthansa / Air Canada",   points:55000,  cash:4200, tip:"Sin fuel surcharges en LH. Busca en aircanada.com/aeroplan." },
    { programId:"virginatlantic",programName:"Virgin Flying Club",airline:"Delta One",              points:50000,  cash:4500, tip:"Único programa para canjear Delta One Business fácilmente." },
  ],
  "europe-asia": [
    { programId:"avios",        programName:"Avios (JAL)",       airline:"Japan Airlines vía LHR",  points:67500,  cash:6500, tip:"JAL Business clase J, sin fuel surcharges. Busca en ba.com." },
    { programId:"flyingblue",   programName:"Flying Blue",       airline:"Air France vía CDG",      points:75000,  cash:5800, tip:"AF A380 upper deck CDG‑NRT/BKK/SIN. Excelente producto Business." },
    { programId:"aeroplan",     programName:"Aeroplan",          airline:"ANA vía FRA",             points:85000,  cash:7000, tip:"ANA Business 'The Room' vía Frankfurt. Stopover gratis." },
    { programId:"asiamiles",    programName:"Asia Miles",        airline:"Cathay Pacific vía HKG",  points:60000,  cash:5500, tip:"Cathay Business Studio. Compra Asia Miles en promociones 30‑50%." },
  ],
  "europe-middle_east": [
    { programId:"avios",        programName:"Avios (Qatar)",     airline:"Qatar Airways vía DOH",   points:40000,  cash:4000, tip:"Qatar Qsuites con Avios. Mejor producto Business del mundo." },
    { programId:"flyingblue",   programName:"Flying Blue",       airline:"Air France vía CDG",      points:45000,  cash:3500, tip:"AF Business vía Paris hacia DXB/RUH/AUH." },
    { programId:"aeroplan",     programName:"Aeroplan",          airline:"Turkish Airlines vía IST", points:45000, cash:3800, tip:"Turkish Business muy bueno. Sin fuel surcharges con Aeroplan." },
  ],
  "europe-latam": [
    { programId:"avios",        programName:"Iberia Avios",      airline:"Iberia",                  points:51000,  cash:4200, tip:"Iberia tiene las mejores tarifas a Latam. Busca en iberia.com." },
    { programId:"flyingblue",   programName:"Flying Blue",       airline:"Air France vía CDG",      points:62500,  cash:4800, tip:"AF Business hacia GRU/EZE/BOG. Promo Awards disponibles." },
    { programId:"aeroplan",     programName:"Aeroplan",          airline:"Air Canada vía YYZ",      points:60000,  cash:4500, tip:"Air Canada Signature Business hacia Latam vía Toronto." },
  ],
  "europe-africa": [
    { programId:"avios",        programName:"Avios (BA)",        airline:"British Airways",         points:40000,  cash:3800, tip:"BA vuela directo LHR‑JNB/CPT/NBO en Business." },
    { programId:"flyingblue",   programName:"Flying Blue",       airline:"Air France / KLM",        points:40000,  cash:3500, tip:"AF/KL rutas extensas a África. Promo Awards frecuentes." },
    { programId:"aeroplan",     programName:"Aeroplan",          airline:"Ethiopian Airlines",      points:40000,  cash:3200, tip:"Ethiopian Business a todo el África subsahariana vía ADD." },
  ],
  "europe-oceania": [
    { programId:"avios",        programName:"Avios (QF)",        airline:"Qantas vía SIN/HKG",      points:80000,  cash:8000, tip:"Qantas Business vía Asia con Avios. Busca en ba.com." },
    { programId:"aeroplan",     programName:"Aeroplan",          airline:"Air New Zealand / ANA",   points:85000,  cash:8500, tip:"Air NZ Business via LAX o ANA vía NRT." },
    { programId:"flyingblue",   programName:"Flying Blue",       airline:"Air France CDG‑SYD",      points:90000,  cash:9000, tip:"AF vuela CDG‑SYD Business. Ruta larga, excelente producto." },
  ],
  "north_america-asia": [
    { programId:"aeroplan",     programName:"Aeroplan",          airline:"ANA / Air Canada",        points:75000,  cash:5500, tip:"ANA Business desde LAX/SFO/YVR. Mejor producto Business trans‑Pacífico." },
    { programId:"virginatlantic",programName:"Virgin Flying Club",airline:"ANA First Class",        points:95000,  cash:13000,tip:"ANA First Class desde USA con Virgin Flying Club." },
    { programId:"avios",        programName:"Avios (JAL)",       airline:"Japan Airlines",          points:60000,  cash:5000, tip:"JAL Business JFK‑NRT o LAX‑NRT con Avios BA." },
  ],
  "north_america-europe": [
    { programId:"aeroplan",     programName:"Aeroplan",          airline:"Lufthansa / SWISS",       points:55000,  cash:4000, tip:"Lufthansa Business desde JFK/ORD/EWR. Sin fuel surcharges." },
    { programId:"avios",        programName:"Avios (BA)",        airline:"British Airways",         points:50000,  cash:4200, tip:"BA Business JFK‑LHR. Ten en cuenta fuel surcharges de BA." },
    { programId:"virginatlantic",programName:"Virgin Flying Club",airline:"Delta One",              points:50000,  cash:4500, tip:"Delta One con Virgin Flying Club. Sin fuel surcharges." },
  ],
  "asia-europe": [
    { programId:"asiamiles",    programName:"Asia Miles",        airline:"Cathay Pacific",          points:60000,  cash:6000, tip:"Cathay Business HKG‑LHR/FRA. Busca en asiamiles.com." },
    { programId:"avios",        programName:"Avios (CX)",        airline:"Cathay Pacific",          points:50000,  cash:6000, tip:"Cathay con Avios, sin fuel surcharges. Busca en ba.com." },
    { programId:"flyingblue",   programName:"Flying Blue",       airline:"Air France / KLM",        points:75000,  cash:5500, tip:"AF/KL Business Asia‑Europa. Promo Awards disponibles." },
  ],
  "middle_east-europe": [
    { programId:"avios",        programName:"Avios (Qatar)",     airline:"Qatar Airways",           points:40000,  cash:3800, tip:"Qatar Qsuites DOH‑LHR/MAD/FRA con Avios. Producto excepcional." },
    { programId:"flyingblue",   programName:"Flying Blue",       airline:"Air France / KLM",        points:40000,  cash:3200, tip:"AF/KL Business desde DXB/DOH/AUH." },
  ],
  "latam-europe": [
    { programId:"avios",        programName:"Iberia Avios",      airline:"Iberia",                  points:51000,  cash:4500, tip:"Iberia Business GRU/EZE/BOG‑MAD. Mejores tarifas desde Latam." },
    { programId:"flyingblue",   programName:"Flying Blue",       airline:"Air France / KLM",        points:62500,  cash:5000, tip:"AF/KL Business desde GRU/EZE/LIM hacia CDG/AMS." },
  ],
};

const FIRST_MULTIPLIER: Record<string, number> = {
  avios:1.5, flyingblue:1.6, aeroplan:1.6, asiamiles:1.67, virginatlantic:1.9,
};

function resolveRouteData(origin: string, dest: string, cabin: Cabin): RouteEntry[] {
  const oR = AIRPORT_REGION[origin];
  const dR = AIRPORT_REGION[dest];
  if (!oR || !dR || oR === dR) return [];
  const base = REGIONAL_DATA[`${oR}-${dR}`] || REGIONAL_DATA[`${dR}-${oR}`] || [];
  if (cabin === "first") {
    return base
      .filter(r => ["avios","aeroplan","asiamiles","virginatlantic"].includes(r.programId))
      .map(r => ({
        ...r,
        points: Math.round(r.points * (FIRST_MULTIPLIER[r.programId] || 1.5)),
        cash: Math.round(r.cash * 2.2),
        tip: r.tip + " — First Class: busca con 6‑11 meses de antelación.",
      }));
  }
  return base;
}

function simulateSearch(segments: Segment[], cabin: Cabin): SearchResult[] {
  const results: SearchResult[] = [];
  const buyPerPoint = 0.0072;
  for (const seg of segments) {
    const o = seg.origin?.trim().toUpperCase();
    const d = seg.destination?.trim().toUpperCase();
    if (!o || !d || o.length !== 3 || d.length !== 3) continue;
    resolveRouteData(o, d, cabin).forEach(m => {
      const prog = PROGRAMS.find(p => p.id === m.programId);
      const buyCost = prog?.canBuyPoints ? Math.round(m.points * buyPerPoint) : 0;
      results.push({
        programId: m.programId, programName: m.programName, airline: m.airline,
        origin: o, destination: d, date: seg.date || "", cabin,
        pointsNeeded: m.points, cashEquivalent: m.cash,
        savingsPct: buyCost > 0 ? Math.round(((m.cash - buyCost) / m.cash) * 100) : 0,
        seatsAvailable: Math.floor(Math.random() * 4) + 1,
        canBuyPoints: prog?.canBuyPoints || false, buyCost,
        bookingTip: m.tip, difficulty: prog?.difficulty || "medium",
      });
    });
  }
  return results;
}

// Reemplaza estos IDs cuando te registres en cada programa de afiliados
const BOOKING_AFFILIATE_ID = "YOUR_BOOKING_ID"; // booking.com/affiliate-program
const VRBO_AFFILIATE_ID = "YOUR_VRBO_ID";        // vrbo.com/affiliates

function vrboUrl(cityCode: string) {
  const cityNames: Record<string, string> = {
    JFK: "New York", EWR: "New York", LGA: "New York",
    LHR: "London", LGW: "London",
    CDG: "Paris", ORY: "Paris",
    NRT: "Tokyo", HND: "Tokyo",
    HKG: "Hong Kong", SIN: "Singapore",
    DXB: "Dubai", AUH: "Abu Dhabi", DOH: "Doha",
    BKK: "Bangkok", KUL: "Kuala Lumpur",
    GRU: "Sao Paulo", EZE: "Buenos Aires",
    AMS: "Amsterdam", FRA: "Frankfurt", MUC: "Munich",
    ZRH: "Zurich", VIE: "Vienna", FCO: "Rome",
    MAD: "Madrid", BCN: "Barcelona", LIS: "Lisbon",
    SYD: "Sydney", MEL: "Melbourne",
    JNB: "Johannesburg", NBO: "Nairobi",
    ICN: "Seoul", PEK: "Beijing", PVG: "Shanghai",
    DEL: "Delhi", BOM: "Mumbai",
  };
  const city = cityNames[cityCode] || cityCode;
  return `https://www.vrbo.com/search/keywords:${encodeURIComponent(city)}?affid=${VRBO_AFFILIATE_ID}`;
}

function bookingHotelUrl(cityCode: string, destination: string) {
  const cityNames: Record<string, string> = {
    JFK: "Nueva York", EWR: "Nueva York", LGA: "Nueva York",
    LHR: "Londres", LGW: "Londres",
    CDG: "París", ORY: "París",
    NRT: "Tokio", HND: "Tokio",
    HKG: "Hong Kong",
    DXB: "Dubái", AUH: "Abu Dabi", DOH: "Doha",
    SIN: "Singapur",
    BKK: "Bangkok",
    GRU: "São Paulo", EZE: "Buenos Aires",
    AMS: "Ámsterdam", FRA: "Frankfurt", MUC: "Múnich",
    ZRH: "Zúrich", VIE: "Viena", FCO: "Roma",
    MAD: "Madrid", BCN: "Barcelona", LIS: "Lisboa",
    SYD: "Sídney", MEL: "Melbourne",
    JNB: "Johannesburgo", NBO: "Nairobi",
    ICN: "Seúl", PEK: "Pekín", PVG: "Shanghái",
    DEL: "Delhi", BOM: "Mumbai",
  };
  const city = cityNames[cityCode] || destination;
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&aid=${BOOKING_AFFILIATE_ID}`;
}

const POPULAR_ROUTES = [
  { from:"MAD", to:"JFK", label:"Madrid → Nueva York" },
  { from:"BCN", to:"NRT", label:"Barcelona → Tokio" },
  { from:"MAD", to:"DXB", label:"Madrid → Dubai" },
  { from:"LHR", to:"HKG", label:"Londres → Hong Kong" },
  { from:"BCN", to:"BKK", label:"Barcelona → Bangkok" },
  { from:"MAD", to:"GRU", label:"Madrid → São Paulo" },
];

const NAV = () => (
  <header style={{ borderBottom:"1px solid #E5E7EB", background:"#ffffff", position:"sticky", top:0, zIndex:40 }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56 }}>
      <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
        <div style={{ width:28, height:28, background:"#1D4ED8", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Plane style={{ width:14, height:14, color:"#ffffff" }} />
        </div>
        <span style={{ fontWeight:700, fontSize:"1rem", color:"#111827" }}>PointsToFly</span>
      </Link>
      <nav style={{ display:"flex", alignItems:"center", gap:24 }}>
        <Link href="/search" className="nav-link active">Buscar</Link>
        <Link href="/programs" className="nav-link">Programas</Link>
        <Link href="/calculator" className="nav-link">Calculadora</Link>
        <Link href="/alerts" className="nav-link">Alertas</Link>
        <Link href="/wallet" className="nav-link">Mis puntos</Link>
      </nav>
    </div>
  </header>
);

export default function SearchPage() {
  const [mode, setMode] = useState<SearchMode>("oneway");
  const [cabin, setCabin] = useState<Cabin>("business");
  const [segments, setSegments] = useState<Segment[]>([{ id:1, origin:"", destination:"", date:"" }]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const updateSegment = (id: number, field: keyof Segment, value: string) => {
    setSegments(s => {
      const updated = s.map(x => x.id === id ? { ...x, [field]: value } : x);
      // En modo ida y vuelta, el segundo segmento se sincroniza automáticamente
      if (mode === "roundtrip" && updated.length === 2) {
        const first = updated[0];
        return [
          first,
          { ...updated[1], origin: first.destination, destination: first.origin },
        ];
      }
      return updated;
    });
  };

  const addSegment = () => {
    if (segments.length < 5) setSegments(s => [...s, { id: Date.now(), origin:"", destination:"", date:"" }]);
  };

  const removeSegment = (id: number) => {
    if (segments.length > 1) setSegments(s => s.filter(x => x.id !== id));
  };

  const handleSearch = async () => {
    setIsSearching(true); setHasSearched(false);
    await new Promise(r => setTimeout(r, 1400));
    setResults(simulateSearch(segments, cabin));
    setIsSearching(false); setHasSearched(true);
  };

  const diffLabel = (d: string) => d === "easy" ? "Fácil" : d === "medium" ? "Medio" : "Avanzado";
  const diffColor = (d: string) => d === "easy" ? "#059669" : d === "medium" ? "#D97706" : "#DC2626";

  return (
    <div style={{ background:"#F4F5F7", color:"#111827", minHeight:"100vh" }}>
      <NAV />
      <div style={{ maxWidth:860, margin:"0 auto", padding:"40px 24px 64px" }}>
        <h1 style={{ fontSize:"1.75rem", fontWeight:700, letterSpacing:"-0.02em", marginBottom:4 }}>Buscar award seats</h1>
        <p style={{ color:"#6B7280", fontSize:"0.9375rem", marginBottom:32 }}>Disponibilidad en 20+ programas. Business y First Class.</p>

        {/* SEARCH PANEL */}
        <div className="card" style={{ padding:24, marginBottom:24 }}>
          {/* MODE */}
          <div style={{ display:"flex", gap:4, background:"#F3F4F6", borderRadius:8, padding:4, width:"fit-content", marginBottom:20 }}>
            {(["oneway","roundtrip","multicity"] as SearchMode[]).map(m => (
              <button key={m} onClick={() => {
                setMode(m);
                setSegments(prev => {
                  const first = prev[0];
                  if (m === "oneway") return [{ ...first, id:1 }];
                  if (m === "roundtrip") return [
                    first,
                    { id:2, origin: first.destination, destination: first.origin, date:"" },
                  ];
                  // multicity
                  return [first, { id:2, origin:"", destination:"", date:"" }];
                });
              }}
                style={{ padding:"6px 14px", borderRadius:6, border:"none", fontWeight:500, fontSize:"0.875rem", cursor:"pointer", background: mode===m ? "#ffffff" : "transparent", color: mode===m ? "#111827" : "#6B7280", boxShadow: mode===m ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition:"all 0.15s" }}>
                {m==="oneway"?"Solo ida":m==="roundtrip"?"Ida y vuelta":"Multi-ciudad"}
              </button>
            ))}
          </div>

          {/* CABIN */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <span style={{ fontSize:"0.875rem", color:"#6B7280", fontWeight:500 }}>Cabina:</span>
            {(["business","first","economy"] as Cabin[]).map(c => (
              <button key={c} onClick={() => setCabin(c)}
                style={{ padding:"5px 12px", borderRadius:6, border:`1px solid ${cabin===c ? "#1D4ED8" : "#E5E7EB"}`, background: cabin===c ? "#EFF6FF" : "#ffffff", color: cabin===c ? "#1D4ED8" : "#6B7280", fontWeight:500, fontSize:"0.8125rem", cursor:"pointer", transition:"all 0.15s" }}>
                {c==="first"?"✦ First":c==="business"?"Business":"Economy"}
              </button>
            ))}
          </div>

          {/* SEGMENTS */}
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
            {segments.map((seg, idx) => (
              <div key={seg.id}>
                {mode==="multicity" && <span style={{ fontSize:"0.75rem", color:"#9CA3AF", display:"block", marginBottom:4 }}>Segmento {idx+1}</span>}
                {/* Fila 1: origen + destino */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                  {mode==="roundtrip" && idx===1 ? (
                    <>
                      <div style={{ padding:"11px 14px", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:8, fontSize:"0.875rem", color:"#6B7280" }}>
                        ↩ {seg.origin || "—"}
                      </div>
                      <div style={{ padding:"11px 14px", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:8, fontSize:"0.875rem", color:"#6B7280" }}>
                        → {seg.destination || "—"}
                      </div>
                    </>
                  ) : (
                    <>
                      <AirportInput value={seg.origin} onChange={c => updateSegment(seg.id,"origin",c)} placeholder="Origen" />
                      <AirportInput value={seg.destination} onChange={c => updateSegment(seg.id,"destination",c)} placeholder="Destino" />
                    </>
                  )}
                </div>
                {/* Fila 2: fecha + botón eliminar */}
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <input type="date" value={seg.date} onChange={e => updateSegment(seg.id,"date",e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    max={new Date(Date.now()+365*864e5).toISOString().split("T")[0]}
                    className="input" style={{ padding:"11px 12px", flex:1 }} />
                  {mode==="multicity" && segments.length>1
                    ? <button onClick={() => removeSegment(seg.id)} style={{ background:"none", border:"none", color:"#9CA3AF", cursor:"pointer", padding:4 }}><Trash2 style={{width:16,height:16}} /></button>
                    : null}
                </div>
              </div>
            ))}
          </div>

          {mode==="multicity" && segments.length<5 && (
            <button onClick={addSegment} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#1D4ED8", fontWeight:500, fontSize:"0.875rem", cursor:"pointer", marginBottom:16, padding:0 }}>
              <Plus style={{width:14,height:14}} /> Añadir segmento
            </button>
          )}

          <button onClick={handleSearch} disabled={isSearching} className="btn-primary"
            style={{ width:"100%", padding:"12px", fontSize:"0.9375rem", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity: isSearching?0.7:1 }}>
            {isSearching ? <><Loader style={{width:16,height:16,animation:"spin 1s linear infinite"}} /> Buscando en 20+ programas…</> : <><Search style={{width:16,height:16}} /> Buscar disponibilidad</>}
          </button>
        </div>

        {/* POPULAR ROUTES */}
        {!hasSearched && (
          <div style={{ marginBottom:32 }}>
            <p style={{ fontSize:"0.8125rem", color:"#9CA3AF", marginBottom:10, fontWeight:500 }}>Rutas populares</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {POPULAR_ROUTES.map(r => (
                <button key={r.label} onClick={() => setSegments([{id:1,origin:r.from,destination:r.to,date:""}])}
                  className="btn-secondary" style={{ padding:"6px 12px", fontSize:"0.8125rem", display:"flex", alignItems:"center", gap:6 }}>
                  <Plane style={{width:12,height:12}} /> {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS */}
        {hasSearched && (
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <h2 style={{ fontSize:"1rem", fontWeight:600 }}>
                {results.length > 0 ? `${results.length} opciones` : "Sin resultados"}{" "}
                <span style={{ fontWeight:400, color:"#6B7280" }}>
                  {mode==="roundtrip"
                    ? `${segments[0]?.origin} ⇄ ${segments[1]?.destination}`
                    : `para ${segments[0]?.origin} → ${segments[0]?.destination}`}
                </span>
              </h2>
              <span style={{ fontSize:"0.8125rem", color:"#6B7280" }}>{cabin==="first"?"✦ First Class":cabin==="business"?"Business":"Economy"}</span>
            </div>

            {/* ROUNDTRIP TOTALS */}
            {mode==="roundtrip" && results.length > 0 && (() => {
              // Agrupa por programa y suma puntos ida+vuelta
              const byProgram: Record<string, { name: string; points: number; buyCost: number; cash: number; count: number }> = {};
              results.forEach(r => {
                if (!byProgram[r.programId]) {
                  byProgram[r.programId] = { name: r.programName, points: 0, buyCost: 0, cash: 0, count: 0 };
                }
                byProgram[r.programId].points += r.pointsNeeded;
                byProgram[r.programId].buyCost += r.buyCost;
                byProgram[r.programId].cash += r.cashEquivalent;
                byProgram[r.programId].count += 1;
              });
              const totals = Object.values(byProgram).filter(p => p.count >= 2);
              if (!totals.length) return null;
              return (
                <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
                  <p style={{ fontSize:"0.75rem", fontWeight:600, color:"#1D4ED8", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                    Total ida + vuelta por programa
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {totals.sort((a,b) => a.buyCost - b.buyCost).map(p => (
                      <div key={p.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                        <span style={{ fontWeight:600, fontSize:"0.9rem", color:"#1E3A8A" }}>{p.name}</span>
                        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                          <span style={{ fontSize:"0.875rem", color:"#374151" }}><strong>{p.points.toLocaleString("es-ES")}</strong> pts totales</span>
                          {p.buyCost > 0 && <span style={{ fontSize:"0.875rem", color:"#1D4ED8", fontWeight:700 }}>~€{p.buyCost.toLocaleString("es-ES")} comprando puntos</span>}
                          <span style={{ fontSize:"0.8125rem", color:"#9CA3AF", textDecoration:"line-through" }}>€{p.cash.toLocaleString("es-ES")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {results.length === 0 && (
              <div className="card" style={{ padding:40, textAlign:"center" }}>
                <p style={{ color:"#6B7280", marginBottom:8 }}>No tenemos datos para esta ruta.</p>
                <p style={{ color:"#9CA3AF", fontSize:"0.875rem" }}>Prueba rutas de larga distancia: Europa ↔ América, Asia, Oriente Medio. Las rutas cortas no tienen awards de Business.</p>
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {results.map((r, i) => (
                <div key={i} className="card" style={{ overflow:"hidden" }}>
                  <div style={{ padding:"20px 24px", cursor:"pointer" }} onClick={() => setExpanded(expanded===i ? null : i)}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, flexWrap:"wrap" }}>
                          <span style={{ fontWeight:600, fontSize:"1rem" }}>{r.programName}</span>
                          <span className="badge badge-gray" style={{ fontSize:"0.75rem" }}>{r.airline}</span>
                          {r.canBuyPoints && <span className="badge badge-green">Puntos comprables</span>}
                          <span style={{ fontSize:"0.75rem", fontWeight:500, color: diffColor(r.difficulty) }}>● {diffLabel(r.difficulty)}</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
                          <div>
                            <div style={{ fontSize:"0.75rem", color:"#9CA3AF" }}>Puntos</div>
                            <div style={{ fontWeight:700, fontSize:"1rem" }}>{r.pointsNeeded.toLocaleString("es-ES")}</div>
                          </div>
                          {r.canBuyPoints && (
                            <div>
                              <div style={{ fontSize:"0.75rem", color:"#9CA3AF" }}>Comprar puntos (~)</div>
                              <div style={{ fontWeight:700, fontSize:"1rem", color:"#1D4ED8" }}>€{r.buyCost.toLocaleString("es-ES")}</div>
                            </div>
                          )}
                          <div>
                            <div style={{ fontSize:"0.75rem", color:"#9CA3AF" }}>Precio cash</div>
                            <div style={{ fontSize:"0.9375rem", color:"#9CA3AF", textDecoration:"line-through" }}>€{r.cashEquivalent.toLocaleString("es-ES")}</div>
                          </div>
                          {r.canBuyPoints && (
                            <div>
                              <div style={{ fontSize:"0.75rem", color:"#9CA3AF" }}>Ahorro</div>
                              <span className="badge badge-green" style={{ fontSize:"0.875rem", fontWeight:700 }}>{r.savingsPct}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronDown style={{ width:18, height:18, color:"#9CA3AF", transform: expanded===i?"rotate(180deg)":"none", transition:"transform 0.2s", flexShrink:0 }} />
                    </div>
                  </div>

                  {expanded===i && (
                    <div style={{ borderTop:"1px solid #E5E7EB", padding:"20px 24px", background:"#F4F5F7" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:8, background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:8, padding:14, marginBottom:16 }}>
                        <Shield style={{ width:14, height:14, color:"#1D4ED8", flexShrink:0, marginTop:2 }} />
                        <p style={{ fontSize:"0.875rem", color:"#1E40AF" }}>{r.bookingTip}</p>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
                        {[
                          { label:"Dificultad", value: diffLabel(r.difficulty), color: diffColor(r.difficulty) },
                          { label:"Antelación", value:"3–11 meses" },
                          { label:"CPP estimado", value:`€${((r.cashEquivalent/r.pointsNeeded)*100).toFixed(1)}c/pto`, color:"#059669" },
                        ].map(item => (
                          <div key={item.label} style={{ background:"#ffffff", border:"1px solid #E5E7EB", borderRadius:8, padding:12 }}>
                            <div style={{ fontSize:"0.75rem", color:"#9CA3AF", marginBottom:4 }}>{item.label}</div>
                            <div style={{ fontWeight:600, fontSize:"0.9375rem", color: item.color || "#111827" }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"flex", gap:12 }}>
                        <Link href="/calculator" style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.875rem", color:"#1D4ED8", textDecoration:"none", fontWeight:500 }}>
                          Calcular coste exacto <ArrowRight style={{width:13,height:13}} />
                        </Link>
                        <span style={{ color:"#E5E7EB" }}>·</span>
                        <Link href="/alerts" style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.875rem", color:"#D97706", textDecoration:"none", fontWeight:500 }}>
                          Crear alerta para esta ruta <ArrowRight style={{width:13,height:13}} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ACCOMMODATION AFFILIATE BLOCK */}
            {results.length > 0 && segments[0]?.destination && (
              <div style={{ marginTop:24, border:"1px solid #BFDBFE", borderRadius:12, overflow:"hidden", background:"#ffffff" }}>
                <div style={{ background:"#EFF6FF", padding:"14px 20px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #BFDBFE" }}>
                  <Hotel style={{ width:18, height:18, color:"#1D4ED8" }} />
                  <div>
                    <p style={{ fontWeight:600, fontSize:"0.9375rem", color:"#1E3A8A" }}>
                      Completa tu viaje a {segments[0].destination}
                    </p>
                    <p style={{ fontSize:"0.8125rem", color:"#3B82F6", marginTop:1 }}>
                      Gana puntos extra reservando alojamiento con tu programa de millas
                    </p>
                  </div>
                </div>
                <div style={{ padding:"16px 20px" }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:16 }}>
                    {[
                      "Avios (Iberia / BA) — 1–3 Avios por € en hoteles",
                      "Flying Blue — 1–4 Miles por € en hoteles",
                      "Aeroplan — 1–5 pts por € en hoteles",
                    ].map(tip => (
                      <div key={tip} style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8125rem", color:"#6B7280" }}>
                        <span style={{ color:"#059669", fontWeight:700 }}>+</span> {tip}
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    <a
                      href={bookingHotelUrl(segments[0].destination, segments[0].destination)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display:"flex", alignItems:"center", gap:7, background:"#1D4ED8", color:"#ffffff", padding:"9px 16px", borderRadius:8, fontWeight:600, fontSize:"0.875rem", textDecoration:"none", whiteSpace:"nowrap" }}
                    >
                      <Hotel style={{ width:14, height:14 }} />
                      Hoteles en Booking.com
                      <ExternalLink style={{ width:12, height:12 }} />
                    </a>
                    <a
                      href={vrboUrl(segments[0].destination)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display:"flex", alignItems:"center", gap:7, background:"#ffffff", color:"#111827", border:"1px solid #E5E7EB", padding:"9px 16px", borderRadius:8, fontWeight:600, fontSize:"0.875rem", textDecoration:"none", whiteSpace:"nowrap" }}
                    >
                      <Hotel style={{ width:14, height:14 }} />
                      Apartamentos en Vrbo
                      <ExternalLink style={{ width:12, height:12 }} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginTop:16, padding:14, background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:8 }}>
              <AlertCircle style={{ width:14, height:14, color:"#D97706", flexShrink:0, marginTop:2 }} />
              <p style={{ fontSize:"0.8125rem", color:"#92400E" }}>
                Tarifas actualizadas en <strong>{DATA_LAST_UPDATED}</strong>. Fuente: {DATA_SOURCES} Los puntos necesarios pueden variar si las aerolíneas actualizan sus tablas. Activa una alerta para ser notificado cuando aparezcan asientos reales en tu ruta.
              </p>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
