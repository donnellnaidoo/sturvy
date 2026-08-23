# KleenKicks

Monorepo for KleenKicks, a sneaker cleaning & restoration studio in Benoni, Ekurhuleni.

- `apps/web` — the public marketing site & shop (Next.js App Router + Tailwind), using a Nike-inspired design system (see `DESIGN.md`).
- `apps/admin` — internal order-management dashboard, password-gated, deployed separately from the storefront.
- `packages/db` — shared Drizzle ORM schema/client used by both apps to read and write orders.

## Getting started

```bash
npm install

npm run dev:web    # http://localhost:3000
npm run dev:admin  # http://localhost:3001
```

## Environment variables

Copy the `.env.example` in each app to `.env.local` and fill in real values:

- `apps/web/.env.example` — `DATABASE_URL`. Optional: without it, checkout still completes via WhatsApp, orders just aren't saved for the admin dashboard.
- `apps/admin/.env.example` — `DATABASE_URL` (same database as `apps/web`), `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.

`DATABASE_URL` is a Postgres connection string — [Neon](https://neon.tech) has a generous free tier and works well with this setup (`drizzle-orm/neon-http`).

After setting `DATABASE_URL`, push the schema to your database:

```bash
npm run db:push
```

## Before launch

Update the placeholder business details in `apps/web/src/lib/site-config.ts`:

- `whatsappNumber` / `phoneDisplay` — real WhatsApp booking number
- `email` — real contact address
- `instagram` / `tiktok` — real social links

## 3D model

`apps/web/public/models/nike-air-force-1-white.glb` (interactive viewer) and
`nike-air-force-1-white.usdz` (iOS AR Quick Look) are rendered in the hero via
`apps/web/src/components/sneaker-viewer.tsx`, built on
[`@google/model-viewer`](https://modelviewer.dev/).
