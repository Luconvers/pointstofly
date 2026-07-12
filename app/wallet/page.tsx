"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plane, Wallet, Plus, Edit2, Save, ExternalLink, CheckCircle,
  Trash2, TrendingUp, ArrowRight, Info, RefreshCw, Lock
} from "lucide-react";
import { PROGRAMS } from "@/lib/programs-data";

interface ProgramBalance {
  programId: string;
  points: number;
  lastUpdated: string;
  connected: boolean; // true = OAuth, false = manual
}

interface AffordableFlight {
  programId: string;
  programName: string;
  route: string;
  cabin: "business" | "first";
  pointsNeeded: number;
  pointsYouHave: number;
  canAfford: boolean;
  pointsShort: number;
  cashToBuy: number; // EUR to buy missing points
  cashEquivalent: number;
  savingsPct: number;
}

// Programs config with manual check URLs and OAuth status
const PROGRAM_CONFIG: Record<string, {
  name: string;
  airline: string;
  logo: string;
  color: string;
  checkUrl: string;
  hasOAuth: boolean;
  oauthNote?: string;
  currency: string; // what the points are called
}> = {
  avios: {
    name: "Avios (Iberia Plus)",
    airline: "Iberia",
    logo: "🇪🇸",
    color: "from-red-600 to-orange-600",
    checkUrl: "https://www.iberia.com/es/iberia-plus/mi-cuenta/",
    hasOAuth: false,
    currency: "Avios",
  },
  avios_ba: {
    name: "Avios (British Airways)",
    airline: "British Airways",
    logo: "🇬🇧",
    color: "from-blue-700 to-blue-900",
    checkUrl: "https://www.britishairways.com/en-gb/executive-club/account/overview",
    hasOAuth: false,
    currency: "Avios",
  },
  flyingblue: {
    name: "Flying Blue",
    airline: "Air France / KLM",
    logo: "💙",
    color: "from-blue-600 to-blue-800",
    checkUrl: "https://www.flyingblue.com/es/account",
    hasOAuth: false,
    currency: "Miles",
  },
  aeroplan: {
    name: "Aeroplan",
    airline: "Air Canada",
    logo: "🍁",
    color: "from-red-600 to-red-800",
    checkUrl: "https://www.aircanada.com/ca/en/aco/home/aeroplan.html",
    hasOAuth: false,
    currency: "Points",
  },
  asiamiles: {
    name: "Asia Miles",
    airline: "Cathay Pacific",
    logo: "🐉",
    color: "from-teal-600 to-teal-800",
    checkUrl: "https://www.asiamiles.com/en/account/overview.html",
    hasOAuth: false,
    currency: "Miles",
  },
  united: {
    name: "MileagePlus",
    airline: "United Airlines",
    logo: "🔵",
    color: "from-blue-500 to-indigo-700",
    checkUrl: "https://www.united.com/en/us/fly/mileageplus.html",
    hasOAuth: true,
    oauthNote: "United tiene API pública — conexión directa disponible pronto",
    currency: "Miles",
  },
  american: {
    name: "AAdvantage",
    airline: "American Airlines",
    logo: "🦅",
    color: "from-gray-600 to-gray-800",
    checkUrl: "https://www.aa.com/aadvantage/createAccount/loginBenefits.do",
    hasOAuth: true,
    oauthNote: "AA tiene API pública — conexión directa disponible pronto",
    currency: "Miles",
  },
  virginatlantic: {
    name: "Flying Club",
    airline: "Virgin Atlantic",
    logo: "💃",
    color: "from-red-600 to-pink-700",
    checkUrl: "https://www.virginatlantic.com/flying-club/account",
    hasOAuth: false,
    currency: "Miles",
  },
};

