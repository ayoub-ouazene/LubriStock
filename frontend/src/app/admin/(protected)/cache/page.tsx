"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { CacheCategory, CacheRecord, deleteCache, listCache } from "@/lib/adminCache";

export default function CachePage() {
  const params = useSearchParams();
  const category: CacheCategory = params.get("category") === "transmission" ? "transmission" : "engine";
  const { handleApiError } = useAdminAuth();
  const confirm = useConfirm();
  const [items, setItems] = useState<CacheRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isEngine = category === "engine";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listCache({ category, q: query.trim() || undefined, page_size: 100 });
      setItems(result.items); setError(null);
    } catch (err) { setError(handleApiError(err) || "Erreur de chargement"); }
    finally { setLoading(false); }
  }, [category, handleApiError, query]);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);

  async function remove(item: CacheRecord) {
    if (!await confirm(`La règle ${item.brand} ${item.model} sera supprimée.`, { title: "Supprimer la règle ?", confirmLabel: "Supprimer", danger: true })) return;
    try { await deleteCache(item.category, item.id); await load(); }
    catch (err) { setError(handleApiError(err) || "Erreur de suppression"); }
  }

  return <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">Base technique</p><h1 className="mt-1 text-2xl font-semibold text-brand-text">{isEngine ? "Huiles moteur" : "Huiles de boîte"}</h1><p className="mt-1 text-sm text-brand-text-muted">Règles de spécifications pour les recommandations véhicule.</p></div><Link href={`/admin/cache/new?category=${category}`} className="rounded-md bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-orange-hover">+ Nouvelle règle</Link></div>
    <div className="mb-5 flex gap-2 rounded-lg border border-brand-border bg-brand-surface p-2"><Link href="/admin/cache?category=engine" className={`rounded-md px-3 py-2 text-sm font-medium ${isEngine ? "bg-brand-dark text-white" : "text-brand-text-muted hover:bg-brand-bg"}`}>Huile moteur</Link><Link href="/admin/cache?category=transmission" className={`rounded-md px-3 py-2 text-sm font-medium ${!isEngine ? "bg-brand-dark text-white" : "text-brand-text-muted hover:bg-brand-bg"}`}>Boîte / transmission</Link></div>
    <section className="overflow-hidden rounded-lg border border-brand-border bg-brand-surface shadow-sm"><div className="border-b border-brand-border p-4"><label htmlFor="cache-search" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-text-muted">Rechercher</label><input id="cache-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Marque, modèle ou spécification…" className="w-full rounded-md border border-brand-border px-3 py-2.5 text-sm focus:border-brand-dark focus:outline-none" /></div>{error && <p className="m-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}{loading ? <p className="p-8 text-center text-sm text-brand-text-muted">Chargement…</p> : items.length === 0 ? <p className="p-10 text-center text-sm text-brand-text-muted">Aucune règle trouvée.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-brand-bg text-xs uppercase tracking-wide text-brand-text-muted"><tr><th className="px-4 py-3">Véhicule</th><th className="px-4 py-3">Années</th><th className="px-4 py-3">{isEngine ? "Moteur" : "Boîte"}</th><th className="px-4 py-3">Viscosité</th><th className="px-4 py-3">OEM</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-brand-border">{items.map(item => <tr key={`${item.category}-${item.id}`} className="hover:bg-brand-bg"><td className="px-4 py-3"><strong className="block text-brand-text">{item.brand}</strong><span className="text-brand-text-muted">{item.model}</span></td><td className="px-4 py-3 text-brand-text-muted">{item.start_year}–{item.end_year}</td><td className="px-4 py-3 text-brand-text">{isEngine ? item.engine : item.gearbox}</td><td className="px-4 py-3 text-brand-text-muted">{item.viscosity || "—"}</td><td className="px-4 py-3 text-brand-text-muted">{item.oem}</td><td className="whitespace-nowrap px-4 py-3 text-right"><Link className="mr-3 font-medium text-brand-orange hover:underline" href={`/admin/cache/${item.category}/${item.id}`}>Modifier</Link><button className="font-medium text-red-700 hover:underline" onClick={() => remove(item)}>Supprimer</button></td></tr>)}</tbody></table></div>}</section>
  </div>;
}
