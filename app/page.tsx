"use client";

import Link from "next/link";
import { useState } from "react";
import { Plane, Search, Bell, Calculator, ArrowRight, Check, X, ChevronRight } from "lucide-react";
import { DATA_LAST_UPDATED } from "@/lib/programs-data";

const REAL_BOOKINGS = [
  { route: "Madrid → Nueva York", cabin: "Business", program: "Iberia Avios", airline: "Iberia", points: "34.000", cash: "€3.200", paid: "€408", savings: "87%" },
  { route: "Barcelona → Dubai", cabin: "Business", program: "Avios (Qatar)", airline: "Qatar Airways", points: "40.000", cash: "€4.000", paid: "€480", savings: "88%" },
  { route: "Madrid → Tokio", cabin: "Business", program: "Avios (JAL)", airline: "Japan Airlines", points: "67.500", cash: "€6.500", paid: "€810", savings: "88%" },
  { route: "Amsterdam → Hong Kong", cabin: "First", program: "Asia Miles", airline: "Cathay Pacific", points: "100.000", cash: "€10.000", paid: "€1.200", savings: "88%" },
  { route: "Frankfurt → Chicago", cabin: "Business", program: "Aeroplan", airline: "Lufthansa", points: "55.000", cash: "€4.500", paid: "€660", savings: "85%" },
];

const FEATURES = [
  { icon: <Search className="w-5 h-5" />, title: "Busca en 20+ programas", desc: "Un solo lugar para ver disponibilidad en Avios, Flying Blue, Aeroplan y más.", href: "/search" },
  { icon: <Plane className="w-5 h-5" />, title: "Multi-ciudad", desc: "Combina hasta 5 segmentos con aerolíneas distintas. Ideal para round-the-world.", href: "/search" },
  { icon: <Calculator className="w-5 h-5" />, title: "Calculadora de ahorro", desc: "Introduce el precio en cash y te decimos exactamente cuánto ahorras con puntos.", href: "/calculator" },
  { icon: <Bell className="w-5 h-5" />, title: "Alertas de disponibilidad", desc: "Aviso inmediato cuando aparecen asientos Business en tu ruta. Hasta 12 meses.", href: "/alerts" },
];

const PROGRAMS = [
  { name: "Avios", note: "Iberia / British Airways / Qatar", buyable: true, best: "Oneworld" },
  { name: "Flying Blue", note: "Air France / KLM", buyable: true, best: "Promo Awards −50%" },
  { name: "Aeroplan", note: "Air Canada + Star Alliance", buyable: true, best: "Mejor Star Alliance" },
  { name: "Virgin Flying Club", note: "Virgin Atlantic", buyable: true, best: "Único para Delta One" },
  { name: "Asia Miles", note: "Cathay Pacific", buyable: true, best: "Cathay First" },
  { name: "Miles & More", note: "Lufthansa Group", buyable: false, best: "LH First Class" },
  { name: "ANA Miles", note: "ANA All Nippon", buyable: false, best: "Mejor valor CPP" },
];

