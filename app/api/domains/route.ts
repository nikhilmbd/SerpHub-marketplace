import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function publicName(name: string) {
  const dot = name.lastIndexOf(".");
  const suffix = dot >= 0 ? name.slice(dot) : "";
  const base = dot >= 0 ? name.slice(0, dot) : name;
  if (base.length <= 3) return `${base[0] ?? ""}••••${suffix}`;
  return `${base.slice(0, 3)}••••••${suffix}`;
}

export async function GET() {
  const rows = await prisma.domain.findMany({ where: { status: { not: "INACTIVE" } }, include: { category: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });
  const domains = rows.map((d) => ({
    id: d.id,
    name: d.status === "SOLD" ? publicName(d.name) : d.name,
    priceUSD: Number(d.priceUSD),
    category: d.category?.name ?? "Uncategorized",
    age: d.ageYears === null ? 0 : Number(d.ageYears),
    as: d.authorityScore === null ? 0 : Number(d.authorityScore),
    da: d.domainAuthority === null ? 0 : Number(d.domainAuthority),
    pa: d.pageAuthority === null ? 0 : Number(d.pageAuthority),
    dr: d.domainRating === null ? 0 : Number(d.domainRating),
    backlinks: d.backlinks === null ? 0 : Number(d.backlinks),
    tags: d.tags.filter((tag) => tag !== "DEMO RECORD"),
    description: d.description ?? "SEO metrics supplied with this listing; figures may change and should be independently verified.",
    status: d.status,
  }));
  return NextResponse.json({ domains }, { headers: { "Cache-Control": "no-store" } });
}
