# Stage 5 — Finance integration scaffold

Status: scaffold only. Stopped before any code that writes to an external API.

Branch: `cursor/salonos-stage5-finance-scaffold-b88d`, stacked on `cursor/salonos-stage4-preview-b88d` (PR #1).

Tony's finance app already exists. The exact sync will be confirmed after preview review. This stage prepares a daily cash-up and sales push (tenders, deposits, tips, refunds, commission). Product cost pull and invoice sync are later and optional. They are not built.

The module is optional and off by default. No live data and no real keys are used.

## Module boundary

`src/modules/finance-sync/` is a separate module. It reads the payments ledger, the tips ledger, commission rows, the closed cash-up record and the existing finance outbox. It does not change the till, the ledger writer, the Stripe test-mode flow, or the IndexedDB adapter.

The existing outbox in `src/domain/finance.ts` stays the source pattern: each posting has an idempotency key, a status, and append-only lines. This module does not edit those rows. A day's push is a new document. A correction is a new document with the next sequence, not an update.

Nothing in this module calls the network. `HttpFinanceAdapter.postCashUp` throws `NOT ENABLED: awaiting Tony approval`.

## Daily cash-up payload

Schema name: `salonos.cash-up.v1`. Schema version: `1`. Currency is GBP. The business date is a Europe/London calendar day.

Idempotency key: `finance-sync:{siteId}:{businessDate}:{sequence}`.

Sequence starts at 1. Re-running the same salon, date and sequence produces the same key. The mock adapter stores one row per key and returns that row on a repeat, so the day is not duplicated. A later correction uses sequence 2, 3, and so on. Each sequence is its own append-only posting.

```json
{
  "schema": "salonos.cash-up.v1",
  "schemaVersion": 1,
  "idempotencyKey": "finance-sync:site-sample-1:2026-10-28:1",
  "siteId": "site-sample-1",
  "businessDate": "2026-10-28",
  "sequence": 1,
  "currency": "GBP",
  "timezone": "Europe/London",
  "generatedAt": "2026-10-28T21:00:00.000Z",
  "lines": [],
  "totals": {
    "tendersPence": 0,
    "depositsPence": 0,
    "tipsPence": 0,
    "refundsPence": 0,
    "commissionPence": 0,
    "paidInPence": 0,
    "paidOutPence": 0,
    "expectedCashPence": 0,
    "actualCashPence": null,
    "variancePence": null
  },
  "outbox": []
}
```

Amounts are integer pence. Refund lines are negative. A paid-out line is negative. A commission reversal is a second negative line. The original line is left as it was.

## Mapping

Totals that must match the till come from the payments ledger, using the same `expectedCash` formula as cash-up:

expected cash = float + cash tenders + cash deposits − cash refunds − paid out + paid in.

Tips are not cash sales. They are listed as `tips-payable` and are not added to expected cash. Commission is listed on its own and is not added to expected cash. Card and simulated tenders are listed under tenders, and only cash method rows affect expected cash.

| Source | Payload line | Sign |
|---|---|---|
| Ledger `tender` | `tender` | As recorded |
| Ledger `deposit` | `deposit` / `deposit-held` | As recorded |
| Ledger `refund` | `refund` | Negative, even when the till stored a positive refund |
| Ledger `paid-in` | `paid-in` | Positive |
| Ledger `paid-out` | `paid-out` | Negative |
| Tips ledger (or a ledger tip only when the tips ledger has nothing that day) | `tip` / `tips-payable` | As recorded |
| Commission row | `commission` | As recorded, plus a negative reversal line when the row is marked reversed |
| Closed cash-up variance | `over-short` | Actual minus expected |

The finance outbox is copied onto the payload under `outbox` for the same business date, including a cash-up posting whose source id is that date. Those outbox lines keep the account split already used by the stub (service, retail, discount, VAT, tip, deposit held, deposit applied, and the rest). They are not added again into `totals.tendersPence`, so a deposit that exists in both the ledger and the outbox is counted once in the totals.

Product cost and supplier invoices are not mapped.

## Retry and backoff

Retries belong to a future server-side worker. This scaffold only defines the plan.

- The same idempotency key is sent on every retry of a sequence.
- After attempt 1 the delay is 1s, then 2s, 4s, 8s, 16s, 32s, 64s, capped at five minutes.
- Attempt 8 is `failed`. It is not retried automatically.
- A failed day is not edited. Staff can post the next sequence if the business content changed.
- The preview does not schedule these delays and does not call an endpoint.

## Reconciliation report

`reconcileCashUp` compares the payload with the till formula and, when a day is closed, with the stored expected cash and variance. It checks that every refund line is negative and that every outbox idempotency key for that day is present. `matched` is true only when those checks pass. The report is for the salon screen and for tests. It is not sent anywhere.

The admin button **Preview cash-up payload** builds this JSON from the SAMPLE data already on the device (the latest business date that has ledger, tip, commission, outbox or cash-up rows) and states whether the till expected cash matches. The preview is not a push.

## Per-salon config

Held by this module, not by the till settings writer. In the preview the choice is stored on the device. Defaults:

| Field | Default |
|---|---|
| enabled | `false` |
| base URL | `[FINANCE API BASE URL – Tony to set]` |
| auth type | `[FINANCE API AUTH – Tony to set]` |
| posting time | `22:00` Europe/London |

The admin screen shows **OPTIONAL / NOT CONNECTED**. The base URL and auth type are placeholders and are not editable into a live secret. There is no API key field. Turning the toggle on does not send a request.

## Security

Secrets, if Tony later approves a connection, go in Cloudflare environment variables on a Pages Function (or another server-side worker). They must not be compiled into the client, stored in IndexedDB, or typed into this screen. The browser may hold only the on/off choice, the posting time, and the placeholder labels. The HTTP adapter in this scaffold has no network call, so it cannot leak a key because it has nowhere to put one.

## Open questions for Tony's finance API

1. What is the endpoint URL, path and HTTP method for the daily cash-up push?
2. What auth does the API use (API key, OAuth, mTLS or something else), and who issues the test credential?
3. Will the API accept `salonos.cash-up.v1`, or does it need a different JSON shape and field names?
4. Is there a test environment that cannot post into the live books? What is its base URL?
5. What are the rate limits, and is `22:00` Europe/London an acceptable posting time?
6. Which error codes are safe to retry, and which must stop?
7. Does the API honour an idempotency key in the body, in a header, or both, and for how long is a repeat recognised?
8. Confirm the business date is the Europe/London calendar day, including around BST.
9. Should tips and commission travel in this daily payload, or as separate resources?
10. For the later product-cost pull and invoice sync: which direction, which identifiers, and are they still optional?
11. What reconciliation report will the finance app return so a salon day can be matched?
12. Who may turn the per-salon switch on (owner only is assumed here)?

No code that writes to the external API will be added until Tony answers these and a test run against the approved test environment succeeds.
