"use client";

import Link from "next/link";

const sections = [
  { title: "Commandes", href: "/admin/orders", text: "Consultez, confirmez et annulez les commandes clients.", action: "Voir les commandes →" },
  { title: "Stock & Inventaire", href: "/admin/stock", text: "Gérez les produits, les prix, les quantités et les images.", action: "Gérer le stock →" },
  { title: "Spécifications / Cache", href: "/admin/cache", text: "Gérez séparément les règles moteur et boîte/transmission.", action: "Gérer les spécifications →" },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">Espace de gestion</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Tableau de bord</h2><p className="mt-1 text-brand-text-muted">Pilotez votre catalogue, vos commandes et votre référentiel technique.</p></div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-brand-dark p-5 text-white"><p className="text-xs uppercase tracking-wide text-white/60">Modules actifs</p><p className="mt-2 text-3xl font-bold">03</p></div><div className="rounded-2xl border border-brand-border bg-brand-surface p-5"><p className="text-xs uppercase tracking-wide text-brand-text-muted">Accès rapide</p><p className="mt-2 font-bold">Commandes · Stock · Cache</p></div><div className="rounded-2xl border border-brand-border bg-brand-surface p-5"><p className="text-xs uppercase tracking-wide text-brand-text-muted">État du service</p><p className="mt-2 font-bold text-emerald-600">● Opérationnel</p></div></div>
      <div className="grid gap-5 md:grid-cols-3">{sections.map((section) => <Link key={section.href} href={section.href} className="group rounded-2xl border border-brand-border bg-brand-surface p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-orange hover:shadow-md"><div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 font-bold text-brand-orange">→</div><h3 className="text-lg font-bold">{section.title}</h3><p className="mt-2 min-h-12 text-sm text-brand-text-muted">{section.text}</p><span className="mt-5 inline-block text-sm font-bold text-brand-orange group-hover:underline">{section.action}</span></Link>)}</div>
    </div>
  );
}
