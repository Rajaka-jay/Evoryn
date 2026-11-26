# Evoryn

Evoryn is a Vue 3 + TypeScript storefront prototype for a gemstone and jewellery brand.

## Current capabilities

- Responsive, video-led brand landing page
- Sample gemstone collection and product detail modal
- Search preview
- In-memory cart demonstration
- Light/dark theme toggle
- Static GitHub Pages deployment

## Production status

This repository is a frontend prototype. It does **not** currently include a commerce backend, a trusted product catalog, customer accounts, persistent carts, checkout, payment processing, order management, or inventory control. The catalog uses sample gemstone fixtures only; its products, prices, and stock are still demo data. Do not use it to accept real orders.

See [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md) for the code review, launch blockers, implementation order, and decisions needed for a real store.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Local development

```sh
npm ci
npm run dev
```

## Quality checks

```sh
npm run type-check
npm run build-only
```

The pull request workflow runs these compile checks. The existing Playwright test is a stale Vue starter assertion and must be replaced with real storefront journeys before it can be used as a release gate.

## Deployment

The existing GitHub Pages workflow builds the Vite app and publishes `dist/` from pushes to `main`. This serves static frontend files only. GitHub Pages does not provide trusted order, inventory, account, or payment processing.

## Stack

- Vue 3 and Vue Router
- TypeScript
- Vite
- Tailwind CSS v4
- Vitest and Playwright (test foundations)
