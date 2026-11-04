# SerpHub: 39-domain import

This import uses USD-only pricing. INR is stored as SQL NULL, not zero.

- 19 domains, categories, USD prices and supplied SEO metrics.
- AS, DA, PA and DR are separate fields.
- Age is stored to two decimal places; backlinks use a 64-bit integer.
- Status is set to AVAILABLE, as assumed in the source workbook; verify before publishing.
- NameRank and Domain Rank remain separate tags. The agreed combined tag `Subfolder Indexed High DR Backlink` replaces the source `Backlink Subfolder` marker only where that marker was present.
- Indexed and High DR were not independently supplied as verified fields.

## Import locally
1. Keep your existing `.env` in the project root; do not share it.
2. Run `npm install`.
3. Run `npx prisma generate`.
4. Run `npx prisma migrate deploy` to apply the migration.
5. Run `npx tsx prisma/import-domains.ts`.

The script is safe to rerun: it updates records with matching domain names. It sets INR to NULL.
