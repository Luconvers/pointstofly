"use client";

import { useState } from "react";
import Link from "next/link";
import { Plane, Calculator, TrendingDown, ArrowRight, CheckCircle, Info } from "lucide-react";
import { PROGRAMS } from "@/lib/programs-data";

const POPULAR_CALC_ROUTES = [
  { label: "Madrid → Nueva York", origin: "MAD", dest: "JFK", businessCash: 3200, firstCash: 7000 },
  { label: "Madrid → Tokio", origin: "MAD", dest: "NRT", businessCash: 6500, firstCash: 12000 },
  { label: "Barcelona → Dubai", origin: "BCN", dest: "DXB", businessCash: 4000, firstCash: 9000 },
  { label: "Amsterdam → Hong Kong", origin: "AMS", dest: "HKG", businessCash: 5500, firstCash: 10000 },
  { label: "Madrid → São Paulo", origin: "MAD", dest: "GRU", businessCash: 4200, firstCash: 0 },
  { label: "Barcelona → Bangkok", origin: "BCN", dest: "BKK", businessCash: 5000, firstCash: 11000 },
];

interface CalcResult {
  programId: string;
  programName: string;
  canBuy: boolean;
  pointsNeeded: number;
  buyCost: number;
  buyCostWithBonus: number;
  savings: number;
  savingsPct: number;
  cppEarned: number;
  verdict: "excellent" | "good" | "ok" | "avoid";
  verdictLabel: string;
  verdictColor: string;
}

function calcResults(cashPrice: number, cabin: "business" | "first", bonusPct: number): CalcResult[] {
  const results: CalcResult[] = [];

  const programPoints: Record<string, { business: number; first: number }> = {
    avios:        { business: 40000, first: 80000 },
    flyingblue:   { business: 50000, first: 90000 },
    aeroplan:     { business: 55000, first: 87500 },
    asiamiles:    { business: 60000, first: 100000 },
    virginatlantic: { business: 50000, first: 95000 },
    anamiles:     { business: 75000, first: 55000 },
    milesandmore: { business: 66000, first: 87000 },
  };

  for (const prog of PROGRAMS) {
    const pts = programPoints[prog.id]?.[cabin];
    if (!pts) continue;

    const baseCostPerPoint = 0.012; // EUR, before bonus
    const effectiveMultiplier = 1 + bonusPct / 100;
    const buyCost = prog.canBuyPoints ? Math.round((pts / effectiveMultiplier) * baseCostPerPoint) : 0;
    const buyCostWithBonus = buyCost;
    const savings = cashPrice - buyCostWithBonus;
    const savingsPct = Math.round((savings / cashPrice) * 100);
    const cppEarned = parseFloat(((cashPrice / pts) * 100).toFixed(2));

    let verdict: "excellent" | "good" | "ok" | "avoid" = "avoid";
    let verdictLabel = "";
    let verdictColor = "";

    if (savingsPct >= 80) { verdict = "excellent"; verdictLabel = "🔥 Excelente"; verdictColor = "text-green-400"; }
    else if (savingsPct >= 65) { verdict = "good"; verdictLabel = "✅ Buena opción"; verdictColor = "text-blue-400"; }
    else if (savingsPct >= 45) { verdict = "ok"; verdictLabel = "⚠️ Aceptable"; verdictColor = "text-yellow-400"; }
    else { verdict = "avoid"; verdictLabel = "❌ No vale la pena"; verdictColor = "text-red-400"; }

    if (!prog.canBuyPoints) {
      verdictLabel = "Sin compra directa";
      verdictColor = "text-white/40";
    }

    results.push({
      programId: prog.id,
      programName: prog.name,
      canBuy: prog.canBuyPoints,
      pointsNeeded: pts,
      buyCost,
      buyCostWithBonus,
      savings,
      savingsPct,
      cppEarned,
      verdict,
      verdictLabel,
      verdictColor,
    });
  }

  return results.sort((a, b) => {
    if (!a.canBuy && b.canBuy) return 1;
    if (a.canBuy && !b.canBuy) return -1;
    return b.savingsPct - a.savingsPct;
  });
}

