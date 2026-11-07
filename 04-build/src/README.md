# SalonOS

Preview build of an operating system for one independent UK high-street hair and beauty salon. The public site uses the neon-pink SalonOS shopfront, wordmark and treatment photos (AI-made, licence-free). Text sits on dark plum (`#1A0B1F`) or as plum on `#FF1493`, so pink is not used as text on pink. It runs the diary, till, walk-ins, client cards, stock, loyalty and the online shop in the browser. It is not a booking-only site.

This build is **noindex**, uses **SAMPLE** fictional people, and takes **no real payments**. It does not deploy itself.

## Setup

```bash
npm install
npm test
npm run test:e2e
npm run build
```

Dev server: `npm run dev`.

## Build and deploy output

| | |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Static headers | `public/_headers` (copied into `dist`) |
| Pages Functions | `functions/` (picked up from the repo root, not from inside `dist`) |

The coordinator deploys a Cloudflare Pages preview later, after a written pre-flight check. The command, which this build does **not** run, is:

```bash
npx wrangler pages deploy dist
```

Free tier only. No custom domain, no paid add-on, no D1 database, no KV, no secret required for the preview to open.

## Tests

| Command | What it covers |
|---|---|
| `npm test` | Money, deposit (greater of 20% and £15, cap at the price, per-service and per-salon rules), no-show cap, commission, tips pass-through, stock ledger, slot length and processing gaps, patch-test gate, catalogue seed (703 rows plus the locked brief prices). |
| `npm run test:e2e` | Chrome smoke test: choose Ladies Cut & Blow Dry Short, pick Jordan Hale, choose a slot, accept terms, simulated checkout, unlock the desk, see the booking on the diary with the deposit paid. |

Latest local run: **33 unit tests passed**, **1 e2e test passed**.

## Environment variables

None are required.

| Variable | Where | Rule |
|---|---|---|
| `STRIPE_SECRET_KEY` | Pages Function only | Optional. Must start with `sk_test_`. A live key is refused. If unset, checkout returns the simulated-payment stub. |
| `STRIPE_WEBHOOK_SECRET` | Pages Function only | Optional. Without it the webhook endpoint stays a stub. The browser ledger already ignores a repeated idempotency key. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Not read | Left for a later Stripe.js step. This preview does not load Stripe.js. |

Copy `.env.example`. Do not commit real keys. The browser banner always says **TEST MODE – no real payments**.

## Architecture

One React and TypeScript app.

- `src/domain/` is the rules: pence, deposits, no-show cap, commission, tips, slots, stock, patch tests, offers, permissions. The UI does not get to invent a total. Checkout recalculates.
- `src/data/session.ts` is the preview adapter. Guests read a public catalogue and seal a booking with the salon’s public key. Staff unlock decrypts the private record and applies the booking, the ledger and the finance outbox.
- IndexedDB holds that state. Seeded people are labelled **SAMPLE**. There is no server database in this preview.
- `d1/migrations/0001_init.sql` is the free-tier schema for later. `d1/README.md` is the adapter note. Nothing in this build creates the database.
- `functions/api/stripe/` is the optional test-mode Checkout call. `functions/api/health.ts` reports which mode is active.
- Legal drafts LEG-01 to LEG-23 are public pages under `/legal`. Each page shows **DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use**.
- UK display: `£` via `en-GB`, dates `dd/mm/yyyy`, times in `Europe/London`.

One client record, one stock ledger and one payments ledger. `site_id` is on every record. There is no site switcher.

### Offline and a lost device

The next days of the diary, the price list and the client cards are in IndexedDB, so the desk still opens if the network drops. **Simulate offline** on the staff home queues writes. Reconnect runs them once. A second booking on the same time goes to **Needs attention** with the phone number. It is not dropped and it is not saved twice.

Card buttons are disabled offline. External card (SumUp, Dojo or another terminal) stays available. No card number is stored. True offline card payments are out of this version.

Health data, formulas and the private ledger are encrypted with AES-GCM. The key is derived from the device PIN with PBKDF2 (120,000 rounds) and kept in memory. Locking or closing the tab drops it. Guest bookings are hybrid-encrypted to the salon key, so a locked device can still accept a booking without putting the name in clear IndexedDB.

The preview PIN is **published** (`2580`, and the SAMPLE logins on the lock screen) because every person in the seed is fictional. Change the PIN in a live salon before any real client exists. This is not a defence against someone who already knows the published preview PIN.

### Placeholders

These stay as tokens. The build does not invent operator details, travel fees, shipping rates, nail-tier prices, branded-product price differences, membership benefits or a monthly membership price.

