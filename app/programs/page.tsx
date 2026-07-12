"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Plane, Star, CheckCircle, XCircle, TrendingUp, Shield, ArrowRight, ShoppingCart, Hotel, Car, UtensilsCrossed, CreditCard, Gift, Zap, ExternalLink } from "lucide-react";
import { PROGRAMS, type LoyaltyProgram, type EarnMethod } from "@/lib/programs-data";

type FilterCabin = "all" | "business" | "first";
type FilterBuyable = "all" | "buyable" | "transfer";

const ALLIANCE_COLORS: Record<string, string> = {
  oneworld: "bg-red-500/20 text-red-400 border-red-500/20",
  star_alliance: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  skyteam: "bg-teal-500/20 text-teal-400 border-teal-500/20",
  independent: "bg-purple-500/20 text-purple-400 border-purple-500/20",
};

const ALLIANCE_LABELS: Record<string, string> = {
  oneworld: "Oneworld",
  star_alliance: "Star Alliance",
  skyteam: "SkyTeam",
  independent: "Independiente",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

const EARN_CATEGORY_CONFIG: Record<EarnMethod["category"], { icon: ReactNode; label: string; color: string }> = {
  shopping:    { icon: <ShoppingCart className="w-3.5 h-3.5" />, label: "Shopping",     color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  hotel:       { icon: <Hotel className="w-3.5 h-3.5" />,        label: "Hoteles",      color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  car:         { icon: <Car className="w-3.5 h-3.5" />,          label: "Coches",       color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
  dining:      { icon: <UtensilsCrossed className="w-3.5 h-3.5" />, label: "Restaurantes", color: "bg-red-500/15 text-red-400 border-red-500/20" },
  credit_card: { icon: <CreditCard className="w-3.5 h-3.5" />,   label: "Tarjeta",      color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  partner:     { icon: <Gift className="w-3.5 h-3.5" />,         label: "Partner",      color: "bg-teal-500/15 text-teal-400 border-teal-500/20" },
  promo:       { icon: <Zap className="w-3.5 h-3.5" />,          label: "Promo",        color: "bg-green-500/15 text-green-400 border-green-500/20" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`}
        />
      ))}
      <span className="text-xs text-white/40 ml-1">{rating}</span>
    </div>
  );
}

export default function ProgramsPage() {
  const [selected, setSelected] = useState<LoyaltyProgram | null>(null);
  const [filterCabin, setFilterCabin] = useState<FilterCabin>("all");
  const [filterBuyable, setFilterBuyable] = useState<FilterBuyable>("all");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filtered = PROGRAMS.filter(p => {
    if (filterCabin !== "all" && !p.cabinsAvailable.includes(filterCabin)) return false;
    if (filterBuyable === "buyable" && !p.canBuyPoints) return false;
    if (filterBuyable === "transfer" && p.canBuyPoints) return false;
    return true;
  });

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const comparePrograms = PROGRAMS.filter(p => compareIds.includes(p.id));

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
            <Link href="/programs" className="text-white">Programas</Link>
            <Link href="/calculator" className="hover:text-white transition-colors">Calculadora</Link>
            <Link href="/alerts" className="hover:text-white transition-colors">Alertas</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Comparador de Programas</h1>
            <p className="text-white/50">Los 7 programas que realmente sirven para Business y First Class. Cuáles comprar, cuáles transferir.</p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
              {(["all", "business", "first"] as FilterCabin[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterCabin(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCabin === f ? "bg-blue-600 text-white" : "text-white/50 hover:text-white"}`}
                >
                  {f === "all" ? "Todos" : f === "business" ? "Business" : "✨ First"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
              {([["all", "Todos"], ["buyable", "Comprables"], ["transfer", "Solo transferencia"]] as [FilterBuyable, string][]).map(([f, label]) => (
                <button
                  key={f}
                  onClick={() => setFilterBuyable(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterBuyable === f ? "bg-green-600 text-white" : "text-white/50 hover:text-white"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {compareIds.length > 0 && (
              <div className="ml-auto flex items-center gap-2 text-sm text-white/50">
                Comparando {compareIds.length}/3
                <button onClick={() => setCompareIds([])} className="text-red-400 text-xs hover:text-red-300">Limpiar</button>
              </div>
            )}
          </div>

          {/* COMPARE TABLE */}
          {compareIds.length >= 2 && (
            <div className="card-glass rounded-2xl p-6 mb-8 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-4">Comparativa directa</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <td className="text-white/40 pb-3 pr-4 font-medium">Característica</td>
                      {comparePrograms.map(p => (
                        <td key={p.id} className="text-white pb-3 pr-4 font-semibold">{p.name}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {[
                      { label: "Alianza", key: (p: LoyaltyProgram) => ALLIANCE_LABELS[p.alliance] },
                      { label: "Comprable", key: (p: LoyaltyProgram) => p.canBuyPoints ? "✅ Sí" : "❌ No" },
                      { label: "Bonus máx. compra", key: (p: LoyaltyProgram) => p.canBuyPoints ? `+${p.typicalBonusPercent}%` : "N/A" },
                      { label: "Valor CPP (€)", key: (p: LoyaltyProgram) => `€${(p.cppValue / 100).toFixed(2)}/pto` },
                      { label: "Dificultad", key: (p: LoyaltyProgram) => DIFFICULTY_LABEL[p.difficulty] },
                      { label: "Valoración", key: (p: LoyaltyProgram) => `${p.rating}/5` },
                    ].map(row => (
                      <tr key={row.label} className="border-t border-white/5">
                        <td className="text-white/40 py-2.5 pr-4">{row.label}</td>
                        {comparePrograms.map(p => (
                          <td key={p.id} className="text-white py-2.5 pr-4">{row.key(p)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROGRAM GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            {filtered.map((prog) => (
              <div
                key={prog.id}
                className={`card-glass rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  selected?.id === prog.id ? "border border-blue-500/40" : ""
                }`}
                onClick={() => setSelected(selected?.id === prog.id ? null : prog)}
              >
                <div className="p-5">
                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{prog.logo}</span>
                        <div>
                          <h3 className="text-white font-bold">{prog.name}</h3>
                          <p className="text-white/40 text-xs">{prog.airline}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${ALLIANCE_COLORS[prog.alliance]}`}>
                          {ALLIANCE_LABELS[prog.alliance]}
                        </span>
                        {prog.canBuyPoints ? (
                          prog.buyPointsUrl ? (
                            <a
                              href={prog.buyPointsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full hover:bg-green-500/30 transition-colors flex items-center gap-1"
                            >
                              <ShoppingCart className="w-3 h-3" /> Comprar puntos
                            </a>
                          ) : (
                            <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                              Comprable
                            </span>
                          )
                        ) : (
                          <span className="text-xs bg-white/10 text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                            Solo transferencia
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <StarRating rating={prog.rating} />
                      <div className={`text-xs mt-1 ${DIFFICULTY_COLOR[prog.difficulty]}`}>
                        {DIFFICULTY_LABEL[prog.difficulty]}
                      </div>
                    </div>
                  </div>

                  {/* METRICS */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-xs text-white/30 mb-1">CPP valor</div>
                      <div className="text-white font-bold text-sm">€{(prog.cppValue / 100).toFixed(2)}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-xs text-white/30 mb-1">Bonus compra</div>
                      <div className={`font-bold text-sm ${prog.canBuyPoints ? "text-green-400" : "text-white/30"}`}>
                        {prog.canBuyPoints ? `+${prog.typicalBonusPercent}%` : "—"}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-xs text-white/30 mb-1">Cabinas</div>
                      <div className="text-white text-xs">
                        {prog.cabinsAvailable.map(c => c === "first" ? "✨" : c === "business" ? "💼" : "🪑").join(" ")}
                      </div>
                    </div>
                  </div>

                  {/* BEST FOR */}
                  <div className="mb-3">
                    <div className="text-xs text-white/30 mb-1.5">Mejor para:</div>
                    <div className="flex flex-wrap gap-1">
                      {prog.bestFor.slice(0, 3).map(b => (
                        <span key={b} className="text-xs bg-blue-500/10 text-blue-400/80 border border-blue-500/10 rounded-lg px-2 py-0.5">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* COMPARE CHECKBOX */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleCompare(prog.id); }}
                      className={`flex items-center gap-2 text-xs transition-all ${
                        compareIds.includes(prog.id) ? "text-blue-400" : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        compareIds.includes(prog.id) ? "border-blue-500 bg-blue-500/20" : "border-white/20"
                      }`}>
                        {compareIds.includes(prog.id) && <CheckCircle className="w-3 h-3" />}
                      </div>
                      Comparar
                    </button>
                    <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      Ver detalles <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* EXPANDED */}
                {selected?.id === prog.id && (
                  <div className="border-t border-white/5 p-5 bg-white/[0.02]">
                    <p className="text-white/60 text-sm mb-4">{prog.notes}</p>

                    <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Aerolíneas partner</h4>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {prog.partnerAirlines.map(a => (
                        <span key={a} className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white/60">{a}</span>
                      ))}
                    </div>

                    {prog.minRedemption.length > 0 && (
                      <>
                        <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Ejemplos de canje</h4>
                        <div className="space-y-2">
                          {prog.minRedemption.map((r, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                              <div>
                                <div className="text-white text-sm font-medium">{r.route}</div>
                                <div className="text-white/40 text-xs">{r.cabin === "first" ? "✨ First" : "Business"}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-blue-400 font-bold">{r.points.toLocaleString()} pts</div>
                                <div className="text-white/30 text-xs line-through">€{r.cashValue.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {prog.earnMethods.length > 0 && (
                      <>
                        <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 mt-2">Cómo ganar puntos sin volar</h4>
                        <div className="space-y-2 mb-4">
                          {prog.earnMethods.map((m, i) => {
                            const cat = EARN_CATEGORY_CONFIG[m.category];
                            return (
                              <div key={i} className="flex items-start justify-between gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5">
                                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${cat.color}`}>
                                    {cat.icon} {cat.label}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-white text-xs font-medium">{m.label}</div>
                                    <div className="text-white/40 text-xs leading-relaxed">{m.detail}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {m.pointsPer && (
                                    <span className="text-xs text-green-400 font-medium whitespace-nowrap">{m.pointsPer}</span>
                                  )}
                                  {m.url && (
                                    <a
                                      href={m.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-white/30 hover:text-white transition-colors"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    <div className="flex gap-3 mt-4">
                      <Link
                        href="/calculator"
                        className="flex-1 flex items-center justify-center gap-2 btn-primary py-2.5 rounded-xl text-white text-sm font-semibold"
                      >
                        <TrendingUp className="w-4 h-4" /> Calcular ahorro
                      </Link>
                      <Link
                        href="/search"
                        className="flex-1 flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors"
                      >
                        <Plane className="w-4 h-4" /> Buscar vuelos
                      </Link>
                    </div>
                    {prog.canBuyPoints && prog.buyPointsUrl && (
                      <a
                        href={prog.buyPointsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 w-full flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 py-2.5 rounded-xl text-green-400 text-sm font-semibold transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" /> Comprar puntos en {prog.airline.split(" / ")[0]}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* KEY INSIGHT BOX */}
          <div className="card-glass rounded-2xl p-6 border border-yellow-500/10">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-2">El secreto que nadie te cuenta</h3>
                <div className="space-y-2 text-sm text-white/60">
                  <p>
                    <strong className="text-white">Flying Blue:</strong> Publica &quot;Promo Awards&quot; el primer martes de cada mes con 25-50% descuento.
                    Si tu ruta es AF/KLM, espera a esa fecha.
                  </p>
                  <p>
                    <strong className="text-white">Avios (Iberia):</strong> La tarifa Iberia Avios para vuelos JFK es diferente (más barata) que BA Avios para el mismo vuelo.
                    Siempre compara las dos.
                  </p>
                  <p>
                    <strong className="text-white">Virgin Flying Club:</strong> El único programa que permite canjear Delta One Business con puntos comprados.
                    Delta no te deja usar sus propios puntos en Business fácilmente.
                  </p>
                  <p>
                    <strong className="text-white">Aeroplan:</strong> Accede a Lufthansa First Class sin fuel surcharges — algo que ni Miles & More permite hacer fácilmente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
