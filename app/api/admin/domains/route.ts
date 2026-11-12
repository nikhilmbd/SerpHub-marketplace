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

function parseDomain(body: any) {
  const name = typeof body.name === "string" ? body.name.trim().toLowerCase() : "";
  const categoryName = typeof body.category === "string" ? body.category.trim() : "";
  if (!/^(?=.{3,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(name)) throw new Error("Enter a valid domain name, such as example.com.");
  if (!categoryName || categoryName.length > 80) throw new Error("Enter a category (maximum 80 characters).");
  const priceUSD = Number(body.priceUSD);
  if (!Number.isFinite(priceUSD) || priceUSD <= 0) throw new Error("Price must be greater than zero.");
  if (body.status !== undefined && !statuses.includes(body.status)) throw new Error("Choose a valid listing status.");
  const backlinks = optionalNumber(body.backlinks, "Backlinks", true);
  if (backlinks !== null && !Number.isSafeInteger(backlinks)) throw new Error("Backlinks must be a safe whole number.");
  const tags = Array.isArray(body.tags) ? body.tags.filter((tag: unknown): tag is string => typeof tag === "string").map((tag: string) => tag.trim()).filter(Boolean).slice(0, 20) : [];
  return {
    name, categoryName, priceUSD, status: body.status ?? "AVAILABLE", tags, backlinks,
    description: typeof body.description === "string" ? body.description.trim().slice(0, 1000) : null,
    ageYears: optionalNumber(body.ageYears, "Age"), authorityScore: optionalNumber(body.authorityScore, "AS"),
    domainAuthority: optionalNumber(body.domainAuthority, "DA"), pageAuthority: optionalNumber(body.pageAuthority, "PA"),
    domainRating: optionalNumber(body.domainRating, "DR"), featured: body.featured === true,
  };
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const rows = await prisma.domain.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  const domains = rows.map((d) => ({
    id: d.id, name: d.name, priceUSD: Number(d.priceUSD), category: d.category?.name ?? "Uncategorized",
    status: d.status, createdAt: d.createdAt.toISOString(), description: d.description,
    ageYears: d.ageYears === null ? null : Number(d.ageYears), authorityScore: d.authorityScore === null ? null : Number(d.authorityScore),
    domainAuthority: d.domainAuthority === null ? null : Number(d.domainAuthority), pageAuthority: d.pageAuthority === null ? null : Number(d.pageAuthority),
    domainRating: d.domainRating === null ? null : Number(d.domainRating), backlinks: d.backlinks === null ? null : Number(d.backlinks),
    tags: d.tags, featured: d.featured,
  }));
  return NextResponse.json({ domains }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = parseDomain(await request.json());
    const category = await prisma.category.upsert({ where: { slug: slugify(body.categoryName) }, update: {}, create: { name: body.categoryName, slug: slugify(body.categoryName) } });
    const domain = await prisma.domain.create({ data: {
      name: body.name, slug: slugify(body.name), description: body.description, priceUSD: body.priceUSD, categoryId: category.id,
      ageYears: body.ageYears, authorityScore: body.authorityScore, domainAuthority: body.domainAuthority, pageAuthority: body.pageAuthority,
      domainRating: body.domainRating, backlinks: body.backlinks === null ? null : BigInt(body.backlinks), tags: body.tags, status: body.status,
      featured: body.featured, metricsSource: "Admin entry", metricsUpdatedAt: new Date(),
    }, include: { category: true } });
    return NextResponse.json({ ok: true, domain: { id: domain.id, name: domain.name, category: domain.category?.name, priceUSD: Number(domain.priceUSD), status: domain.status } }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ error: "This domain is already in the inventory, or its slug is already in use." }, { status: 409 });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create domain." }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.id !== "string" || !body.id.trim()) throw new Error("Missing domain ID.");
    const values = parseDomain(body);
    const existing = await prisma.domain.findUnique({ where: { id: body.id } });
    if (!existing) return NextResponse.json({ error: "Domain not found." }, { status: 404 });
    const categorySlug = slugify(values.categoryName);
    const category = await prisma.category.upsert({ where: { slug: categorySlug }, update: {}, create: { name: values.categoryName, slug: categorySlug } });
    const domain = await prisma.domain.update({ where: { id: body.id }, data: {
      name: values.name, slug: slugify(values.name), description: values.description, priceUSD: values.priceUSD, categoryId: category.id,
      ageYears: values.ageYears, authorityScore: values.authorityScore, domainAuthority: values.domainAuthority, pageAuthority: values.pageAuthority,
      domainRating: values.domainRating, backlinks: values.backlinks === null ? null : BigInt(values.backlinks), tags: values.tags, status: values.status,
      featured: values.featured, metricsSource: "Admin entry", metricsUpdatedAt: new Date(),
    }, include: { category: true } });
    return NextResponse.json({ ok: true, domain: { id: domain.id, name: domain.name, category: domain.category?.name, priceUSD: Number(domain.priceUSD), status: domain.status } });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ error: "Another domain already uses this domain name or slug." }, { status: 409 });
    if (error?.code === "P2025") return NextResponse.json({ error: "Domain not found." }, { status: 404 });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update domain." }, { status: 400 });
  }
}
