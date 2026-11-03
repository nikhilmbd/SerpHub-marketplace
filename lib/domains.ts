export type DomainListing = {
  id: string;
  name: string;
  priceUSD: number;
  priceINR: number;
  category: string;
  age: number;
  dr: number;
  backlinks: number;
  referringDomains: number;
  traffic: number;
  featured?: boolean;
  tag?: string;
  description: string;
};

// Demo inventory only. Replace with verified, owned/authorized listings from the admin database.
export const domains: DomainListing[] = [
  { id: "1", name: "northstaranalytics.com", priceUSD: 850, priceINR: 70900, category: "Technology", age: 11, dr: 32, backlinks: 4200, referringDomains: 186, traffic: 740, featured: true, tag: "Featured", description: "A confident name for analytics, intelligence and data-led products." },
  { id: "2", name: "brightpathfinance.com", priceUSD: 620, priceINR: 51700, category: "Finance", age: 8, dr: 27, backlinks: 2100, referringDomains: 124, traffic: 510, featured: true, tag: "Curated", description: "A clear, trustworthy brand direction for financial services." },
  { id: "3", name: "urbanleafstudio.com", priceUSD: 390, priceINR: 32500, category: "Lifestyle", age: 6, dr: 19, backlinks: 980, referringDomains: 72, traffic: 260, description: "A versatile name for a design, interiors or lifestyle brand." },
  { id: "4", name: "learncraftacademy.org", priceUSD: 450, priceINR: 37500, category: "Education", age: 10, dr: 24, backlinks: 1750, referringDomains: 98, traffic: 430, description: "A memorable education-focused name for learning platforms." },
  { id: "5", name: "wellnessfoundry.com", priceUSD: 1100, priceINR: 91800, category: "Health", age: 13, dr: 36, backlinks: 5300, referringDomains: 240, traffic: 920, featured: true, tag: "Premium", description: "A polished brand asset for wellness and health businesses." },
  { id: "6", name: "pixelharbor.io", priceUSD: 550, priceINR: 45900, category: "Technology", age: 5, dr: 21, backlinks: 1250, referringDomains: 83, traffic: 315, description: "A concise technology name suited to software and creative tools." },
];

export const categories = ["All domains", "Technology", "Finance", "Lifestyle", "Education", "Health"];
