/* eslint-disable @next/next/no-img-element -- public brand asset */
import Link from "next/link";
import {
  ArrowRight, Camera, Check, Droplets, Filter, Mail, MapPin, Package,
  Phone, ShieldCheck, Truck, Wallet, Wrench,
} from "lucide-react";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import { OpenChatButton } from "@/components/home/OpenChatButton";

const categories = [
  { id: "engine_oil", title: "Huile moteur", description: "La protection essentielle au quotidien.", detail: "Viscosités & normes constructeur", icon: Droplets, number: "01" },
  { id: "gearbox_oil", title: "Huile de boîte", description: "Des passages de rapports plus fluides.", detail: "Manuelle, automatique & pont", icon: Wrench, number: "02" },
  { id: "oil_filter", title: "Filtres à huile", description: "Un moteur propre, plus longtemps.", detail: "Filtration fiable et durable", icon: Filter, number: "03" },
  { id: "additional", title: "Additifs & entretien", description: "Les bons gestes, jusqu’au bout.", detail: "Compléments et produits atelier", icon: Package, number: "04" },
] as const;

async function FeaturedProducts() {
  let items;
  try {
    const data = await getProducts({ page: 1, page_size: 4, sort: "random" });
    items = data.items;
  } catch {
    return null;
  }
  if (!items.length) return null;
  return (
    <section className="landing-featured" aria-labelledby="featured-title">
      <div className="landing-container">
        <div className="landing-section-heading">
          <div><p className="landing-kicker">Sélection du moment</p><h2 id="featured-title">Les références qui font la différence.</h2></div>
          <Link href="/products" className="landing-text-link">Voir tout le catalogue <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{items.map((product) => <ProductCard key={`${product.category}-${product.id}`} product={product} />)}</div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="landing-hero-grid" aria-hidden="true" />
        <div className="landing-orb landing-orb-one" aria-hidden="true" /><div className="landing-orb landing-orb-two" aria-hidden="true" />
        <div className="landing-container landing-hero-inner">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow"><span /> Lubrifiants automobiles · Algérie</p>
            <h1 id="hero-title">Le bon entretien.<br /><em>Sans compromis.</em></h1>
            <p className="landing-hero-lede">Des huiles, filtres et produits d’entretien sélectionnés pour prendre soin de votre véhicule — avec la simplicité d’un catalogue pensé pour vous.</p>
            <div className="landing-hero-actions"><Link href="/products" className="landing-button landing-button-primary">Explorer le catalogue <ArrowRight size={18} aria-hidden="true" /></Link><Link href="#categories" className="landing-button landing-button-ghost">Trouver mon produit</Link></div>
            <div className="landing-proof"><span><Check size={15} aria-hidden="true" /> Marques reconnues</span><span><Check size={15} aria-hidden="true" /> Livraison 58 wilayas</span></div>
          </div>
          <div className="landing-hero-mark">
            <div className="landing-mark-ring" aria-hidden="true"><span>PERFORMANCE</span><span>PROTECTION</span><span>CONFIANCE</span></div>
            <div className="landing-mark-glow" aria-hidden="true" />
            <img src="/LubriStock.png" alt="LubriStock" />
            <div className="landing-float-card"><span className="landing-float-dot" />Votre véhicule mérite mieux.<strong>Commencez par l’essentiel.</strong></div>
          </div>
        </div>
        <div className="landing-scroll-cue" aria-hidden="true"><span />Défiler pour découvrir</div>
      </section>

      <section className="landing-trust" aria-label="Nos engagements"><div className="landing-container landing-trust-grid">
        {[{ icon: ShieldCheck, title: "Références fiables", description: "Des marques choisies avec exigence" }, { icon: Truck, title: "Partout en Algérie", description: "Livraison dans les 58 wilayas" }, { icon: Wallet, title: "Simple et transparent", description: "Paiement à la livraison" }].map(({ icon: Icon, title, description }) => <div className="landing-trust-item" key={title}><Icon size={22} aria-hidden="true" /><div><strong>{title}</strong><span>{description}</span></div></div>)}
      </div></section>

      <section className="landing-categories" id="categories" aria-labelledby="categories-title"><div className="landing-container">
        <div className="landing-section-heading landing-heading-dark"><div><p className="landing-kicker">Le catalogue</p><h2 id="categories-title">Tout ce qu’il faut,<br /><em>au même endroit.</em></h2></div><p>Du premier changement d’huile à l’entretien régulier, choisissez la référence adaptée à votre véhicule.</p></div>
        <div className="landing-category-grid">{categories.map(({ id, title, description, detail, icon: Icon, number }) => <Link key={id} href={`/products?category=${id}`} className="landing-category-card"><span className="landing-category-number">{number} <i>/ 04</i></span><span className="landing-category-icon"><Icon size={24} aria-hidden="true" /></span><div><h3>{title}<ArrowRight size={17} aria-hidden="true" /></h3><p>{description}</p><small>{detail}</small></div></Link>)}</div>
      </div></section>

      <FeaturedProducts />

      <section className="landing-story" aria-labelledby="about-title"><div className="landing-container landing-story-grid"><div className="landing-story-stamp"><span>Depuis<br /><strong>LubriStock</strong></span><b>01</b></div><div><p className="landing-kicker">Notre approche</p><h2 id="about-title">Moins de recherche.<br /><em>Plus de confiance.</em></h2><p className="landing-story-copy">LubriStock est un détaillant algérien spécialisé dans les huiles et lubrifiants automobiles. Nous réunissons les références essentielles dans un seul catalogue clair, pour que vous puissiez entretenir votre véhicule sans détour.</p><Link href="/products" className="landing-text-link">Découvrir notre sélection <ArrowRight size={16} aria-hidden="true" /></Link></div></div></section>

      <section className="landing-contact" aria-labelledby="contact-title"><div className="landing-container landing-contact-inner"><div><p className="landing-kicker">Besoin d’un conseil ?</p><h2 id="contact-title">On parle de votre<br /><em>véhicule.</em></h2><p>Une question sur une viscosité ou une référence ? Notre équipe est là pour vous aider.</p><OpenChatButton className="landing-text-link mt-6 inline-flex items-center gap-2" /></div><address><a href="tel:+213555000000"><Phone size={18} aria-hidden="true" /><span><small>Téléphone</small>+213 5XX XX XX XX</span></a><a href="mailto:contact@lubristock.dz"><Mail size={18} aria-hidden="true" /><span><small>E-mail</small>contact@lubristock.dz</span></a><div><MapPin size={18} aria-hidden="true" /><span><small>Adresse</small>Alger, Algérie</span></div><a href="https://instagram.com/lubristock" target="_blank" rel="noopener noreferrer"><Camera size={18} aria-hidden="true" /><span><small>Instagram</small>@lubristock</span></a></address></div></section>
    </main>
  );
}
