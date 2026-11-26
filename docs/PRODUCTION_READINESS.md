# Evoryn production-readiness review

Reviewed the default branch on 26 November 2026. This is a code review of the repository, not a live payment, security, accessibility, or deployment certification.

## Current state

Evoryn is a Vue 3 + TypeScript + Vite single-page storefront deployed as a static GitHub Pages site. It currently demonstrates a cinematic home page, a product collection backed by one shared sample catalog, search preview, product detail dialog with category/price filters, theme toggle, and a guest cart persisted in browser storage.

The current implementation is a prototype. It is not ready to accept real customer orders or payments.

## Findings

### Release blockers

1. **No trusted commerce backend.** The current branch uses hard-coded sample catalog data in browser code. A customer can alter browser state. There is no server-side price/stock validation, inventory reservation, order record, or payment confirmation.
2. **Catalog contains demo merchandise.** This branch removes the unrelated DummyJSON products from the collection and search. Four hard-coded sample gemstone items remain; their price, stock, and rating values are demonstrations rather than a merchant catalog.
3. **Cart is browser-local and has no checkout.** The guest cart survives a refresh in browser storage, but this state is untrusted and not synchronized to a server. There is no address, delivery, payment, or order-confirmation flow.
4. **No operations interface.** There is no protected product/inventory management, order fulfillment, refunds, or customer support workflow.
5. **Fulfillment and settlement rules remain open.** The sales target is Sri Lanka plus international buyers in LKR/USD. Delivery regions and fees, tax handling, returns/refunds, merchant settlement setup, and order notifications need business-owner decisions before those flows can be implemented correctly.
6. **Automated browser check is stale.** The only Playwright check expects the Vue starter heading “You did it!”, which the current storefront does not render.
7. **Large media payload.** A bundled MP4 is approximately 56 MB. The second hero video is now lazy-loaded when its section enters the viewport, reducing initial transfer; the file still increases repository clone/build size, and video compression/off-site delivery remains a release improvement.

### Storefront quality gaps

- The main menu and story calls to action now link to real sections; footer support links and the newsletter form still need destinations and submission feedback.
- The product detail dialog now supports keyboard activation and Escape; focus placement, focus return, and cart-dialog keyboard behavior still need an accessibility pass.
- Product and order routes, shareable product links, and robust catalog error states are missing. Basic page metadata is in place; canonical URLs and social preview imagery remain.

## Recommended implementation order

### Phase 1 — establish a reliable storefront baseline

- The README and pull request compile checks now describe the actual project. The Playwright starter assertion still needs replacement.
- The visible collection and search now use one shared module containing only four gemstone sample fixtures; connect it to a trusted catalog before launch.
- The guest cart now survives a refresh in browser storage; build the server-backed checkout separately and never trust the saved client prices.
- Add product types and a single catalog service boundary so a real backend can replace demo fixtures without spreading fetch logic through components.
- The second hero video now loads only near its section; still compress/offload the large asset, provide poster images, and respect reduced-motion.
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
