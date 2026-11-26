# Evoryn production-readiness review

Reviewed the default branch on 26 November 2026. This is a code review of the repository, not a live payment, security, accessibility, or deployment certification.

## Current state

Evoryn is a Vue 3 + TypeScript + Vite single-page storefront deployed as a static GitHub Pages site. It currently demonstrates a cinematic home page, a product collection, search preview, product detail modal, theme toggle, and an in-memory cart.

The current implementation is a prototype. It is not ready to accept real customer orders or payments.

## Findings

### Release blockers

1. **No trusted commerce backend.** Products and prices are embedded in browser code or loaded from DummyJSON. A customer can alter browser state. There is no server-side price/stock validation, inventory reservation, order record, or payment confirmation.
2. **Catalog contains demo merchandise.** The collection combines four sample gemstone products with unrelated DummyJSON products. Their price, stock, and rating values are demonstrations rather than a merchant catalog.
3. **Cart is temporary and has no checkout.** Cart state is held in Vue memory and disappears on refresh. The cart drawer has no address, delivery, payment, or order-confirmation flow.
4. **No operations interface.** There is no protected product/inventory management, order fulfillment, refunds, or customer support workflow.
5. **Business rules are undecided.** Currency, delivery regions and fees, tax handling, returns, payment provider, and order notifications need merchant decisions before those flows can be implemented correctly.
6. **Automated browser check is stale.** The only Playwright check expects the Vue starter heading “You did it!”, which the current storefront does not render.
7. **Large media payload.** A bundled MP4 is approximately 56 MB. This increases clone/build size and can make the first visit slow, especially on mobile connections.

### Storefront quality gaps

- Several navigation entries and story buttons are placeholder links/actions.
- The newsletter form prevents submission but has no integration or success/error feedback.
- The cart/product dialogs need a keyboard and screen-reader pass (focus management, Escape handling, and clear accessible labels).
- Product and order routes, page metadata, shareable product links, and robust empty/error states are missing.

## Recommended implementation order

### Phase 1 — establish a reliable storefront baseline

- Replace the starter README and test expectations with project-accurate documentation and checks.
- Remove third-party demo products from the visible gemstone catalog.
- Add product types and a single catalog service boundary so a real backend can replace demo fixtures without spreading fetch logic through components.
- Optimize video delivery: provide poster images, defer/offload large videos, respect reduced-motion, and avoid downloading both hero videos eagerly.
- Add functional store navigation, product detail routes, cart persistence, quantity/stock constraints, and accessible dialogs.

### Phase 2 — backend and catalog

- Choose a backend (for example, a managed commerce service or a custom API with PostgreSQL).
- Define product, variant, stock, customer, cart, order, payment, shipping, and audit-log models.
- Make all prices, stock checks, discounts, totals, and order creation server-authoritative.
- Add authentication and role-based admin access, input validation, rate limiting, logging, backups, and migration strategy.

### Phase 3 — checkout and fulfillment

- Select a payment provider that supports the merchant's country, settlement account, and desired currencies.
- Create payment sessions on the server; verify signed provider webhooks before marking orders paid.
- Never store card numbers or trust a client-reported payment result.
- Implement address collection, delivery options, transparent totals, order confirmation, cancellation/refund process, and customer notifications.

### Phase 4 — launch validation

- Replace the stale end-to-end test with customer journeys for browse/search, product details, cart, checkout, payment outcomes, and mobile layouts.
- Add integration tests for price/stock validation and webhook idempotency.
- Verify accessibility, privacy/terms/returns, analytics consent, monitoring, incident recovery, and production backups.
- Use a staging environment and test-mode payment credentials before a controlled live launch.

## Decisions needed before implementing the real checkout

1. Will the store sell in Sri Lanka only, or ship internationally as well?
2. Which display and settlement currencies should it support (LKR, USD, or both)?
3. Which payment provider or providers do you want to use? This depends on the merchant account and supported country.
4. What backend/catalog do you want to use: Supabase/custom API, or a hosted commerce platform?
5. What delivery, tax, and returns rules should checkout show?

Until those choices and backend credentials are available, the repository can be hardened and the storefront refined, but real payment processing cannot be completed or safely represented as production-ready.