// What can you book with X points in each program
const REACHABLE_FLIGHTS: Record<string, { route: string; cabin: "business" | "first"; pointsNeeded: number; cashEquivalent: number }[]> = {
  avios: [
    { route: "MAD → JFK", cabin: "business", pointsNeeded: 34000, cashEquivalent: 3200 },
    { route: "MAD → DXB", cabin: "business", pointsNeeded: 40000, cashEquivalent: 4000 },
    { route: "BCN → HKG", cabin: "business", pointsNeeded: 50000, cashEquivalent: 5000 },
    { route: "MAD → NRT", cabin: "business", pointsNeeded: 67500, cashEquivalent: 6500 },
    { route: "LHR → HKG", cabin: "first", pointsNeeded: 100000, cashEquivalent: 10000 },
  ],
  avios_ba: [
    { route: "LHR → JFK", cabin: "business", pointsNeeded: 50000, cashEquivalent: 4000 },
    { route: "LHR → HKG", cabin: "business", pointsNeeded: 50000, cashEquivalent: 5500 },
    { route: "LHR → NRT", cabin: "first", pointsNeeded: 67500, cashEquivalent: 8000 },
  ],
  flyingblue: [
    { route: "AMS → JFK", cabin: "business", pointsNeeded: 50000, cashEquivalent: 3800 },
    { route: "CDG → NRT", cabin: "business", pointsNeeded: 75000, cashEquivalent: 5500 },
    { route: "BCN → GRU", cabin: "business", pointsNeeded: 62500, cashEquivalent: 4200 },
  ],
  aeroplan: [
    { route: "MAD → JFK", cabin: "business", pointsNeeded: 55000, cashEquivalent: 4200 },
    { route: "FRA → NRT", cabin: "business", pointsNeeded: 85000, cashEquivalent: 7000 },
    { route: "FRA → NRT", cabin: "first", pointsNeeded: 87500, cashEquivalent: 12000 },
  ],
  asiamiles: [
    { route: "LHR → HKG", cabin: "business", pointsNeeded: 60000, cashEquivalent: 5500 },
    { route: "LHR → HKG", cabin: "first", pointsNeeded: 100000, cashEquivalent: 10000 },
  ],
  virginatlantic: [
    { route: "JFK → LHR", cabin: "business", pointsNeeded: 50000, cashEquivalent: 4500 },
    { route: "NRT → LAX", cabin: "first", pointsNeeded: 95000, cashEquivalent: 13000 },
  ],
  united: [
    { route: "EWR → LHR", cabin: "business", pointsNeeded: 57500, cashEquivalent: 4000 },
    { route: "IAD → NRT", cabin: "business", pointsNeeded: 70000, cashEquivalent: 6000 },
  ],
  american: [
    { route: "JFK → LHR", cabin: "business", pointsNeeded: 57500, cashEquivalent: 4000 },
    { route: "LAX → NRT", cabin: "business", pointsNeeded: 60000, cashEquivalent: 5500 },
  ],
};

function calculateAffordable(balances: ProgramBalance[]): AffordableFlight[] {
  const results: AffordableFlight[] = [];
  const buyPricePerPoint = 0.0072; // after typical 30% bonus

  for (const balance of balances) {
    if (!balance.points) continue;
    const flights = REACHABLE_FLIGHTS[balance.programId] || [];
    const config = PROGRAM_CONFIG[balance.programId];

    for (const flight of flights) {
      const canAfford = balance.points >= flight.pointsNeeded;
      const pointsShort = Math.max(0, flight.pointsNeeded - balance.points);
      const cashToBuy = canAfford ? 0 : Math.round(pointsShort * buyPricePerPoint);
      const savingsPct = Math.round(((flight.cashEquivalent - cashToBuy) / flight.cashEquivalent) * 100);

      results.push({
        programId: balance.programId,
        programName: config?.name || balance.programId,
        route: flight.route,
        cabin: flight.cabin,
        pointsNeeded: flight.pointsNeeded,
        pointsYouHave: balance.points,
        canAfford,
        pointsShort,
        cashToBuy,
        cashEquivalent: flight.cashEquivalent,
        savingsPct: canAfford ? Math.round(((flight.cashEquivalent - 0) / flight.cashEquivalent) * 100) : savingsPct,
      });
    }
  }

  return results.sort((a, b) => {
    if (a.canAfford && !b.canAfford) return -1;
    if (!a.canAfford && b.canAfford) return 1;
    return a.cashToBuy - b.cashToBuy;
  });
}

const STORAGE_KEY = "ptf_wallet_balances";