export default function CalculatorPage() {
  const [cashPrice, setCashPrice] = useState<number>(3200);
  const [cabin, setCabin] = useState<"business" | "first">("business");
  const [bonusPct, setBonusPct] = useState<number>(30);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(0);

  const results = calcResults(cashPrice, cabin, bonusPct);
  const bestResult = results.find(r => r.canBuy && r.verdict !== "avoid");

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
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
            <Link href="/calculator" className="text-white">Calculadora</Link>
            <Link href="/alerts" className="hover:text-white transition-colors">Alertas</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Calculator className="w-8 h-8 text-purple-400" />
              Calculadora de Valor Real
            </h1>
            <p className="text-white/50">
              Introduce el precio en cash de tu vuelo y te decimos exactamente cuánto ahorras comprando puntos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* INPUTS */}
            <div className="lg:col-span-1 space-y-4">
              <div className="card-glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Tu vuelo</h3>

                {/* ROUTE PRESETS */}
                <div className="mb-4">
                  <label className="text-xs text-white/40 mb-2 block">Ruta de ejemplo</label>
                  <div className="space-y-1.5">
                    {POPULAR_CALC_ROUTES.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedRoute(i);
                          setCashPrice(cabin === "business" ? r.businessCash : r.firstCash || r.businessCash);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedRoute === i
                            ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                            : "bg-white/5 border border-transparent text-white/50 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CABIN */}
                <div className="mb-4">
                  <label className="text-xs text-white/40 mb-2 block">Cabina</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["business", "first"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCabin(c);
                          if (selectedRoute !== null) {
                            const r = POPULAR_CALC_ROUTES[selectedRoute];
                            const price = c === "first" ? (r.firstCash || r.businessCash) : r.businessCash;
                            setCashPrice(price);
                          }
                        }}
                        className={`py-2 rounded-lg text-xs font-medium transition-all ${
                          cabin === c
                            ? c === "first" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-white/5 text-white/40 border border-transparent hover:border-white/10"
                        }`}
                      >
                        {c === "first" ? "✨ First" : "Business"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CASH PRICE */}
                <div className="mb-4">
                  <label className="text-xs text-white/40 mb-2 block">Precio en cash (€)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">€</span>
                    <input
                      type="number"
                      value={cashPrice}
                      onChange={(e) => setCashPrice(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                {/* BONUS */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-white/40">Bonus al comprar puntos</label>
                    <span className="text-blue-400 text-xs font-bold">+{bonusPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={bonusPct}
                    onChange={(e) => setBonusPct(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-white/20 mt-1">
                    <span>0% (sin promo)</span>
                    <span>100% (mejor promo)</span>
                  </div>
                  <div className="mt-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 text-xs text-blue-400">
                    💡 Flying Blue y Avios suelen ofrecer 25-50% de bonus. Aeroplan llega al 100%.
                  </div>
                </div>
              </div>
            </div>

            {/* RESULTS */}
            <div className="lg:col-span-2">
              {/* BEST DEAL HIGHLIGHT */}
              {bestResult && (
                <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">Mejor opción para este vuelo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold text-lg">{bestResult.programName}</div>
                      <div className="text-white/50 text-sm">{bestResult.pointsNeeded.toLocaleString()} puntos necesarios</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-green-400">€{bestResult.buyCostWithBonus.toLocaleString()}</div>
                      <div className="text-white/40 text-sm line-through">€{cashPrice.toLocaleString()} en cash</div>
                      <div className="text-green-400 text-sm font-bold">Ahorras {bestResult.savingsPct}%</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-white/40">
                    Con +{bonusPct}% bonus al comprar puntos · CPP: €{bestResult.cppEarned} centavos/punto
                  </div>
                </div>
              )}

              {/* ALL RESULTS */}
              <div className="space-y-3">
                {results.map((r) => (
                  <div key={r.programId} className={`card-glass rounded-xl p-4 ${!r.canBuy ? "opacity-50" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-medium">{r.programName}</span>
                            {!r.canBuy && (
                              <span className="text-xs bg-white/10 text-white/40 px-2 py-0.5 rounded-full">
                                Sin compra directa
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-white/30 mt-0.5">
                            {r.pointsNeeded.toLocaleString()} pts · CPP €{r.cppEarned} c/pto
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {r.canBuy ? (
                          <>
                            <div className="text-white font-bold">€{r.buyCostWithBonus.toLocaleString()}</div>
                            <div className={`text-xs font-medium ${r.verdictColor}`}>{r.verdictLabel}</div>
                          </>
                        ) : (
                          <div className={`text-xs ${r.verdictColor}`}>{r.verdictLabel}</div>
                        )}
                      </div>
                    </div>
                    {r.canBuy && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              r.verdict === "excellent" ? "bg-green-500" :
                              r.verdict === "good" ? "bg-blue-500" :
                              r.verdict === "ok" ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(r.savingsPct, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-white/20 mt-1">
                          <span>Ahorro: {r.savingsPct}%</span>
                          <span>Ahorras €{r.savings.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* INFO NOTE */}
              <div className="mt-4 flex items-start gap-3 bg-white/3 border border-white/5 rounded-xl p-4">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/40">
                  Cálculos basados en precio promedio de compra de puntos (~€0.012/pto antes de bonus).
                  El ahorro real varía según la promoción activa. Activa una alerta cuando haya promo en tu programa preferido.
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <Link href="/search" className="flex-1 flex items-center justify-center gap-2 btn-primary py-3 rounded-xl text-white text-sm font-semibold">
                  <Plane className="w-4 h-4" /> Buscar disponibilidad
                </Link>
                <Link href="/alerts" className="flex-1 flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 py-3 rounded-xl text-white text-sm font-semibold transition-colors">
                  <TrendingDown className="w-4 h-4" /> Crear alerta de promo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
