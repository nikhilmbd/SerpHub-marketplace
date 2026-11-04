import Marketplace from "@/components/marketplace";
import { domains as inventory } from "@/lib/domains";
import { demoDomains } from "@/lib/demo-domains";

function maskSoldDomainName(name: string) {
  const dot = name.lastIndexOf(".");
  const label = dot >= 0 ? name.slice(0, dot) : name;
  const suffix = dot >= 0 ? name.slice(dot) : "";
  const visible = label.slice(0, 3);
  const hidden = "•".repeat(Math.max(6, label.length - visible.length));
  return `${visible}${hidden}${suffix}`;
}

export default function Home() {
  const availableDomains = inventory.map((domain) => ({ ...domain, status: "AVAILABLE" as const }));
  const privacySafeDemoDomains = demoDomains.map((domain) => ({
    ...domain,
    name: domain.status === "SOLD" ? maskSoldDomainName(domain.name) : domain.name,
  }));
  return <Marketplace domains={[...availableDomains, ...privacySafeDemoDomains]} />;
}
