# SalonOS task log

## Stage 4 preview build

- Branch: `cursor/salonos-stage4-preview-b88d`
- In-scope requirements implemented in the preview: 293
- Stubbed because hardware, a provider, or Tony’s marketplace lock says so: 11
- Deferred (OUT and section 11.6): 67
- No deploy. No cloud database. No live payments.
- Build: `npm run build` → `dist`
- Tests: `npm test` (33), `npm run test:e2e` (booking to diary)

## Stage 5 finance sync scaffold

- Branch: `cursor/salonos-stage5-finance-scaffold-b88d`, stacked on `cursor/salonos-stage4-preview-b88d` (PR #1).
- Separate module `src/modules/finance-sync/`. The till, ledger writer, Stripe test-mode flow and IndexedDB adapter were not changed.
- Daily cash-up payload `salonos.cash-up.v1`, with an idempotency key per salon, business date and sequence. Mock adapter only. HTTP adapter throws and has no network call.
- Per-salon toggle defaults to off and is labelled OPTIONAL / NOT CONNECTED. Preview button shows the JSON from SAMPLE data.
- OUT-07 stays deferred. Product cost pull and invoice sync are not built.
- Stopped before any write to an external API. No deploy.
- Open questions are in `docs/stage5-finance-integration.md`.
