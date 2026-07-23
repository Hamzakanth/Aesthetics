# Aurelius

Marketing site foundation for a premium enterprise SaaS product.
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui.

Design philosophy: **Apple × Stripe × Linear** — Swiss Modernism base, near-black
neutrals, a single gold accent.

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (next/core-web-vitals + typescript) |
| `npm run typecheck` | `tsc --noEmit` |

## Architecture

```
src/
├── app/                     App Router. Route files only — no business logic.
│   ├── actions/             Server actions ("use server")
│   ├── contact/             /contact
│   ├── globals.css          ALL design tokens + Tailwind theme bridge
│   ├── layout.tsx           Fonts, providers, header/footer shell
│   ├── sitemap.ts robots.ts SEO route handlers
│   └── error.tsx not-found.tsx
├── components/
│   ├── ui/                  shadcn primitives. Unopinionated, reusable.
│   ├── primitives/          Container, Section, SectionHeading — layout contract
│   ├── layout/              Header, footer, nav, theme
│   ├── sections/            Page sections. Composed, not reused across products.
│   ├── forms/               Form components
│   ├── charts/              Recharts wrappers
│   └── motion/              Framer Motion reveal primitives
├── config/                  site.ts, nav.ts — structural configuration
├── content/                 Copy and data. Swap for a CMS without touching UI.
├── hooks/
├── lib/                     utils, seo, validations/
└── types/
```

**The layering rule:** `sections/` compose `primitives/` and `ui/`, and read from
`content/`. Nothing flows the other way. `ui/` never imports from `sections/`.

Content lives in `src/content/` as typed modules precisely so swapping in a CMS
later is a change to one directory, not to every component.

## Design system

`design-system/aurelius/MASTER.md` is the source of truth for colour, type,
spacing, motion, and the accessibility non-negotiables. Read it before adding UI.

Tokens are defined once in `src/app/globals.css` across three layers —
primitive → semantic → component — and bridged into Tailwind via `@theme inline`.
**Never write a raw hex inside a component.**

## Adding a shadcn component

`components.json` is configured (new-york, stone base, CSS variables):

```bash
npx shadcn@latest add dialog
```

New primitives land in `src/components/ui/`. Re-style them against the semantic
tokens rather than the shadcn defaults.

## Accessibility baseline

Enforced throughout, not retrofitted: skip link, visible focus rings, 44px touch
targets, labelled fields with `role="alert"` errors, `aria-hidden` on decorative
DOM, text alternatives for charts, 4.5:1 contrast in both themes, and
`prefers-reduced-motion` handled globally in CSS and per-component in JS.

## Extending

- **New page** — add `src/app/<route>/page.tsx`, export `buildMetadata({...})`
  from `@/lib/seo`, and register the path in `src/app/sitemap.ts`.
- **New section** — compose `Section` + `Container` + `SectionHeading`. Do not
  set `max-width` or `padding-block` directly.
- **New form** — add a schema in `src/lib/validations/`, share it between the
  client resolver and the server action. Server validation is authoritative.

## Known integration points

- `src/app/actions/contact.ts` validates and returns success, but does not
  forward anywhere. Wire it to your CRM or email provider.
- `/login`, `/docs`, `/signup` and the legal routes are linked but not built.
- `public/og.png` (1200×630) is referenced by metadata and needs to be added.
