"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Globe2, Heart, Menu, Search, ShieldCheck, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { categories, domains } from "@/lib/domains";

type Currency = "USD" | "INR";

function money(value: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Marketplace() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All domains");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [offerDomain, setOfferDomain] = useState<string | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerEmail, setOfferEmail] = useState("");
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => {
    const result = domains.filter((domain) => {
      const matchesQuery = domain.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All domains" || domain.category === category;
      return matchesQuery && matchesCategory;
    });
    if (sort === "price-low") result.sort((a, b) => a.priceUSD - b.priceUSD);
    if (sort === "price-high") result.sort((a, b) => b.priceUSD - a.priceUSD);
    if (sort === "dr") result.sort((a, b) => b.dr - a.dr);
    return result;
  }, [query, category, sort]);

  const selected = domains.filter((domain) => cart.includes(domain.id));
  const total = selected.reduce((sum, domain) => sum + (currency === "USD" ? domain.priceUSD : domain.priceINR), 0);

  function toggleCart(id: string) {
    setCart((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setNotice("");
  }

  function submitOrder() {
    if (!selected.length) return;
    const lines = selected.map((d) => `${d.name} — ${money(currency === "USD" ? d.priceUSD : d.priceINR, currency)}`).join("\n");
    const subject = encodeURIComponent(`SerpHub order request (${selected.length} domains)`);
    const body = encodeURIComponent(`Hello SerpHub,\n\nI would like to enquire about the following domains:\n${lines}\n\nEstimated total: ${money(total, currency)}\nCurrency: ${currency}\n\nName:\nEmail:\nTelegram (optional):\n\nPlease confirm availability and next steps.`);
    window.location.href = `mailto:hello@serphub.info?subject=${subject}&body=${body}`;
  }

  function submitOffer() {
    if (!offerDomain || !offerAmount.trim() || !offerEmail.trim()) return;
    const domain = domains.find((item) => item.id === offerDomain);
    const subject = encodeURIComponent(`Offer for ${domain?.name ?? "domain"} — SerpHub`);
    const body = encodeURIComponent(`Hello SerpHub,\n\nI would like to make an offer for ${domain?.name}.\nOffer: ${offerAmount} ${currency}\nEmail: ${offerEmail}\n\nPlease let me know if this offer can be considered.`);
    window.location.href = `mailto:hello@serphub.info?subject=${subject}&body=${body}`;
    setOfferDomain(null);
    setOfferAmount("");
    setOfferEmail("");
  }

  return (
    <main>
      <div className="announcement"><span>Curated digital assets.</span> Find a domain that moves your next idea forward. <a href="#domains">Explore inventory <ArrowUpRight size={13} /></a></div>
      <header className="site-header">
        <a className="brand" href="#" aria-label="SerpHub home"><span className="brand-mark">S</span><span>serphub<span className="brand-dot">.</span></span></a>
        <nav className={mobileMenu ? "main-nav open" : "main-nav"}>
          <a href="#domains" onClick={() => setMobileMenu(false)}>Explore domains</a>
          <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
          <a href="#about" onClick={() => setMobileMenu(false)}>Why SerpHub</a>
        </nav>
        <div className="header-actions">
          <label className="currency-select"><span className="sr-only">Display currency</span><select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}><option value="USD">USD $</option><option value="INR">INR ₹</option></select><ChevronDown size={13}/></label>
          <a className="login-link" href="mailto:hello@serphub.info?subject=SerpHub%20account%20enquiry">Sign in</a>
          <button className="cart-button" onClick={() => document.getElementById("order-panel")?.scrollIntoView({ behavior: "smooth" })}><span>Order list</span><span className="cart-count">{cart.length}</span></button>
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> THE DOMAIN MARKETPLACE <span className="eyebrow-pill"><Sparkles size={11}/> Carefully curated</span></div>
          <h1>The right domain.<br/><span>The next big thing.</span></h1>
          <p className="hero-description">Discover distinctive digital assets for your next business, brand or SEO project. Explore a curated collection, compare the details and make your move.</p>
          <div className="hero-search">
            <Search size={19}/>
            <input value={query} onChange={(e) => { setQuery(e.target.value); document.getElementById("domains")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} placeholder="Search a domain or keyword..." aria-label="Search domains"/>
            <a href="#domains" className="search-submit">Explore <ArrowRight size={15}/></a>
          </div>
          <div className="hero-proof"><span><ShieldCheck size={15}/> Human-assisted transfer</span><span><Check size={15}/> Transparent listing details</span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="floating-card card-back"><span className="mini-label">DIGITAL ASSET</span><strong>your next<br/>big idea<span>.</span></strong><div className="card-lines"><i/><i/><i/></div></div>
          <div className="floating-card card-front"><div className="domain-card-top"><span className="brand-mark small">S</span><span className="verified"><ShieldCheck size={12}/> Curated</span></div><strong>brandname<span>.com</span></strong><div className="card-metrics"><span><b>24</b> DR</span><span><b>12y</b> Age</span><span><b>1.2k</b> Links</span></div><div className="card-price"><span>Listed asset</span><b>$ 850</b></div></div>
          <div className="hero-spark spark-a">✳</div><div className="hero-spark spark-b">✳</div>
        </div>
      </section>

      <section className="trust-strip"><div><Globe2/><span>Curated domain inventory</span></div><div><ShieldCheck/><span>Assisted purchase process</span></div><div><CircleHelp/><span>Personal support at every step</span></div></section>

      <section className="market-section section-wrap" id="domains">
        <div className="section-heading"><div><div className="eyebrow">THE COLLECTION</div><h2>Find your next <span>digital asset.</span></h2><p>Explore available names selected for brand potential and online projects.</p></div><div className="inventory-count"><b>{filtered.length.toString().padStart(2, "0")}</b><span>listings shown</span></div></div>
        <div className="market-toolbar">
          <div className="category-tabs">{categories.map((item) => <button key={item} className={category === item ? "category-tab active" : "category-tab"} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <label className="sort-select"><SlidersHorizontal size={15}/><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="dr">Highest DR</option></select><ChevronDown size={13}/></label>
        </div>
        <div className="domain-grid">
          {filtered.map((domain) => {
            const inCart = cart.includes(domain.id);
            const isSaved = saved.includes(domain.id);
            return <article className="domain-card" key={domain.id}>
              <div className="domain-card-head"><span className="domain-category">{domain.category}</span><button className={isSaved ? "save-button saved" : "save-button"} onClick={() => setSaved((items) => isSaved ? items.filter((id) => id !== domain.id) : [...items, domain.id])} aria-label={isSaved ? "Remove from saved" : "Save domain"}><Heart size={17} fill={isSaved ? "currentColor" : "none"}/></button></div>
              <div className="domain-name">{domain.name}</div>
              <p className="domain-description">{domain.description}</p>
              <div className="metric-row"><div><b>{domain.dr}</b><span>DR</span></div><div><b>{domain.age}y</b><span>Age</span></div><div><b>{domain.referringDomains.toLocaleString()}</b><span>Ref. domains</span></div><div><b>{domain.traffic.toLocaleString()}</b><span>Traffic*</span></div></div>
              <div className="domain-card-bottom"><div><span className="price-caption">Asking price</span><strong>{money(currency === "USD" ? domain.priceUSD : domain.priceINR, currency)}</strong></div><div className="card-actions"><button className="offer-button" onClick={() => setOfferDomain(domain.id)}>Make offer</button><button className={inCart ? "add-button added" : "add-button"} onClick={() => toggleCart(domain.id)}>{inCart ? <><Check size={15}/> Added</> : <>Add <ArrowUpRight size={15}/></>}</button></div></div>
              <div className="listing-footnote">*Illustrative demo metrics — verify before publication.</div>
            </article>;
          })}
        </div>
        {filtered.length === 0 && <div className="empty-state">No domains match your search. Try another keyword or category.</div>}
      </section>

      <section className="order-section section-wrap" id="order-panel">
        <div className="order-copy"><div className="eyebrow">YOUR SHORTLIST</div><h2>One list.<br/><span>Many possibilities.</span></h2><p>Add multiple domains to one enquiry. We’ll confirm availability and guide you through payment and transfer personally.</p><div className="order-assurance"><ShieldCheck size={18}/> No payment is collected at this stage.</div></div>
        <div className="order-panel">
          <div className="order-panel-head"><div><span className="panel-kicker">ORDER REQUEST</span><h3>Your selected domains</h3></div><span className="cart-count large">{selected.length}</span></div>
          {selected.length ? <div className="selected-list">{selected.map((domain) => <div className="selected-item" key={domain.id}><div><b>{domain.name}</b><span>{domain.category}</span></div><strong>{money(currency === "USD" ? domain.priceUSD : domain.priceINR, currency)}</strong><button onClick={() => toggleCart(domain.id)} aria-label={`Remove ${domain.name}`}><X size={15}/></button></div>)}</div> : <div className="order-empty">Your shortlist is empty. Add a domain from the collection to get started.</div>}
          <div className="order-total"><span>Indicative total</span><strong>{money(total, currency)}</strong></div>
          <button className="checkout-button" disabled={!selected.length} onClick={submitOrder}>Send order enquiry <ArrowRight size={17}/></button>
          <p className="order-terms">Submitting an enquiry does not reserve a domain or complete a purchase. Availability and final pricing are confirmed by SerpHub.</p>
        </div>
      </section>

      <section className="how-section section-wrap" id="how-it-works"><div className="section-heading centered"><div className="eyebrow">A CLEARER WAY TO BUY</div><h2>From discovery to <span>ownership.</span></h2><p>A straightforward, human-assisted process at every stage.</p></div><div className="steps-grid"><div className="step"><span className="step-number">01</span><Search/><h3>Discover</h3><p>Explore the collection and compare domain details that matter to your project.</p></div><div className="step"><span className="step-number">02</span><Heart/><h3>Shortlist</h3><p>Add one or multiple domains to your order list, or make an offer on a listing.</p></div><div className="step"><span className="step-number">03</span><MessageIcon/><h3>Connect</h3><p>Send your enquiry. Our team will confirm availability, pricing and next steps.</p></div><div className="step"><span className="step-number">04</span><ShieldCheck/><h3>Transfer</h3><p>After agreed payment, we coordinate the domain transfer with you.</p></div></div></section>

      <section className="about-band" id="about"><div className="about-inner"><div><div className="eyebrow light">BUILT AROUND CLARITY</div><h2>Good names open<br/>new <span>possibilities.</span></h2></div><p>SerpHub brings domain discovery and personal support together. Browse with clarity, ask questions freely and move forward when the details are right.</p><a href="mailto:hello@serphub.info" className="about-contact">Talk to our team <ArrowUpRight size={16}/></a></div></section>

      <section className="faq-section section-wrap"><div className="eyebrow">GOOD TO KNOW</div><h2>Frequently asked <span>questions.</span></h2><div className="faq-grid"><div><h3>How do I purchase a domain?</h3><p>Add a domain to your order list and submit an enquiry. We’ll contact you to confirm availability, payment and transfer details.</p></div><div><h3>Can I make an offer?</h3><p>Yes. Use the Make offer option on a listing. Offers are requests for consideration and are not automatically accepted.</p></div><div><h3>Are SEO metrics guaranteed?</h3><p>No. Metrics are indicative, can change and depend on their data source and measurement date. Always review the latest evidence before buying.</p></div><div><h3>When do I pay?</h3><p>Payment is arranged manually after availability and transaction details have been confirmed with you.</p></div></div></section>

      <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark">S</span><span>serphub<span className="brand-dot">.</span></span></a><span>© {new Date().getFullYear()} SerpHub. All rights reserved.</span><div><a href="mailto:hello@serphub.info">Contact</a><a href="#about">About</a><a href="mailto:hello@serphub.info?subject=Privacy%20policy%20request">Privacy</a><a href="mailto:hello@serphub.info?subject=Terms%20of%20sale">Terms</a></div></footer>

      {offerDomain && <div className="modal-backdrop" onClick={() => setOfferDomain(null)}><div className="offer-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setOfferDomain(null)}><X/></button><div className="eyebrow">MAKE AN OFFER</div><h3>{domains.find((d) => d.id === offerDomain)?.name}</h3><p>Share your proposed price. Our team will review it and get back to you.</p><label>Your offer ({currency})<input value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} placeholder={currency === "USD" ? "e.g. 500" : "e.g. 42000"} inputMode="decimal"/></label><label>Email address<input value={offerEmail} onChange={(e) => setOfferEmail(e.target.value)} placeholder="you@example.com" type="email"/></label><button className="checkout-button" disabled={!offerAmount.trim() || !offerEmail.trim()} onClick={submitOffer}>Send offer enquiry <ArrowRight size={16}/></button><small>No payment is collected when making an offer.</small></div></div>}
      {notice && <div className="toast">{notice}</div>}
    </main>
  );
}

function MessageIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/></svg>;
}
