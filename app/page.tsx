import Marketplace from "@/components/marketplace";
import { demoDomains } from "@/lib/demo-domains";
import { prisma } from "@/lib/prisma";

function maskSoldDomainName(name: string) {
  const dot = name.lastIndexOf(".");
  const label = dot >= 0 ? name.slice(0, dot) : name;
  const suffix = dot >= 0 ? name.slice(dot) : "";
  const visible = label.slice(0, 3);
  const hidden = "•".repeat(Math.max(6, label.length - visible.length));
  return `${visible}${hidden}${suffix}`;
}

export const dynamic = "force-dynamic";

export default async function Home() {
  // Read live inventory from Supabase so admin-created domains appear on the homepage.
  const rows = await prisma.domain.findMany({
    where: { status: { not: "INACTIVE" } },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const databaseDomains = rows.map((domain) => ({
    id: domain.id,
    name: domain.status === "SOLD"
      ? maskSoldDomainName(domain.name)
      : domain.name,
    priceUSD: Number(domain.priceUSD),
    category: domain.category?.name ?? "Uncategorized",
    age: domain.ageYears === null ? 0 : Number(domain.ageYears),
    as: domain.authorityScore === null ? 0 : Number(domain.authorityScore),
    da: domain.domainAuthority === null ? 0 : Number(domain.domainAuthority),
    pa: domain.pageAuthority === null ? 0 : Number(domain.pageAuthority),
    dr: domain.domainRating === null ? 0 : Number(domain.domainRating),
    backlinks: domain.backlinks === null ? 0 : Number(domain.backlinks),
    tags: domain.tags.filter((tag) => tag !== "DEMO RECORD"),
    description: domain.description ??
      "SEO metrics supplied with this listing; figures may change and should be independently verified.",
    status: domain.status,
  }));

  const privacySafeDemoDomains = demoDomains.map((domain) => ({
    ...domain,
    name: domain.status === "SOLD"
      ? maskSoldDomainName(domain.name)
      : domain.name,
  }));

  return (
    <Marketplace
      domains={[...databaseDomains, ...privacySafeDemoDomains]}
    />
  );
}