`[SALON NAME]`, `[OPERATOR LEGAL NAME]`, `[OPERATOR ADDRESS]`, `[OPERATOR EMAIL]`, `[VAT NUMBER]`, `[OPERATOR VAT POSITION]`, `[ICO REGISTRATION]`, `[DATABASE HOST]`, `[EMAIL PROVIDER]`, `[SMS PROVIDER]`, `[WHATSAPP PROVIDER]`, `[PRICE]`, `[PRICE – Tony to set]`, `[PRICE DIFFERENCE – Tony to set]`, `[SHIPPING RATE – Tony to set]`, `[FREE SHIPPING THRESHOLD]`, `[TRAVEL FEE – Tony to set]`, `[HOLD MINUTES]`, `[TIP POLICY – salon writes]`, `[PATCH TEST VALIDITY – salon sets]`, `[PATCH TEST RETENTION – salon sets]`, `[MEMBERSHIP BENEFITS – Tony to define]`, `[VOUCHER VAT TREATMENT – adviser to confirm]`, `[ACCOUNTING PACKAGE – Tony to choose later]`, `[CANCELLATION WINDOW]`, `[DECLINED-TEST POLICY]`, `[COMMISSION %]`, `[PAYOUT DAY]`, `[MARKETPLACE – later phase]`.

The locked brief services and the 15 retail lines keep the brief’s prices. The 703-row treatment seed has names and sourced durations only, starts inactive, and can be edited or deleted. New products default to **in shop only**. Gift vouchers are sold at the till only. The deposit starts at the greater of 20% and £15, editable per service and per salon, and a no-show fee cannot exceed the deposit already taken unless a separate card-on-file agreement was ticked.

SAMPLE staff commission rates and the SAMPLE10 offer are labelled sample configuration so the till and the journey can be tried. They are not a price list.

## Requirements coverage

304 in-scope requirements. **293 implemented. 11 stubbed. 67 deferred** (20 OUT rows and 47 struck or marketplace rows). The ID-by-ID table is in [`docs/requirements-coverage.md`](docs/requirements-coverage.md). Counts are checked by `tests/catalogue.test.ts`.

### Stubbed

| ID | Why |
|---|---|
| MKS-01, MKS-02 | Marketplace is a stub by Tony’s 22:53 lock. Disabled settings line and empty reserved tables. |
| TIL-07 | Receipt on screen and browser print. Email is logged, not sent. No network printer. |
| TIL-15 | Drawer-open is audited and the ESC/POS kick is in the payload. No drawer hardware. |
| ADM-14 | Same printer limit. |
| OFF-03 | Offline cash sale queues. Drawer and LAN print stay hardware stubs. |
| MSG-01, MSG-06 | Reminders and provider settings are logged. Nothing is sent. Providers stay placeholders. |
| LYC-04 | Campaign audience rules run. Preview does not transmit. |
| ORT-12 | Order emails are stored on screen. |
| SVC-09 | Membership can be recorded. The price is `[PRICE]` and benefits are `[MEMBERSHIP BENEFITS – Tony to define]`, so no amount is charged. |

### Deferred

OUT-01 true offline card. OUT-02 full multi-site. OUT-03 automated supplier ordering. OUT-04 advanced waitlist. OUT-05 deep terminal APIs. OUT-06 rent-a-chair payout. OUT-07 live accounting. OUT-08 production deploy. OUT-09 payroll. OUT-10 client-history import. OUT-11 batch and scale integrations. OUT-12 WhatsApp marketing. OUT-13 routing API. OUT-14 native app. OUT-15 online vouchers. OUT-16 marketplace card-present. OUT-17 paid club. OUT-18 courier APIs. OUT-19 international shipping. OUT-20 marketplace beyond the stub.

Struck on 22:53 and not built: DIA-14, DIA-16, CLI-11, PTT-07, COL-06, COL-07, STK-05, STK-06, GFT-05, GFT-06, GFT-07, GFT-08, LOY-10, OFF-10, MSG-03, MSG-04, MSG-07, RPT-02, RPT-04, RPT-05, CAT-16, NAI-06, TFB-05, TFB-08, HEV-06, LYC-08, LYC-09, OFR-06, OFR-09, BKJ-18, ORT-21, MKT-08, NFR-02, NFR-03, NFR-06, NFR-07, NFR-09, ROL-08, FIN-09, MKT-01, MKT-02, MKT-03, MKT-04, MKT-05, MKT-06, MKT-07, MKT-09.

## Needs a decision or money

- Operator legal name, address, email, VAT and ICO registration. LEG-23 cannot be completed without them.
- Travel fee, shipping rate, free-shipping threshold, nail-tier prices, branded-product price differences, cancellation window, patch-test validity, tip policy text, voucher VAT treatment, membership price and benefits.
- A solicitor reviews the 23 drafts before any salon relies on them.
- Stripe test keys, if the coordinator wants the Pages Function to open a real Stripe test Checkout. The preview runs without them.
- A free D1 database, only when someone chooses to attach it. Not created here.
- A network receipt printer and cash drawer, bought by the salon. The preview will not talk to hardware it cannot see.
- SMS, WhatsApp and email providers. Costs pass through to the salon. Nothing is sent from this preview.
- Workers Logs and traces were left off so this preview does not enable extra Cloudflare products.

No deploy was made. No custom domain. No paid add-on. No live Stripe key. No real customer data.
