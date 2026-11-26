# Evoryn catalog and admin setup

The storefront can be published as a static GitHub Pages site. The catalog, admin sign-in, and product CRUD use Supabase; the browser only receives the public/publishable key. Database row-level security decides which records and operations are allowed.

## 1. Create the Supabase project

Create a project in Supabase, then copy its Project URL and publishable key. Add them as GitHub repository Actions secrets named `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Do not add a service-role/secret key to GitHub Pages build variables or any `VITE_` variable: Vite embeds those values in public browser files.

For local development, copy `.env.example` to `.env.local` and fill in the same two public values.

## 2. Apply the catalog migration

Use the Supabase SQL editor or the Supabase CLI linked to your own project to apply `supabase/migrations/20261126091414_evoryn_product_catalog.sql`. The migration creates the product catalog and RLS policies. Public visitors can read published rows only; an admin JWT claim in `app_metadata.role` is required to see drafts or modify catalog records.

## 3. Create a private admin account

In Supabase Auth, create/invite the owner account and set its **app metadata** to:

```json
{"role":"admin"}
```

Never put the role in user-editable `user_metadata`. Disable public sign-ups in the hosted Supabase Auth settings; local Supabase config also disables them. If you use the Supabase Admin API for provisioning, run it only in a trusted server-side or local private environment with a service-role key; do not commit that key or expose it in the site.

## 4. Enable the storefront

Add the two GitHub Actions secrets above, then rerun the Pages workflow or merge a commit to `main`. The store's shop route is `/#/shop`; admin sign-in is `/#/admin/login`. Hash routes are used so GitHub Pages can serve those pages directly.

Until Supabase is configured, the shop displays the existing sample pieces as a visual fallback and the admin form remains disabled. The existing homepage cart is a prototype and does not accept or process payments.

## Before accepting orders

Connect checkout to a server-side order and payment flow. Never trust browser-sent totals or inventory for a paid order. Configure and verify shipping, returns, product provenance, currency conversion, and payment-provider requirements with the business before enabling checkout.
