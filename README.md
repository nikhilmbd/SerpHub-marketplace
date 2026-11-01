# SerpHub Marketplace — Netlify-ready starter

A premium-minimal Next.js starter for SerpHub.info.

## Included
- Responsive premium-minimal marketplace homepage
- Demo domain cards, categories, search, filtering and sorting
- USD / INR display toggle using explicit sample prices (not live FX conversion)
- Shortlist/cart interaction
- Make an Offer form that opens a prefilled email draft
- Multi-domain order enquiry that opens a prefilled email draft
- How-it-works, FAQ and contact sections
- Basic SEO metadata and Open Graph metadata
- Prisma schema draft for the planned PostgreSQL backend
- Netlify build configuration (`netlify.toml`)

## Important limitations
This ZIP is the complete **current starter source**, not a completed production marketplace.
- Inventory is illustrative demo data in `lib/domains.ts`. Replace it with verified listings before publishing.
- Order and offer actions currently open a `mailto:` draft addressed to `hello@serphub.info`; they do not persist requests or send Telegram notifications.
- Sign-in is a placeholder. Authentication, customer accounts, admin dashboard, CSV import, live database APIs and seller portal are not implemented yet.
- No payment is collected.
- Complete legal pages, business contact details, privacy policy, terms and refund/cancellation policy before launch.

## Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Netlify
For a Next.js application, do not drag the source ZIP into Netlify's manual deploy drop zone. That flow is for prebuilt static output. Instead:

1. Extract this ZIP on your computer.
2. Create a GitHub repository (for example `serphub-marketplace`).
3. Upload the extracted project files and folders to the repository root, then commit.
4. In Netlify, choose **Add new project → Import an existing project**.
5. Connect GitHub and select the repository.
6. Netlify should detect Next.js. Use build command `npm run build` and publish directory `.next` (also defined in `netlify.toml`).
7. Deploy. Add `serphub.info` in Netlify's domain settings after the first successful deployment.

The current frontend does not require environment variables to render. The `.env.example` file is a template for backend services that will be added later.

## Next implementation milestones
1. Configure PostgreSQL and Prisma migrations.
2. Implement customer/admin authentication and role permissions.
3. Implement domain inventory APIs and admin CRUD.
4. Add CSV import with validation, preview and duplicate handling.
5. Add persistent cart, wishlist and customer dashboard.
6. Save orders and offers with server-side price and availability validation.
7. Integrate transactional email and Telegram bot notifications.
8. Add seller-ready workflows (seller portal disabled initially).
9. Production security, backups, monitoring and legal pages.