export default function HomePage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <div style={{ background: "#F4F5F7", color: "#111827", minHeight: "100vh" }}>

      {/* NAV */}
      <header style={{ borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, background: "#ffffff", zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, background: "#1D4ED8", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plane style={{ width: 14, height: 14, color: "#ffffff" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>PointsToFly</span>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <Link href="/search" className="nav-link">Buscar</Link>
            <Link href="/programs" className="nav-link">Programas</Link>
            <Link href="/calculator" className="nav-link">Calculadora</Link>
            <Link href="/alerts" className="nav-link">Alertas</Link>
            <Link href="/wallet" className="nav-link">Mis puntos</Link>
          </nav>
          <Link href="/search" className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.875rem", textDecoration: "none", display: "inline-block" }}>
            Buscar gratis
          </Link>
        </div>
      </header>

      {/* HERO — texto grande, blanco puro, sin colores */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 64px" }}>
        <p className="section-label" style={{ marginBottom: 20 }}>Sistema de award travel · Europa</p>
        <h1 style={{ fontSize: "clamp(2.4rem, 5.5vw, 4rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: 780, marginBottom: 20 }}>
          Business Class por el precio<br />de un vuelo de economy.
        </h1>
        <p style={{ fontSize: "1.125rem", color: "#6B7280", maxWidth: 520, lineHeight: 1.6, marginBottom: 40 }}>
          Encuentra asientos Business y First con puntos de fidelidad.
          Busca disponibilidad real en 20 programas. Hasta 12 meses de antelación.
        </p>

        {/* SEARCH BOX */}
        <div className="card" style={{ maxWidth: 560, padding: 20, marginBottom: 40 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <input
              className="input"
              style={{ padding: "11px 14px" }}
              placeholder="Origen — Madrid, Barcelona..."
              value={origin}
              onChange={e => setOrigin(e.target.value)}
            />
            <input
              className="input"
              style={{ padding: "11px 14px" }}
              placeholder="Destino — Nueva York, Tokio..."
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
          </div>
          <Link
            href="/search"
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", fontSize: "0.9375rem", textDecoration: "none", width: "100%", borderRadius: 8 }}
          >
            <Search style={{ width: 16, height: 16 }} />
            Ver disponibilidad de awards
          </Link>
        </div>

        {/* TRUST ITEMS */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
          {["20+ programas de puntos", "Hasta 12 meses de antelación", "Multi-ciudad", "Sin tarjeta de crédito"].map(item => (
            <span key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem", color: "#6B7280" }}>
              <Check style={{ width: 14, height: 14, color: "#059669" }} />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* REAL SAVINGS — la signature: números grandes */}
      <section style={{ borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", background: "#ffffff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="section-label" style={{ marginBottom: 8 }}>Reservas reales</p>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Lo que el sistema permite
              </h2>
            </div>
            <Link href="/calculator" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.875rem", color: "#1D4ED8", textDecoration: "none", fontWeight: 500 }}>
              Calcula el tuyo <ChevronRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                  {["Ruta", "Aerolínea", "Programa", "Cabina", "Precio cash", "Con puntos", "Ahorro"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9CA3AF", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {REAL_BOOKINGS.map((b, i) => (
                  <tr key={i} className="table-row">
                    <td style={{ padding: "16px", fontWeight: 600, fontSize: "0.9375rem", whiteSpace: "nowrap" }}>{b.route}</td>
                    <td style={{ padding: "16px", color: "#6B7280", fontSize: "0.875rem" }}>{b.airline}</td>
                    <td style={{ padding: "16px", fontSize: "0.875rem" }}>
                      <span className="badge badge-blue">{b.program}</span>
                    </td>
                    <td style={{ padding: "16px", fontSize: "0.875rem" }}>
                      <span className={b.cabin === "First" ? "badge badge-gold" : "badge badge-gray"}>
                        {b.cabin}
                      </span>
                    </td>
                    <td style={{ padding: "16px", color: "#9CA3AF", fontSize: "0.875rem" }}>
                      <span className="price-strike">{b.cash}</span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>{b.paid}</span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span className="badge badge-green" style={{ fontSize: "0.8125rem", fontWeight: 700 }}>{b.savings}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize:"0.75rem", color:"#9CA3AF", marginTop:12 }}>
            Tarifas actualizadas en {DATA_LAST_UPDATED} · Fuente: tablas oficiales de cada programa de fidelidad
          </p>
        </div>
      </section>

      {/* VS SECTION */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}>
        <p className="section-label" style={{ marginBottom: 16 }}>Por qué funciona</p>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>
          No es un truco. Es un sistema.
        </h2>
        <p style={{ color: "#6B7280", marginBottom: 48, maxWidth: 480 }}>
          Los "travel hacks" dependen de la suerte. Esto funciona igual cada vez.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 860 }}>
          {/* LEFT — travel hacks */}
          <div className="card" style={{ padding: "32px" }}>
            <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#9CA3AF", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              "Travel hacks"
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "Upgrades aleatorios que rara vez llegan",
                "Tarifas error que cancelan sin avisar",
                "Imposible planificar con meses de antelación",
                "No sabes cuánto ahorras realmente",
              ].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <X style={{ width: 16, height: 16, color: "#DC2626", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "0.9375rem", color: "#6B7280" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — our system */}
          <div className="card" style={{ padding: "32px", borderColor: "#1D4ED8", borderWidth: 2 }}>
            <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1D4ED8", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              PointsToFly
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "Business Class completo, todos los beneficios",
                "Precios reales — sin riesgo de cancelación",
                "Planifica hasta 12 meses por adelantado",
                "Calculas exactamente cuánto gastas antes de reservar",
              ].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Check style={{ width: 16, height: 16, color: "#059669", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "0.9375rem", color: "#111827", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "#ffffff", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}>
          <p className="section-label" style={{ marginBottom: 16 }}>Herramientas</p>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 48 }}>
            Todo en un solo lugar
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {FEATURES.map(f => (
              <Link key={f.title} href={f.href} style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "24px", height: "100%" }}>
                  <div style={{ width: 36, height: 36, background: "#EFF6FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: "#1D4ED8" }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: 8, color: "#111827" }}>{f.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6, marginBottom: 16 }}>{f.desc}</p>
                  <span style={{ fontSize: "0.8125rem", color: "#1D4ED8", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                    Abrir <ArrowRight style={{ width: 13, height: 13 }} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}>
        <p className="section-label" style={{ marginBottom: 16 }}>Programas de puntos</p>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Los 7 que realmente importan
          </h2>
          <Link href="/programs" style={{ fontSize: "0.875rem", color: "#1D4ED8", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
            Ver comparativa completa <ChevronRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>

        <div className="card" style={{ overflow: "hidden" }}>
          {PROGRAMS.map((p, i) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderBottom: i < PROGRAMS.length - 1 ? "1px solid #E5E7EB" : "none",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 180 }}>
                <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{p.name}</span>
                <span style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>{p.note}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span className="badge badge-blue">{p.best}</span>
                {p.buyable
                  ? <span className="badge badge-green">Puntos comprables</span>
                  : <span className="badge badge-gray">Solo transferencia</span>
                }
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#ffffff", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}>
          <p className="section-label" style={{ marginBottom: 16 }}>Proceso</p>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 48 }}>
            Cómo funciona en 4 pasos
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { n: "1", title: "Elige destino y fechas", desc: "Introduce origen, destino y ventana de fechas. Hasta 12 meses de antelación." },
              { n: "2", title: "Ve la disponibilidad real", desc: "El motor busca en 20+ programas y muestra qué asientos existen y cuántos puntos cuestan." },
              { n: "3", title: "Calcula si conviene comprar puntos", desc: "Te decimos si hay promoción activa y cuánto costaría comprar los puntos necesarios." },
              { n: "4", title: "Sigue la guía de booking", desc: "Instrucciones paso a paso para cada programa: dónde buscar, qué teléfono llamar." },
            ].map(s => (
              <div key={s.n} className="card" style={{ padding: "24px" }}>
                <span style={{ display: "block", fontSize: "1.5rem", fontWeight: 800, color: "#E5E7EB", marginBottom: 16, letterSpacing: "-0.02em" }}>{s.n}</span>
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
          Busca tu próximo vuelo Business
        </h2>
        <p style={{ color: "#6B7280", marginBottom: 32, fontSize: "1rem" }}>
          Sin registrarte. Sin tarjeta. Ahora mismo.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/search" className="btn-primary" style={{ padding: "12px 24px", fontSize: "0.9375rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Search style={{ width: 16, height: 16 }} />
            Buscar vuelos en Business
          </Link>
          <Link href="/calculator" className="btn-secondary" style={{ padding: "12px 24px", fontSize: "0.9375rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Calculator style={{ width: 16, height: 16 }} />
            Calcular ahorro
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #E5E7EB", padding: "28px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 22, background: "#1D4ED8", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plane style={{ width: 11, height: 11, color: "#ffffff" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>PointsToFly</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Buscar", "Programas", "Calculadora", "Alertas", "Mis puntos"].map((label, i) => {
              const hrefs = ["/search", "/programs", "/calculator", "/alerts", "/wallet"];
              return <Link key={label} href={hrefs[i]} className="nav-link" style={{ fontSize: "0.8125rem" }}>{label}</Link>;
            })}
          </div>
          <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>© 2025 PointsToFly</span>
        </div>
      </footer>
    </div>
  );
}
