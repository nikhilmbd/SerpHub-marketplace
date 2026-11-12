import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, isAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
const statuses = ["AVAILABLE", "RESERVED", "SOLD", "INACTIVE"] as const;
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const optionalNumber = (value: unknown, field: string, integer = false) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || (integer && !Number.isInteger(number))) throw new Error(`${field} must be a valid non-negative ${integer ? "integer" : "number"}.`);
  return number;
};
function authorized(request: NextRequest) {
  return isAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const rows = await prisma.domain.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  const domains = rows.map((d) => ({ id: d.id, name: d.name, priceUSD: Number(d.priceUSD), category: d.category?.name ?? "Uncategorized", status: d.status, createdAt: d.createdAt.toISOString() }));
  return NextResponse.json({ domains });
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim().toLowerCase() : "";
    const categoryName = typeof body.category === "string" ? body.category.trim() : "";
    if (!/^(?=.{3,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(name)) throw new Error("Enter a valid domain name, such as example.com.");
    if (!categoryName || categoryName.length > 80) throw new Error("Enter a category (maximum 80 characters).");
    const priceUSD = Number(body.priceUSD);
    if (!Number.isFinite(priceUSD) || priceUSD <= 0) throw new Error("Price must be greater than zero.");
    if (body.status !== undefined && !statuses.includes(body.status)) throw new Error("Choose a valid listing status.");
    const status = body.status ?? "AVAILABLE";
    const backlinksValue = optionalNumber(body.backlinks, "Backlinks", true);
    if (backlinksValue !== null && !Number.isSafeInteger(backlinksValue)) throw new Error("Backlinks must be a safe whole number.");
    const tags = Array.isArray(body.tags) ? body.tags.filter((tag: unknown): tag is string => typeof tag === "string").map((tag: string) => tag.trim()).filter(Boolean).slice(0, 20) : [];
    const categorySlug = slugify(categoryName);
    const category = await prisma.category.upsert({ where: { slug: categorySlug }, update: {}, create: { name: categoryName, slug: categorySlug } });
    const domain = await prisma.domain.create({ data: {
      name, slug: slugify(name), description: typeof body.description === "string" ? body.description.trim().slice(0, 1000) : null,
      priceUSD, categoryId: category.id,
      ageYears: optionalNumber(body.ageYears, "Age"), authorityScore: optionalNumber(body.authorityScore, "AS"),
      domainAuthority: optionalNumber(body.domainAuthority, "DA"), pageAuthority: optionalNumber(body.pageAuthority, "PA"),
      domainRating: optionalNumber(body.domainRating, "DR"), backlinks: backlinksValue === null ? null : BigInt(backlinksValue),
      tags, status, featured: body.featured === true, metricsSource: "Admin entry", metricsUpdatedAt: new Date(),
    }, include: { category: true } });
    return NextResponse.json({ ok: true, domain: { id: domain.id, name: domain.name, category: domain.category?.name, priceUSD: Number(domain.priceUSD), status: domain.status } }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ error: "This domain is already in the inventory, or its slug is already in use." }, { status: 409 });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create domain." }, { status: 400 });
  }
}