function loadBalances(): ProgramBalance[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveBalances(balances: ProgramBalance[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(balances));
}

export default function WalletPage() {
  const [balances, setBalances] = useState<ProgramBalance[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>("avios");
  const [inputPoints, setInputPoints] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPoints, setEditPoints] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBalances(loadBalances());
  }, []);

  const updateBalances = (updated: ProgramBalance[]) => {
    setBalances(updated);
    saveBalances(updated);
  };

  const addBalance = () => {
    if (!inputPoints || isNaN(Number(inputPoints))) return;
    const existing = balances.find(b => b.programId === selectedProgram);
    let updated: ProgramBalance[];
    if (existing) {
      updated = balances.map(b =>
        b.programId === selectedProgram
          ? { ...b, points: Number(inputPoints.replace(/\D/g, "")), lastUpdated: new Date().toLocaleDateString("es-ES") }
          : b
      );
    } else {
      updated = [...balances, {
        programId: selectedProgram,
        points: Number(inputPoints.replace(/\D/g, "")),
        lastUpdated: new Date().toLocaleDateString("es-ES"),
        connected: false,
      }];
    }
    updateBalances(updated);
    setInputPoints("");
    setShowAddForm(false);
  };

  const saveEdit = (programId: string) => {
    const pts = Number(editPoints.replace(/\D/g, ""));
    if (!pts) return;
    const updated = balances.map(b =>
      b.programId === programId
        ? { ...b, points: pts, lastUpdated: new Date().toLocaleDateString("es-ES") }
        : b
    );
    updateBalances(updated);
    setEditingId(null);
  };

  const removeBalance = (programId: string) => {
    updateBalances(balances.filter(b => b.programId !== programId));
  };

  const totalCppValue = balances.reduce((acc, b) => {
    const prog = PROGRAMS.find(p => p.id === b.programId || (b.programId === "avios_ba" && p.id === "avios"));
    return acc + (b.points * ((prog?.cppValue || 1.5) / 100));
  }, 0);

  const affordable = mounted ? calculateAffordable(balances) : [];
  const canAffordCount = affordable.filter(f => f.canAfford).length;
  const availablePrograms = Object.entries(PROGRAM_CONFIG).filter(
    ([id]) => !balances.find(b => b.programId === id)
  );

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-white">PointsToFly</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <Link href="/search" className="hover:text-white transition-colors">Buscar</Link>
            <Link href="/programs" className="hover:text-white transition-colors">Programas</Link>
            <Link href="/calculator" className="hover:text-white transition-colors">Calculadora</Link>
            <Link href="/alerts" className="hover:text-white transition-colors">Alertas</Link>
            <Link href="/wallet" className="text-white font-medium">Mi Cartera</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Wallet className="w-8 h-8 text-blue-400" />
                Mi Cartera de Puntos
              </h1>
              <p className="text-white/50">
                Añade tus saldos de puntos y te decimos qué vuelos Business o First puedes reservar ahora mismo.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex-shrink-0"
            >
              <Plus className="w-4 h-4" /> Añadir programa
            </button>
          </div>

          {/* PRIVACY NOTE */}
          <div className="flex items-start gap-3 bg-green-500/5 border border-green-500/15 rounded-xl p-4 mb-6">
            <Lock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/50">
              <strong className="text-green-400">100% privado.</strong> Tus puntos se guardan solo en este navegador (localStorage).
              No enviamos ningún dato a servidores externos. Nunca te pedimos contraseñas de aerolíneas.
            </p>
          </div>

          {/* SUMMARY STATS */}
          {balances.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="card-glass rounded-2xl p-5">
                <div className="text-xs text-white/40 mb-1">Programas activos</div>
                <div className="text-3xl font-bold text-white">{balances.length}</div>
              </div>
              <div className="card-glass rounded-2xl p-5">
                <div className="text-xs text-white/40 mb-1">Valor total estimado</div>
                <div className="text-3xl font-bold text-green-400">
                  €{Math.round(totalCppValue).toLocaleString()}
                </div>
                <div className="text-xs text-white/30 mt-1">en puntos acumulados</div>
              </div>
              <div className="card-glass rounded-2xl p-5">
                <div className="text-xs text-white/40 mb-1">Vuelos Business alcanzables</div>
                <div className="text-3xl font-bold text-blue-400">{canAffordCount}</div>
                <div className="text-xs text-white/30 mt-1">con tus puntos actuales</div>
              </div>
            </div>
          )}

          {/* ADD PROGRAM FORM */}
          {showAddForm && (
            <div className="card-glass rounded-2xl p-6 mb-6 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-4">Añadir programa de puntos</h3>

              {/* PROGRAM SELECT */}
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-2 block">Selecciona el programa</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availablePrograms.map(([id, config]) => (
                    <button
                      key={id}
                      onClick={() => setSelectedProgram(id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all border text-left ${
                        selectedProgram === id
                          ? "border-blue-500/40 bg-blue-500/10 text-white"
                          : "border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span className="text-xl">{config.logo}</span>
                      <div>
                        <div className="font-medium">{config.name}</div>
                        <div className="text-xs text-white/30">{config.airline}</div>
                      </div>
                      {config.hasOAuth && (
                        <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          API
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {availablePrograms.length === 0 && (
                  <p className="text-white/30 text-sm">Ya has añadido todos los programas disponibles.</p>
                )}
              </div>

              {selectedProgram && PROGRAM_CONFIG[selectedProgram] && (
                <>
                  {/* LINK TO CHECK BALANCE */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/70 text-sm mb-2">
                          Para ver tu saldo de <strong className="text-white">{PROGRAM_CONFIG[selectedProgram].name}</strong>,
                          abre tu cuenta en la web oficial:
                        </p>
                        <a
                          href={PROGRAM_CONFIG[selectedProgram].checkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                        >
                          Ver mi saldo en {PROGRAM_CONFIG[selectedProgram].airline}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        {PROGRAM_CONFIG[selectedProgram].hasOAuth && (
                          <p className="text-white/30 text-xs mt-2">
                            🔌 {PROGRAM_CONFIG[selectedProgram].oauthNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* POINTS INPUT */}
                  <div className="mb-4">
                    <label className="text-xs text-white/40 mb-2 block">
                      ¿Cuántos {PROGRAM_CONFIG[selectedProgram].currency} tienes?
                    </label>
                    <input
                      type="text"
                      value={inputPoints}
                      onChange={(e) => setInputPoints(e.target.value.replace(/\D/g, ""))}
                      placeholder="Ej: 45000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50"
                      onKeyDown={(e) => e.key === "Enter" && addBalance()}
                    />
                    {inputPoints && (
                      <p className="text-xs text-white/30 mt-1">
                        = {Number(inputPoints).toLocaleString("es-ES")} {PROGRAM_CONFIG[selectedProgram].currency}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={addBalance} className="btn-primary flex-1 py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" /> Guardar saldo
                    </button>
                    <button onClick={() => setShowAddForm(false)} className="px-4 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-colors">
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* BALANCES */}
          {balances.length === 0 && !showAddForm ? (
            <div className="card-glass rounded-2xl p-16 text-center">
              <Wallet className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Tu cartera está vacía</h3>
              <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
                Añade tus programas de puntos para ver qué vuelos Business o First puedes reservar ahora mismo.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary px-6 py-3 rounded-xl text-white font-semibold text-sm"
              >
                Añadir primer programa
              </button>
            </div>
          ) : (
            <>
              {/* PROGRAM CARDS */}
              {balances.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {balances.map((balance) => {
                    const config = PROGRAM_CONFIG[balance.programId];
                    if (!config) return null;
                    const isEditing = editingId === balance.programId;
                    const progFlights = REACHABLE_FLIGHTS[balance.programId] || [];
                    const affordableHere = progFlights.filter(f => balance.points >= f.pointsNeeded).length;

                    return (
                      <div key={balance.programId} className="card-glass rounded-2xl overflow-hidden">
                        <div className={`h-1.5 bg-gradient-to-r ${config.color}`} />
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{config.logo}</span>
                              <div>
                                <div className="text-white font-semibold text-sm">{config.name}</div>
                                <div className="text-white/40 text-xs">{config.airline}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingId(balance.programId);
                                  setEditPoints(String(balance.points));
                                }}
                                className="text-white/30 hover:text-white transition-colors p-1"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => removeBalance(balance.programId)} className="text-white/30 hover:text-red-400 transition-colors p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="flex items-center gap-2 mb-4">
                              <input
                                type="text"
                                value={editPoints}
                                onChange={(e) => setEditPoints(e.target.value.replace(/\D/g, ""))}
                                className="flex-1 bg-white/5 border border-blue-500/40 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && saveEdit(balance.programId)}
                              />
                              <button onClick={() => saveEdit(balance.programId)} className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-colors">
                                <Save className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-2 text-white/30 hover:text-white transition-colors">
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="mb-4">
                              <div className="text-3xl font-bold text-white">
                                {balance.points.toLocaleString("es-ES")}
                              </div>
                              <div className="text-white/40 text-xs">{config.currency}</div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {affordableHere > 0 ? (
                                <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-1 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> {affordableHere} vuelo{affordableHere !== 1 ? "s" : ""} alcanzable{affordableHere !== 1 ? "s" : ""}
                                </span>
                              ) : (
                                <span className="text-xs text-white/30">Añade más puntos para alcanzar vuelos Business</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-white/20">
                              <RefreshCw className="w-3 h-3" />
                              {balance.lastUpdated}
                            </div>
                          </div>

                          <a
                            href={config.checkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex items-center gap-1 text-xs text-blue-400/60 hover:text-blue-400 transition-colors"
                          >
                            Ver saldo actualizado en {config.airline} <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}

                  {/* ADD MORE */}
                  {availablePrograms.length > 0 && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="card-glass rounded-2xl p-5 border-dashed flex flex-col items-center justify-center gap-3 text-white/30 hover:text-white/60 hover:border-white/20 transition-all min-h-[140px]"
                    >
                      <Plus className="w-8 h-8" />
                      <span className="text-sm">Añadir otro programa</span>
                    </button>
                  )}
                </div>
              )}

              {/* WHAT CAN I FLY */}
              {affordable.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">¿Qué puedes volar con tus puntos?</h2>
                  <p className="text-white/40 text-sm mb-5">
                    Basado en tus saldos actuales. Los verdes puedes reservar ya. Los amarillos necesitan comprar puntos adicionales.
                  </p>

                  <div className="space-y-3">
                    {affordable.slice(0, 12).map((flight, i) => {
                      const config = PROGRAM_CONFIG[flight.programId];
                      return (
                        <div
                          key={i}
                          className={`card-glass rounded-2xl p-5 transition-all ${
                            flight.canAfford
                              ? "border border-green-500/20 bg-green-500/[0.03]"
                              : "border border-white/5"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-white font-semibold">{flight.route}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  flight.cabin === "first"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-blue-500/20 text-blue-400"
                                }`}>
                                  {flight.cabin === "first" ? "✨ First" : "Business"}
                                </span>
                                {flight.canAfford && (
                                  <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                                    ✓ Tienes suficientes
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-white/40 mb-2">{flight.programName}</div>
                              <div className="flex items-center gap-5 text-sm">
                                <div>
                                  <span className="text-white/30 text-xs">Necesitas </span>
                                  <span className="text-white font-medium">{flight.pointsNeeded.toLocaleString()} pts</span>
                                </div>
                                <div>
                                  <span className="text-white/30 text-xs">Tienes </span>
                                  <span className={`font-medium ${flight.canAfford ? "text-green-400" : "text-white/60"}`}>
                                    {flight.pointsYouHave.toLocaleString()} pts
                                  </span>
                                </div>
                                {!flight.canAfford && (
                                  <div>
                                    <span className="text-white/30 text-xs">Comprar diferencia </span>
                                    <span className="text-yellow-400 font-medium">~€{flight.cashToBuy}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-white/30 text-xs line-through">€{flight.cashEquivalent.toLocaleString()}</div>
                              <div className="text-green-400 font-bold text-sm">
                                {flight.canAfford ? "100% puntos" : `€${flight.cashToBuy} extra`}
                              </div>
                            </div>
                          </div>

                          {/* PROGRESS BAR */}
                          {!flight.canAfford && (
                            <div className="mt-3">
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                                  style={{ width: `${Math.min((flight.pointsYouHave / flight.pointsNeeded) * 100, 100)}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-white/20 mt-1">
                                <span>{Math.round((flight.pointsYouHave / flight.pointsNeeded) * 100)}% completado</span>
                                <span>Faltan {flight.pointsShort.toLocaleString()} pts</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Link href="/search" className="flex-1 flex items-center justify-center gap-2 btn-primary py-3 rounded-xl text-white font-semibold text-sm">
                      <Plane className="w-4 h-4" /> Buscar disponibilidad real
                    </Link>
                    <Link href="/calculator" className="flex-1 flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 py-3 rounded-xl text-white text-sm font-semibold transition-colors">
                      <TrendingUp className="w-4 h-4" /> Calcular si conviene comprar más
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
