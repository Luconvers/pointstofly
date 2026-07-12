"use client";

import { useState } from "react";
import Link from "next/link";
import { Plane, Bell, Plus, Trash2, CheckCircle, Clock, Zap, Lock, Star, X } from "lucide-react";

// Reemplaza con tu link de pago de Stripe cuando lo configures
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/YOUR_PAYMENT_LINK";

const FREE_ALERT_LIMIT = 1;
const FREE_DATE_RANGE_DAYS = 30;

interface Alert {
  id: number;
  origin: string;
  destination: string;
  cabin: "business" | "first" | "economy";
  programs: string[];
  dateFrom: string;
  dateTo: string;
  active: boolean;
  lastChecked: string;
}

const SAMPLE_ALERTS: Alert[] = [
  { id: 1, origin: "MAD", destination: "NRT", cabin: "business", programs: ["avios", "flyingblue"], dateFrom: "2026-03-01", dateTo: "2026-03-31", active: true, lastChecked: "Hace 12 min" },
  { id: 2, origin: "BCN", destination: "DXB", cabin: "business", programs: ["avios"], dateFrom: "2026-04-10", dateTo: "2026-04-20", active: true, lastChecked: "Hace 28 min" },
];

const PROGRAMS_LIST = [
  { id: "avios", name: "Avios (BA/Iberia)" },
  { id: "flyingblue", name: "Flying Blue" },
  { id: "aeroplan", name: "Aeroplan" },
  { id: "asiamiles", name: "Asia Miles" },
  { id: "virginatlantic", name: "Virgin Flying Club" },
  { id: "anamiles", name: "ANA Miles" },
  { id: "milesandmore", name: "Miles & More" },
];

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="card-glass rounded-2xl p-8 max-w-md w-full border border-yellow-500/20 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">PointsToFly Premium</h3>
            <p className="text-white/40 text-sm">Desbloquea todas las alertas</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { free: "1 alerta activa",         premium: "Alertas ilimitadas" },
            { free: "Máx. 30 días de ventana", premium: "Hasta 12 meses" },
            { free: "1 programa por alerta",   premium: "Todos los programas" },
            { free: "Email diario",             premium: "Notificación inmediata" },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                <Lock className="w-3 h-3 text-white/30 flex-shrink-0" />
                <span className="text-white/40 text-xs">{row.free}</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2">
                <CheckCircle className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                <span className="text-yellow-300 text-xs font-medium">{row.premium}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-6 text-center">
          <div className="text-3xl font-bold text-white mb-1">€9<span className="text-lg font-normal text-white/40">/mes</span></div>
          <div className="text-white/40 text-xs">Cancela cuando quieras</div>
        </div>

        <a
          href={STRIPE_PAYMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm"
        >
          <Star className="w-4 h-4" /> Activar Premium por €9/mes
        </a>
        <p className="text-center text-white/20 text-xs mt-3">Pago seguro con Stripe · Sin permanencia</p>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(SAMPLE_ALERTS);
  const [showForm, setShowForm] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPremium] = useState(false); // TODO: conectar con Stripe webhook
  const [newAlert, setNewAlert] = useState<{
    origin: string; destination: string; cabin: "business" | "first" | "economy";
    programs: string[]; dateFrom: string; dateTo: string;
  }>({
    origin: "", destination: "", cabin: "business",
    programs: [], dateFrom: "", dateTo: "",
  });
  const [saved, setSaved] = useState(false);

  const toggleProgram = (id: string) => {
    setNewAlert(prev => ({
      ...prev,
      programs: prev.programs.includes(id)
        ? prev.programs.filter(p => p !== id)
        : [...prev.programs, id],
    }));
  };

  const handleNewAlert = () => {
    if (!isPremium && alerts.filter(a => a.active).length >= FREE_ALERT_LIMIT) {
      setShowUpgrade(true);
    } else {
      setShowForm(true);
    }
  };

  const handleDateTo = (value: string) => {
    if (!isPremium && newAlert.dateFrom) {
      const from = new Date(newAlert.dateFrom);
      const to = new Date(value);
      const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > FREE_DATE_RANGE_DAYS) {
        setShowUpgrade(true);
        return;
      }
    }
    setNewAlert(p => ({ ...p, dateTo: value }));
  };

  const saveAlert = () => {
    if (!newAlert.origin || !newAlert.destination || !newAlert.dateFrom) return;
    const alert: Alert = {
      id: Date.now(),
      ...newAlert,
      programs: newAlert.programs.length ? newAlert.programs : ["avios"],
      active: true,
      lastChecked: "Ahora",
    };
    setAlerts(prev => [alert, ...prev]);
    setNewAlert({ origin: "", destination: "", cabin: "business", programs: [], dateFrom: "", dateTo: "" });
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const deleteAlert = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id));
  const toggleAlert = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
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
            <Link href="/alerts" className="text-white">Alertas</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Bell className="w-8 h-8 text-yellow-400" />
                Alertas de Disponibilidad
              </h1>
              <p className="text-white/50">Te avisamos cuando aparezcan asientos Business o First en tus rutas.</p>
            </div>
            <button
              onClick={handleNewAlert}
              className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> Nueva alerta
            </button>
          </div>

          {/* PLAN BANNER */}
          {!isPremium && (
            <div className="flex items-center justify-between gap-4 bg-yellow-500/5 border border-yellow-500/15 rounded-xl p-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">Plan gratuito — 1 alerta activa · máx. 30 días</p>
                  <p className="text-white/40 text-xs">Premium desbloquea alertas ilimitadas hasta 12 meses</p>
                </div>
              </div>
              <button
                onClick={() => setShowUpgrade(true)}
                className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 px-4 py-2 rounded-xl text-yellow-300 text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <Star className="w-3.5 h-3.5" /> Activar Premium €9/mes
              </button>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">¡Alerta creada! Te avisaremos cuando haya disponibilidad.</span>
            </div>
          )}

          {/* NEW ALERT FORM */}
          {showForm && (
            <div className="card-glass rounded-2xl p-6 mb-6 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-4">Nueva Alerta</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input
                  value={newAlert.origin}
                  onChange={e => setNewAlert(p => ({ ...p, origin: e.target.value.toUpperCase() }))}
                  placeholder="Origen (MAD)"
                  maxLength={3}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50 uppercase"
                />
                <input
                  value={newAlert.destination}
                  onChange={e => setNewAlert(p => ({ ...p, destination: e.target.value.toUpperCase() }))}
                  placeholder="Destino (NRT)"
                  maxLength={3}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-blue-500/50 uppercase"
                />
              </div>

              {/* CABIN */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-white/40 text-xs">Cabina:</span>
                {(["business", "first", "economy"] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setNewAlert(p => ({ ...p, cabin: c }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      newAlert.cabin === c
                        ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                        : "border-white/10 text-white/40 hover:text-white"
                    }`}
                  >
                    {c === "first" ? "✨ First" : c === "business" ? "Business" : "Economy"}
                  </button>
                ))}
              </div>

              {/* DATES */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Desde</label>
                  <input
                    type="date"
                    value={newAlert.dateFrom}
                    onChange={e => setNewAlert(p => ({ ...p, dateFrom: e.target.value }))}
                    min={new Date().toISOString().split("T")[0]}
                    max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">
                    Hasta {!isPremium && <span className="text-yellow-400/60">(máx. 30 días en plan free)</span>}
                  </label>
                  <input
                    type="date"
                    value={newAlert.dateTo}
                    onChange={e => handleDateTo(e.target.value)}
                    min={newAlert.dateFrom || new Date().toISOString().split("T")[0]}
                    max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              {/* PROGRAMS */}
              <div className="mb-4">
                <label className="text-xs text-white/40 mb-2 block">Programas a monitorear (selecciona todos los que quieras)</label>
                <div className="flex flex-wrap gap-2">
                  {PROGRAMS_LIST.map(p => (
                    <button
                      key={p.id}
                      onClick={() => toggleProgram(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        newAlert.programs.includes(p.id)
                          ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                          : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveAlert}
                  className="btn-primary flex-1 py-3 rounded-xl text-white font-semibold text-sm"
                >
                  Guardar alerta
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* INFO BOXES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <Zap className="w-5 h-5 text-yellow-400" />, title: "Tiempo real", desc: "Comprobamos disponibilidad cada 30 minutos en todos tus programas." },
              { icon: <Clock className="w-5 h-5 text-blue-400" />, title: "Hasta 12 meses", desc: "Crea alertas con hasta un año de anticipación para las mejores fechas." },
              { icon: <Bell className="w-5 h-5 text-green-400" />, title: "Email + Push", desc: "Notificación inmediata cuando aparece un asiento Business o First." },
            ].map((b) => (
              <div key={b.title} className="card-glass rounded-xl p-4">
                <div className="mb-2">{b.icon}</div>
                <div className="text-white text-sm font-medium mb-1">{b.title}</div>
                <div className="text-white/40 text-xs">{b.desc}</div>
              </div>
            ))}
          </div>

          {/* ALERTS LIST */}
          <h2 className="text-white font-semibold mb-4">Tus alertas activas ({alerts.filter(a => a.active).length})</h2>

          {alerts.length === 0 ? (
            <div className="card-glass rounded-2xl p-12 text-center">
              <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 mb-4">No tienes alertas activas</p>
              <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-3 rounded-xl text-white font-semibold text-sm">
                Crear primera alerta
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`card-glass rounded-2xl p-5 transition-all ${!alert.active ? "opacity-50" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-semibold text-lg">
                          {alert.origin} → {alert.destination}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          alert.cabin === "first"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {alert.cabin === "first" ? "✨ First" : "Business"}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          alert.active ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"
                        }`}>
                          {alert.active ? "● Activa" : "Pausada"}
                        </span>
                      </div>
                      <div className="text-sm text-white/40 mb-2">
                        {new Date(alert.dateFrom).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                        {alert.dateTo && ` → ${new Date(alert.dateTo).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {alert.programs.map(p => (
                          <span key={p} className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 text-white/50">
                            {PROGRAMS_LIST.find(pl => pl.id === p)?.name || p}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/30">
                        <Clock className="w-3 h-3" />
                        Última comprobación: {alert.lastChecked}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          alert.active
                            ? "border-white/20 text-white/40 hover:text-white hover:border-white/40"
                            : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                        }`}
                      >
                        {alert.active ? "Pausar" : "Activar"}
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="text-white/30 hover:text-red-400 transition-colors p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 card-glass rounded-2xl p-6 border border-yellow-500/10">
            <div className="flex items-start gap-4">
              <Bell className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">¿Cómo funcionan las alertas?</h3>
                <p className="text-white/50 text-sm mb-3">
                  Monitoreamos disponibilidad en todos los programas que selecciones cada 30 minutos.
                  Cuando aparece un asiento Business o First en tu ruta y rango de fechas, recibes un email inmediato
                  con instrucciones de cómo hacer el booking antes de que el asiento desaparezca.
                </p>
                <p className="text-white/50 text-sm">
                  Los asientos award son limitados y desaparecen rápido — especialmente en rutas populares.
                  Con las alertas, eres el primero en saberlo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
