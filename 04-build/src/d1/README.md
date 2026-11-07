# D1 adapter (not created)

This preview does not create a Cloudflare D1 database, a KV namespace, or any other cloud resource.

`migrations/0001_init.sql` is the free-tier schema. Apply it later with the Cloudflare dashboard or Wrangler only when the owner asks. The command would be `wrangler d1 migrations apply`, which this build does not run.

## What the preview uses instead

The browser keeps one salon in IndexedDB:

- `public` is the catalogue, staff profiles, offers and anonymous busy times a guest needs in order to book.
- `private` is AES-GCM ciphertext: clients, formulas, patch tests, bookings, orders and every ledger.

`src/data/session.ts` is the adapter. A later D1 adapter must call the same rules in `src/domain/` and must only insert ledger, stock, points, tips, commission, audit and finance rows. Corrections are new rows. `ledger.idempotency_key` is unique per site so a repeated Stripe event does nothing the second time.

`site_id` is on every table. v1 has one site and no site switcher.

Marketplace tables exist and stay empty. Nothing in the preview writes them.

## When D1 is attached

1. Create a free D1 database in the Cloudflare dashboard.
2. Apply `d1/migrations/0001_init.sql`.
3. Add the binding in `wrangler.toml` under `[[d1_databases]]`.
4. Point a Pages Function at that binding and move guest inbox rows server-side.
5. Keep Stripe in test mode until a separate go-live decision.

Until that happens, `/api/health` reports `persistence: "browser-indexeddb"`.
