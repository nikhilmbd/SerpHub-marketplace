import Link from "next/link";

export default function LinkBuildingPage() {
  return (
    <main className="link-building-page">
      <section className="link-building-hero">
        <div className="link-building-wrap">
          <div className="link-building-kicker">SERPHUB LINK BUILDING</div>
          <h1>Buy Footer Links from <span>Real Traffic Sites</span></h1>
          <p>Monthly footer-link placements on websites with organic traffic. A straightforward service for brands and businesses looking to build visibility for relevant pages and keywords.</p>
          <div className="link-building-price">$15 / month per link</div>
        </div>
      </section>

      <section className="link-building-content">
        <div className="link-building-wrap">
          <h2>Real websites. Clear monthly pricing.</h2>
          <p>We offer footer links on a monthly rental basis for $15 per link, per month. Placements are sourced from websites that receive organic traffic. We do not offer spam placements or private blog network (PBN) links.</p>
          <p>This service may suit Indonesian gaming brands and businesses targeting competitive generic keywords. Placement suitability, relevance, availability and link attributes should be reviewed before an order is confirmed.</p>

          <h2 style={{marginTop: 42}}>Why buy from SerpHub?</h2>
          <div className="link-building-benefits">
            <article className="link-building-benefit"><b>300+ sites available</b><p>Choose from a pool of websites reported to have organic traffic. Site details can be shared for review before placement.</p></article>
            <article className="link-building-benefit"><b>Replacement support</b><p>If a placed link is removed during the agreed rental period, contact us for a replacement under the service terms.</p></article>
            <article className="link-building-benefit"><b>Same-day delivery target</b><p>We aim to publish approved placements the same day, subject to site availability and content approval.</p></article>
            <article className="link-building-benefit"><b>Competitive keyword campaigns</b><p>Discuss your target pages and keywords with our team so we can check whether available sites are appropriate.</p></article>
            <article className="link-building-benefit"><b>Telegram support</b><p>Reach our team on Telegram for order updates, site details and placement assistance.</p></article>
            <article className="link-building-benefit"><b>$15 per link / month</b><p>Monthly rental pricing per active link. Confirm duration, renewal and cancellation terms before ordering.</p></article>
          </div>

          <h2>Ready to discuss a placement?</h2>
          <p>Message us with your target URL, preferred anchor text, target keywords and the number of links you need. We will confirm available sites and the next steps.</p>
          <div className="link-building-cta">
            <a className="primary" href="https://t.me/Serphub_seo" target="_blank" rel="noreferrer"> <span>Contact on Telegram</span> ↗</a>
            <a className="secondary" href="mailto:serphub.info@gmail.com?subject=SerpHub%20Link%20Building%20Enquiry">Email SerpHub ↗</a>
            <Link className="secondary" href="/">Back to marketplace</Link>
          </div>
          <p className="link-building-note">SEO results are not guaranteed. Search engines may treat paid links as advertising; buyers and publishers should use appropriate link attributes and follow applicable search-engine guidelines. Any satisfaction or refund terms should be confirmed in writing before payment.</p>
        </div>
      </section>
    </main>
  );
}
