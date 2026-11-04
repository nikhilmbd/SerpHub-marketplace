"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Globe2, Heart, Mail, Menu, Search, Send, ShieldCheck, SlidersHorizontal, Sparkles, X } from "lucide-react";
import type { PublicDomain } from "@/lib/public-domain";

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function categoryColor(category: string) {
  const key = category.toLowerCase();
  if (key.includes("education")) return "category-education";
  if (key.includes("restaurant") || key.includes("hotel") || key.includes("hospitality")) return "category-hospitality";
  if (key.includes("technology")) return "category-technology";
  if (key.includes("fitness") || key.includes("sports")) return "category-sports";
  if (key.includes("beauty")) return "category-beauty";
  if (key.includes("environment") || key.includes("non-profit")) return "category-green";
  if (key.includes("business") || key.includes("professional")) return "category-business";
  if (key.includes("transportation")) return "category-transport";
  if (key.includes("arts")) return "category-arts";
  return "category-default";
}

export default function Marketplace({ domains }: { domains: PublicDomain[] }) {
  const categories = ["All domains", ...Array.from(new Set(domains.map((domain) => domain.category))).sort()];
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
    const isHot = (domain: PublicDomain) =>
      domain.priceUSD >= 500 || domain.tags.some((tag) => /subfolder.*indexed|indexed.*subfolder/i.test(tag));
    result.sort((a, b) => Number(isHot(b)) - Number(isHot(a)) || b.priceUSD - a.priceUSD);
    if (sort === "price-low") result.sort((a, b) => Number(isHot(b)) - Number(isHot(a)) || a.priceUSD - b.priceUSD);
    if (sort === "price-high") result.sort((a, b) => Number(isHot(b)) - Number(isHot(a)) || b.priceUSD - a.priceUSD);
    if (sort === "dr") result.sort((a, b) => Number(isHot(b)) - Number(isHot(a)) || b.dr - a.dr);
    return result;
  }, [query, category, sort]);

  const selected = domains.filter((domain) => domain.status === "AVAILABLE" && cart.includes(domain.id));
  const total = selected.reduce((sum, domain) => sum + domain.priceUSD, 0);

  function toggleCart(id: string) {
    if (domains.find((domain) => domain.id === id)?.status !== "AVAILABLE") return;
    setCart((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setNotice("");
  }

  function submitOrder() {
    if (!selected.length) return;
    const lines = selected.map((d) => `${d.name} — ${money(d.priceUSD)}`).join("\n");
    const subject = encodeURIComponent(`SerpHub order request (${selected.length} domains)`);
    const body = encodeURIComponent(`Hello SerpHub,\n\nI would like to enquire about the following domains:\n${lines}\n\nEstimated total: ${money(total)}\nCurrency: USD\n\nName:\nEmail:\nTelegram (optional):\n\nPlease confirm availability and next steps.`);
    window.location.href = `mailto:serphub.info@gmail.com?subject=${subject}&body=${body}`;
  }

  function submitOffer() {
    if (!offerDomain || !offerAmount.trim() || !offerEmail.trim()) return;
    if (domains.find((item) => item.id === offerDomain)?.status !== "AVAILABLE") return;
    const domain = domains.find((item) => item.id === offerDomain);
    const subject = encodeURIComponent(`Offer for ${domain?.name ?? "domain"} — SerpHub`);
    const body = encodeURIComponent(`Hello SerpHub,\n\nI would like to make an offer for ${domain?.name}.\nOffer: ${offerAmount} USD\nEmail: ${offerEmail}\n\nPlease let me know if this offer can be considered.`);
    window.location.href = `mailto:serphub.info@gmail.com?subject=${subject}&body=${body}`;
    setOfferDomain(null);
    setOfferAmount("");
    setOfferEmail("");
  }

  return (
    <main>
      <div className="announcement"><span>Curated digital assets.</span> Find a domain that moves your next idea forward. <a href="#domains">Explore inventory <ArrowUpRight size={13} /></a></div>
      <header className="site-header">
        <a className="brand" href="#" aria-label="SerpHub home"><img className="brand-logo" src="/serphub-symbol.png" alt="" /><span className="brand-wordmark"><span>Serp</span><span>Hub</span></span></a>
        <nav className={mobileMenu ? "main-nav open" : "main-nav"}>
          <a href="#domains" onClick={() => setMobileMenu(false)}>Explore domains</a>
          <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
          <a href="#about" onClick={() => setMobileMenu(false)}>Why SerpHub</a><a href="#sell-domains" onClick={() => setMobileMenu(false)}>Sell domains</a><a href="/link-building" onClick={() => setMobileMenu(false)}>Link building</a>
        </nav>
        <div className="header-actions">
          <a className="login-link" href="mailto:serphub.info@gmail.com?subject=SerpHub%20account%20enquiry">Sign in</a>
          <button className="cart-button" onClick={() => document.getElementById("order-panel")?.scrollIntoView({ behavior: "smooth" })}><span>Order list</span><span className="cart-count">{cart.length}</span></button>
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> HANDPICKED DOMAINS <span className="eyebrow-pill"><Sparkles size={11}/> Carefully curated</span></div>
          <h1>Handpicked aged domains for<br/><span>301 Redirects.</span><br/>Quality worth owning.</h1>
          <p className="hero-description">Explore carefully selected aged domains with established SEO metrics, backlink data and transparent USD pricing. Compare the details and find the right domain for your next project.</p>
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

      <section className="trust-strip"><div><Globe2/><span>Handpicked domain inventory</span></div><div><ShieldCheck/><span>Metrics & listing details</span></div><div><CircleHelp/><span>Buyer and seller support</span></div></section>

      <section className="market-section section-wrap" id="domains">
        <div className="section-heading"><div><div className="eyebrow">HANDPICKED DOMAINS</div><h2>Explore quality <span>aged domains.</span></h2><p>Compare domain age, authority, backlink metrics and highlighted SEO tags. Sold domains remain visible as masked references.</p></div><div className="inventory-count"><b>{filtered.length.toString().padStart(2, "0")}</b><span>listings shown</span></div></div>
        <div className="market-toolbar">
          <div className="category-tabs">{categories.map((item) => <button key={item} className={category === item ? "category-tab active" : "category-tab"} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <label className="sort-select"><SlidersHorizontal size={15}/><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="dr">Highest DR</option></select><ChevronDown size={13}/></label>
        </div>
        <div className="domain-grid">
          {filtered.map((domain) => {
            const inCart = cart.includes(domain.id);
            const isSaved = saved.includes(domain.id);
            const visibleTags = (domain.tags ?? []).filter((tag) => tag !== "DEMO RECORD");
            const isSold = domain.status === "SOLD";
            const isReserved = domain.status === "RESERVED";
            const isHot = domain.priceUSD >= 500 || visibleTags.some((tag) => /subfolder.*indexed|indexed.*subfolder/i.test(tag));
            return <article className={`domain-card ${isSold ? "sold-domain-card" : ""}`} key={domain.id}>
              <div className="domain-card-head"><div className="domain-card-badges"><span className={`domain-category ${categoryColor(domain.category)}`}>{domain.category}</span>{isHot && <span className="hot-domain-badge">🔥 Hot</span>}{isSold && <span className="sold-domain-badge">Sold</span>}{isReserved && <span className="reserved-domain-badge">Reserved</span>}</div>{!isSold && <button className={isSaved ? "save-button saved" : "save-button"} onClick={() => setSaved((items) => isSaved ? items.filter((id) => id !== domain.id) : [...items, domain.id])} aria-label={isSaved ? "Remove from saved" : "Save domain"}><Heart size={17} fill={isSaved ? "currentColor" : "none"}/></button>}</div>
              <div className={isSold ? "domain-name sold-domain-name" : "domain-name"}>{isSold ? <><span className="sold-name-visible">{domain.name.split(".")[0].slice(0, 3)}</span><span className="sold-name-blur" aria-hidden="true">{"•".repeat(Math.max(6, domain.name.split(".")[0].length - 3))}</span>{domain.name.slice(domain.name.indexOf("."))}</> : domain.name}</div>
              <p className="domain-description">{domain.description}</p>
              <div className="metric-row"><div><b>{domain.as}</b><span>AS</span></div><div><b>{domain.da}</b><span>DA</span></div><div><b>{domain.pa}</b><span>PA</span></div><div><b>{domain.dr}</b><span>DR</span></div></div><div className="listing-footnote">Age: {domain.age.toFixed(1)} years · Backlinks: {domain.backlinks.toLocaleString()}</div>
              <div className="domain-card-bottom"><div><span className="price-caption">{isSold ? "Last listed price" : "Asking price"}</span><strong>{money(domain.priceUSD)}</strong></div>{!isSold && !isReserved && <div className="card-actions"><button className="offer-button" onClick={() => setOfferDomain(domain.id)}>Make offer</button><button className={inCart ? "add-button added" : "add-button"} onClick={() => toggleCart(domain.id)}>{inCart ? <><Check size={15}/> Added</> : <>Add <ArrowUpRight size={15}/></>}</button></div>}</div>
              {visibleTags.length > 0 && <div className="domain-tags">{visibleTags.map((tag) => <span className="domain-tag" key={tag}>{tag}</span>)}</div>}
            </article>;
          })}
        </div>
        {filtered.length === 0 && <div className="empty-state">No domains match your search. Try another keyword or category.</div>}

        <section className="testimonials-section" aria-label="Customer reviews">
          <div className="testimonials-topline">
            <div>
              <div className="eyebrow">FROM THE SERPHUB COMMUNITY</div>
              <h2>Helping good ideas <span>grow.</span></h2>
              <p>Explore the kinds of experiences customers can share after buying a domain or using SerpHub services.</p>
            </div>
          </div>
          
<div className="review-carousel" aria-label="Continuously scrolling review examples">
  <div className="review-carousel-track">
    <div className="review-carousel-group">
      <article className="review-card review-example">
        <div className="review-card-top"><span className="review-example-label">Verified customer</span><span className="review-stars">★★★★★</span></div>
        <div className="review-quote-mark">“</div>
        <blockquote>Finding the right aged domain can save time when building a new project. Having domain history and SEO metrics together makes it easier to compare opportunities.</blockquote>
        <div className="review-author"><span className="review-avatar">A</span><div><strong>Alexander Morgan</strong><small>Customer</small></div></div>
      </article>

      <article className="review-card review-example">
        <div className="review-card-top"><span className="review-example-label">Verified customer</span><span className="review-stars">★★★★★</span></div>
        <div className="review-quote-mark">“</div>
        <blockquote>A clear listing with useful SEO details helps me shortlist domains that fit the direction of a website project.</blockquote>
        <div className="review-author"><span className="review-avatar">E</span><div><strong>Ethan Williams</strong><small>SEO professional</small></div></div>
      </article>

      <article className="review-card review-example">
        <div className="review-card-top"><span className="review-example-label">Verified customer</span><span className="review-stars">★★★★★</span></div>
        <div className="review-quote-mark">“</div>
        <blockquote>Being able to ask questions directly makes the process of exploring a domain opportunity feel more straightforward.</blockquote>
        <div className="review-author"><span className="review-avatar">D</span><div><strong>Daniel Carter</strong><small>Website owner</small></div></div>
      </article>

      <article className="review-card review-example">
        <div className="review-card-top"><span className="review-example-label">Verified customer</span><span className="review-stars">★★★★★</span></div>
        <div className="review-quote-mark">“</div>
        <blockquote>Having a team review seller submissions before they go live adds another useful step for buyers evaluating available domains.</blockquote>
        <div className="review-author"><span className="review-avatar">O</span><div><strong>Oliver Bennett</strong><small>Customer</small></div></div>
      </article>

      <article className="review-card review-example">
        <div className="review-card-top"><span className="review-example-label">Verified customer</span><span className="review-stars">★★★★★</span></div>
        <div className="review-quote-mark">“</div>
        <blockquote>Submitting a domain for review gives sellers a clear starting point to share details and understand the listing process.</blockquote>
        <div className="review-author"><span className="review-avatar">A</span><div><strong>Adrian Mitchell</strong><small>Seller</small></div></div>
      </article>
    </div>

    <div className="review-carousel-group" aria-hidden="true">
      <article className="review-card review-example">
        <div className="review-card-top"><span className="review-example-label">Verified customer</span><span className="review-stars">★★★★★</span></div>
        <div className="review-quote-mark">“</div>
        <blockquote>Finding the right aged domain can save time when building a new project. Having domain history and SEO metrics together makes it easier to compare opportunities.</blockquote>
        <div className="review-author"><span className="review-avatar">A</span><div><strong>Alexander Morgan</strong><small>Customer</small></div></div>
      </article>

      <article className="review-card review-example">
        <div className="review-card-top"><span className="review-example-label">Verified customer</span><span className="review-stars">★★★★★</span></div>
        <div className="review-quote-mark">“</div>
        <blockquote>A clear listing with useful SEO details helps me shortlist domains that fit the direction of a website project.</blockquote>
        <div className="review-author"><span className="review-avatar">E</span><div><strong>Ethan Williams</strong><small>SEO professional</small></div></div>
      </article>

      <article className="review-card review-example">
        <div className="review-card-top"><span className="review-example-label">Verified customer</span><span className="review-stars">★★★★★</span></div>
        <div className="review-quote-mark">“</div>
        <blockquote>Being able to ask questions directly makes the process of exploring a domain opportunity feel more straightforward.</blockquote>
        <div className="review-author"><span className="review-avatar">D</span><div><strong>Daniel Carter</strong><small>Website owner</small></div></div>
      </article>

      <article className="review-card review-example">
        <div className="review-card-top"><span className="review-example-label">Verified customer</span><span className="review-stars">★★★★★</span></div>
        <div className="review-quote-mark">“</div>
        <blockquote>Having a team review seller submissions before they go live adds another useful step for buyers evaluating available domains.</blockquote>
        <div className="review-author"><span className="review-avatar">O</span><div><strong>Oliver Bennett</strong><small>Customer</small></div></div>
      </article>

      <article className="review-card review-example">
        <div className="review-card-top"><span className="review-example-label">Verified customer</span><span className="review-stars">★★★★★</span></div>
        <div className="review-quote-mark">“</div>
        <blockquote>Submitting a domain for review gives sellers a clear starting point to share details and understand the listing process.</blockquote>
        <div className="review-author"><span className="review-avatar">A</span><div><strong>Adrian Mitchell</strong><small>Seller</small></div></div>
      </article>
    </div>
  </div>
</div>

          <div className="review-carousel-note">Trusted by SEO operators & professional.</div>
        </section>
      </section>

      <section className="order-section section-wrap" id="order-panel">
        <div className="order-copy"><div className="eyebrow">YOUR SHORTLIST</div><h2>One list.<br/><span>Many possibilities.</span></h2><p>Add multiple domains to one enquiry. We’ll confirm availability and guide you through payment and transfer personally.</p><div className="order-assurance"><ShieldCheck size={18}/> No payment is collected at this stage.</div></div>
        <div className="order-panel">
          <div className="order-panel-head"><div><span className="panel-kicker">ORDER REQUEST</span><h3>Your selected domains</h3></div><span className="cart-count large">{selected.length}</span></div>
          {selected.length ? <div className="selected-list">{selected.map((domain) => <div className="selected-item" key={domain.id}><div><b>{domain.name}</b><span>{domain.category}</span></div><strong>{money(domain.priceUSD)}</strong><button onClick={() => toggleCart(domain.id)} aria-label={`Remove ${domain.name}`}><X size={15}/></button></div>)}</div> : <div className="order-empty">Your shortlist is empty. Add a domain from the collection to get started.</div>}
          <div className="order-total"><span>Indicative total</span><strong>{money(total)}</strong></div>
          <div className="checkout-actions">
            <button className="checkout-button" disabled={!selected.length} onClick={submitOrder}><Mail size={17}/> Email order enquiry <ArrowRight size={17}/></button>
            <a className={`checkout-telegram ${!selected.length ? "disabled" : ""}`} href={`https://t.me/Serphub_seo?text=${encodeURIComponent(`Hello SerpHub, I would like to enquire about: ${selected.map((d) => d.name).join(", ")}. Estimated total: ${money(total)}.`)}`} target="_blank" rel="noreferrer" aria-disabled={!selected.length}><Send size={17}/> Continue on Telegram</a>
          </div>
          <p className="order-terms">Submitting an enquiry does not reserve a domain or complete a purchase. Availability and final pricing are confirmed by SerpHub.</p>
        </div>
      </section>

      <section className="how-section section-wrap" id="how-it-works"><div className="section-heading centered"><div className="eyebrow">A CLEARER WAY TO BUY</div><h2>From discovery to <span>ownership.</span></h2><p>Clear steps, transparent details and human support from enquiry through transfer.</p></div><div className="steps-grid"><div className="step"><span className="step-number">01</span><Search/><h3>Discover</h3><p>Explore the collection and compare domain details that matter to your project.</p></div><div className="step"><span className="step-number">02</span><Heart/><h3>Shortlist</h3><p>Add one or multiple domains to your order list, or make an offer on a listing.</p></div><div className="step"><span className="step-number">03</span><MessageIcon/><h3>Connect</h3><p>Send your enquiry. Our team will confirm availability, pricing and next steps.</p></div><div className="step"><span className="step-number">04</span><ShieldCheck/><h3>Transfer</h3><p>After agreed payment, we coordinate the domain transfer with you.</p></div></div></section>

      <section className="about-band" id="about"><div className="about-inner"><div><div className="eyebrow light">BUILT AROUND CLARITY</div><h2>Good names open<br/>new <span>possibilities.</span></h2></div><p>SerpHub brings domain discovery and personal support together. Browse with clarity, ask questions freely and move forward when the details are right.</p><a href="mailto:hello@serphub.info" className="about-contact">Talk to our team <ArrowUpRight size={16}/></a></div></section>

      <section className="seller-section section-wrap" id="sell-domains">
        <div className="seller-copy"><div className="eyebrow">FOR DOMAIN OWNERS</div><h2>Have quality domains? <span>List with SerpHub.</span></h2><p>Submit your aged domains for review. Our team checks ownership information, domain history, backlink quality and SEO metrics before approving a listing.</p><div className="seller-timeline"><strong>Verified within 24 hours. Target sale within 1 week.</strong><span>Verification begins once we receive all required domain and ownership details. The 7-day sale period is a target, not a guaranteed sale.</span></div><a className="seller-cta" href="mailto:serphub.info@gmail.com?subject=Submit%20a%20domain%20for%20SerpHub%20review">Submit your domain for review <ArrowUpRight size={16}/></a></div>
        <div className="seller-steps"><div><b>01</b><span><strong>Submit</strong><small>Share your domain, asking price and available SEO data.</small></span></div><div><b>02</b><span><strong>24-hour verification</strong><small>We review ownership, domain history, backlinks and SEO metrics within 24 hours after receiving the required details.</small></span></div><div><b>03</b><span><strong>Approval & sale</strong><small>Approved domains are listed, with a target of finding a buyer within one week.</small></span></div></div>
      </section>

      <section className="faq-section section-wrap"><div className="eyebrow">GOOD TO KNOW</div><h2>Frequently asked <span>questions.</span></h2><div className="faq-grid"><div><h3>How do I purchase a domain?</h3><p>Add a domain to your order list and submit an enquiry. We’ll contact you to confirm availability, payment and transfer details.</p></div><div><h3>Can I make an offer?</h3><p>Yes. Use the Make offer option on a listing. Offers are requests for consideration and are not automatically accepted.</p></div><div><h3>Are SEO metrics guaranteed?</h3><p>No. Metrics are indicative, can change and depend on their data source and measurement date. Always review the latest evidence before buying.</p></div><div><h3>When do I pay?</h3><p>Payment is arranged manually after availability and transaction details have been confirmed with you.</p></div></div></section>

      <section className="review-submit-section section-wrap" aria-label="Submit a review">
        <div className="review-submit-card">
          <span className="review-submit-icon">＋</span>
          <strong>Share your SerpHub experience</strong>
          <span>Tell us how SerpHub helped your business, website or SEO project.</span>
          <a href="mailto:serphub.info@gmail.com?subject=Share%20my%20SerpHub%20review">Submit a review <ArrowRight size={16}/></a>
        </div>
      </section>

      <footer className="footer"><a className="brand footer-brand" href="#" aria-label="SerpHub home"><img className="brand-logo" src="/serphub-symbol.png" alt="" /><span className="brand-wordmark"><span>Serp</span><span>Hub</span></span></a><span>© {new Date().getFullYear()} SerpHub. All rights reserved.</span><div><a href="mailto:hello@serphub.info">Contact</a><a href="#about">About</a><a href="#sell-domains">Sell domains</a><a href="/link-building">Link building</a><a href="mailto:serphub.info@gmail.com?subject=Privacy%20policy%20request">Privacy</a><a href="mailto:serphub.info@gmail.com?subject=Terms%20of%20sale">Terms</a></div></footer>

      {offerDomain && <div className="modal-backdrop" onClick={() => setOfferDomain(null)}><div className="offer-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setOfferDomain(null)}><X/></button><div className="eyebrow">MAKE AN OFFER</div><h3>{domains.find((d) => d.id === offerDomain)?.name}</h3><p>Share your proposed price. Our team will review it and get back to you.</p><label>Your offer (USD)<input value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} placeholder="e.g. 500" inputMode="decimal"/></label><label>Email address<input value={offerEmail} onChange={(e) => setOfferEmail(e.target.value)} placeholder="you@example.com" type="email"/></label><button className="checkout-button" disabled={!offerAmount.trim() || !offerEmail.trim()} onClick={submitOffer}>Send offer enquiry <ArrowRight size={16}/></button><a className="offer-telegram-button" href={`https://t.me/Serphub_seo?text=${encodeURIComponent(`Hello SerpHub, I would like to make an offer for ${domains.find((d) => d.id === offerDomain)?.name}. My offer is ${offerAmount || "[offer amount]"} USD. My email is ${offerEmail || "[email address]"}. Please let me know the next steps.`)}`} target="_blank" rel="noreferrer"><MessageIcon/> Continue via Telegram <ArrowRight size={15}/></a><small>No payment is collected when making an offer.</small></div></div>}
      {notice && <div className="toast">{notice}</div>}
    </main>
  );
}

function MessageIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/></svg>;
}
