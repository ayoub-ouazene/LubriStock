"use client";
import { CachePayload, CacheRecord } from "@/lib/adminCache";

const fields = [
  ["brand", "Marque"], ["model", "Modèle"], ["start_year", "Année de début"], ["end_year", "Année de fin"],
  ["engine", "Code moteur"], ["gearbox", "Référence boîte"], ["fuel_type", "Carburant"], ["transmission_type", "Type de transmission"],
  ["viscosity", "Viscosité"], ["capacity_liters", "Capacité (litres)"], ["oem", "Spécification OEM"],
] as const;

export function CacheFields({ value, onChange, edit = false }: { value: Partial<CachePayload> | CacheRecord; onChange: (key: string, value: string) => void; edit?: boolean }) {
  const category = value.category || "engine";
  return <div className="space-y-3">
    {!edit && <div className="grid gap-1.5 md:grid-cols-[11rem_minmax(0,1fr)] md:items-center md:gap-4"><label htmlFor="category" className="text-sm font-medium text-brand-text">Type de cache *</label><select id="category" required value={category} onChange={(e) => onChange("category", e.target.value)} className="w-full rounded-md border border-brand-border px-3 py-2 text-sm focus:border-brand-dark focus:outline-none"><option value="engine">Huile moteur</option><option value="transmission">Huile de boîte / transmission</option></select></div>}
    {fields.map(([key, label]) => {
      if (category === "engine" && ["gearbox", "transmission_type"].includes(key)) return null;
      if (category === "transmission" && ["engine", "fuel_type"].includes(key)) return null;
      const required = ["brand", "model", "start_year", "end_year", "oem"].includes(key) || (category === "engine" && key === "engine") || (category === "transmission" && key === "gearbox");
      return <div className="grid gap-1.5 md:grid-cols-[11rem_minmax(0,1fr)] md:items-center md:gap-4" key={key}><label htmlFor={key} className="text-sm font-medium text-brand-text">{label}{required && <span className="ml-1 text-brand-orange">*</span>}</label><input id={key} required={required} type={key.includes("year") ? "number" : "text"} value={String(value[key] ?? "")} onChange={(e) => onChange(key, e.target.value)} className="w-full rounded-md border border-brand-border px-3 py-2 text-sm focus:border-brand-dark focus:outline-none" /></div>;
    })}
  </div>;
}
