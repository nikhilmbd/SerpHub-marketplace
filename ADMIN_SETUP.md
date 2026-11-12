# SerpHub Admin Panel Setup

This patch adds a password-protected admin area at `/admin` for manually adding domains to the existing Prisma/Supabase inventory.

## 1. Add environment variables

Set these in **Netlify → Site configuration → Environment variables** (and in your local `.env` for local testing):

- `ADMIN_PASSWORD` — a strong, unique admin password.
- `ADMIN_SESSION_SECRET` — a random secret of at least 32 characters.

Generate a session secret in PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Do not commit either value, share it in chat, or put it in a `NEXT_PUBLIC_` variable. Redeploy after setting Netlify variables.

## 2. Copy files

Copy the folders and files in this ZIP into the root of your existing SerpHub project, merging folders:

- `app/admin/`
- `app/api/admin/`
- `app/api/domains/`
- `lib/admin-auth.ts`

The included `app/api/domains/route.ts` exposes only public listing fields and masks sold domain names on the server. It never sends full sold names to the browser.

## 3. Connect the homepage to live inventory

The latest homepage component expects a `domains` prop (`PublicDomain[]`). Update `app/page.tsx` so it loads the Prisma inventory and passes it to `<Marketplace domains={domains} />`. If your current page already does this, do not replace it. Otherwise use this server component:

```tsx
import Marketplace from "@/components/marketplace";
import { prisma } from "@/lib/prisma";
import type { PublicDomain } from "@/lib/public-domain";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rows = await prisma.domain.findMany({
    where: { status: { not: "INACTIVE" } },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const domains: PublicDomain[] = rows.map((d) => {
    const dot = d.name.lastIndexOf(".");
    const base = dot >= 0 ? d.name.slice(0, dot) : d.name;
    const suffix = dot >= 0 ? d.name.slice(dot) : "";
    const safeName = d.status === "SOLD"
      ? `${base.slice(0, 3)}••••••${suffix}`
      : d.name;

    return {
      id: d.id,
      name: safeName,
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
    };
  });

  return <Marketplace domains={domains} />;
}
```

Make sure `lib/public-domain.ts` exports a `PublicDomain` type with these fields: `id`, `name`, `priceUSD`, `category`, `age`, `as`, `da`, `pa`, `dr`, `backlinks`, `tags`, `description`, and `status` (status is `"AVAILABLE" | "RESERVED" | "SOLD" | "INACTIVE"`). If your existing type differs, align the mapping with that type.

## 4. Test and deploy

```powershell
npm run build
git add app/admin app/api/admin app/api/domains lib/admin-auth.ts ADMIN_SETUP.md
git commit -m "Add secure domain admin panel"
git push origin main
```

If you also changed `app/page.tsx` or `lib/public-domain.ts`, include those files in `git add`.

After Netlify publishes, open `https://serphub.info/admin`, sign in with `ADMIN_PASSWORD`, and add a domain. The homepage reads from the database; the new listing appears there according to its status. No Prisma migration is required because the existing Domain and Category models already contain the required fields.
