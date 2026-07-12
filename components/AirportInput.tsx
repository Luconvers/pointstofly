"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { searchAirports, AIRPORTS, type Airport } from "@/lib/airports";

interface AirportInputProps {
  value: string;
  onChange: (code: string) => void;
  placeholder: string;
}

export default function AirportInput({ value, onChange, placeholder }: AirportInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Airport[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Airport | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && (!selected || selected.code !== value)) {
      const found = AIRPORTS.find(a => a.code === value);
      if (found) { setSelected(found); setQuery(""); }
    }
    if (!value) { setSelected(null); setQuery(""); }
  }, [value]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelected(null);
    onChange("");
    if (val.length >= 2) { setResults(searchAirports(val)); setOpen(true); }
    else setOpen(false);
  };

  const select = (airport: Airport) => {
    setSelected(airport);
    setQuery("");
    onChange(airport.code);
    setOpen(false);
  };

  const clear = () => {
    setSelected(null);
    setQuery("");
    onChange("");
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      {selected ? (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:8, padding:"10px 14px" }}>
          <MapPin style={{ width:14, height:14, color:"#1D4ED8", flexShrink:0 }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:600, fontSize:"0.875rem", color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selected.city}</div>
            <div style={{ fontSize:"0.75rem", color:"#6B7280" }}>{selected.code} · {selected.country}</div>
          </div>
          <button onClick={clear} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", padding:2, display:"flex" }}>
            <X style={{ width:14, height:14 }} />
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          style={{ width:"100%", background:"#ffffff", border:"1px solid #D1D5DB", borderRadius:8, padding:"11px 14px", fontSize:"0.875rem", color:"#111827", outline:"none", boxSizing:"border-box" }}
        />
      )}

      {open && results.length > 0 && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:"#ffffff", border:"1px solid #E5E7EB", borderRadius:8, boxShadow:"0 4px 16px rgba(0,0,0,0.12)", zIndex:100, overflow:"hidden" }}>
          {results.map((airport) => (
            <button
              key={airport.code}
              onMouseDown={(e) => { e.preventDefault(); select(airport); }}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"10px 16px", background:"none", border:"none", cursor:"pointer", textAlign:"left", transition:"background 0.1s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F7F7F8")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <div style={{ width:36, height:28, background:"#F3F4F6", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontSize:"0.6875rem", fontWeight:700, color:"#374151" }}>{airport.code}</span>
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:"0.875rem", color:"#111827" }}>{airport.city}</div>
                <div style={{ fontSize:"0.75rem", color:"#9CA3AF", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{airport.name} · {airport.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:"#ffffff", border:"1px solid #E5E7EB", borderRadius:8, padding:"12px 16px", zIndex:100, boxShadow:"0 4px 16px rgba(0,0,0,0.12)" }}>
          <p style={{ fontSize:"0.875rem", color:"#9CA3AF" }}>No encontramos "{query}". Prueba con otro nombre o ciudad.</p>
        </div>
      )}
    </div>
  );
}
