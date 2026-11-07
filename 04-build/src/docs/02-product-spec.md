# SalonOS: Stage 2 Locked v1 Product Spec

**Status:** Stage 2 spec, **APPROVED by Tony at 22:53 GMT on 31 Oct 2026 with locks** (revised in this version: 37 of my 109 Stage 2 proposals struck to section 11.6, marketplace reduced to a stub, defaults locked). Stage 3 (legal and compliance drafts, folder `03-legal/`) is **APPROVED by Tony at 23:58 GMT on 31 Oct 2026 with six fine-tunes**; the fine-tunes (LEG-22, LEG-23 and wording changes) are **delivered and awaiting Tony's review**. No build.
**Prepared:** 31 Oct 2026 (UK time). **Stage 1 was approved by Tony at 21:39 GMT on 31 Oct 2026.**
**Draft, not legal advice.** Nothing here has been sent, posted, published or deployed. No code has been written.
**Scope rule:** this spec locks **v1 only**. It does not reduce the scope of the locked brief (`00-locked-brief-from-tony.md`). It adds only what Tony approved at Stage 1 (message pt755u) and in Amendments 01 (`00b-amendments-01-from-tony.md`, A1 to A7), plus a small number of clearly marked support items that the law or the real shop needs. Those are marked, and Tony struck 37 of my 109 proposals at 22:53 (section 11.6).
**Placeholders kept (Tony fills, never invented):** [OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL], [VAT NUMBER], [OPERATOR VAT POSITION], [ICO REGISTRATION], [DATABASE HOST], [EMAIL PROVIDER]. Spec-specific placeholders are listed in section 11.
**Companion files:** Stage 1 research `01-research-report.md` (sections 1 to 13); Stage 2 research `_research/stage2-deep-research.md`; catalogue seed `_research/treatment-catalogue-seed.csv`; Tony's instructions log `00c-tony-instructions-log.md`; short summary `02-checkpoint-summary.md`.

---

## 0. How to read this spec

**Every requirement has an ID** (for example `DIA-03`) and a **Source** column.

| Source tag | Meaning |
|---|---|
| **[BRIEF]** | In Tony's original locked brief. Not negotiable. |
| **[ADDED – Stage 1 approval]** | Tony locked it on 31 Oct 2026, 21:39 GMT (pt755u). |
| **[ADDED – Amendments 01]** | Tony's amendments of 21:30 GMT, 31 Oct 2026 (A1 to A7). Locked scope. |
| **[ADDED – Tony steer 21:45]** | Tony's steer at 21:45 GMT: focus on the main shop, a comprehensive treatment and product catalogue, the marketplace as a secondary extra. |
| **[ADDED – Tony 21:52]** | Tony's steer at 21:52 GMT: the end-to-end online journey (treatment, branded product, offers, regular artist, checkout) and a mail-order shop. |
| **[ADDED – Tony 21:53]** | Tony's steer at 21:53 GMT: "make sure everything stays together": one integrated system, traceable. |
| **[ADDED – Tony steer 20:49 GMT, relayed]** | Tony's real-world steer ("has to work in the real world. not cyber fantasy land"), passed to me by the parent agent. |
| **[ADDED – pipeline-rules]** | Required by `/workspace/pipeline-rules.md` for every delivered product (customer admin area, 26 Oct 2026). |
| **[ADDED – Stage 2 proposal]** | **My addition.** Needed to make a locked item work in a real shop, or to meet a UK legal duty found in Stage 1 research. **Not locked by Tony.** Tony reviewed these at 22:53: 72 kept, 37 struck (section 11.6). |
| **[ADDED – Tony 22:53]** | Tony's Stage 2 approval with locks, 22:53 GMT, 31 Oct 2026 (message pt763u): strike what a single high-street shop does not need on day one, marketplace as a stub only, seed rows freely editable and deletable, deposit editable per service and per salon. Saved verbatim in `00c-tony-instructions-log.md`. |
| **[LOCKED – Tony 22:53]** | A default that Tony's 22:53 message confirmed. No longer "Tony to confirm": deposit default (D18), new products in shop only (D9, default part), single site (D21), in-shop gift vouchers only (D8). |
| **[DEFAULT – Tony to confirm]** | A choice I made because Tony has not answered yet. Changing it changes the spec. All defaults are collected in section 1.3 and section 11. |

**Words used.** *Site Operator* = the business that holds the Stripe platform account and, if a marketplace is ever built beyond the stub, signs the artist agreements: [OPERATOR LEGAL NAME]. *Salon* = the licensed high-street salon using SalonOS. *Artist* (or hairdresser, therapist, stylist) = a person who performs a treatment: salon staff, or in the optional marketplace a mobile hair or beauty artist (a subcontractor). *Staff* = people working in the salon (employed or renting a chair). *Client* = the salon's customer. *Member* = a client in the loyalty club.

A row can carry more than one tag; the tag in front is the main source.

**Acceptance criteria** are written so they can be tested at Stage 8 with a yes/no result. Numbers marked **[TARGET]** are design targets to validate on real hardware. They are not measured results.

---

## 1. Scope

### 1.1 Locked decisions applied (from Tony, 31 Oct 2026)

**Stage 1 approval (21:39 GMT):**
1. **In v1:** colour active/processing segments; external-card tender; tips ledger (full pass-through); offline diary plus cash sales queue; colour formula fields (grams, developer, waste); back-bar stock deduction from formulas; goods-in and basic stock take; simple gift vouchers (VAT treatment flagged for adviser); rent-a-chair basic tracking (revenue split recorded, full payout later).
2. **Hosting:** Cloudflare Pages for the preview. **Vercel stays paused.** (This replaces "Vercel Hobby" in the original brief's item 8.)
3. **Payments:** Stripe primary, plus an external tender for SumUp, Dojo or other terminals. No deep terminal integration in v1.
4. **Messaging:** SMS and WhatsApp costs **pass through** to the salon, or the salon brings its own provider. Not absorbed in the licence price.
5. **Staff:** mixed employed and self-employed/rent-a-chair. Employment status is the salon's responsibility. The system records and splits.
6. **Deferred from v1:** true offline card payments (needs a native shell later); full multi-site; automated supplier ordering; advanced waitlist automation.

**Amendments 01 (A1 to A7), locked scope:** A1 nails menu with design tiers; A2 online loyalty club with notifications and emails; A3 treatment-first booking with durations; A4 regular artist booking; A5 home visits and wedding/event bookings; A6 UK-wide mobile artist marketplace (all enquiries through the site, work subcontracted); A7 scheduled payout date per artist, pre-agreed commission, signed contracts.

**Later steers from Tony (all locked scope, tagged where they appear):**
- **21:45:** the **main shop** is the focus; define a comprehensive treatment and product catalogue ("1000s") with bulk import and search (CAT); the **marketplace is "just an extra"**, secondary and optional (MKT); the **salon takes responsibility** for the work, employed or subcontracted; pricing, commission and payout stay as placeholders.
- **21:46:** more research, with sources counted (section 11.4 and `_research/stage2-deep-research.md`).
- **21:52:** the **one online journey**: pick a treatment, choose the branded product, see offers, pick a regular or any artist, pick a slot that fits, add retail, check out with Stripe (BKJ); and a **mail-order and click-and-collect shop** for products the salon chooses (ORT).
- **21:53:** **make sure everything stays together**: one integrated system (section 5) and a full **traceability matrix** (section 9).
- **22:53 (Stage 2 approval, locks):** keep all previously approved real-shop items; deposit default stays 20% or £15 (higher), **editable per service and per salon**; new products default to in-shop only; **one site only**; strike every Stage 2 proposal not required for one high-street shop to run diary, till, cash-up and formulas on day one; **marketplace is a stub only**; hosting Cloudflare Pages preview; the **703-row treatment seed is freely editable and deletable** by the salon; proceed to Stage 3, no build.
- **23:58 (Stage 3 approval, fine-tunes):** add LEG-22 short home-visit and wedding booking agreement; strengthen declined-test wording (manager records risk told, client declined, insurance may not cover); deposit and no-show fee stay fully editable, no-show charge not above the deposit taken unless a card-on-file charge is separately agreed; gift vouchers in-shop only, VAT left to the adviser; extract the Operator privacy notice as LEG-23; under-16 policy notes the salon checks manufacturer instructions. Apply, then stop; no build.

### 1.2 Tensions found, with my recommendation

| # | Tension | Recommendation |
|---|---|---|
| T1 | The brief says "independent UK salon **(or small group of shops)**". Tony has deferred full multi-site. | **Single-site v1.** The data model carries a `site_id` on every record from day one, so adding sites later needs no rewrite. No site switcher, no cross-site reports, no stock transfers in v1. [ADDED – Stage 2 proposal] |
| T2 | Stage 1 deferred "full payout" for rent-a-chair, but **A7 requires a scheduled payout per marketplace artist.** | Two different things. **Rent-a-chair stays "record the split, pay outside the system".** **Marketplace artist payouts (A7)** are **parked**: Tony reduced the marketplace to a stub at 22:53 (MKS-01, MKS-02). The original rows are kept in section 11.6. |
| T3 | The brief says "independent salon". Amendments add a UK-wide marketplace, which is a different job (public adverts, vetting, third-party payouts, HMRC reporting). | Tony reduced the marketplace to **a stub only** at 22:53 (MKS-01, MKS-02). Only the main shop (diary, till, catalogue, online journey, online shop) is built. [ADDED – Tony 22:53] |
| T4 | Fixed tier prices (Junior to Director multipliers) in the brief **versus** marketplace artists setting **their own prices**. | Tier multipliers apply to **salon staff only**. Marketplace artists (optional module) set their own prices, placeholders until set (this also supports their independent status, research 13.5). |
| T5 | "Reception can add a booking in under 15 seconds" **versus** treatment-first online booking with several treatments. | Both stand. The 15-second rule applies to the reception quick-add. Treatment-first is the online flow. They share one availability engine. |
| T6 | **"Offline"** is in v1 but **true offline card is deferred.** | Offline covers the diary and cash sales. Cards offline use the **external-card tender** on a separate machine. The screen must never imply Stripe cards work offline. |
| T7 | A **monthly membership** package ("Monthly Membership – Fixed monthly") is in the brief, and the new **loyalty club** is free. | They are different. The **loyalty club** is free (points, offers, messages). The **Monthly Membership** is a paid package. Do not merge them. The benefits of the paid membership are not defined in the brief (open item OI-07). |
| T8 | The brief says "no new features" at Stage 2, and Tony now locks extras. | Each extra is tagged. Support items I added are tagged **[ADDED – Stage 2 proposal]** so Tony can strike them. |

### 1.3 Defaults used because Tony has not answered yet

Status after Tony's 22:53 message: **D8, D9 (default part), D18 and D21 are LOCKED**; **D1 to D4 are PARKED** (they only apply if the marketplace is ever built beyond the stub); the others stay **[DEFAULT – Tony to confirm]** wherever they appear and are used as working defaults.

| ID | Default | Where it bites |
|---|---|---|
| D1 | **PARKED (marketplace stub, Tony 22:53).** **The Site Operator is merchant of record** for marketplace bookings (optional module only). The salon takes responsibility for the work, employed or subcontracted. | MKT, compliance |
| D2 | **PARKED (marketplace stub, Tony 22:53).** **The marketplace is an optional module in the same product**, sharing the diary, client records and Stripe account, built last. | Architecture, build order |
| D3 | **PARKED (marketplace stub, Tony 22:53).** **Commission % and payout day are placeholders:** [COMMISSION %] and [PAYOUT DAY], no value invented. The system supports any percentage and a weekly or monthly day per artist. | MKT |
| D4 | **PARKED (marketplace stub, Tony 22:53).** **Vetting covers ID, qualifications and insurance.** Documents are checked by a human at the Site Operator before an artist can be listed. | MKT |
| D5 | **Nail prices:** where the brief has no price, show **"Prices on request"** online and **[PRICE – Tony to set]** in admin. Nothing is invented. Tony's existing nail prices stay as locked. | NAI |
| D6 | **The loyalty club is free.** Channels: **email and web push**. **SMS is optional**, and its cost passes through to the salon. | LYC |

Further spec defaults are in section 11.2 (D7 onward).

### 1.4 In scope for v1 (summary)

Shared diary and booking (shop and online); client cards; the locked service catalogue and pricing rule; **the comprehensive treatment and product catalogue with bulk import (CAT)**; nails menu and tiers (NAI); patch tests; colour formulas and processing segments; retail till and stock (including back-bar); payments, deposits, split tender, external-card tender, refunds, cash-up; tips ledger; gift vouchers; staff, tiers, commission and rent-a-chair tracking; promotions and the offers engine (PRM, OFR); loyalty points and the online loyalty club (LOY, LYC); **the end-to-end online booking journey with treatment-first booking, branded product choice, offers, regular artist choice and Stripe checkout (BKJ, TFB, RAB)**; home visits and wedding or event bookings (HEV); **the online shop: mail order and click and collect with shared stock (ORT)**; offline diary and cash queue; finance API ledger and sync log; admin screens and customer admin area; reports; and, the mobile artist marketplace as a **stub only** (MKS).

### 1.5 Out of v1 (deferred or excluded)

| ID | Item | Why | Source |
|---|---|---|---|
| OUT-01 | **True offline card payments** (Stripe Terminal offline) | Needs a native iOS/Android shell. In the UK offline means insert-and-PIN only, no tap (Stage 1 8.2). Use external-card tender instead. | Tony, Stage 1 approval |
| OUT-02 | **Full multi-site** (site switcher, cross-site reports, stock transfers, franchise) | Single-site v1; `site_id` is in the model. | Tony, Stage 1 approval |
| OUT-03 | **Automated supplier ordering** | Low-stock list only. No ordering integrations. | Tony, Stage 1 approval |
| OUT-04 | **Advanced waitlist automation** | The brief's **walk-in queue with estimated wait stays.** Automated fill-from-waitlist, priority rules and auto-offers are out. | Tony, Stage 1 approval |
| OUT-05 | **Deep terminal integration** (SumUp, Dojo APIs) | External tender only. | Tony, Stage 1 approval |
| OUT-06 | **Rent-a-chair automated payouts** | Split is recorded and reported. Pay outside the system. | Tony, Stage 1 approval |
| OUT-07 | **Live accounting connections** (Xero, QuickBooks, FreeAgent, Sage) with real credentials | v1 posts to the finance API **ledger and a stub adapter** that writes the exact payload to the sync log. Real credentials stay a placeholder. | Stage 1 section 7 (Judgement); brief says "post to finance API" |
| OUT-08 | **Production deploy.** Preview only on Cloudflare Pages, Stripe in test mode or stubbed, no custom domain. | Pipeline rules (adapted from the Vercel lock). | pipeline-rules |
| OUT-09 | **Payroll and pay runs, clock-in/out** | Export hours only. | Stage 1 8.8 |
| OUT-10 | **Client-data migration tooling** (import of another system's client history) | Not locked. Manual client entry only. **Catalogue CSV import and rollback ARE in v1** (CAT-08, CAT-09) per Tony's 21:45 steer. | Stage 1 8.12 (clients only); Tony steer 21:45 (catalogue) |
| OUT-11 | **Batch/expiry tracking, supplier integrations, scale integrations** (Vish, SalonScale) | Not locked. | Stage 1 8.5, 8.10 |
| OUT-12 | **WhatsApp marketing campaigns** | WhatsApp is for service reminders only in v1 (cost and opt-in rules for marketing not checked). | Research 13.2 |
| OUT-13 | **Routing/mapping API for travel time** | v1 uses postcode distance rules. Routing cost not researched. | Research 13.3 |
| OUT-14 | **Native mobile app, tap-to-pay, customer-facing display** | PWA only. | Stage 1 9.3 |
| OUT-15 | **Online gift voucher purchase** | v1 vouchers are sold in the shop at the till. The online shop sells products only. [LOCKED – Tony 22:53] | D8 |
| OUT-16 | **Marketplace card-present payments** | Marketplace bookings are paid online through Stripe. | Spec decision |
| OUT-17 | **Paid loyalty club tiers or paid club membership** | The club is free. A paid membership is the separate Monthly Membership package. DMCCA subscription rules (reported start 1 Jan 2027) apply to paid subscriptions. | D6, research 13.2 |
| OUT-18 | **Courier API integrations** (automatic labels, live rates, tracking pull) | v1 records courier, service and tracking number typed or pasted by staff; shipping rates are salon-set placeholders (ORT-05, ORT-11). | [ADDED – Stage 2 proposal] (courier APIs not researched) |
| OUT-19 | **International shipping** | UK delivery only by default; other zones are a salon setting with its own rates and duties left to the salon. | [ADDED – Stage 2 proposal] |
| OUT-20 | **Marketplace beyond a stub** (listings, vetting, contracts, scheduled payouts, Stripe Connect, HMRC reporting) | Stub only (MKS-01, MKS-02). The original MKT-01 to MKT-09, FIN-09 and ROL-08 are kept in section 11.6. | Tony 22:53 |

---

## 2. User roles and permissions

### 2.1 Roles

| Role | Who | Notes |
|---|---|---|
| **Owner** | Salon owner | Full access to the salon. Sets prices, staff, settings, policies, commission, exports data. |
| **Manager** | Delegated by owner | Same as owner **except** the things the owner switches off (for example commission rates and data export). Owner decides. |
| **Reception** | Front desk | All diary columns, client search and card (including patch-test status), till, walk-in queue, stock quick sale. No commission rates, no settings, no finance sync log. |
| **Stylist / Therapist (employed)** | Staff on the floor | Own diary column and today's clients. Own client notes and formulas for clients they serve. Own commission and tips statement. |
| **Junior** | Employed, restricted | As Stylist, plus the owner can restrict what they see (for example allergies yes, full spend history no). |
| **Renter (rent-a-chair)** | Self-employed in the shop | Own column and own sales statement. Sees only own sales split. Does not see other staff takings. |
| **Client** | Public | Books online, sees My bookings, own points, own consents. |
| **Member** | Client in the loyalty club | Client plus club preferences and offers. |
| **Marketplace Artist** (stub only) | Vetted mobile artist (subcontractor), later phase | Reserved role value with no screens in v1 (MKS-02). The original rights are in section 11.6. |
| **Site Operator Admin** (support only in v1) | [OPERATOR LEGAL NAME] staff | Support only. Support access to salon data is **off by default** and needs a logged, time-limited grant by the salon owner. |

### 2.2 Requirements

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| ROL-01 | Role-based access for every screen and API call, enforced on the server, not only hidden in the interface. | [ADDED – Stage 2 proposal] | A test user in each role cannot read or write what the matrix below forbids, even by calling the API directly. |
| ROL-02 | **Reception and owner see all** diary columns and client cards. | [BRIEF] | Logged in as Reception or Owner, all staff columns show. |
| ROL-03 | **A stylist sees own column and today's clients.** | [BRIEF] | Logged in as Stylist, only own column shows. Other staff takings are not visible. |
| ROL-04 | **Restrict health data.** Allergies and patch-test results are visible only to roles the owner allows. The owner can restrict a Junior's view of history and spend. | [ADDED – Stage 2 proposal] (research 6.1) | A restricted Junior sees allergies and patch-test status but no spend history. A Client sees only their own record. |
| ROL-05 | **Audit log of sensitive actions:** opening a client card, editing patch tests or formulas, voids, refunds, drawer opens, manual loyalty adjustments, price changes, role changes, data exports, support-access grants. | [ADDED – Stage 2 proposal] (research 6.1, 9.1) | Each listed action writes who, what, when, from which device. The log cannot be edited in the app. Owner can view and filter it. |
| ROL-06 | Staff logins: each staff member has their own login. Shared logins are blocked. Owner and Manager require a second factor. | [ADDED – pipeline-rules] (customer admin area includes staff logins) | Creating, disabling and resetting a staff login works from the admin area without Tony. Owner login cannot complete without a second factor. |
| ROL-07 | **Renter privacy:** a Renter sees only their own sales and split. | [ADDED – Stage 1 approval] (rent-a-chair tracking) | Logged in as Renter, no other staff figures appear anywhere. |
| ROL-09 | **Site Operator support access is off by default** and needs a logged, time-limited grant by the salon owner. | [ADDED – Stage 2 proposal] (UK GDPR processor role, research 6.1) | Without a grant, Site Operator Admin cannot open a salon client card. A grant shows in the audit log with start and end. |
| ROL-10 | **Catalogue and import permission:** only Owner and Manager (or a role the owner names) can bulk import, roll back an import, change cost price, RRP or the online channel flag. Reception can view and sell. | [ADDED – Tony steer 21:45] (CAT-08, CAT-09, ORT-02) | Reception cannot open the import screen or edit RRP. |
| ROL-11 | **Fulfilment permission:** staff with the Fulfilment permission see online orders, packing slips and returns, and can mark statuses, but cannot see takings, commission or health data. | [ADDED – Tony 21:52] (ORT-11) | A Fulfilment-only user sees orders and nothing else financial. |
| ROL-12 | **Campaign permission:** only Owner and Manager can compose or send loyalty club campaigns (LYC-04). | [ADDED – Amendments 01] (A2) | Reception cannot send a campaign. |

### 2.3 Permission matrix (v1)

Legend: **R** read, **W** write, **own** only own records, **–** none, **grant** only with a logged grant.

| Capability | Owner | Manager | Reception | Stylist / Junior | Renter | Client | Artist | Site Operator Admin |
|---|---|---|---|---|---|---|---|---|
| Diary, all columns | R/W | R/W | R/W | own R (W own notes) | own R | – | – | – |
| Client card, contact | R/W | R/W | R/W | R for clients in own diary | R for own clients | own | – | grant |
| Patch tests, allergies | R/W | R/W | R/W | R/W | R/W for own clients | own R | – | grant |
| Colour formulas | R/W | R/W | R | R/W for own clients | R/W own | – | – | – |
| Till, take payment | R/W | R/W | R/W | W (own sale if allowed) | W (own) | – | – | – |
| Void / refund | R/W | R/W | owner-set | – | – | – | – | – |
| Cash-up | R/W | R/W | W (count) / close by owner-set | – | – | – | – | – |
| Services and prices | R/W | R/W | R | R | R | R | – | – |
| Staff and tiers | R/W | R/W | R | own | own | R (bio) | – | – |
| Commission rates | R/W | owner-set | – | own statement | own statement | – | – | – |
| Tips ledger and policy | R/W | R/W | R | own | – | – | – | – |
| Promotions, loyalty rules | R/W | R/W | R | – | – | R | – | – |
| Loyalty manual adjust | R/W | R/W | owner-set | – | – | – | – | – |
| Stock, goods-in, stock take | R/W | R/W | R/W | R | – | – | – | – |
| Gift vouchers sell/redeem | R/W | R/W | R/W | – | – | – | – | – |
| Finance sync log | R/W | R | – | – | – | – | – | – |
| Data export, audit log | R/W | owner-set | – | – | – | own data | own data | R (platform) |
| Catalogue, import, cost and RRP | R/W | R/W | R (no cost price) | R | – | R (public) | – | – |
| Online shop orders and returns | R/W | R/W | R/W | – | – | own | – | – |
| Loyalty club campaigns | R/W | R/W | – | – | – | own prefs | – | – |

---

## 3. Modules, requirements and acceptance criteria

Section 3 is organised by module. Each row is one requirement. IDs never change once Tony approves this spec.

### 3.1 Diary and booking (shop and online): DIA

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| DIA-01 | **One shared diary** visible to reception and all staff, one column per staff member. | [BRIEF] | Create a booking on one device and it shows on every other signed-in device. |
| DIA-02 | **Online bookings appear in the same diary instantly, with deposit status** (paid, not required, failed, refunded). | [BRIEF] | A test online booking appears in the reception diary without refresh, with a deposit badge. |
| DIA-03 | **Phone booking and walk-in added in under 15 seconds.** | [BRIEF] | Timed test: existing client, one service, one stylist, from "New booking" to saved takes 15 seconds or less, with no more than the minimum fields (client, service, staff, time). |
| DIA-04 | **Drag and drop between staff, only if qualified.** | [BRIEF] | Dropping a booking onto a staff column that lacks the service qualification is refused with a reason. A qualified column accepts it. |
| DIA-05 | **Colour timing notes and processing time visible on the appointment.** | [BRIEF] | The diary card shows the note, and the processing minutes. |
| DIA-06 | **Block time** for breaks, training or cleaning. | [BRIEF] | Owner/Reception can add and remove blocks per staff. Online booking cannot use blocked time. |
| DIA-07 | **No-show button and late-cancel button**, each able to trigger a charge. | [BRIEF] | Pressing either records the event with a reason. If a card is on file and the policy allows, it offers a charge (second confirmation, amount shown, amount cannot exceed the policy limit without owner override). Waive and refund are one action. |
| DIA-08 | **Walk-in queue with estimated wait.** | [BRIEF] | Adding a walk-in shows an estimate. **Rule:** estimated wait = the earliest time a staff member qualified for the chosen service is free for its full duration, minus now. The rule is shown on screen. |
| DIA-09 | **Double booking is impossible online and in the shop.** The database refuses overlapping **active** time for one staff member. | [ADDED – Stage 2 proposal] (research 8.3; Stage 1 approved the architecture) | Two simultaneous attempts on one slot: exactly one succeeds. The other gets a clear message. |
| DIA-10 | **Processing segments:** a colour service is stored as active, processing, active. **The stylist is free during processing**, and another booking may use that stylist during the processing minutes. | [ADDED – Stage 1 approval] | A 120-minute service with 30 minutes processing leaves the 30 minutes bookable for another client. The diary shows the processing time shaded. Overlap of **active** time is still refused. |
| DIA-11 | **Soft hold at online checkout.** A slot is held for a short time while the client pays, then released. The hold length is a salon setting [HOLD MINUTES]. | [ADDED – Stage 2 proposal] (research 8.3) | A held slot cannot be taken by another online client. It releases when the time passes. |
| DIA-12 | **Appointment status** (booked, arrived, in service, completed, no-show, cancelled) with check-in at reception. | [ADDED – Stage 2 proposal] (needed for till, loyalty-after-payment, reports) | Status moves only in valid order. Completed requires payment recorded or a reason. |
| DIA-13 | **Multi-service appointment** for one client in sequence, held as one booking, with one deposit and one bill. | [ADDED – Stage 2 proposal] (add-ons and packages exist in the brief; A3) | Adding a second treatment extends the time and total. If it cannot fit, nothing is booked. |
| DIA-15 | **Cancellation and reschedule** by reception and by the client (My bookings) within the salon's notice policy. | [ADDED – Stage 2 proposal] (needed by DIA-07 and ONL-07) | A client cancel inside the free window frees the slot and refunds the deposit per policy. Outside the window it applies the policy and shows the fee first. |

### 3.2 Client card: CLI

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| CLI-01 | **Core fields:** name, mobile, email, notes, patch-test dates and results. | [BRIEF] | All fields can be saved and edited. Mobile and email format-checked. |
| CLI-02 | **Full history:** every service, formula, retail purchase, spend, no-shows. | [BRIEF] | One scrolling history shows each, newest first, with totals. |
| CLI-03 | **Photos of previous work** (optional). | [BRIEF] | Staff can attach photos to a visit. Photos are off unless the client has agreed (CLI-10). |
| CLI-04 | **Loyalty points balance** on the card. | [BRIEF] | Balance equals the sum of the points ledger (LOY). |
| CLI-05 | **Preferred stylist.** | [BRIEF] | Settable. Used as the default in the diary and online. |
| CLI-06 | **Marketing consent** recorded **per channel** (email, SMS, push) with date, wording version and source, separate from service reminders. | [BRIEF] marketing consent; per-channel record [ADDED – Stage 2 proposal] (PECR, research 6.2) | Changing consent writes a record. A client with no consent is excluded from every campaign. |
| CLI-07 | **Client search and card open in seconds.** | [BRIEF] | Search by name or mobile returns a match in 2 seconds or less [TARGET] on salon hardware with a sample client list. |
| CLI-08 | **Allergy and health flags** visible at booking and check-in. | [ADDED – Stage 2 proposal] (patch-test purpose, research 8.6) | A client with a flagged reaction shows a warning on the diary card. |
| CLI-09 | **Right of access and erasure:** export or delete one client's data from the card, with a log. | [ADDED – Stage 2 proposal] (UK GDPR, research 6.1) | Export produces a file with the client's data. Delete anonymises the record but keeps ledger rows that law requires (amounts, dates), with the reason recorded. |
| CLI-10 | **Consent for photos and health data** recorded with date and wording version. | [ADDED – Stage 2 proposal] (UK GDPR Article 9, research 6.1) | Health data cannot be saved without a consent record or an owner-recorded alternative basis. |
| CLI-12 | **Colour formula history** shown on the card (see COL). | [ADDED – Stage 1 approval] | Last three formulas show at the top of the card. |

### 3.3 Services, pricing and packages: SVC

The exact catalogue is in Appendix A. The service structure, prices and durations are locked. **Do not change them without Tony's yes.**

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| SVC-01 | **Service structure:** ID, category, name, duration, base price, price type (Fixed / Tier-multiplied / Quote only), staff qualified, patch test required, deposit rule, linked retail, photo set. | [BRIEF] | Each field exists on every service and is editable in admin. |
| SVC-02 | **Seed catalogue:** every service, package and add-on in Appendix A is loaded exactly as listed, with the price, duration and category given. | [BRIEF] | A diff of the seed against Appendix A shows no difference. |
| SVC-03 | **Price rule:** price = base × staff tier (Junior 0.85, Stylist 1.0, Senior 1.2, Director 1.4). **Rounding to the nearest penny** [DEFAULT – Tony to confirm]. | [BRIEF] | A Fixed service at base £42 with a Senior stylist shows £50.40. Multipliers are editable in admin. |
| SVC-04 | **Price types:** Fixed (base only, no tier), Tier-multiplied, Quote only. Which services are Fixed or Tier-multiplied is a setting per service. Default for seeded services is Tier-multiplied, except add-ons and packages (Fixed). | [BRIEF] price types; default assignment [DEFAULT – Tony to confirm] (brief does not say which seeded services are Fixed) | Each seeded service has a price type shown in admin. |
| SVC-05 | **Quote-only services cannot be booked online.** Online shows "Request a quote" and creates an enquiry. Reception can book them and enter an agreed price. | [BRIEF] | The online booking page offers no time slot for a quote-only service. Reception can still set a price on a booking. |
| SVC-06 | **Deposit default is 20% or £15 minimum:** the greater of 20% of the price and £15, never more than the price [LOCKED – Tony 22:53]. **Editable per service** (each service can have its own percentage, minimum, fixed amount, or no deposit) **and per salon** (the salon-wide default in SVC-15). | [BRIEF], [ADDED – Tony 22:53] | A £10 service takes a deposit of £10 (capped at price). A £130 service takes £26. A £48 service takes £15 (since 20% = £9.60). Changing one service's rule changes only that service. Changing the salon default changes every service that has no override of its own, for new bookings only. |
| SVC-07 | **Add-ons:** Extra 15 min £12; Long/Thick Hair Supplement £8 to £15; Toner Add-on £18; Deep Conditioning Add-on £12. A range add-on takes a price chosen at booking within the range. | [BRIEF] | Adding an add-on increases price and, where relevant, duration, and updates the deposit. A range add-on rejects a price outside £8 to £15. |
| SVC-08 | **Packages:** Bridal Hair + Makeup (quote only); Party Hair Up + Makeup (90 min, base £95); Monthly Membership (fixed monthly). | [BRIEF] | Bridal is quote-only. Party Hair Up is bookable. Membership is a recurring monthly charge (SVC-09). |
| SVC-09 | **Monthly Membership:** a fixed monthly charge to a card on file. **Benefits are not defined in the brief** [MEMBERSHIP BENEFITS – Tony to define]. Cancellation terms and monthly price shown before sign-up. Stripe test mode only in the preview. | [BRIEF] (fixed monthly) | Sign-up records the client's acceptance of price and cancel terms. A test charge posts to the ledger each month. Cancel stops the next charge. |
| SVC-10 | **Linked retail** per service (recommended at booking and at till). | [BRIEF] | A service with linked retail shows the product at online checkout and at the till. |
| SVC-11 | **Photo set** per service. | [BRIEF] | A service page shows its photos. Photos can be uploaded in admin. |
| SVC-12 | **Staff qualified** per service controls who can be booked and who can receive a drag-and-drop. | [BRIEF] | Online booking lists only qualified staff. |
| SVC-13 | **Patch-test required** flag per service drives PTT rules. | [BRIEF] | Setting the flag on a service makes booking require a valid patch test (PTT-02). |
| SVC-14 | **Processing minutes** per service (active before, processing, active after) so colour services can use DIA-10. | [ADDED – Stage 1 approval] | A colour service has three durations that sum to the service duration. |
| SVC-15 | **Salon-wide deposit default:** the Owner (or a Manager the Owner allows) sets the salon's default deposit percentage and minimum in Settings. It starts at 20% and £15 (the greater of the two). A service uses it unless the service has its own deposit rule (SVC-06). A change applies to new bookings only; existing bookings keep the deposit they were booked with. | [ADDED – Tony 22:53] | After the Owner sets 25% and £20, a service with no override takes the greater of 25% and £20 on the next booking. A booking made before the change keeps its old deposit. |

### 3.4 Patch tests: PTT

NHBF rule (Verified, research 8.6): a patch test at least 48 hours before a colour service. Validity is a salon setting. **Draft, not legal advice.**

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| PTT-01 | **Patch-test records** on the client card: date, product tested, result (no reaction / reaction), who did it, optional photo. | [BRIEF] (patch-test dates and results) | A record saves with all fields. |
| PTT-02 | **48-hour rule:** a booking for a patch-test-required service needs a **valid** test dated at least 48 hours before the appointment. Online, a client without one cannot book the colour slot and is offered a patch-test slot. | [ADDED – Stage 2 proposal] (research 8.6; completes the brief's patch-test item) | Booking a root tint for a client with no test online is blocked. A test done 24 hours before is rejected. A test 48 hours or more before is accepted. |
| PTT-03 | **Validity period** is a salon setting [PATCH TEST VALIDITY – salon sets; six months is the NHBF-cited example, not universal]. Expiry shows on the card and the diary entry. | [ADDED – Stage 2 proposal] | After expiry the rule treats the client as untested. |
| PTT-04 | **Reaction blocks the service.** A recorded reaction blocks booking and check-in of that product class until an owner clears it with a reason. | [ADDED – Stage 2 proposal] | A reacting client cannot be checked in for the blocked service without a logged override. |
| PTT-05 | **Consent form** with health questions, signed on screen. Stored with signature image, time, form version, staff member and a PDF copy. For a client under 16 the form needs a parent or guardian, and **the salon checks each product's manufacturer instructions before offering chemical services to under-16s** (LEG-01 clause 7.2). | [ADDED – Stage 2 proposal] (UK GDPR special category, research 6.1, 8.6) | A completed form is on the card and cannot be edited, only superseded. |
| PTT-06 | **Declined-test waiver:** a manager can proceed without a test only with a recorded "client declined test" waiver, shown visibly. **The waiver records three things: the client was told the risk, the client chose to decline the test, and the service may not be covered by insurance** (LEG-01 clause 6.3, LEG-09 Part 4). Some insurers refuse cover on declined tests, so the salon must check its own policy first; the declined-test policy is a salon setting [DECLINED-TEST POLICY]. | [ADDED – Stage 2 proposal] (research 8.6; insurer question flagged) | Waiver requires manager login, reason, all three confirmations ticked and client acknowledgment; it cannot be saved with any box missing. It appears on the card and in the audit log. |
| PTT-08 | **Retention setting** for patch-test records, with a stated reason [PATCH TEST RETENTION – salon sets]. The product does not hard-code six years. | [ADDED – Stage 2 proposal] (research 8.6, UK GDPR storage limitation) | Retention is configurable. Records past retention are flagged for review and deletion with a log. |

### 3.5 Colour formulas, processing and back-bar stock: COL

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| COL-01 | **Formula fields on the client card per visit:** product/shade lines, **grams used per line**, **developer** (type/strength and grams), **waste grams**, notes, timing. | [ADDED – Stage 1 approval] | A stylist records a formula with two shade lines, developer and waste in under a minute. Values are whole grams or one decimal. Saved against the appointment. |
| COL-02 | **Copy last formula** into a new visit and edit it. | [ADDED – Stage 2 proposal] (speeds COL-01) | One tap copies the last formula to the open appointment. |
| COL-03 | **Manual entry of grams.** No connected scale in v1. | [ADDED – Stage 1 approval] (research 8.5) | Grams are typed. The screen works on a tablet. |
| COL-04 | **Back-bar stock deduction from formulas:** when a formula is saved and the appointment completes, the grams used plus waste are deducted from the back-bar product stock. | [ADDED – Stage 1 approval] | Using 40g shade A and 20g developer drops those stock figures by those grams. A void or edit reverses the deduction with a log. |
| COL-05 | **Back-bar product master:** product, unit size in grams, pack size, cost price, reorder level. Retail and back-bar are two stock pools. | [ADDED – Stage 1 approval] | A back-bar product shows grams on hand and tubes equivalent. |
| COL-08 | **Waste is recorded separately** and appears in the stock-take variance as expected loss. | [ADDED – Stage 1 approval] | Waste grams deduct stock and are reported. |

### 3.6 Till and payments: TIL

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| TIL-01 | **Take a deposit online or in the shop.** | [BRIEF] | A deposit taken either way shows on the booking and posts to the ledger as "deposit held". |
| TIL-02 | **Take the final balance in shop:** cash, card or split. Balance = total less deposit held less vouchers and loyalty reward applied. | [BRIEF] | Paying £100 as £40 cash + £60 card closes the bill. Totals reconcile to the pence. |
| TIL-03 | **Quick sale** for retail only (no appointment). | [BRIEF] | A walk-in product sale completes in a few taps and drops stock. |
| TIL-04 | **Add product to an open appointment** while the client is in the chair or at reception. | [BRIEF] | A product added to an open booking appears on the bill and on the staff member's retail attribution. |
| TIL-05 | **Staff discount** applied at the till, owner-set percentage, logged. | [BRIEF] | Discount needs a reason code and is posted as a discount line. |
| TIL-06 | **Mixed payment** (cash + card, and also external-card or voucher). | [BRIEF] | Any combination sums to the bill. Over- or under-payment is blocked. |
| TIL-07 | **Print or email receipt.** | [BRIEF] | Receipt shows lines, discount, VAT (if registered), tender, deposit applied, tip, points earned. Email sends to the client's address. Print goes to a network receipt printer. |
| TIL-08 | **Void and refund with reason.** A refund goes back to the original tender where possible. A void before payment closes the bill. | [BRIEF] | A reason code is required. A card refund creates a ledger refund event linked to the sale. A refund never edits the original sale. |
| TIL-09 | **Stock drops on sale** (retail). | [BRIEF] | Selling one item reduces stock by one. A refund returns it if flagged resaleable. |
| TIL-10 | **Stripe is the primary card method** (Stripe Terminal smart reader on the shop LAN; hosted Stripe pages online). **Preview uses Stripe test mode or a stub.** | [ADDED – Stage 1 approval] (Stripe primary) | In the preview, no real card is charged. A banner says TEST MODE. |
| TIL-11 | **External-card tender:** record a card payment taken on a separate machine (SumUp, Dojo or other). Fields: terminal name, amount, receipt or reference number, time, taken by. **No card numbers** are stored. | [ADDED – Stage 1 approval] | Adding an external-card tender closes the bill. It posts to the ledger as a separate tender "External card (terminal name)". It appears on its own line in cash-up and needs a reference. |
| TIL-12 | **External-card reconciliation:** at cash-up, the staff enter each external terminal's end-of-day total. Variance is shown per terminal. | [ADDED – Stage 1 approval] | Variance equals counted minus recorded for each terminal. |
| TIL-13 | **No-show and late-cancel charge:** card on file taken at booking using Stripe SetupIntent, with the client's recorded acceptance of the terms. **A no-show charge cannot exceed the deposit already taken unless the client separately agreed a card-on-file charge** (a separate tick, stored with wording version and time); a zero-deposit service with no card-on-file agreement cannot be charged a no-show fee. A later charge needs a second confirmation and reason. If the bank asks for authentication, a "pay now" recovery link is sent. | [ADDED – Stage 2 proposal] (research 8.7; makes the brief's "chargeable" real) | Booking with a card on file stores token and last four digits only, plus consent text version, time and device. A charge posts to the ledger linked to the booking. |
| TIL-14 | **Cancellation terms shown before the client confirms**, stored with the acceptance. The fee is capped by the policy, "not excessive", and **by the deposit already taken unless a separate card-on-file agreement exists**. **The deposit (the greater of X% or £Y), the no-show fee and the cancellation window all stay fully editable per service (SVC-06) and per salon (SVC-15); a service may have a lower or zero deposit.** Owner can waive. | [ADDED – Stage 2 proposal] (CRA 2015 s62; GOV.UK, research 6.4) | The booking page shows the deposit and window before the Confirm button. The acceptance record exists for each booking. |
| TIL-15 | **Cash drawer opens from the receipt printer** on a cash tender and on a no-sale, with a reason for no-sale. Every open is logged. | [ADDED – Stage 2 proposal] (research 8.1) | Cash tender opens the drawer. A no-sale needs a reason. |
| TIL-16 | **Cash-up: expected vs actual cash, card totals, variance.** Expected cash = float + cash tenders − cash refunds − cash paid out + cash paid in. Card totals for Stripe and each external terminal. Variance shown per tender with a reason field. | [BRIEF] | A day of test sales yields an expected figure that matches a hand count to the pence. Variance equals actual minus expected. |
| TIL-17 | **Cash-up reconciles against the diary:** appointments completed with no payment, payments with no appointment, and open bills are listed before close. | [BRIEF] ("reconciles against the diary") | The close screen lists every unreconciled item. Close is blocked until each is resolved or given a reason. |
| TIL-18 | **Cash-up close is final.** After close the day is locked. A correction is a new event on the next day with a reason. Reopen only by the owner, logged. | [ADDED – Stage 2 proposal] (append-only ledger, research 9.1) | Closed days cannot be edited. |
| TIL-19 | **Paid in / paid out of the till** with reason. | [ADDED – Stage 2 proposal] (needed for a correct expected-cash figure) | A £20 paid-out reduces expected cash by £20 and is on the report. |
| TIL-20 | **Every sale, tender, refund, void and cash-up is an append-only ledger event** in integer pence. Corrections are new events. | [ADDED – Stage 2 proposal] (research 9.1; supports the brief's finance API) | No ledger row can be updated or deleted by the application. |
| TIL-21 | **Stripe webhooks are idempotent:** a repeated event changes nothing the second time. | [ADDED – Stage 2 proposal] (research 9.1) | Replaying one webhook twice creates one ledger event. |
| TIL-22 | **VAT:** prices are entered VAT-inclusive. The system supports a VAT-registered and a non-registered salon. VAT lines show only when the salon is registered: [VAT NUMBER], [OPERATOR VAT POSITION]. | [ADDED – Stage 2 proposal] (research 6.5) | Setting VAT-registered turns on VAT lines on receipts and finance postings. |

### 3.7 Retail catalogue and till: RET

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| RET-01 | **Admin-editable retail catalogue** with the starter list in Appendix B. | [BRIEF] | Seed matches Appendix B. Admin can add, edit, price, hide products. |
| RET-02 | **Fields:** name, size, price (or price range), stock level, reorder level, cost price, barcode (optional), pool (retail or back-bar). | [BRIEF] stock fields; cost price and barcode [ADDED – Stage 1 approval] (goods-in and margin) | Each field editable. |
| RET-03 | **Till functions:** add to open appointment, sell product only, staff discount, mixed payment, print or email receipt. | [BRIEF] | As TIL-03 to TIL-07. |
| RET-04 | **Low-stock alert** when stock falls to the reorder level. | [BRIEF] | A visible alert and a low-stock list appear on the admin home. |
| RET-05 | **Range-priced items** (for example £14 to £18) require a price chosen at sale within range, or one fixed price set by admin. | [BRIEF] (starter list has ranges) | A sale outside the range is refused unless an owner overrides. |
| RET-06 | **Retail attribution** to the selling staff member for commission. | [BRIEF] (commission tracking) | Each retail line carries a staff ID. |

### 3.8 Stock: goods-in, stock take, back-bar: STK

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| STK-01 | **Stock levels screen** for retail and back-bar, with quick sale link. | [BRIEF] | Shows on-hand, reorder level, status. |
| STK-02 | **Goods-in:** record a delivery against a supplier: product, quantity, cost price, delivery note number, discrepancies. Stock increases on save. | [ADDED – Stage 1 approval] | A goods-in of 12 units raises stock by 12 and records cost. A discrepancy is noted and reportable. |
| STK-03 | **Basic stock take:** count screen (type or scan), variance against system, adjustment posts to the ledger as a loss or write-off with a reason. | [ADDED – Stage 1 approval] | Counting 8 where the system says 10 shows variance −2, and approval posts the adjustment. |
| STK-04 | **Low-stock list** can be printed or exported. **No automated supplier ordering** and no ordering integration. | [ADDED – Stage 1 approval] (low-stock visible stays; automation deferred, OUT-03) | Export lists product, on-hand, reorder level, supplier. |

### 3.9 Tips ledger: TIP

**Draft, not legal advice.** Employment (Allocation of Tips) Act 2023, in force 1 Oct 2024 (Verified for no deductions, research 6.7).

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| TIP-01 | **Record a tip** at the till on card, external card or cash, optionally attributed to a staff member or to the pool. | [ADDED – Stage 1 approval] | A £5 card tip appears as a separate tip line, not as revenue. |
| TIP-02 | **Tips ledger:** each tip is a liability ("tips payable"), not salon revenue. | [ADDED – Stage 1 approval] | Tips never appear in service or retail revenue. They post to the finance API as tips payable. |
| TIP-03 | **Full pass-through, no deductions.** The amount allocated to staff equals the tip received. Card processing fees are **not** deducted from tips. | [ADDED – Stage 1 approval] | Allocation total equals tips received for the period. There is no field or rule that reduces it. |
| TIP-04 | **Allocation rule** set by the salon (to the named staff member, or shared by a recorded fair rule). The written tipping policy text is stored and shown to staff. [TIP POLICY – salon writes] | [ADDED – Stage 1 approval] | Policy is stored with version. Each allocation names its rule. |
| TIP-05 | **Monthly tips distribution report** per staff, showing tips received, allocated and paid, and the date paid. | [ADDED – Stage 1 approval] | Report exports per month. Payment is recorded by the owner (paid outside the system, with payroll). |
| TIP-06 | **Record retention for three years.** | [ADDED – Stage 1 approval] (research 6.7) | Tip records cannot be deleted inside three years. |
| TIP-07 | **Cash tips given directly to staff** are not employer tips. They may be logged for information only and are labelled as such. | [ADDED – Stage 2 proposal] (research 6.7) | A directly given cash tip log is not part of the payable total. |
| TIP-08 | **Renters:** whether tips to a renter are "qualifying" is the salon's responsibility. The system records and attributes only. | [ADDED – Stage 1 approval] (employment status is the salon's responsibility) | Tips for a Renter go to their statement, labelled "not decided by SalonOS". |
| TIP-09 | **Open point:** whether any exception for card-processing costs exists under the code of practice is **not verified** (research 6.7). The v1 default is **no deductions**. Stage 3 to check. | [ADDED – Stage 1 approval] | Item is on the open list (OI-12). |

### 3.10 Simple gift vouchers: GFT

**Draft, not legal advice.** VAT treatment is **flagged for adviser** (research 8.9). [OPERATOR VAT POSITION].

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| GFT-01 | **Sell a voucher at the till** for a chosen amount: code, amount, purchaser, optional recipient, issue date. | [ADDED – Stage 1 approval] | Selling a £50 voucher produces a unique code and a printable or emailable voucher. |
| GFT-02 | **Redeem a voucher** (full or part) as a tender at the till. The balance remains. | [ADDED – Stage 1 approval] | Redeeming £30 from a £50 voucher leaves £20. A voucher cannot go below zero. |
| GFT-03 | **Voucher is a liability until redeemed.** Sale posts "voucher liability". Redemption reduces it. | [ADDED – Stage 1 approval] (research 8.9) | Ledger shows liability up on sale and down on redemption. |
| GFT-04 | **VAT treatment flagged for adviser.** The system carries a per-salon setting [VOUCHER VAT TREATMENT – adviser to confirm: single-purpose or multi-purpose] and posts VAT on sale or on redemption accordingly. No default is claimed to be correct. | [ADDED – Stage 1 approval] | The setting exists and drives the VAT line timing. The spec states it is not tax advice. |

### 3.11 Staff: STF

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| STF-01 | **Staff record:** name, photo, bio, tier, services qualified, working hours and breaks, calendar colour, optional commission %, active status. | [BRIEF] | All fields editable. Inactive staff cannot be booked and keep history. |
| STF-02 | **Tiers:** Junior, Stylist, Senior, Director with the multipliers in SVC-03. | [BRIEF] | Changing a staff member's tier changes future prices, not past bills. |
| STF-03 | **Commission (optional):** per staff, separate rules for services and retail, flat or tiered. **Default: calculated on the net-of-VAT price actually earned after discount** [DEFAULT – Tony to confirm]. The rule is shown to the stylist. | [BRIEF] optional commission; calculation base [DEFAULT – Tony to confirm] (research 8.8) | A £60 service with a 10% discount and 40% commission shows commission on £54 (ex-VAT figure if registered). |
| STF-04 | **Commission report** available to the owner, and each staff member's own. | [BRIEF] | Report per period, by staff, services and retail split. |
| STF-05 | **Staff hours and performance screen:** rota hours, booked hours, completed hours, takings, retail takings, average ticket, rebooking, no-shows. Each figure shows its definition. | [BRIEF] (listed admin screen) | The definitions are shown on screen. Numbers equal the underlying records. |
| STF-06 | **Staff type:** **Employed** or **Self-employed (rent-a-chair)**. Employment status is the salon's responsibility. The system records the setting and does not decide it. | [ADDED – Stage 1 approval] | The staff record has a type and a notice that status is the salon's responsibility. |
| STF-07 | **Rota:** a weekly pattern per staff member, plus exceptions (holiday, sickness, training). | [ADDED – Stage 2 proposal] (brief has working hours and breaks; exceptions are needed so online booking never offers a time the person is off) | An exception removes the time from online booking. |
| STF-08 | **Client-facing staff profile** (photo, bio, services) on the online booking page. | [BRIEF] (staff photo and bio) | Profile shows online for active, bookable staff. |

### 3.12 Rent-a-chair basic tracking: RNT

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| RNT-01 | **Renter staff type** with a settlement rule: **percentage split**, or **fixed rent plus renter keeps the rest**, or **record only** (no split). | [ADDED – Stage 1 approval] | Each renter has exactly one rule. |
| RNT-02 | **Revenue attribution:** each service and retail line sold is attributed to the staff member, and the **split is recorded per sale** (salon share, renter share). | [ADDED – Stage 1 approval] | A £100 sale with a 30% salon share records £30 and £70. |
| RNT-03 | **Renter statement** per period: sales, split, tips, amounts owed to the renter, rent due. Exportable. | [ADDED – Stage 1 approval] | Statement totals equal the per-sale records. |
| RNT-04 | **"Owed to renter" is a liability** in the ledger. **No automated payout in v1.** Payment is recorded manually when made outside the system. | [ADDED – Stage 1 approval] (OUT-06) | Marking a payout paid reduces the liability. |
| RNT-05 | **VAT flag:** chair rental and who makes the supply to the client are flagged for adviser (HMRC treatment differs by case, research 8.8). [OPERATOR VAT POSITION] | [ADDED – Stage 1 approval] | The flag appears on the renter setup and statement. |
| RNT-06 | **Employment status warning:** the renter setup shows that HMRC looks at control, financial risk, substitutes and who supplies products. SalonOS does not decide status. | [ADDED – Stage 1 approval] | Text appears on setup. Link to HMRC hair and beauty guidance. |

### 3.13 Promotions: PRM

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| PRM-01 | **Promo types:** percentage off, fixed amount, buy-one-get-one (BOGO). | [BRIEF] | Each type can be created and applied. |
| PRM-02 | **Conditions:** time-limited; by **code** or **automatic**; **new clients** or all; **minimum spend** or **specific service**. | [BRIEF] | Each condition is testable. An expired promo does not apply. |
| PRM-03 | **One promo per booking.** | [BRIEF] | A second promo is refused. |
| PRM-04 | **Discount applies before the deposit is calculated.** | [BRIEF] | A £100 service with 10% off gives a £90 price and the deposit is based on £90. |
| PRM-05 | **Logged and posted to the finance API** as a discount line with the promo ID. | [BRIEF] | Each use appears in the ledger and sync log. |
| PRM-06 | **New-client test:** a new client is one with no completed paid visit. | [ADDED – Stage 2 proposal] (definition needed) | A client with a completed paid visit cannot use a new-client promo. |
| PRM-07 | **Promo and voucher interplay:** a voucher is a tender, not a promo. It does not count as the one promo. | [ADDED – Stage 2 proposal] | A booking can use one promo and a voucher. |

### 3.14 Loyalty points: LOY

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| LOY-01 | **1 point per £1** on completed paid services and retail. | [BRIEF] | A £42 service and £30 product earns 72 points once paid in full. **Basis: amount paid after discount, excluding tips, VAT-inclusive** [DEFAULT – Tony to confirm]. Fractions round down. |
| LOY-02 | **Points only after final payment is confirmed.** Not on deposits, not on unpaid bills. | [BRIEF] | A booking with only a deposit earns no points. Points appear when the final balance is paid. |
| LOY-03 | **Points expire after 12 months of inactivity.** "Inactivity" = no completed paid visit and no redemption in 12 months. | [BRIEF] | A test account with no activity for 12 months loses its points, with a ledger entry and a notice sent beforehand (service message). |
| LOY-04 | **Optional tiers** (for example by points or spend), set in admin, off by default. | [BRIEF] | Tiers can be enabled and thresholds edited. |
| LOY-05 | **Fixed rewards:** a reward costs a fixed number of points and gives a fixed benefit (amount off or free item) as set in admin. | [BRIEF] | Redeeming a reward deducts points and applies the benefit. |
| LOY-06 | **Manual adjust with log.** Reason required. | [BRIEF] | Each adjustment is in the points ledger and audit log. |
| LOY-07 | **Separate line on the invoice/receipt** for loyalty redemption and for points earned. | [BRIEF] | Receipt shows the loyalty line apart from services and promotions. |
| LOY-08 | **Points ledger** is append-only. Balance is the sum. | [ADDED – Stage 2 proposal] | Balance equals the sum of entries. No entry is edited. |
| LOY-09 | **Refund reverses points** earned on the refunded amount. | [ADDED – Stage 2 proposal] | A refund of £20 removes 20 points, and shows a ledger entry. |

### 3.15 Client-facing online booking: ONL

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| ONL-01 | **Home page with category tiles.** | [BRIEF] | Tiles for each category in Appendix A (plus Nails and Make-up from Amendments 01). |
| ONL-02 | **Service detail** with photos and **tier pricing** (price shown per tier or "from" price). | [BRIEF] | Page shows photos, duration and price for each tier. |
| ONL-03 | **Choose stylist and time.** | [BRIEF] | Slots shown only for qualified staff and for the full service duration (see TFB, RAB, BKJ-05, BKJ-06). |
| ONL-04 | **Add-ons and recommended retail** before checkout. | [BRIEF] | Add-ons update the price and time. Linked retail can be added to the order (BKJ-02, BKJ-03, BKJ-07; delivery orders follow ORT-10). |
| ONL-05 | **Checkout with deposit** (Stripe hosted, test mode in preview). Promo code field. | [BRIEF] | A deposit is taken in test mode. Booking appears in the diary (DIA-02). |
| ONL-06 | **Confirmation** by screen and email (service message). | [BRIEF] | Confirmation shows services, time, staff, deposit paid, cancellation terms. |
| ONL-07 | **My bookings:** list, cancel, reschedule inside the policy. | [BRIEF] | A signed-in client sees upcoming and past bookings. |
| ONL-08 | **Drops into the same diary reception uses.** | [BRIEF] | As DIA-01 and DIA-02. |
| ONL-09 | **Client sign-in** by emailed one-time link or code. No password to remember. | [ADDED – Stage 2 proposal] (My bookings needs identity; brief is silent) | A client can open My bookings by link or code. |
| ONL-10 | **Quote-only services show "Request a quote"** (SVC-05). | [BRIEF] | No bookable slot is offered. |
| ONL-11 | **Cancellation and deposit terms on screen before confirm**, with the tick-box acceptance recorded (TIL-14). | [ADDED – Stage 2 proposal] (research 6.4) | Confirm button stays disabled until accepted. |
| ONL-12 | **Patch-test gate online** (PTT-02). | [ADDED – Stage 2 proposal] | As PTT-02. |
| ONL-13 | **WCAG 2.2 AA** for the public booking page. | [ADDED – Stage 2 proposal] (Equality Act 2010, research 6.8) | Automated checks pass and a keyboard-only booking completes. |
| ONL-14 | **Booking page uses the salon name and branding set in admin.** Operator details [OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL] appear in the footer as placeholders until Tony fills them. | [ADDED – Stage 2 proposal] | Footer shows placeholders in the preview. |

### 3.16 Offline diary and cash sales queue: OFF

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| OFF-01 | **Offline diary:** the next 7 days of diary, client cards, price list and product list are held on the front-desk device. | [ADDED – Stage 1 approval] | With the network off, reception can open the diary, client cards and prices. |
| OFF-02 | **Offline writes queue:** new bookings, edits, walk-ins, check-in/out and **cash sales** are queued locally and sent when the link returns. | [ADDED – Stage 1 approval] | Offline actions appear as pending and sync on reconnect with no duplicates. |
| OFF-03 | **Cash sales offline** include opening the drawer and printing a receipt over the shop LAN. | [ADDED – Stage 1 approval] | A cash sale completes offline, drawer opens, receipt prints. |
| OFF-04 | **Clear banner:** "OFFLINE, X changes waiting". | [ADDED – Stage 1 approval] | Banner shows on every screen while offline. |
| OFF-05 | **Idempotent sync:** each local write carries a client-generated unique ID, device ID and local time. Retries are safe. | [ADDED – Stage 2 proposal] (research 8.2) | Sending the same queued item twice creates one record. |
| OFF-06 | **Server decides conflicts.** A rejected change (for example a double booking found on sync) appears in a **"needs attention"** list for the manager, not silently lost. | [ADDED – Stage 2 proposal] (research 8.2) | Two offline bookings on one slot: one accepted, one in the list with the client's phone number. |
| OFF-07 | **Money events never overwritten.** An offline sale posts as a sale. Corrections are refunds. | [ADDED – Stage 2 proposal] | Ledger has no edited rows. |
| OFF-08 | **Card payment while offline uses the external-card tender** (TIL-11) on a separate machine. The screen never offers Stripe card as available offline. **True offline card is deferred (OUT-01).** | [ADDED – Stage 1 approval] | With the network off, the Stripe card button is disabled with the reason, and external-card remains available. |
| OFF-09 | **One desk device is the offline-write device per site** in v1, to limit conflicts. Other devices are read-only while offline. [DEFAULT – Tony to confirm] | [ADDED – Stage 2 proposal] (research 8.2 said to confirm with Tony) | Only the designated device can queue writes offline. |

### 3.17 Finance API and ledger: FIN

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| FIN-01 | **Every deposit, final payment, retail sale, promo, loyalty use, cancellation, refund and cash-up summary** posts clear lines and a status to the finance API. | [BRIEF] | Each event appears with its lines and status in the sync log. |
| FIN-02 | **Clear lines:** service, retail, discount, VAT (if registered), tip, voucher, deposit held, deposit applied, deposit forfeited, refund, processor fee, over/short. | [BRIEF] (service, retail, discount, VAT) and others [ADDED – Stage 2 proposal] (research 7, 8.9) | A mixed bill creates one line per type with account mapping per Appendix C. |
| FIN-03 | **Internal append-only ledger** is the source for every posting. | [ADDED – Stage 2 proposal] (research 7, 9.1) | Postings are generated from ledger rows only. |
| FIN-04 | **Outbox with retries:** each posting has status (pending, sent, failed, retrying) and retries on failure. | [ADDED – Stage 2 proposal] (research 9.1) | A failed post retries and shows its error. A fix and replay sends it once. |
| FIN-05 | **Stub adapter in v1** that writes the exact payload to the sync log. No real accounting credentials. [ACCOUNTING PACKAGE – Tony to choose later] | [ADDED – Stage 2 proposal] (OUT-07) | The sync log shows the exact payload for every event. |
| FIN-06 | **Finance sync log screen** with filters, status, payload view and manual retry. | [BRIEF] | Owner can view, filter and retry. |
| FIN-07 | **Idempotency key per posting** to prevent duplicate postings after retry. | [ADDED – Stage 2 proposal] | A retry sends the same key. |
| FIN-08 | **Cash-up summary posts once** per closed day. | [BRIEF] | Close creates one summary posting. |
| FIN-10 | **Online shop and booking-journey postings:** every online order and online booking posts with its order or booking ID and the channel (online or shop); the delivery charge posts as its own line; a refund posts as its own line; the same VAT rules as the till apply (TIL-22). | [ADDED – Tony 21:52] | An online order of one product plus delivery produces a retail line, a delivery line and a payment line, each with the order ID. |

### 3.18 Reminders and messaging: MSG

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| MSG-01 | **Appointment confirmations and reminders** by email, SMS and WhatsApp (service messages, not marketing). | [ADDED – Stage 1 approval] (messaging decision implies reminders; brief silent) | A reminder sends at the salon-set time. It carries no promotion. |
| MSG-02 | **SMS and WhatsApp cost passes through to the salon**, or the **salon brings its own provider**. Costs are **not** absorbed in the licence price. | [ADDED – Stage 1 approval] | Admin shows the provider mode. In pass-through mode each message's cost is logged and totalled for the month. |
| MSG-05 | **Opt-out** honoured for each channel. | [ADDED – Stage 2 proposal] (PECR) | A client who opts out receives no further messages in that channel (service messages continue by email or phone as the law allows). |
| MSG-06 | **Provider choices are placeholders:** [EMAIL PROVIDER], [SMS PROVIDER], [WHATSAPP PROVIDER]. | [ADDED – Stage 1 approval] | Config accepts a provider or a stub. |

### 3.19 Admin and reception screens, customer admin area: ADM

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| ADM-01 | **Today's diary** (all staff columns). | [BRIEF] | As DIA-01. |
| ADM-02 | **Client search and card.** | [BRIEF] | As CLI-07. |
| ADM-03 | **Till / checkout.** | [BRIEF] | As TIL. |
| ADM-04 | **Walk-in queue.** | [BRIEF] | As DIA-08. |
| ADM-05 | **Stock levels and quick sale.** | [BRIEF] | As STK-01, TIL-03. |
| ADM-06 | **End-of-day cash-up.** | [BRIEF] | As TIL-16 to TIL-18. |
| ADM-07 | **Staff hours and performance.** | [BRIEF] | As STF-05. |
| ADM-08 | **Promo and loyalty settings.** | [BRIEF] | As PRM, LOY. |
| ADM-09 | **Finance sync log.** | [BRIEF] | As FIN-06. |
| ADM-10 | **Customer admin area** so the salon manages its own core settings without Tony: services and prices, staff and logins, opening hours, policies, deposit rules, tender types, tips policy, provider settings, **data export**. | [ADDED – pipeline-rules] (26 Oct 2026, standing rule) | An owner can change each listed setting and run a data export without help. |
| ADM-11 | **Data export:** the owner can export their clients, bookings, sales and stock as files. | [ADDED – pipeline-rules] | Export downloads CSV files with a log entry. |
| ADM-12 | **"Needs attention" list** (sync conflicts, unreconciled items, failed postings, no-shows waiting to charge, low stock). | [ADDED – Stage 2 proposal] | The list gathers each item with a link to fix it. |
| ADM-13 | **Installable web app (PWA)** for PC and tablet, plus a phone view for stylists. | [ADDED – Stage 1 approval] (architecture approved with Stage 1) | App installs on Windows and iPad and a stylist phone view loads. |
| ADM-14 | **Network receipt printer support** (ESC/POS over LAN) and drawer kick. iPad Safari cannot print over USB or Bluetooth from a web page. | [ADDED – Stage 2 proposal] (research 8.1) | A test receipt prints on a network Epson-class printer. |

### 3.20 Basic owner reports: RPT

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| RPT-01 | **Takings by tender and by staff** (services and retail separately). | [ADDED – Stage 2 proposal] (needed for cash-up and commission; research 8.11) | Totals equal ledger sums for the period. |
| RPT-03 | **Deposits held**, **voucher liability**, **tips payable**, **owed to renters**. | [ADDED – Stage 1 approval] (follows from the locked ledgers) | Each shows the open balance and its movement. |


### 3.21 Catalogue: treatments and products at scale: CAT

[ADDED – Tony steer 21:45] Tony asked for the **main shop** to carry "full product databases of every different available products and treatments" ("there are 1000s"). The catalogue is one database shared by the diary, the till, stock, online booking and online shop (section 5). Evidence for the seed and for the sources is in `_research/stage2-deep-research.md` and `_research/treatment-catalogue-seed.csv`. **Rule: no SKU, barcode (EAN), cost or price is invented. They are blank or a placeholder until the salon enters or imports them.** **Draft, not legal advice** on licensing.

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| CAT-01 | **Treatment taxonomy** with at least these top-level categories, each with sub-categories the owner can add: hair cut and finish; colour (all techniques); hair treatments and scalp; texture and smoothing; extensions; nails (manicure, pedicure, gel, BIAB, acrylic and dip, nail-art tiers); brows and lashes; waxing and threading; facials and skin; massage and body; tanning; make-up; men's grooming; bridal and events. | [ADDED – Tony steer 21:45] (builds on SVC-01; brief categories stay) | All categories exist after setup. The seed rows map onto them with no "Other" left unassigned after review. |
| CAT-02 | **Treatment fields:** name, category, **duration** (total), **processing segments** (active, processing, active minutes), **patch-test requirement** and lead time (text, salon sets), **contraindications** (free text plus tick-list), **skill level or staff tier** allowed, **price** (a number, a "from" price, **[PRICE – Tony to set]** or **"Prices on request"**), deposit rule, linked retail, photo set, online-bookable flag, channel (salon / home visit / both). | [ADDED – Tony steer 21:45] (extends SVC-01, SVC-12 to SVC-14) | A treatment saves with all fields. A blank price shows "Prices on request" online and the placeholder in admin. Nothing is defaulted to a number. |
| CAT-03 | **Treatment variants** (for example short / medium / long hair, nail length, number of areas) that change duration and price without creating a new treatment. | [ADDED – Tony steer 21:45] | A variant changes the booked duration and price. The diary block length follows. |
| CAT-04 | **Treatment seed list** loaded as **names only** (no prices, no descriptions copied from any menu), with a sourced typical duration where one exists, from `treatment-catalogue-seed.csv` (603 sourced names from 40 UK menus plus 100 taxonomy-only rows labelled Judgement). Every seed row shows its source URL and confidence label in admin. **The owner reviews, edits, accepts or deletes seed rows before any go online, and every seed row stays freely editable and deletable afterwards (CAT-19).** Seed rows are **inactive** until accepted. | [ADDED – Tony steer 21:45] | Import of the seed creates 703 inactive rows. Rows with a duration show the source URL. No seed row is bookable until accepted. |
| CAT-05 | **Locked brief services stay exactly as listed in Appendix A**, with the brief's prices. The seed adds names around them and never overwrites them. | [BRIEF] (SVC-02) | After seed import, the 50 brief rows (43 services, 3 packages, 4 add-ons) still match Appendix A on name, duration, price and type. |
| CAT-06 | **Product master:** brand, range, product name, **SKU** (the salon's own), **barcode/EAN**, size, unit, pack size, **cost price**, **RRP**, VAT flag (standard, zero, exempt, per [OPERATOR VAT POSITION]), **use type** (retail, back-bar, both), supplier, stock level, reorder level, photos, description, active flag, **online channel flag** (ORT-02). Cost, RRP and EAN are **placeholders until entered**. | [ADDED – Tony steer 21:45] (extends RET-02, COL-05) | A product saves with every field. A product with no RRP cannot be sold until a price is set. No field is pre-filled with a figure. |
| CAT-07 | **Variants for shade and size** (each colour shade or size is its own SKU with its own barcode and stock, grouped under one product). | [ADDED – Tony steer 21:45] (Reported: colour ranges run from 70 to 184 shades per line, research 3) | A colour line with many shades can be created as one product with shade variants. Stock counts per variant. |
| CAT-08 | **Bulk import by CSV** for treatments and products: a template download, column mapping, a **dry run** that shows what would be created, updated or rejected, row-level error messages, then commit. Import is atomic per file. Every import is logged (who, file name, row counts) and can be **rolled back**. | [ADDED – Tony steer 21:45] (partly overrides OUT-10, see section 1.5) | A 5,000-row file dry-runs without writing. Errors name the row and column. A committed import can be rolled back and the catalogue returns to its earlier state. |
| CAT-09 | **Supplier price-list import:** the salon uploads the price list or invoice file it holds under its **own** account terms (CSV; spreadsheet saved as CSV). Matching is by EAN, then supplier code, then name. A change in cost price creates a **cost-change record** and flags products where margin falls under a salon-set threshold. **RRP is never auto-changed.** | [ADDED – Tony steer 21:45] | A price list with 100 changed costs updates 100 cost prices, writes 100 cost-change records and leaves every RRP as it was. |
| CAT-10 | **Duplicate protection:** EAN and SKU are unique per site. A duplicate EAN in an import is flagged, not silently merged. | [ADDED – Tony steer 21:45] | Importing a row with an existing EAN offers "update" or "skip", never creates a second product. |
| CAT-11 | **Search and filters that scale:** search by name, brand, range, SKU, EAN or supplier code; filters by category, brand, supplier, use type, channel, stock state, active; sort; saved filters. A barcode scan finds the product on the till and in stock take. | [ADDED – Tony steer 21:45] | With **50,000** test products, search returns in 1 second or less on the desk device [TARGET, validate on real hardware]. A scanned EAN opens the product. |
| CAT-12 | **Scale design:** the data model, indexes and screens are built for tens of thousands of SKUs per site, with paged lists (no screen loads all rows) and background import. | [ADDED – Tony steer 21:45] | A load test with 50,000 products and 5,000 treatments shows paged lists and no screen timeout [TARGET]. |
| CAT-13 | **Named UK sources** are recorded in admin help as places the salon may get its **own** data: its supplier accounts (for example Salon Services trade card, Aston & Fincher, Capital, Sally), brand trade portals (for example Wellastore, L'Oréal Partner Shop, Schwarzkopf eShop) and GS1 barcodes on the pack. Each shows its **licensing limit**: trade prices are shown to account holders only (Salon Services, Reported); feeds are not evidenced; scraping is not permitted (UK database right, GS1 terms). | [ADDED – Tony steer 21:45] | Admin help lists each source with its confidence label from the research file. No automated scraper exists. |
| CAT-14 | **Product images and descriptions** are the salon's own or supplied by the brand under its trade terms. SalonOS does not bundle brand images. | [ADDED – Tony steer 21:45] | No product image ships with the seed. |
| CAT-15 | **Back-bar vs retail** are separate stock locations for one product (a bottle can be bought as back-bar and retail). Moving stock between them is a logged transfer. | [ADDED – Tony steer 21:45] (extends STK-01) | A transfer reduces one location and raises the other with a log line. |
| CAT-17 | **Archive, not delete,** for anything that has been sold or booked. A row never sold or booked, including every seed row, can be deleted outright (CAT-19). | [ADDED – Stage 2 proposal] | Archiving hides it from sale and booking and keeps history intact. |
| CAT-18 | **Treatment-to-product links** feed both "linked retail" (SVC-10) and "branded product option" (BKJ-03) and the back-bar deduction (COL-04). One link table, three uses. | [ADDED – Tony 21:52] and [ADDED – Tony 21:53] (keep it together) | Changing a link once changes the recommendation, the option and the deduction. |
| CAT-19 | **Seed rows are freely editable and deletable.** Every one of the 703 seed rows (name, category, duration, flags, group) can be edited, deactivated or deleted by the Owner or a Manager the Owner allows, one at a time or in bulk by filter, with a confirm step and no minimum number kept. The seed is a starting suggestion, not locked data, and deleting seed rows never affects the services the salon created itself. The same seed file can be imported again later; a deleted row is not restored automatically. | [ADDED – Tony 22:53] | Import the seed (703 inactive rows), delete 600 of them by filter, edit 3 and delete the rest: no error, and the salon's own services are unchanged. |

### 3.22 Nails menu, design tiers and ranges: NAI

[ADDED – Amendments 01] (A1). The brief already holds five nail services with prices. The amendment adds nail art and design tiers with prices, a full manicure range and a full pedicure range.

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| NAI-01 | **Nail art and design tiers** attached to a nail treatment as options (for example "Level 1, 2, 3, or full design"), each with its own price and extra minutes. Tier names and prices are set by the salon. | [ADDED – Amendments 01] (A1) | Choosing a tier adds its price and time to the booking. |
| NAI-02 | **Tier prices:** where Tony has not given a price, the system shows **"Prices on request"** online and **[PRICE – Tony to set]** in admin. **No price is invented.** | [ADDED – Amendments 01] (A1), [DEFAULT – Tony to confirm] (D5) | A tier with no price cannot be paid online. It shows "Prices on request". |
| NAI-03 | **Full manicure range and full pedicure range** are seeded as names (CAT-04: 39 manicure and pedicure rows and 75 BIAB, gel, acrylic and dip rows, 12 nail-art and add-on rows in the seed), including the brief's Gel Manicure, Gel Pedicure, Builder Gel Overlay, Full Set Extensions and Infill. | [ADDED – Amendments 01] (A1) and [BRIEF] | The nails category lists the brief services and the accepted seed rows. |
| NAI-04 | **Nail brand option** (for example gel brand) uses the branded product option (BKJ-03). | [ADDED – Amendments 01] (A1) and [ADDED – Tony 21:52] | A gel brand option shows with its price difference placeholder. |
| NAI-05 | **Nail design photo gallery** per tier (salon's own photos). | [ADDED – Amendments 01] (A1) | Photos show on the tier page. |

### 3.23 Treatment-first booking and duration fitting: TFB

[ADDED – Amendments 01] (A3): "a client must be able to pick what treatment they want and book a slot that fits their treatment with different treatments taking longer."

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| TFB-01 | **Treatment before person:** the online journey starts with the treatment (BKJ-01), then the artist, then the slot. | [ADDED – Amendments 01] (A3) | A client can reach slots without choosing a person first ("anyone"). |
| TFB-02 | **Slots are computed from the total duration** of the chosen treatments, variants, options and add-ons (CAT-03, SVC-07, BKJ-03), for the chosen tier. | [ADDED – Amendments 01] (A3) | A 180-minute treatment never shows a 60-minute gap. |
| TFB-03 | **Processing segments are honoured:** during processing time the stylist is free for another client's active time (DIA-10); slots offered reflect the real free time. | [ADDED – Amendments 01] (A3), [ADDED – Stage 1 approval] | A balayage booking leaves a stylist bookable for short services during processing. |
| TFB-04 | **Multi-treatment booking** in sequence, one deposit, one bill (DIA-13). | [ADDED – Amendments 01] (A3) | Two treatments book as one appointment with the summed time. |
| TFB-06 | **Different treatments take different times,** shown on the treatment card before booking ("about 2 h 30 min"). | [ADDED – Amendments 01] (A3) | The card shows the duration after variants are chosen. |
| TFB-07 | **Soft hold on the chosen slot** while paying (DIA-11). | [ADDED – Amendments 01] (A3) | A second client cannot take a held slot until the hold expires. |

### 3.24 Regular artist, therapist or hairdresser: RAB

[ADDED – Amendments 01] (A4) and [ADDED – Tony 21:52]: "select your regular artist/therapist/hairdresser".

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| RAB-01 | **A client can save a regular artist** per treatment category (for example hair, make-up, nails, brows) on their account, building on CLI-05. | [ADDED – Amendments 01] (A4) | A client with a saved regular sees that name first in the journey. |
| RAB-02 | **Choose a named artist or "anyone"** at step 4 of the journey (BKJ-05). "Anyone" picks from qualified free staff. | [ADDED – Tony 21:52] | Both choices work and show different slot lists. |
| RAB-03 | **Rebook with my regular** from My bookings in one tap, using the last treatment. | [ADDED – Amendments 01] (A4) | One tap opens the journey at slot choice. |
| RAB-04 | **A client who picks a regular sees only that artist's availability** (A4). If the regular has no suitable slot, the screen says so and offers two **explicit** buttons: "See other dates for [name]" and "Choose anyone / another artist". The system never swaps the artist silently. | [ADDED – Amendments 01] (A4) | A regular with no slot shows both buttons and no other artist's slots until the client taps. |
| RAB-05 | **Price follows the artist's tier** (SVC-03). The price shown before payment includes the tier. | [ADDED – Tony 21:52] | Choosing a Senior shows base × 1.2, rounded as SVC-03 says. |

### 3.25 Home visits, weddings and events: HEV

[ADDED – Amendments 01] (A5): "home and wedding or event bookings."

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| HEV-01 | **Booking location type:** in salon, at the client's home, or at an event venue, set per treatment (CAT-02). | [ADDED – Amendments 01] (A5) | A home-visit treatment asks for an address. |
| HEV-02 | **Address, access notes and contact** captured, with a travel zone check by postcode. Travel fee is a placeholder **[TRAVEL FEE – Tony to set]**. | [ADDED – Amendments 01] (A5) | A postcode outside the zone is refused with a message. No travel fee value ships. |
| HEV-03 | **Travel time is blocked in the diary** before and after a home visit. | [ADDED – Amendments 01] (A5) | The artist cannot be double-booked across travel time. |
| HEV-04 | **Wedding and event enquiry form:** date, venue, party size, services wanted, trial wanted, notes. It creates an **enquiry**, not a booking. Quote-only (like the brief's Bridal package). | [ADDED – Amendments 01] (A5), [BRIEF] (Bridal quote only) | An enquiry shows in a staff list. It cannot be paid online until a quote is issued. |
| HEV-05 | **Quote to booking:** staff issue a quote with a deposit, the client accepts online, a **signed booking agreement** is stored (template: LEG-22, short home-visit and wedding / event booking agreement), the diary blocks the date. | [ADDED – Amendments 01] (A5) | An accepted quote creates a diary block and a stored agreement. |
| HEV-07 | **Lone-worker safety:** a home visit shows the address and contact to a second named person set by the salon (setting). | [ADDED – Stage 2 proposal] | The setting exists and the field shows on the diary card. |

### 3.26 Online loyalty club: LYC

[ADDED – Amendments 01] (A2): "loyalty club online with regular notifications and emails on promotions, treatments, new products, deals." Free to join [DEFAULT – Tony to confirm] (D6). It uses the points engine in LOY.

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| LYC-01 | **Join online** with email and mobile, with **separate unticked consent boxes** for email, web push and SMS, each recorded (CLI-06). Joining the club does not need marketing consent; marketing needs it. | [ADDED – Amendments 01] (A2) | A member can join with all three boxes unticked and receives no marketing. |
| LYC-02 | **Member page:** points balance (LOY-08), rewards, current offers, preferences, consents. | [ADDED – Amendments 01] (A2) | The balance equals the points ledger sum. |
| LYC-03 | **Topic preferences:** promotions, new treatments, new products, deals. | [ADDED – Amendments 01] (A2) | A member can switch each topic off. Campaigns respect it. |
| LYC-04 | **Campaign composer** for the owner: topic, channel, audience (all members, members with a topic, members who have bought a treatment type), subject, body, preview, **test send to the owner only**. | [ADDED – Amendments 01] (A2) | A campaign sends only to members with the right consent and topic. |
| LYC-05 | **Audience rules never use health data** (patch tests, allergies, consent forms). | [ADDED – Stage 2 proposal] (UK GDPR, research 4.3) | The audience builder has no health field. |
| LYC-06 | **Every message has a working unsubscribe** and the sender identity ([OPERATOR LEGAL NAME], [OPERATOR ADDRESS]). Opt-out takes effect at once. | [ADDED – Stage 2 proposal] (PECR reg 22, research 4.2) | An unsubscribe stops the next send. The send log shows it. |
| LYC-07 | **Soft opt-in is a salon setting, off by default.** If on, it applies only to email to existing clients about similar services with a free opt-out at collection and in every message. | [ADDED – Stage 2 proposal] (PECR reg 22(3), research 4.2) | The setting text states the three conditions. |
| LYC-10 | **SMS is optional,** off by default, cost passed through (MSG-02). | [ADDED – Amendments 01] (A2), [DEFAULT – Tony to confirm] | With SMS off, no SMS is possible. |
| LYC-11 | **Nothing is sent from the preview.** In the Stage 8 preview all channels send only to named test addresses. | [ADDED – pipeline-rules] | A campaign to "all members" in preview goes only to the test list. |
| LYC-12 | **Club offers feed the journey:** member-only offers show in step 3 of the booking journey for signed-in members (OFR-04). | [ADDED – Tony 21:53] | A member-only offer shows only when signed in as a member. |

### 3.27 Offers and special offers: OFR

[ADDED – Tony 21:52]: clients must "get to choose what branded product or special offers going". This extends PRM (the brief's promo rules stay: percentage off, fixed amount, BOGO, time-limited, code or automatic, new-client or all, minimum spend or specific service, **one promo per booking**, discount before deposit, logged and posted to the finance API).

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| OFR-01 | **Offers are visible in the booking journey** (step 3): the client sees the offers that apply to the chosen treatment, artist and date, and picks one or enters a code. | [ADDED – Tony 21:52] | An offer on Gel Manicure shows only when Gel Manicure is in the basket. |
| OFR-02 | **Offer types** beyond PRM-01: bundle (treatment plus a named product), free or discounted add-on, percentage off retail when booked with a treatment, early-slot or off-peak price. Each is a **placeholder value** until the salon sets it. | [ADDED – Tony 21:52] | Each type can be created with no numeric default. |
| OFR-03 | **One promo per booking and one per online shop order** (PRM-03 holds). If several apply, the journey shows them and lets the client choose; the system may preselect the one that saves the client most (setting). | [BRIEF] (PRM-03), [ADDED – Tony 21:52] | A second offer is refused. The preselect is shown and can be changed. |
| OFR-04 | **Offer audiences:** everyone, new clients (PRM-06), club members only, a code. | [ADDED – Tony 21:52], [ADDED – Amendments 01] (A2) | A member-only offer is hidden from a guest. |
| OFR-05 | **Discount before deposit** (PRM-04) and the deposit and payment choice recalculate on screen. | [BRIEF] | A 10% offer on £100 shows £90 and the deposit on £90. |
| OFR-07 | **Offers are posted** as a discount line with the offer ID (FIN-02, PRM-05). | [BRIEF] | Each use is in the ledger. |
| OFR-08 | **Honest price display:** a "was" price is shown only if it was the price actually charged recently (salon setting, the adviser confirms the rule). Draft, not legal advice. | [ADDED – Stage 2 proposal] (Judgement, no source opened) | The offer card has a "reference price" field with a help note. |

### 3.28 The end-to-end online booking journey: BKJ

[ADDED – Tony 21:52] Tony's locked words: "they must be able to book their treatments and get to choose what branded product or special offers going and follow through booking system with options you have like select your regular artist/therapist/hairdresser etc. leading to check out. with a mail order service for selected products chosen by salonOS to retail online and some in shop." This module is the single flow that ties TFB, RAB, OFR, SVC-07, ONL and TIL together. It extends ONL-01 to ONL-08 and does not replace them.

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| BKJ-01 | **Step 1: pick a treatment** (or several) from category tiles or search. Quote-only treatments show "Request a quote" (SVC-05). | [ADDED – Tony 21:52], [BRIEF] | A guest can add a treatment to the booking in two taps from the home page. |
| BKJ-02 | **Step 2 (variants and add-ons):** choose the variant (CAT-03) and add-ons (SVC-07). Each shows its price change and extra minutes. | [ADDED – Tony 21:52] | The running total and duration update at once. |
| BKJ-03 | **Step 2b: choose the branded product used,** where the treatment has one or more **branded product options** (for example Olaplex add-on, K18 add-on, a colour brand, a gel brand, a lash or brow product). Each option has a brand, a linked product (CAT-18), a **price difference as a placeholder** ([PRICE DIFFERENCE – Tony to set]) and optional extra minutes. A treatment with one option shows it as a normal choice; with none, step 2b is skipped. | [ADDED – Tony 21:52] | Choosing "Olaplex add-on" adds its placeholder-priced line, its minutes, and a back-bar link for stock deduction (COL-04). A treatment without options skips the step. |
| BKJ-04 | **Step 3: see and apply special offers** (OFR-01 to OFR-05). | [ADDED – Tony 21:52] | Offers that apply show; one can be applied; the total updates. |
| BKJ-05 | **Step 4: choose an artist, therapist or hairdresser:** a saved regular first (RAB-01), other qualified staff with photo and bio (STF-08), or **"anyone"**. | [ADDED – Tony 21:52] | All three options work. A person who cannot do the treatment is not shown. |
| BKJ-06 | **Step 5: choose a slot** that fits the **total duration** of everything chosen so far, including product options and add-ons (TFB-02). | [ADDED – Tony 21:52] | Adding a 20-minute option removes slots that no longer fit. |
| BKJ-07 | **Step 6: add retail products to the basket** (linked retail, recommended, or search), only items flagged for online sale (ORT-02). The client chooses at this step whether they collect in the salon at the visit (no shipping), or buy for delivery (a separate mail-order order, ORT-10). | [ADDED – Tony 21:52] | A retail item with channel "shop only" is not offered. Collect-at-visit items go on the booking bill. |
| BKJ-08 | **Step 7: check out with Stripe** and choose **a deposit, full payment, or pay in the salon.** Deposit amount follows SVC-06 and PRM-04. Pay-in-salon is allowed only if the salon switches it on for that treatment or client type, and it takes a **card on file** (SetupIntent) for no-show terms (TIL-13). Stripe is in test mode in the preview. | [ADDED – Tony 21:52], [BRIEF] | All three options complete. Pay-in-salon without a card on file is refused where the salon requires one. |
| BKJ-09 | **Terms before confirm:** cancellation and no-show terms, the deposit amount and rule, and the pre-contract information (price inclusive of taxes, main characteristics, supplier identity, cancellation rights, complaints policy) shown and acceptance stored (TIL-14, ONL-11). | [ADDED – Stage 2 proposal] (Consumer Contracts Regulations Schedule 2, research 4.1) | The confirm button is disabled until the box is ticked. The acceptance is stored with wording version. |
| BKJ-10 | **One order, one record:** the journey creates one booking, one set of lines (treatment, options, add-ons, retail collect-at-visit), one payment record and one client record. Nothing is typed twice. | [ADDED – Tony 21:53] | The reception view of the booking shows every line and the payment status. |
| BKJ-11 | **Patch-test gate** applies at step 1 or 2 where the treatment requires it (PTT-02): the client is offered a patch-test slot first. | [ADDED – Tony 21:52], [ADDED – Stage 2 proposal] | A colour treatment with no valid test offers a test slot. |
| BKJ-12 | **Back and forward without losing choices;** a basket saved for the session; a held slot expires (DIA-11) with a clear message. | [ADDED – Tony 21:52] | Going back to step 2 keeps the choices. |
| BKJ-13 | **Guest checkout or sign-in** (ONL-09). A guest gets a one-time-link account at confirmation. | [ADDED – Tony 21:52] | A guest can finish with only name, mobile and email. |
| BKJ-14 | **Confirmation:** screen and email with every line, artist, time, address, payment taken, balance due, how to change or cancel. A calendar file attachment. | [ADDED – Tony 21:52] (extends ONL-06) | The email contains all lines and the balance. |
| BKJ-15 | **Reception can build the same booking** with the same options, offers and artist choice, in under 15 seconds for a simple booking (DIA-03). | [ADDED – Tony 21:53] | Same engine, same prices as online. |
| BKJ-16 | **Pricing is calculated on the server only.** The browser shows a quote; the server recalculates at payment. | [ADDED – Stage 2 proposal] | A tampered browser price does not change the charged amount. |
| BKJ-17 | **Failure handling:** if payment fails, the slot hold is released after its time and no booking is created; if the webhook is late, the booking stays pending until it arrives (TIL-21). | [ADDED – Stage 2 proposal] | A failed card leaves no confirmed booking. |

### 3.29 Online shop: mail order and click and collect: ORT

[ADDED – Tony 21:52]: "a mail order service for selected products chosen by salonOS to retail online and some in shop." The salon chooses which products sell online, which only in the shop and which both. It uses the **same stock ledger as the till** (section 5). Prices of delivery are **placeholders**. **Draft, not legal advice** on consumer law.

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| ORT-01 | **Public shop pages** on the salon site: categories, brand pages, product pages with photos, size, price, stock status, "add to basket". | [ADDED – Tony 21:52] | A product flagged online shows on the site. |
| ORT-02 | **Per-SKU channel flag, curated by the salon:** **online only**, **in shop only**, or **both**. Default for new products: **in shop only** (nothing goes online by accident). Channel is set per product and per variant, in bulk by filter or import (CAT-08). | [ADDED – Tony 21:52], [LOCKED – Tony 22:53] (default in shop only) | A "shop only" product never shows online; an "online only" product cannot be added at the till (except staff order lookup). |
| ORT-03 | **Shared stock with the till:** one stock quantity per SKU. A sale at either place reduces the same number. **Online availability = on hand minus reserved minus a salon-set safety buffer** (per product, default 0). | [ADDED – Tony 21:52], [ADDED – Tony 21:53] | A last unit sold at the till disappears online within 1 minute [TARGET]. |
| ORT-04 | **Stock reservation at checkout:** items are held for a short time while paying, and released if payment fails or times out. The decrement is atomic so two buyers cannot take one unit. | [ADDED – Stage 2 proposal] (prevent overselling) | Two simultaneous buyers of the last unit: one succeeds, one is told it is gone. |
| ORT-05 | **Delivery options:** UK mainland home delivery, click and collect (free, collect at the salon), and optionally other zones the salon enables. Each has a name, a price (placeholder **[SHIPPING RATE – Tony to set]**), a free-over threshold (placeholder **[FREE SHIPPING THRESHOLD]**), estimated days, and weight band. | [ADDED – Tony 21:52] | Options show at checkout with the salon's placeholder values replaced when set. No rate ships by default. |
| ORT-06 | **Shipping rate table** by weight band and zone, set by the salon, with VAT shown per [OPERATOR VAT POSITION]. Reference rates from Royal Mail, Evri and DPD (research section 7) are help text only, never defaults. | [ADDED – Tony 21:52] | The table accepts any value. The help text cites its source and date. |
| ORT-07 | **Restricted goods:** a product can be flagged "not for post" (for example aerosols, flammable liquids such as some nail polishes, hair sprays). Flagged items are **click and collect or shop only**. Which items a courier refuses is **Unverified**: the salon checks the chosen courier's rules. | [ADDED – Stage 2 proposal] (Judgement, courier restrictions not opened) | A flagged item cannot be shipped. Default for an item with the "aerosol or flammable" tick is not-for-post. |
| ORT-08 | **Checkout** with Stripe (cards and Apple/Google Pay where Stripe provides them), guest checkout or sign-in, delivery address, delivery option, offer or code (OFR-03), order summary with pre-contract information (ORT-14). | [ADDED – Tony 21:52] | An order can be placed by a guest with an email and address. |
| ORT-09 | **Click and collect:** the client picks the salon, gets an email when the order is ready, collects with an order number or QR code, and staff mark it collected at the till. An uncollected order is released after a salon-set number of days. | [ADDED – Tony 21:52] | A collected order moves to "collected" and stock is already reduced. |
| ORT-10 | **Mail order from the booking journey:** a retail item added at BKJ-07 for delivery becomes a **separate order** with its own delivery and its own payment, but shares the client record and can be paid in the same Stripe checkout. | [ADDED – Tony 21:52], [ADDED – Tony 21:53] | One checkout produces one booking and one order, linked on the client card. |
| ORT-11 | **Fulfilment screen** for staff: new orders, picking list, packing slip (printable), mark packed, **mark dispatched with courier, service and tracking number**, mark delivered. A courier label is bought on the courier's own site in v1 (no courier API, section 6). | [ADDED – Tony 21:52] | An order moves through the statuses and each change is logged. |
| ORT-12 | **Order emails:** confirmation (with the order, price, delivery cost, cancellation rights), "ready to collect", **dispatch with tracking link**, delivered (optional), refund. These are service messages, not marketing. | [ADDED – Tony 21:52] | Each status change sends the matching email to the test address in preview. |
| ORT-13 | **Order statuses:** placed, paid, picking, packed, dispatched, delivered; click and collect: ready, collected; plus cancelled, return requested, returned, refunded. | [ADDED – Tony 21:52] | Statuses exist and each transition is allowed only from the right earlier state. |
| ORT-14 | **Distance-selling pre-contract information** shown before the client pays, and confirmed in the order email: main characteristics of the goods, trader identity and address ([OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL]), total price **including taxes**, delivery charges, payment and delivery arrangements and time, complaint policy, the right to cancel and how, who pays return cost, and where the right does not apply (Schedule 2 to the Consumer Contracts Regulations 2013, items (a) to (n) read on legislation.gov.uk). | [ADDED – Tony 21:52] (Verified, research 4.1) | The checkout page shows each item. The email repeats them. Wording is a **Draft, not legal advice** template. |
| ORT-15 | **14-day cancellation right for goods** (reg 29 and reg 30(3)): the cancel period ends 14 days after the goods come into the consumer's possession. The shop shows the date, offers a cancel form or button, and records the notice. | [ADDED – Tony 21:52] (Verified, research 4.1) | A client can cancel in the period; the system calculates the date from the delivered date. |
| ORT-16 | **Hygiene and personalised exceptions:** a per-SKU flag **"sealed hygiene item"** (opened sealed cosmetics, reg 28(3)(a)) and **"personalised / made to order"** (reg 28(1)(b)). The checkout shows the exception **before** the client pays. **The hygiene exception applies only if the consumer breaks the seal after delivery**; a product that arrives unsealed or damaged is **not** covered. The salon sets which products carry the flag; the system does not decide that a product is unsuitable for return. | [ADDED – Tony 21:52] (Verified, research 4.1) | A flagged product shows the notice at checkout. A return of an unopened sealed product is accepted. |
| ORT-17 | **Returns process:** return request, return address and reference, receipt of return by staff, inspection note, **refund to the original payment method** within the legal time (reg 34, 14 days after the trader gets the goods back or proof of return; adviser confirms the timing and delivery-cost refund details), stock put back or written off. Return postage cost: **the consumer bears it unless the salon says otherwise** in the pre-contract information (Schedule 2(m)). | [ADDED – Tony 21:52] (Verified in part, research 4.1) | A return reaches "refunded", a Stripe refund is posted (TIL-08) and the stock ledger shows the put-back or write-off. |
| ORT-18 | **Faulty or wrong goods** are a separate path ("not as described, faulty, damaged"), handled under the Consumer Rights Act 2015 and not limited by the 14-day cancellation rules; the salon decides remedies, the system records the claim, photos and outcome. Adviser to confirm wording. | [ADDED – Stage 2 proposal] (Judgement) | A fault claim can be logged with photos and a remedy. |
| ORT-19 | **Online retail posts to the finance ledger** with the same lines as a till sale plus delivery charge, VAT per [OPERATOR VAT POSITION], discount and refund (FIN-02). | [ADDED – Tony 21:52], [ADDED – Tony 21:53] | An online order produces ledger lines in the same shape as a till sale. |
| ORT-20 | **Loyalty:** points on online orders follow LOY-01 to LOY-03: after payment is confirmed and the cancellation or return period handling is as the salon sets (default: points are earned when the order is dispatched and reversed on refund, LOY-09). | [ADDED – Tony 21:52] ([DEFAULT – Tony to confirm]) | Points arrive at the set event and reverse on refund. |
| ORT-22 | **Basket and order recovery:** a signed-in client sees their orders and tracking; staff can look up an order by name, number or email. | [ADDED – Tony 21:52] | Both lookups work. |
| ORT-23 | **No price, shade or product is bundled into the shop.** The shop is empty until the salon enters or imports its own catalogue (CAT-06 to CAT-09). | [ADDED – Tony 21:52] ("Never invent SKUs or prices") | A new site shows an empty shop and a "set up your shop" checklist. |

### 3.30 Optional marketplace: stub only (MKS)

[ADDED – Tony 22:53] Tony: "Keep the optional marketplace as a stub only." Amendments 01 (A6, A7) and the 21:45 steer ("just an extra") are therefore **parked, not deleted**: the nine original MKT rows, FIN-09 and ROL-08 are kept word for word in section 11.6. v1 builds only the two rows below. All commission and payout values stay placeholders ([COMMISSION %], [PAYOUT DAY]) if the marketplace is ever built.

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| MKS-01 | **Placeholder only.** v1 has no marketplace screen, public advert page, artist sign-up, vetting, listing, contract screen or payout. Settings shows one disabled line "Mobile artist marketplace: later phase [MARKETPLACE – later phase]". Nothing about it appears on the public site. | [ADDED – Tony 22:53] | A fresh install shows no marketplace page or menu item to any role or to the public. |
| MKS-02 | **Data-model hooks only, no behaviour.** The data model reserves: a staff or person type value for a marketplace artist; empty tables for artist listing, artist contract and payout run; the finance posting types "commission" and "artist payable" (never posted in v1); a reserved role value. No screen, no API route, no Stripe Connect, no HMRC reporting. | [ADDED – Tony 22:53] | On a fresh database the reserved tables exist and are empty; no route reads or writes them; no posting of the reserved types is possible. |

## 4. Data model (entities, shared by every module)

One database, one set of tables. **Every record carries `site_id`** (single site in v1, T1). Money is **integer pence**. Anything that moves money, stock or points is an **append-only ledger line** (a correction is a new line, never an edit). [ADDED – Stage 1 approval] (architecture) and [ADDED – Tony 21:53] (everything stays together).

| Entity | Key contents | Used by |
|---|---|---|
| Site | name, address, opening hours, settings, VAT position | all |
| Person (client / member) | **one record per human**: name, mobile, email, notes, preferred artists by category, consents per channel, health flags, points balance (derived) | CLI, ONL, LYC, LOY, ORT, TIL, PTT |
| Staff / Artist | tier, staff type (employed, renter), services qualified, rota, colour, commission rules | STF, RNT, DIA, RAB, ROL |
| Treatment | category, duration, segments, patch-test class, contraindications, tier rule, price type, deposit rule, location types, online flag | CAT, SVC, TFB, BKJ |
| Treatment variant | duration and price change (hair length, nail length) | CAT-03 |
| Option group and option | branded product options and add-ons: brand, linked product, price difference, minutes | BKJ-03, SVC-07, NAI-04 |
| Product | brand, range, SKU, EAN, size, unit, cost, RRP, VAT flag, use type, channel flag, hygiene and personalised and not-for-post flags | CAT, RET, STK, ORT, COL |
| Product variant | shade or size with its own barcode and stock | CAT-07 |
| Stock location and **stock ledger** | retail, back-bar; every movement: sale, online order, reservation, goods-in, transfer, formula use, waste, stock-take adjustment, return put-back | STK, COL, ORT, TIL |
| Booking and booking line | status, segments, lines (treatment, option, add-on, retail collect-at-visit), source (online, phone, walk-in), artist, location type, address | DIA, BKJ, HEV |
| Order (online shop) | lines, delivery option, address, courier, tracking number, status, returns | ORT |
| Offer | type, audience, conditions, dates, limits, placeholder values | PRM, OFR |
| **Payments ledger** | every deposit, balance, tender, refund, tip, voucher sale and use, external-card entry, Stripe event ID (idempotent) | TIL, TIP, GFT, ORT, FIN |
| Voucher | code, balance, liability | GFT |
| Points ledger | earn, redeem, expire, adjust, reverse | LOY, LYC |
| Tips ledger | tip received, allocated, paid | TIP |
| Commission ledger | per sale line per staff member | STF, RNT |
| Patch test, consent form, formula | dates, results, signature, grams, developer, waste | PTT, COL |
| Cash-up | expected vs counted, tender totals, variance, close lock | TIL |
| Campaign and message log | topic, channel, audience, send log, cost | LYC, MSG |
| Finance posting (outbox) | payload, status, idempotency key, retries | FIN |
| Audit log | who, when, before, after | ROL, DIA, CAT |
| Marketplace (stub hooks only, empty reserved tables) | artist listing, contract, payout run (unused in v1) | MKS |

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| DAT-01 | **One client record** is used by booking, till, online shop, loyalty club, patch tests, formulas and messages. A client who books online, buys online and visits the shop has one card. Matching is by verified email or mobile; duplicates are fixed by hand in v1 (a merge tool is deferred, section 11.6). | [ADDED – Tony 21:53] | An online order and a till sale for the same person appear on one card. |
| DAT-02 | **One stock ledger per site.** The till, online shop, click and collect, formula deduction, goods-in and stock take all write to it. There is no second stock count. | [ADDED – Tony 21:53] | Summing the stock ledger for a product equals the figure shown everywhere. |
| DAT-03 | **One payments ledger per site.** Stripe online, Stripe Terminal, external card, cash, voucher and refund lines all live in it, each tagged with its source (booking, order, quick sale, voucher). | [ADDED – Tony 21:53] | A day's ledger totals by tender equal the cash-up screen and the finance postings. |
| DAT-04 | **Ledgers are append-only,** in integer pence, with an idempotency key from the source event. | [ADDED – Stage 1 approval] (TIL-20) | No ledger row can be edited or deleted through the app. |
| DAT-05 | **`site_id` on every record** and in every query, so more sites can be added later without a rewrite (T1). | [ADDED – Stage 2 proposal] | A schema check shows no table without `site_id` except global reference data. |
| DAT-06 | **Time handling:** times stored in UTC and shown in Europe/London, with correct British Summer Time changes for slots, reminders and cut-off times. | [ADDED – Stage 2 proposal] | A booking across a clock change keeps its wall-clock time. |
| DAT-07 | **Retention and erasure** rules per data type are settings with a stated reason (patch tests PTT-08; tips three years TIP-06; ledgers kept for the legal accounting period [OPERATOR VAT POSITION], erasure replaces personal fields but keeps ledger totals). | [ADDED – Stage 2 proposal] (UK GDPR) | Erasing a client keeps ledger totals and removes the name and contact. |

---

## 5. One integrated system: the end-to-end flow

[ADDED – Tony 21:53] This section is the **single flow** that connects every module. It does not add features; each step names the requirement IDs that deliver it. The test of the whole spec is that **nothing is typed twice and nothing is counted twice.**

### 5.1 The four things that exist once

| Thing | Where it lives | Who writes to it | Who reads from it |
|---|---|---|---|
| **Client** (one person, one card) | Person record (DAT-01) | online sign-up, reception, till, online shop, loyalty club, patch-test screen | diary, till, formulas, messages, loyalty, reports |
| **Catalogue** (treatments, options, products) | CAT tables | owner, bulk import, goods-in | online journey, online shop, diary, till, stock, commission |
| **Stock ledger** | DAT-02 | till sale, online order, click and collect, formula saved, goods-in, transfer, stock take, return | stock screens, online availability, low-stock alerts, reports |
| **Payments ledger** | DAT-03 | Stripe webhooks, Terminal, external card, cash, vouchers, refunds | cash-up, tips, commission, loyalty, finance outbox, reports |

### 5.2 The flow in order

| # | Stage | What happens (one system, one record) | Reads | Writes | Requirements |
|---|---|---|---|---|---|
| 1 | **Set up the catalogue** | Owner loads the treatment seed and her own product price lists by CSV, reviews seed rows, sets channel flags, option groups, branded product options, offers, delivery rates, patch-test and hygiene flags. Nothing goes live until accepted. | seed file, supplier files | treatments, products, options, offers | CAT-01 to CAT-15, CAT-17, CAT-18, NAI, ORT-02, ORT-05, OFR |
| 2 | **Client finds the salon online** | Home page tiles, treatment pages (duration, price or "Prices on request"), shop pages, club sign-up. | catalogue, offers | nothing | ONL-01, ONL-02, ORT-01, LYC-01 |
| 3 | **Client books** (7-step journey) | Treatment → variant and branded product → offers → regular artist or anyone → slot fitting the total time → retail → Stripe checkout (deposit, full pay or pay in salon). One booking, one payment record, one client. | catalogue, staff rota, diary, stock availability, offers | booking, booking lines, payments ledger, stock reservation (collect-at-visit), card on file, consent acceptance | BKJ-01 to BKJ-17, TFB, RAB, OFR, SVC-06, TIL-13, TIL-14 |
| 4 | **Patch test gate** | If the treatment needs a test, the journey offers a test slot first, and blocks the service until a valid test is on the card. | patch test records | patch test record, consent form | PTT-01 to PTT-06, PTT-08, BKJ-11 |
| 5 | **Booking appears in the diary** | Instantly, with deposit status, processing segments, location and travel blocks. Reception sees it as a normal booking. | booking | diary view | DIA-01, DIA-02, DIA-10, HEV-03, ONL-08 |
| 6 | **Reminders and changes** | Service messages by email, SMS or WhatsApp (costs passed through); client changes in My bookings. | booking, consents | message log | MSG-01, MSG-02, MSG-05, MSG-06, ONL-07, DIA-15 |
| 7 | **Client arrives** | Check-in; allergy flags and patch-test status show; walk-ins join the queue. | client card, diary | booking status | DIA-08, DIA-12, CLI-08 |
| 8 | **Service is performed** | Colour formula saved (grams, developer, waste); at completion the back-bar grams are deducted from the **same stock ledger**. | booking, formula, products | formula, stock ledger | COL-01 to COL-05, COL-08 |
| 9 | **Retail at the chair or desk** | Linked retail and any retail picked online are on the bill; staff add more; the till and the shop use the same prices. | booking lines, catalogue | booking lines, stock ledger on payment | TIL-04, RET-03, TIL-09 |
| 10 | **Checkout at the till** | Balance = total − deposit held − vouchers − loyalty reward. Tender: Stripe Terminal, external card, cash, voucher, split. Offer applied before the deposit was calculated. Tip recorded. | booking, payments ledger | payments ledger, tips ledger, voucher ledger | TIL-01 to TIL-12, TIP, GFT, PRM, OFR |
| 11 | **After payment** | Points earned (only after final payment); commission lines for each staff member (renters: revenue split); retail attribution; receipt printed or emailed; drawer opens on cash. | payments ledger | points ledger, commission ledger | LOY-01, LOY-02, STF-03, RNT-02, RET-06, TIL-07, TIL-15 |
| 12 | **Online shop order** (separate path, same records) | Client buys for delivery or click and collect; stock reserved then reduced in the same ledger; fulfilment, dispatch email with tracking; 14-day cancellation and returns; refund through Stripe; stock put back or written off. | catalogue, stock ledger | order, stock ledger, payments ledger, points ledger | ORT-01 to ORT-20, ORT-22, ORT-23 |
| 13 | **Loyalty club communication** | Members with consent get email or web push (SMS optional) about promotions, treatments, new products and deals, built from the same catalogue and offers. Offers shown in the journey for members. | consents, offers | campaign and message log | LYC-01 to LYC-07, LYC-10 to LYC-12 |
| 14 | **Tips and vouchers** | Tips go to the tips ledger as a liability and are passed through in full. Vouchers are a liability until used. | payments ledger | tips ledger, voucher ledger | TIP-01 to TIP-09, GFT-01 to GFT-04 |
| 15 | **Stock upkeep** | Goods-in, low-stock list, basic stock take with variance posted to the stock ledger; waste from COL-08 is expected loss. | stock ledger | stock ledger | STK-01 to STK-04, COL-08, CAT-09 |
| 16 | **End of day cash-up** | Expected cash from the payments ledger vs counted; card totals; external terminal totals entered; reconciled to the diary (completed with no payment, payment with no appointment); close locks the day. | payments ledger, diary | cash-up record | TIL-16 to TIL-19, TIL-12, TIL-17 |
| 17 | **Finance posting** | Every ledger event posts once through the outbox with clear lines (service, retail, discount, VAT, tip, voucher, deposit held and applied, loyalty, delivery charge); the stub adapter writes the payload to the sync log. | ledgers | finance postings | FIN-01 to FIN-08, FIN-10 |
| 18 | **Reports and "needs attention"** | Takings, liabilities (deposits, vouchers, tips, owed to renters), commission, online orders; failed postings and conflicts. | all ledgers | nothing | RPT-01, RPT-03, ADM-12 |
| 19 | **Marketplace (stub only)** | Nothing happens in v1. A disabled placeholder line in Settings; reserved empty tables exist. | – | reserved empty tables | MKS-01, MKS-02 |

### 5.3 One money event, every consequence

| Event | Payments ledger | Stock ledger | Points | Commission | Tips | Finance posting |
|---|---|---|---|---|---|---|
| Online booking, deposit paid | + deposit held | reservation if retail collect-at-visit | none | none | none | deposit |
| Treatment completed and paid in full at till | + balance, deposit applied | formula grams out; retail out | earned | staff service line | tip liability if tipped | service, retail, discount, VAT, tip |
| Gift voucher sold | + voucher liability | none | none (D15) | none | none | voucher sale |
| Voucher redeemed | − voucher liability | as sale | earned on redemption | as sale | none | voucher use |
| External card (SumUp, Dojo) | + external tender, reconciled at cash-up | as sale | as sale | as sale | as sale | tender line |
| No-show or late cancel charged | + fee from card on file | none | none | none | none | cancellation fee |
| Online shop order paid | + order payment, delivery charge | reserved → out | earned at the set event (ORT-20) | none in v1 | none | retail, delivery, VAT |
| Online order cancelled or returned | − refund | put back or written off | reversed | reversed | none | refund |
| Till refund | − refund to original tender | put back if returned | reversed (LOY-09) | reversed | none | refund |
| Stock take variance | none | + or − adjustment | none | none | none | adjustment (if the salon books stock) |
| Cash-up close | totals lock | none | none | none | none | summary, once |

### 5.4 Failure cases the flow must survive

| Case | Required behaviour | Requirements |
|---|---|---|
| Broadband drops in the shop | Diary and cash sales continue offline; card goes through the external terminal; queued changes sync with conflicts shown, never silent. | OFF-01 to OFF-09 |
| Two buyers, one last unit (till and web) | One wins; the other is told. | ORT-03, ORT-04 |
| Online payment fails after the slot is held | Hold released; no booking. | BKJ-17, DIA-11 |
| Stripe webhook arrives twice or late | No double effect; booking stays pending until it arrives. | TIL-21 |
| Client books online and phones to change | One booking; the change shows on the appointment. | DIA-15 |
| A product is changed from "both" to "shop only" while in a basket | The basket flags the item at checkout. | ORT-02, ORT-04 |
| A treatment's price changes after booking | The booking keeps the price shown when booked, unless staff edit it with a reason. | BKJ-16 |
| A staff member's holiday is added | Reception checks the diary for clients already booked and rebooks by hand (clash list deferred, section 11.6). | STF-07 |

---

## 6. Integrations (v1)

| Integration | Use | Real or stub in the preview | Notes | Source |
|---|---|---|---|---|
| Stripe (Checkout / Payment Element, webhooks, SetupIntent for card on file) | Online deposit, full pay, shop orders, no-show charge | **Test mode** | Idempotent webhooks (TIL-21). Stripe is primary. | [BRIEF] (deposits online), [ADDED – Stage 1 approval] |
| Stripe Terminal smart reader on the shop LAN | Card in the shop | Test or simulated | Needs reader; offline card not supported (OUT-01). | [ADDED – Stage 1 approval] |
| External card tender (SumUp, Dojo, other) | Card on a separate machine | Manual entry | No API (OUT-05). | [ADDED – Stage 1 approval] |
| Stripe Connect Express | Not used in v1 (marketplace is a stub only) | – | Parked (MKS). | [ADDED – Amendments 01] |
| Finance API outbox with stub adapter | Posting every money event | **Stub** (payload to sync log) | Real accounting credentials stay a placeholder [ACCOUNTING PACKAGE – Tony to choose later]. | [BRIEF] |
| [EMAIL PROVIDER] | Service emails, order emails, club email | Test addresses only | Placeholder. | [BRIEF] |
| [SMS PROVIDER], [WHATSAPP PROVIDER] | Reminders, optional club SMS | Off or test | Cost passed through (MSG-02). | [ADDED – Stage 1 approval] |
| Web push | Club notifications | Test | iPhone web push needs the web app added to the Home Screen (iOS 16.4 or later, Reported, Stage 1). | [ADDED – Amendments 01] |
| Network ESC/POS receipt printer and drawer | Receipts, cash drawer | Hardware at Stage 8 | ADM-14. | [ADDED – Stage 1 approval] |
| Couriers (Royal Mail, Evri, DPD and others) | Dispatch of online orders | **No API in v1**; staff type courier and tracking number | OUT-18; research section 7. | [ADDED – Tony 21:52] |
| Cloudflare Pages and Workers, [DATABASE HOST] | Hosting the preview and database | Preview only | Vercel stays paused. | [ADDED – Stage 1 approval] |
| Supplier price lists and barcodes | Catalogue data | CSV by the salon | No scraping (CAT-13). | [ADDED – Tony steer 21:45] |

---

## 7. Compliance map

**Draft, not legal advice.** Every item needs the adviser before launch. Sources are in `_research/stage2-deep-research.md` (section number shown) and the Stage 1 report.

| Topic | What the spec does | Confidence | Source |
|---|---|---|---|
| Distance sales: pre-contract information, 14-day cancellation, exceptions (CCR 2013) | ORT-14 to ORT-17, BKJ-09 | Verified (text read) | https://www.legislation.gov.uk/uksi/2013/3134/schedule/2 ; /regulation/28 ; /29 ; /30 ; research 4.1 |
| Hygiene exception for sealed goods unsealed after delivery (reg 28(3)(a)) | ORT-16 flag and notice; applies only if the consumer breaks the seal | Verified | https://www.legislation.gov.uk/uksi/2013/3134/regulation/28 |
| Appointments and reg 28(1)(h) leisure-date exemption | OPEN, adviser (OI-05); the terms are shown before booking | Judgement | research 4.1 |
| No-show fee fairness (Consumer Rights Act 2015 s 62) | TIL-13, TIL-14 | Reported (Stage 1) | https://www.legislation.gov.uk/ukpga/2015/15/section/62 |
| Faulty goods (Consumer Rights Act 2015) | ORT-18 | Judgement | adviser |
| PECR email marketing, soft opt-in three conditions (reg 22) | LYC-06, LYC-07 | Verified | https://www.legislation.gov.uk/uksi/2003/2426/regulation/22 |
| ICO special category data (health) | LYC-05, ROL-04, PTT-08 | Reported | https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/ |
| Subscriptions regime (Monthly Membership) | SVC-09 flagged: reminders and 14-day cooling-off apply to contracts from 1 Jan 2027 | Reported | https://www.legislation.gov.uk/ukdsi/2026/9780348287912 |
| Tips (Employment (Allocation of Tips) Act 2023 and code) | TIP-01 to TIP-09 | Reported (Stage 1) | Stage 1 report |
| Patch test lead times (NHBF 48 h for hair colour; 24 h for skin sensitivity tests) | PTT-02; per-treatment setting | Reported | research 5 |
| VAT on vouchers, deposits, chair rental, delivery charges | Settings and flags [OPERATOR VAT POSITION]; adviser | Judgement | Stage 1 report |
| HMRC digital platform reporting | Marketplace only (stub), adviser (OI-15) | Reported | https://www.gov.uk/guidance/check-if-you-need-to-register-as-a-digital-platform-operator |
| Equality Act reasonable adjustments | Accessibility settings (ONL-13) | Reported | https://www.nhbf.co.uk/news-and-blogs/blog/is-your-salon-and-barbershop-disability-friendly/ |
| Employment status of staff and renters | Salon's responsibility; warning in setup (RNT-06) | Reported (Stage 1) | Stage 1 report |
| Database right and EAN licensing | CAT-13, CAT-14 | Reported | research 2 |

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| CMP-01 | **Every legal-ish text is labelled "Draft, not legal advice"** in admin and in the spec, including cancellation terms, pre-contract information, privacy text and artist agreement. | [ADDED – pipeline-rules] | Each legal template shows the label. |
| CMP-02 | **Consent and terms acceptance are stored** with wording version, time and channel. | [ADDED – Stage 2 proposal] | An acceptance can be shown for any booking or order. |
| CMP-03 | **Operator details placeholders** [OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL], [VAT NUMBER], [ICO REGISTRATION] appear in footers, emails, receipts and pre-contract information until the salon fills them. | [ADDED – pipeline-rules] | A placeholder shows in each place; none is invented. |

---

## 8. Non-functional requirements

| ID | Requirement | Source | Acceptance criteria |
|---|---|---|---|
| NFR-01 | **Real-world rule:** every feature must work in a real shop on real hardware (offline, printers, drawers, patchy wifi, a busy Saturday), with no feature that only works in ideal conditions. Where something cannot work in the real world (for example offline card), the spec says so and gives a workaround. | [ADDED – Tony steer 20:49 GMT, relayed] ("has to work in the real world, not cyber fantasy land") | Each item in OUT with a real-world reason has a workaround in the spec. |
| NFR-04 | **Backups and restore:** daily backup, a tested restore, retention stated. | [ADDED – Stage 2 proposal] | A restore test is run before launch. |
| NFR-05 | **Security:** HTTPS, server-side permission checks (ROL-01), second factor for Owner and Manager (ROL-06), card data never stored (Stripe), secrets outside the code, rate limits on public forms and sign-in. | [ADDED – Stage 2 proposal] | Security checklist passes at Stage 8. |
| NFR-08 | **Data location** is the placeholder [DATABASE HOST]; UK or EU region preferred, adviser to confirm for UK GDPR transfers. | [ADDED – Stage 2 proposal] | Stage 3 privacy notice names the host. |
| NFR-10 | **Nothing is sent from the preview.** Email, SMS, push and finance postings go only to test addresses or the stub. | [ADDED – pipeline-rules] | A send test reaches only test addresses. |

---

## 9. Traceability matrix

[ADDED – Tony 21:53] Purpose: prove that **nothing in the original brief or in any Tony message has been dropped or reduced.** Status values: **Covered** (a requirement delivers it as written), **Covered, extended** (delivered and enlarged by a later steer), **Covered with a stated limit** (delivered, with a real-world limit Tony should know), **Deferred by Tony** (Tony himself deferred it, so it is in OUT), **Later stage** (belongs to a pipeline stage after Stage 2), **GAP** (not covered). A reverse check (every requirement ID appears in this matrix) is in section 9.4.

### 9.1 Part A: the locked brief (`00-locked-brief-from-tony.md`), clause by clause

| Ref | Brief clause | Requirement IDs | Status |
|---|---|---|---|
| B-01 | Reception takes phone bookings and walk-ins all day | DIA-03, DIA-08, TIL-03 | Covered |
| B-02 | Clients arrive with or without an appointment | DIA-08, DIA-12, TIL-03 | Covered |
| B-03 | Stylists and therapists work from a screen diary | DIA-01, ROL-03, ADM-13 | Covered |
| B-04 | Colour and chemical services need timing notes and patch-test records | DIA-05, DIA-10, SVC-13, SVC-14, PTT-01 to PTT-06, PTT-08 | Covered |
| B-05 | Retail sold at the till while the client is in the chair or at reception | TIL-04, RET-03 | Covered |
| B-06 | Deposits in advance; balance on the day (cash, card or mixed) | TIL-01, TIL-02, TIL-06, SVC-06 | Covered |
| B-07 | End-of-day cash-up reconciled against the diary | TIL-16, TIL-17, TIL-18 | Covered |
| B-08 | Staff paid commission or tracked for performance | STF-03, STF-04, STF-05, RNT-01 to RNT-06 | Covered |
| B-09 | Client history (formulas, notes, services, spend) in seconds | CLI-02, CLI-07, CLI-12 | Covered |
| B-10 | No-shows and late cancellations recordable and chargeable | DIA-07, TIL-13, TIL-14 | Covered |
| B-11 | Stock countable and low stock visible | STK-03, RET-04, STK-04 | Covered |
| B-12 | Online bookings drop straight into the shop diary | DIA-02, ONL-08, BKJ-10 | Covered |
| B-13 | "Not a web-only booking site": must run the physical shop: reception, till, walk-ins, phone bookings, staff, stock, client cards, cash-up | Sections 3.1 to 3.20; section 5 | Covered |
| B-14 | Customer is an independent UK salon "(or small group of shops)" | DAT-05, T1 | **Covered with a stated limit:** single site in v1 (Tony deferred full multi-site); `site_id` everywhere |
| B-15 | One system for every transaction and client interaction in the shop plus online booking, with every money movement posted to the finance API | Section 5; DAT-03; FIN-01 to FIN-08, FIN-10 | Covered, extended (online shop added) |
| B-16 | Single shared diary, all staff columns | DIA-01 | Covered |
| B-17 | Online bookings appear instantly with deposit status | DIA-02 | Covered |
| B-18 | Phone booking and walk-in in under 15 seconds | DIA-03, BKJ-15 | Covered |
| B-19 | Drag and drop between staff, only if qualified | DIA-04, SVC-12 | Covered |
| B-20 | Colour timing notes and processing time on the appointment | DIA-05, DIA-10 | Covered |
| B-21 | Block time for breaks, training, cleaning | DIA-06 | Covered |
| B-22 | No-show and late-cancel buttons that can trigger a charge | DIA-07, TIL-13 | Covered |
| B-23 | Walk-in queue with estimated wait | DIA-08, ADM-04 | Covered |
| B-24 | Client card: name, mobile, email, notes, patch-test dates and results | CLI-01 | Covered |
| B-25 | Full history: services, formulas, retail, spend, no-shows | CLI-02, CLI-12 | Covered |
| B-26 | Photos of previous work (optional) | CLI-03 | Covered |
| B-27 | Loyalty points balance on the card | CLI-04, LOY-08 | Covered |
| B-28 | Preferred stylist | CLI-05, RAB-01 | Covered, extended |
| B-29 | Marketing consent | CLI-06, LYC-01 | Covered, extended |
| B-30 | Every service has ID, category, name, duration, base price, price type, staff qualified, patch test, deposit rule, linked retail, photo set | SVC-01, SVC-10 to SVC-14 | Covered, extended (CAT-02) |
| B-31 | Hair cutting and styling: 9 services at the listed durations and prices | SVC-02, Appendix A (A1 to A9), CAT-05 | Covered |
| B-32 | Hair colour and chemical: 8 services | SVC-02, Appendix A (A10 to A17), CAT-05 | Covered |
| B-33 | Hair treatments: 4 services | SVC-02, Appendix A (A18 to A21), CAT-05 | Covered |
| B-34 | Brows and lashes: 6 services | SVC-02, Appendix A (A22 to A27), CAT-05 | Covered |
| B-35 | Nails: 5 services | SVC-02, Appendix A (A28 to A32), NAI-03, CAT-05 | Covered, extended |
| B-36 | Waxing: 7 services | SVC-02, Appendix A (A33 to A39), CAT-05 | Covered |
| B-37 | Facials: 4 services | SVC-02, Appendix A (A40 to A43), CAT-05 | Covered |
| B-38 | Packages: Bridal Hair + Makeup (quote only), Party Hair Up + Makeup, Monthly Membership | SVC-08, SVC-09, HEV-04 | Covered (membership benefits open, OI-07) |
| B-39 | Add-ons: Extra 15 min, Long/Thick Hair Supplement, Toner, Deep Conditioning | SVC-07, BKJ-02 | Covered, extended |
| B-40 | Pricing rule: base × tier (0.85, 1.0, 1.2, 1.4) | SVC-03, STF-02, RAB-05 | Covered |
| B-41 | Deposit default 20% or £15 minimum | SVC-06, BKJ-08, SVC-15 | Covered |
| B-42 | Quote-only cannot be booked online | SVC-05, ONL-10, HEV-04, BKJ-01 | Covered |
| B-43 | Retail starter catalogue of 15 items (admin editable, full price list) | RET-01, RET-05, Appendix B, CAT-06 | Covered, extended |
| B-44 | Till: add product to open appointment | TIL-04, RET-03 | Covered |
| B-45 | Till: sell product only (walk-in retail) | TIL-03, RET-03 | Covered |
| B-46 | Till: staff discount | TIL-05 | Covered |
| B-47 | Till: mixed payment (cash + card) | TIL-06 | Covered |
| B-48 | Till: print or email receipt | TIL-07 | Covered |
| B-49 | Stock drops on sale; low-stock alert | TIL-09, RET-04, DAT-02 | Covered |
| B-50 | Take deposit online or in shop | TIL-01, ONL-05, BKJ-08 | Covered |
| B-51 | Take final balance in shop (cash, card, split) | TIL-02, TIL-06 | Covered |
| B-52 | Quick sale for retail only | TIL-03 | Covered |
| B-53 | Void and refund with reason | TIL-08 | Covered |
| B-54 | Cash-up: expected vs actual cash, card totals, variance | TIL-16 | Covered |
| B-55 | Every transaction posts to finance API with clear lines | FIN-01, FIN-02 | Covered |
| B-56 | Staff: name, photo, bio, tier, services, hours and breaks, colour, optional commission, active status | STF-01 | Covered |
| B-57 | Reception and owner see all; stylist sees own column and today's clients | ROL-02, ROL-03 | Covered |
| B-58 | Commission report available (optional) | STF-04 | Covered |
| B-59 | Promotions: % off, fixed amount, BOGO | PRM-01, OFR-02 | Covered, extended |
| B-60 | Time-limited, code or automatic, new-client or all, minimum spend or specific service | PRM-02, PRM-06, OFR-04 | Covered |
| B-61 | One promo per booking | PRM-03, OFR-03 | Covered |
| B-62 | Discount before deposit | PRM-04, OFR-05 | Covered |
| B-63 | Promo logged and posted to the finance API | PRM-05, OFR-07 | Covered |
| B-64 | Loyalty: 1 point per £1 on completed paid services and retail | LOY-01, ORT-20 | Covered, extended |
| B-65 | Expire after 12 months inactivity | LOY-03 | Covered |
| B-66 | Optional tiers | LOY-04 | Covered |
| B-67 | Fixed rewards | LOY-05 | Covered |
| B-68 | Points only after final payment confirmed | LOY-02, ORT-20 | Covered |
| B-69 | Manual adjust with log | LOY-06 | Covered |
| B-70 | Separate invoice line | LOY-07 | Covered |
| B-71 | Admin screen: today's diary | ADM-01 | Covered |
| B-72 | Admin screen: client search and card | ADM-02 | Covered |
| B-73 | Admin screen: till / checkout | ADM-03 | Covered |
| B-74 | Admin screen: walk-in queue | ADM-04 | Covered |
| B-75 | Admin screen: stock levels and quick sale | ADM-05 | Covered |
| B-76 | Admin screen: end-of-day cash-up | ADM-06 | Covered |
| B-77 | Admin screen: staff hours and performance | ADM-07 | Covered |
| B-78 | Admin screen: promo and loyalty settings | ADM-08 | Covered |
| B-79 | Admin screen: finance sync log | ADM-09, FIN-06 | Covered |
| B-80 | Client-facing: home with category tiles | ONL-01 | Covered |
| B-81 | Service detail with photos and tier pricing | ONL-02 | Covered |
| B-82 | Stylist and time | ONL-03, RAB, TFB, BKJ-05, BKJ-06 | Covered, extended |
| B-83 | Add-ons and recommended retail | ONL-04, BKJ-02, BKJ-03, BKJ-07 | Covered, extended |
| B-84 | Checkout with deposit | ONL-05, BKJ-08 | Covered, extended |
| B-85 | Confirmation | ONL-06, BKJ-14 | Covered |
| B-86 | My bookings | ONL-07 | Covered |
| B-87 | Finance API: deposit, final payment, retail sale, promo, loyalty, cancellation, refund, cash-up summary with clear lines and status | FIN-01 to FIN-08, FIN-10 | Covered |
| B-88 | Deliverable 1: research checkpoint | `01-research-report.md`; `_research/stage2-deep-research.md` | Done (Stage 1, approved 21:39 GMT) |
| B-89 | Deliverable 2: Product Spec, no new features | This file. New items are tagged [ADDED] with the source | Covered (this stage) |
| B-90 | Deliverable 3: legal documents marked "Draft, not legal advice" | CMP-01; section 7 | Later stage (Stage 3) |
| B-91 | Deliverable 4: sample quote and invoice, VAT placeholder | [VAT NUMBER], [OPERATOR VAT POSITION] kept | Later stage |
| B-92 | Deliverable 5: five draft X posts and launch plan | none (marketing, not product) | Later stage |
| B-93 | Deliverable 6: task log | `task-log.md`, `/workspace/master-task-log.md` updated | Covered (maintained) |
| B-94 | Deliverable 7: Chief Editor note | none | Later stage |
| B-95 | Deliverable 8: Builder only after approval, preview only, Stripe test or stub, pre-flight checklist | OUT-08, NFR-10; hosting changed to Cloudflare Pages by Tony at 21:39 | Later stage; hosting changed by Tony |
| B-96 | Rule: follow pipeline-rules.md | Tags [ADDED – pipeline-rules], ROL-06, ADM-10, ADM-11 | Covered |
| B-97 | Rule: stop after every stage for approval | Header of this spec; Stage 3 approved with fine-tunes at 23:58; fine-tunes delivered, awaiting Tony | Covered |
| B-98 | Rule: nothing published, queued or sent | NFR-10, LYC-11, OUT-08 | Covered |
| B-99 | Rule: all placeholders kept | Section 11.1 | Covered |
| B-100 | Rule: save every output in /workspace/salonos/ | File list in section 10 | Covered |
| B-101 | Rule: update master-task-log.md after each approved stage | Updated (Stage 1 approved; Stage 2 awaiting approval) | Covered |

### 9.2 Part B: Tony's messages after the brief

| Ref | Tony message and clause | Requirement IDs | Status |
|---|---|---|---|
| M-01 | 20:49 "has to work in the real world. not cyber fantasy land" (relayed) | NFR-01; OFF-08; OUT-01; ADM-14; ORT-07 | Covered |
| M-02 | 21:30 A1 "nails designs and prices, manicure, pedicure" | NAI-01 to NAI-05, CAT-01 | Covered (prices: placeholders, D5) |
| M-03 | 21:30 A2 "loyalty club online with regular notifications and emails on promotions, treatments, new products deals" | LYC-01 to LYC-07, LYC-10 to LYC-12, OFR-04 | Covered |
| M-04 | 21:30 A3 "a client must be able to pick what treatment they want and book a slot that fits there treatment with different treatments taking longer" | TFB-01 to TFB-04, TFB-06, TFB-07, BKJ-06, CAT-03 | Covered |
| M-05 | 21:30 A4 "picking a slot with your regular hairdresser, make up artist, etc." | RAB-01 to RAB-05, BKJ-05, CLI-05 | Covered |
| M-06 | 21:30 A5 "home and wedding or event bookings" | HEV-01 to HEV-05, HEV-07 | Covered |
| M-07 | 21:30 A6 "mobile hair and beauty artists can place adds on the site for around the uk, with there own services" | MKS-01, MKS-02; MKT-02 (section 11.6) | **Deferred by Tony 22:53 (stub only):** hooks and placeholder in v1 (MKS-01, MKS-02); original rows kept in section 11.6 |
| M-08 | 21:30 A6 "all enquiries go through the sites channels and work sub contracted" | MKS-01, MKS-02; MKT-03, MKT-07 (section 11.6) | **Deferred by Tony 22:53 (stub only):** hooks and placeholder in v1 (MKS-01, MKS-02); original rows kept in section 11.6 |
| M-09 | 21:30 A7 "with a regular payment date set up with each personal artist" | MKS-01, MKS-02; MKT-05 (section 11.6) | **Deferred by Tony 22:53 (stub only):** hooks and placeholder in v1 (MKS-01, MKS-02); original rows kept in section 11.6 |
| M-10 | 21:30 A7 "agreed commission pre signed and contracts good" | MKS-01, MKS-02; MKT-04, MKT-06 (section 11.6) | **Deferred by Tony 22:53 (stub only):** hooks and placeholder in v1 (MKS-01, MKS-02); original rows kept in section 11.6 |
| M-11 | 21:39 In v1: colour active/processing segments | DIA-10, SVC-14, TFB-03 | Covered |
| M-12 | 21:39 In v1: external-card tender | TIL-11, TIL-12, OFF-08 | Covered |
| M-13 | 21:39 In v1: tips ledger, full pass-through | TIP-01 to TIP-09 | Covered |
| M-14 | 21:39 In v1: offline diary plus cash sales queue | OFF-01 to OFF-09 | Covered |
| M-15 | 21:39 In v1: colour formula fields (grams, developer, waste) | COL-01 to COL-03, COL-08 | Covered |
| M-16 | 21:39 In v1: back-bar stock deduction from formulas | COL-04, COL-05, CAT-15, DAT-02 | Covered |
| M-17 | 21:39 In v1: goods-in and basic stock take | STK-02, STK-03 | Covered |
| M-18 | 21:39 In v1: simple gift vouchers, VAT flagged for adviser | GFT-01 to GFT-04 | Covered |
| M-19 | 21:39 In v1: rent-a-chair basic tracking | RNT-01 to RNT-06 | Covered |
| M-20 | 21:39 Hosting: Cloudflare Pages preview; Vercel paused | OUT-08, section 6 | Covered |
| M-21 | 21:39 Payments: Stripe primary plus external tender; no deep terminal integration | TIL-10, TIL-11, OUT-05 | Covered |
| M-22 | 21:39 Messaging costs pass through or own provider | MSG-02, LYC-10 | Covered |
| M-23 | 21:39 Staff mixed employed and self-employed; status is the salon's responsibility | STF-06, RNT-06, ROL-07 | Covered |
| M-24 | 21:39 Deferred: true offline card, full multi-site, automated supplier ordering, advanced waitlist | OUT-01 to OUT-04 | Deferred by Tony |
| M-25 | 21:39 Amendments A1 to A7 are locked scope | NAI, LYC, TFB, RAB, HEV; MKS (marketplace stub) | Covered (A1 to A5); A6 and A7 stub only by Tony 22:53 |
| M-26 | 21:39 Six defaults marked [DEFAULT – Tony to confirm] | Section 1.3 (D1 to D6); D1 to D4 parked, D8, D9, D18, D21 locked at 22:53 | Covered |
| M-27 | 21:39 Surface "small group" vs multi-site tension | T1, DAT-05 | Covered |
| M-28 | 21:39 Mark every added proposal; keep placeholders; do not reduce scope; never invent SKUs or prices | Section 0 tags; section 11.1; CAT-06, CAT-04, ORT-23 | Covered |
| M-29 | 21:39 Report counts, 5 to 6 key points, defaults | `02-checkpoint-summary.md` and the report | Covered |
| M-30 | 21:45 Salon takes responsibility for the work, employed or subcontracted (brief) | STF-06, RNT-06, section 11.6 (marketplace intro), D1 (parked) | Covered |
| M-31 | 21:45 Pricing, commission and payout stay placeholders | D3, ORT-05, NAI-02, BKJ-03 | Covered |
| M-32 | 21:45 Marketplace "just an extra", secondary, short section | MKS-01, MKS-02, T3, OUT-20 | Covered as a stub only (Tony 22:53) |
| M-33 | 21:45 Focus on the main shop; comprehensive catalogue "1000s" | CAT-01 to CAT-15, CAT-17, CAT-18, CAT-19 | **Covered with a stated limit:** the spec ships treatment **names** (703 rows) and the import tools; it cannot lawfully bundle every brand's product data (database right, GS1 terms); products come from the salon's own supplier files (CAT-13) |
| M-34 | 21:45 Treatment taxonomy (13 groups) | CAT-01 | Covered |
| M-35 | 21:45 Treatment fields (duration, segments, patch test, contraindications, skill tier, price or "Prices on request") | CAT-02 | Covered |
| M-36 | 21:45 Product database fields (brand, range, SKU and EAN, size, unit, cost and RRP placeholders, VAT flag, back-bar vs retail, stock) | CAT-06, CAT-07, CAT-15 | Covered |
| M-37 | 21:45 Bulk import (CSV and supplier price lists) scaling to tens of thousands of SKUs with search and filters | CAT-08, CAT-09, CAT-10, CAT-11, CAT-12 | Covered |
| M-38 | 21:45 Real UK sources named for seeding, with licensing limits | CAT-13, CAT-14; research section 2 and 3 | Covered |
| M-39 | 21:45 Seed list with sourced durations, marked [ADDED] | CAT-04; `treatment-catalogue-seed.csv` | Covered |
| M-40 | 21:46 "you didnt do much research": 15+ UK menus, 300+ treatments | Research section 1; 73 menus attempted, 40 contributed, 603 sourced names | Covered |
| M-41 | 21:46 Wholesaler and brand research | Research section 3 | Covered (some brand counts Unverified, stated) |
| M-42 | 21:46 Verify ICO, GOV.UK, HMRC and DMCCA pages | Research section 4; section 7 | Covered (ICO, DMCCA, HMRC: Reported, not opened directly) |
| M-43 | 21:46 Patch-test guidance (NHBF) | PTT-02, research section 5 | Covered |
| M-44 | 21:46 Competitor features in depth | Research section 6 | Covered |
| M-45 | 21:46 Report source counts | Research section 0; final report | Covered |
| M-46 | 21:52 Book treatments | BKJ-01, BKJ-02 | Covered |
| M-47 | 21:52 Choose the branded product used | BKJ-03, CAT-18, NAI-04 | Covered |
| M-48 | 21:52 Special offers going, see and apply | BKJ-04, OFR-01 to OFR-05, OFR-07, OFR-08 | Covered |
| M-49 | 21:52 Select regular artist, therapist or hairdresser, or anyone | BKJ-05, RAB-01 to RAB-05 | Covered |
| M-50 | 21:52 Slot that fits total duration | BKJ-06, TFB-02 | Covered |
| M-51 | 21:52 Add retail to basket | BKJ-07, ORT-10 | Covered |
| M-52 | 21:52 Check out: deposit, full pay or pay in salon, via Stripe | BKJ-08, BKJ-09, BKJ-17 | Covered |
| M-53 | 21:52 Mail order service for selected products chosen by SalonOS | ORT-01 to ORT-20, ORT-22, ORT-23 | **Covered, one reading to confirm:** "chosen by salonOS" is read as chosen **by the salon in SalonOS**, not a curated range sold by the Site Operator (OI-01) |
| M-54 | 21:52 Some products in shop only (channel flag) | ORT-02, ORT-03 | Covered |
| M-55 | 21:52 Delivery options and placeholder shipping rates | ORT-05, ORT-06 | Covered |
| M-56 | 21:52 Fulfilment, dispatch and tracking emails | ORT-11, ORT-12, ORT-13 | Covered |
| M-57 | 21:52 Stock shared with the till | ORT-03, DAT-02 | Covered |
| M-58 | 21:52 Click and collect | ORT-05, ORT-09 | Covered |
| M-59 | 21:52 CCR 14-day returns, hygiene exception verified from legislation | ORT-15, ORT-16, ORT-17; research 4.1 | Covered (adviser to confirm wording) |
| M-60 | 21:52 Distance-selling pre-contract information | ORT-14, BKJ-09 | Covered |
| M-61 | 21:52 Competitor retail and add-on research, courier rates | Research sections 6 and 7 | Covered |
| M-62 | 21:53 "make sure everything stays together": instructions log | `00c-tony-instructions-log.md` | Covered (21:45 now in Tony's own words; 21:39 is the parent's written "verbatim summary", flagged in OI-17) |
| M-63 | 21:53 Traceability matrix | Section 9 | Covered |
| M-64 | 21:53 Integrated end-to-end flow section | Section 5, DAT-01 to DAT-07 | Covered |
| M-65 | 21:53 Report the coverage result | Section 9.3 and the final report | Covered |
| M-66 | 21:53 One client record, one stock ledger, one payments ledger | DAT-01, DAT-02, DAT-03 | Covered |
| M-67 | 22:53 Keep all previously approved real-shop items (processing segments, external-card tender, tips ledger, offline diary and cash, formulas, back-bar, goods-in, stock take, in-shop gift vouchers, rent-a-chair basic, mail order and click and collect) | DIA-10, TIL-11, TIL-12, TIP-01 to TIP-09, OFF-01 to OFF-09, COL-01 to COL-05, COL-08, STK-02, STK-03, GFT-01 to GFT-04, RNT-01 to RNT-06, ORT-01 to ORT-20, ORT-22, ORT-23 | Covered |
| M-68 | 22:53 Deposit default stays 20% or £15 (higher), fully editable per service | SVC-06, BKJ-08 | Covered |
| M-69 | 22:53 The deposit must be editable per salon as well as per service | SVC-06, SVC-15 | Covered |
| M-70 | 22:53 New products default to in-shop only | ORT-02, D9 | Covered (locked) |
| M-71 | 22:53 One site only | DAT-05, T1, OUT-02, D21 | Covered (locked; `site_id` is a hook only) |
| M-72 | 22:53 Strike any Stage 2 proposal not required for a single high-street shop to run diary, till, cash-up and formulas on day one | Section 11.6 (37 struck), 72 kept | Covered |
| M-73 | 22:53 Keep the optional marketplace as a stub only | MKS-01, MKS-02, OUT-20, section 11.6 | Covered as a stub only |
| M-74 | 22:53 Hosting: Cloudflare Pages preview | OUT-08, section 6 | Covered |
| M-75 | 22:53 The 703-treatment seed must be freely editable and deletable by the salon | CAT-04, CAT-17, CAT-19 | Covered |
| M-76 | 22:53 Proceed to Stage 3 (Legal and Contracts plus Compliance): draft all documents marked "Draft, not legal advice"; stop for approval; no build | `03-legal/`, `03-checkpoint-summary.md` | Covered (Stage 3 approved 23:58 with fine-tunes; fine-tunes delivered, awaiting Tony) |
| M-77 | 22:53 Save this message verbatim; replace the relayed 21:39 and 21:45 entries in the log with Tony's originals (OI-17) | `00c-tony-instructions-log.md`, OI-17 | Covered (21:45 replaced; 21:39 original not available to me, flagged) |
| M-78 | 23:58 Stage 3 approved with six fine-tunes: (1) home-visit and wedding booking agreement; (2) declined-test wording strengthened; (3) deposit and no-show fee editable, no-show cap; (4) gift vouchers in-shop only, VAT left to the adviser; (5) Operator privacy notice extracted; (6) under-16 manufacturer check | `03-legal/` documents 01, 03, 09, 22 and 23 (clause references in `03-checkpoint-summary.md`), PTT-05, PTT-06, TIL-13, TIL-14, HEV-05, OI-18 | Covered (fine-tunes delivered, awaiting Tony) |

### 9.3 Part C: supporting requirements (not tied to one brief clause or Tony message)

These rows exist so the named features work safely and legally in a real shop. Each carries its own source tag in its row. They are listed here so the reverse check (9.5) has no orphan.

| Group | Requirement IDs | What they support |
|---|---|---|
| Diary integrity | DIA-09, DIA-11, DIA-13, DIA-15 | No double booking, soft holds, multi-service bookings, cancellations |
| Client data protection | CLI-08 to CLI-10, ROL-04, ROL-05, ROL-09, CMP-02, CMP-03 | Health flags, access and erasure, consent, audit, operator placeholders |
| Roles and permissions | ROL-01, ROL-10, ROL-11, ROL-12 | Server-side permissions, import, fulfilment and campaign permissions |
| Money integrity | TIL-15, TIL-19 to TIL-22, LOY-09, PRM-07, RET-02, RET-06 | Drawer, paid in and out, append-only ledger, idempotent webhooks, VAT, refunds reversing points, voucher is not a promo |
| Stock upkeep | STK-01 | Stock screen |
| Booking journey robustness | BKJ-11 to BKJ-13, BKJ-16, ONL-09, ONL-11 to ONL-14, STF-07, STF-08, SVC-04 | Patch-test gate, back and forward, guest or sign-in, server-side pricing, accessibility, rota, staff profile, price types |
| Messaging | MSG-01, MSG-05, MSG-06 | Reminders, opt-out, provider placeholders |
| Reporting and attention | RPT-01, RPT-03, ADM-12 | Takings, liabilities, needs-attention list |
| Non-functional | NFR-04, NFR-05, NFR-08 | Backups, security, data location |
| Struck by Tony 22:53 (kept word for word, not built in v1) | Section 11.6: 47 rows | Marketplace rows (MKT-01 to MKT-09, FIN-09, ROL-08) and 37 Stage 2 proposals |
| Deferred or excluded (Out of v1) | OUT-06 to OUT-19 | Items not built in v1 with a reason; OUT-01 to OUT-05 and OUT-20 are mapped to Tony's deferrals above |

### 9.4 Coverage result

| Measure | Result |
|---|---|
| Brief clauses checked (Part A) | **101** |
| Tony messages and clauses after the brief checked (Part B) | **77** (66 earlier, 11 added from Tony's 22:53 message) |
| Requirement rows (excluding OUT scope rows) | **304** in 33 module and cross-cutting groups (347 before Tony's 22:53 strike: 47 moved to section 11.6, 4 added) |
| Out of v1 scope rows | **20** (OUT-01 to OUT-20) |
| Brief clauses **Covered** or **Covered, extended** | 94 |
| Brief clauses **Covered with a stated limit** | 1 (B-14, small group of shops: single site in v1, deferred by Tony) |
| Brief clauses for **later stages** (B-90, B-91, B-92, B-94, B-95) | 5 (none is a product feature) |
| Brief clause already done in Stage 1 (B-88) | 1 |
| Tony clauses **Deferred by Tony** | 5 (M-24: offline card, multi-site, supplier ordering, advanced waitlist; M-07 to M-10: marketplace artist adverts, enquiries, payments and commission, now a stub only) |
| Tony clauses **Covered with a stated limit** | 1 (M-33: "1000s" catalogue is names and tools, not bundled brand product data) |
| Tony clauses **Covered, one reading to confirm** | 1 (M-53: "chosen by salonOS", OI-01, D9) |
| Tony clauses **Covered** (including the stub-only and locked ones) | 70 |
| Clauses with status **GAP** | **0** |
| Requirement IDs referenced in the matrix that do not exist | **0** |
| Requirement IDs that appear in no matrix row | **0** |

**What Tony should know about the limits:** (0) the marketplace is a stub only since 22:53, so M-07 to M-10 are deferred, not built; (1) one site only in v1, as he decided; (2) the catalogue can hold tens of thousands of products and ships 703 treatment names, but real brand product data has to come from the salon's own supplier files for licensing reasons (CAT-13); (3) "chosen by SalonOS" is read as chosen by the salon, to be confirmed (D9).

### 9.5 Reverse check (requirements to sources)

A script (re-run after Tony's 22:53 changes) read every requirement ID defined in sections 2 to 8 (304 requirements plus 20 OUT rows) and every ID cited in section 9 (expanding "X-01 to X-09" ranges; struck IDs are cited only in the stub rows, which point to section 11.6). Result: **every defined ID is cited at least once, and every cited ID exists.** Where a requirement is a supporting item, it is cited in Part C with its purpose. The check is repeated in the final report. Any new requirement added later must be added to section 9 or the check fails.


---

## 10. Files, build order and what later stages inherit

### 10.1 Files for this stage

| File | What it is |
|---|---|
| `02-product-spec.md` | This spec |
| `02-checkpoint-summary.md` | Short plain-words summary for Tony |
| `_research/stage2-deep-research.md` | Deep research record with source counts |
| `_research/treatment-catalogue-seed.csv` | 703-row treatment name seed with sources and confidence |
| `00c-tony-instructions-log.md` | Every Tony message with a time stamp |
| `03-legal/` and `03-checkpoint-summary.md` | Stage 3 legal and compliance drafts (Draft, not legal advice) |
| `task-log.md` and `/workspace/master-task-log.md` | Stage log |

### 10.2 Proposed build order for Stage 8 (after Tony's approvals) [ADDED – Stage 2 proposal]

1. Foundations: sites, roles, audit log, ledgers (DAT, ROL).
2. Catalogue and import (CAT), because every other module reads it.
3. Diary, clients, staff, services, patch tests (DIA, CLI, STF, SVC, PTT, TFB).
4. Till, payments, stock, formulas, tips, vouchers, cash-up (TIL, RET, STK, COL, TIP, GFT, RNT).
5. Online booking journey and offers (BKJ, RAB, OFR, ONL, HEV, NAI).
6. Online shop (ORT).
7. Loyalty points and club (LOY, LYC), messaging (MSG).
8. Offline (OFF), finance outbox and reports (FIN, RPT, ADM).
9. **Marketplace: stub only (MKS-01, MKS-02). Nothing else is built.**

### 10.3 What later stages inherit

Stage 3 (legal) uses section 7 and the compliance table. Stage 4 (quotes and invoices) uses [VAT NUMBER] and [OPERATOR VAT POSITION]. Stage 8 (builder) acceptance tests are the acceptance column of every requirement. **Stage 3 (legal and compliance drafts) is approved with fine-tunes (23:58); the 23 documents in `03-legal/` are delivered and await Tony's review of the fine-tunes. No build.**

---

## 11. Open items, placeholders and defaults

### 11.1 Placeholders (Tony or the salon fills; none is invented)

Standing: [OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL], [VAT NUMBER], [OPERATOR VAT POSITION], [ICO REGISTRATION], [DATABASE HOST], [EMAIL PROVIDER].
Spec-specific: [SMS PROVIDER], [WHATSAPP PROVIDER], [ACCOUNTING PACKAGE – Tony to choose later], [COMMISSION %], [PAYOUT DAY], [PRICE – Tony to set], [PRICE DIFFERENCE – Tony to set], [SHIPPING RATE – Tony to set], [FREE SHIPPING THRESHOLD], [TRAVEL FEE – Tony to set], [HOLD MINUTES], [TIP POLICY – salon writes], [PATCH TEST VALIDITY – salon sets], [PATCH TEST RETENTION – salon sets], [MEMBERSHIP BENEFITS – Tony to define], [VOUCHER VAT TREATMENT – adviser].

### 11.2 Defaults (locked, parked, or still to confirm)

Tony's 22:53 message locked D8, D9 (default part), D18 and D21. D1 to D4, D14 and D15 are parked. The rest stay marked [DEFAULT – Tony to confirm] and are used as working defaults; Stage 3 drafts follow them.

| ID | Default | Where |
|---|---|---|
| D1 to D4 | **PARKED** (Tony 22:53, marketplace stub only): merchant of record; optional module; commission and payout placeholders; vetting | MKS |
| D5, D6 | See section 1.3: nail prices "Prices on request"; free loyalty club with email and web push, SMS optional. Still [DEFAULT – Tony to confirm] | NAI, LYC |
| D7 | Prices round to the nearest penny | SVC-03 |
| D8 | **LOCKED (Tony 22:53).** In-shop gift vouchers only; online voucher purchase is out of v1 | OUT-15 |
| D9 | "Mail order for selected products chosen by salonOS" means the **salon chooses** which products sell online; new products default to **in shop only** (the default part is **LOCKED, Tony 22:53**; the reading of "chosen by salonOS" stays OI-01) | ORT-02 |
| D10 | Pay-in-salon at online checkout is allowed only with a card on file where the salon requires it | BKJ-08 |
| D11 | Loyalty points on online shop orders are earned at dispatch and reversed on refund | ORT-20 |
| D12 | Commission base is net-of-VAT price actually earned after discount | STF-03 |
| D13 | Points basis is amount paid after discount, excluding tips, VAT-inclusive; fractions round down | LOY-01 |
| D14 | PARKED: accounting treatment of points is an adviser matter (LOY-10 deferred, section 11.6) | – |
| D15 | PARKED: loyalty points on vouchers (GFT-07 deferred, section 11.6) | – |
| D16 | One desk device queues offline writes | OFF-09 |
| D17 | Seeded services default to Tier-multiplied except add-ons and packages (Fixed) | SVC-04 |
| D18 | **LOCKED (Tony 22:53).** Deposit = greater of 20% and £15, never more than the price; editable per service and per salon | SVC-06, SVC-15 |
| D19 | Soft opt-in for email marketing is off by default | LYC-07 |
| D20 | No automatic swap of a client's regular artist | RAB-04 |
| D21 | **LOCKED (Tony 22:53): one site only.** `site_id` stays in the data only as a hook (DAT-05); no multi-site screens | T1, DAT-05 |

### 11.3 Open items

| ID | Item | Owner |
|---|---|---|
| OI-01 | Meaning of "chosen by salonOS" (D9) | Tony |
| OI-02 | VAT registration and position of the salon and Site Operator | Adviser |
| OI-03 | VAT on vouchers | Adviser |
| OI-04 | VAT and status of chair rental | Adviser |
| OI-05 | Whether salon appointments fall under CCR reg 28(1)(h) | Adviser |
| OI-06 | Nail art tier names and prices | Tony |
| OI-07 | Monthly Membership benefits | Tony |
| OI-08 | Commission % and payout day (marketplace stub; only if built later) | Tony |
| OI-09 | Price differences for branded product options | Tony or the salon |
| OI-10 | Shipping rates, free-over threshold, courier choice | Tony or the salon |
| OI-11 | Which products are online, which are "sealed hygiene", "personalised" or "not for post" | The salon |
| OI-12 | Whether any card-cost exception exists for tips | Adviser, Stage 3 |
| OI-13 | Accounting package | Tony, later |
| OI-14 | Unverified research items: Louis Mariette, CND Shellac colour count, ICO pages not opened directly | Research |
| OI-15 | Whether the Site Operator is a digital platform operator (marketplace stub; only if built later) | Adviser |
| OI-16 | Courier restrictions on aerosols, flammable and similar goods | The salon, per courier |
| OI-17 | **Partly closed 22:53 / 23:xx:** the 21:45 entry now carries Tony's own words. The 21:39 entry carries the parent's written 'verbatim summary' and the instruction quoted in the Stage 2 brief; Tony's long original 'Stage 1 review' message was not passed to me, so the parent should supply it if it must be exact. | Parent agent |
| OI-18 | **Added 23:58:** the Operator privacy notice (LEG-23) is a placeholder until Tony supplies the Operator's legal name, address, email, VAT and ICO details; an adviser must review it and it must be published before any salon signs up. Also open from Tony's fine-tunes: the salon's insurer position on declined patch tests, the under-16 policy and manufacturer check, and the VAT treatment of gift vouchers (OI-03). | Tony and the adviser |

### 11.4 Research source counts

Menus attempted 73; contributing 40; sourced treatment names 603; seed rows 703; durations sourced 203; brands covered 17; wholesalers 5 (one Unverified); legislation pages read 8; competitor vendors compared 7; courier services compared 3. Details and gaps: `_research/stage2-deep-research.md`.

### 11.5 Requirement counts (after Tony's 22:53 strike)

**Requirements total: 304** (was 347; 47 rows moved to section 11.6; 4 added: SVC-15, CAT-19, MKS-01, MKS-02). OUT scope rows: 20.

| Group | Now | Before 22:53 | Group | Now | Before 22:53 |
|---|---|---|---|---|---|
| ROL roles | 11 | 12 | DIA diary | 14 | 16 |
| CLI client | 11 | 12 | SVC services | 15 | 14 |
| PTT patch tests | 7 | 8 | COL colour | 6 | 8 |
| TIL till | 22 | 22 | RET retail | 6 | 6 |
| STK stock | 4 | 6 | TIP tips | 9 | 9 |
| GFT vouchers | 4 | 8 | STF staff | 8 | 8 |
| RNT renters | 6 | 6 | PRM promos | 7 | 7 |
| LOY loyalty | 9 | 10 | ONL online booking | 14 | 14 |
| OFF offline | 9 | 10 | FIN finance | 9 | 10 |
| MSG messaging | 4 | 7 | ADM admin | 14 | 14 |
| RPT reports | 2 | 5 | CAT catalogue | 18 | 18 |
| NAI nails | 5 | 6 | TFB treatment-first | 6 | 8 |
| RAB regular artist | 5 | 5 | HEV home and events | 6 | 7 |
| LYC loyalty club | 10 | 12 | OFR offers | 7 | 9 |
| BKJ booking journey | 17 | 18 | ORT online shop | 22 | 23 |
| MKS marketplace stub | 2 | 0 | DAT data | 7 | 7 |
| CMP compliance | 3 | 3 | NFR non-functional | 5 | 10 |

MKT is now 0 (stub only: MKS). By source tag (a row may carry more than one; counted by a script over the requirement rows): [BRIEF] 97; [ADDED – Stage 1 approval] 47; [ADDED – Amendments 01] 26; [ADDED – Tony steer 21:45] 15; [ADDED – Tony 21:52] 41; [ADDED – Tony 21:53] 10; [ADDED – pipeline-rules] 7; [ADDED – Tony steer 20:49 GMT, relayed] 1; [ADDED – Stage 2 proposal] 72; [ADDED – Tony 22:53] 5; [LOCKED – Tony 22:53] 2; [DEFAULT – Tony to confirm] 8. **[ADDED – Stage 2 proposal] is now 72 (was 109); 37 were struck by Tony.**

### 11.6 Deferred (struck by Tony 22:53)

Tony, 22:53 GMT, 31 Oct 2026: "Strike any Stage 2 proposal that is not required for a single high-street shop to run diary, till, cash-up and formulas on day one. Keep the optional marketplace as a stub only." Nothing is deleted. Every struck row is kept here word for word with the reason it is not needed on day one. If Tony later asks for one back, it returns with its ID.

**Counts.** Stage 2 proposals: 109 in the earlier version, **72 kept, 37 struck**. In addition, **10 non-proposal marketplace rows** (MKT-01 to MKT-07, MKT-09, FIN-09, ROL-08) moved here because the marketplace is a stub. In total **47 rows** are in the tables below. Four rows were added (SVC-15, CAT-19, MKS-01, MKS-02).

**Kept proposals (72):** ROL-01, ROL-04, ROL-05, ROL-09, DIA-09, DIA-11, DIA-12, DIA-13, DIA-15, CLI-06, CLI-08, CLI-09, CLI-10, PTT-02, PTT-03, PTT-04, PTT-05, PTT-06, PTT-08, COL-02, TIL-13, TIL-14, TIL-15, TIL-18, TIL-19, TIL-20, TIL-21, TIL-22, TIP-07, STF-07, PRM-06, PRM-07, LOY-08, LOY-09, ONL-09, ONL-11, ONL-12, ONL-13, ONL-14, OFF-05, OFF-06, OFF-07, OFF-09, FIN-02, FIN-03, FIN-04, FIN-05, FIN-07, MSG-05, ADM-12, ADM-14, RPT-01, CAT-17, HEV-07, LYC-05, LYC-06, LYC-07, OFR-08, BKJ-09, BKJ-11, BKJ-16, BKJ-17, ORT-04, ORT-07, ORT-18, DAT-05, DAT-06, DAT-07, CMP-02, NFR-04, NFR-05, NFR-08.

**Struck proposals that kept rows pointed to** were checked: DIA-11 and ORT-04 stay because the booking-journey, treatment-first and online shop rows depend on them.

#### Struck Stage 2 proposals (37)

| ID | Module | Requirement (original text) | Original source | Original acceptance criteria | Why not needed on day one |
|---|---|---|---|---|---|
| DIA-14 | 3.1 Diary and booking (shop and online): DIA | **Rota-change clash list:** changing a staff member's hours or holiday shows the clients already booked that are affected. | [ADDED – Stage 2 proposal] (research 8.8) | A rota edit that clashes lists every affected booking with the client's phone. | Convenience. Reception can check clashes by eye on the diary on day one. |
| DIA-16 | 3.1 Diary and booking (shop and online): DIA | **Every booking change is audit-logged** (who, when, before, after). | [ADDED – Stage 2 proposal] | The booking history shows each change. | Sensitive actions are already audit-logged by ROL-05; a full booking-change log is not needed on day one. |
| CLI-11 | 3.2 Client card: CLI | **Merge duplicates** by phone or email, with a log. | [ADDED – Stage 2 proposal] | A merge combines history without losing ledger rows. | Convenience. Duplicates can be edited by hand on day one. |
| PTT-07 | 3.4 Patch tests: PTT | **Reminder** to the client before a colour appointment that a test is needed at least 48 hours earlier. | [ADDED – Stage 2 proposal] | A booking with no valid test triggers the reminder (service message, not marketing). | Convenience reminder; the 48-hour rule itself (PTT-02) is kept. |
| COL-06 | 3.5 Colour formulas, processing and back-bar stock: COL | **Fallback allowance:** for a service with no formula recorded, the owner can set a per-service allowance that deducts instead. Default is off. | [ADDED – Stage 2 proposal] (research 8.10) | When on, completing the service deducts the allowance. | Not needed to record and deduct a formula (COL-01 to COL-05 kept). |
| COL-07 | 3.5 Colour formulas, processing and back-bar stock: COL | **Colour cost vs charged report:** cost of product used per service against price charged, by stylist. | [ADDED – Stage 2 proposal] (uses COL-01 and goods-in cost) | Report shows cost, charge and margin for a date range. | Report, not needed to run formulas on day one. |
| STK-05 | 3.8 Stock: goods-in, stock take, back-bar: STK | **Suppliers list** (name, contact, notes) for goods-in. | [ADDED – Stage 2 proposal] (needed by STK-02) | A supplier can be added and selected. | Supplier name can be typed on goods-in (STK-02); no separate list needed on day one. |
| STK-06 | 3.8 Stock: goods-in, stock take, back-bar: STK | **Stock value report** at cost. | [ADDED – Stage 2 proposal] | Sum of on-hand × cost matches the line items. | Report, not needed on day one (stock count STK-03 kept). |
| GFT-05 | 3.10 Simple gift vouchers: GFT | **Expiry** is an optional setting, **off by default**, and not hard-coded. The legal position on expiry is **not verified**. | [ADDED – Stage 2 proposal] (research 8.9) | With expiry off, vouchers never expire. A set date is enforced at redemption. | Optional setting. Day one vouchers have no expiry unless the salon writes one in its own terms. |
| GFT-06 | 3.10 Simple gift vouchers: GFT | **Lost or void voucher** by a manager with a reason. | [ADDED – Stage 2 proposal] | A voided voucher cannot be redeemed. Logged. | Rare event; can be handled as a manual adjustment with a note on day one. |
| GFT-07 | 3.10 Simple gift vouchers: GFT | **Loyalty points on vouchers** [DEFAULT – Tony to confirm]: points are earned **when the voucher is redeemed against services or retail, not when it is sold.** | [ADDED – Stage 2 proposal] (brief: points only after final payment, on completed paid services and retail) | Selling a voucher gives no points. Redeeming one on a completed service does, on the amount redeemed. | Loyalty points on vouchers are not needed on day one (D15 now parked). |
| GFT-08 | 3.10 Simple gift vouchers: GFT | **Voucher balance check** by code at the till. | [ADDED – Stage 2 proposal] | Entering a code shows balance and status. | Balance is shown on the voucher record (GFT-02); a dedicated lookup is a convenience. |
| LOY-10 | 3.14 Loyalty points: LOY | **Points are treated as a marketing cost recorded at redemption, not an accrued liability** [DEFAULT – Tony to confirm; accountant to confirm]. | [ADDED – Stage 2 proposal] (research 8.9) | The finance posting at redemption shows a discount line. No liability account is created for points. | Accounting treatment is an adviser matter, not a product requirement (D14 parked). |
| OFF-10 | 3.16 Offline diary and cash sales queue: OFF | **Offline marketplace, loyalty-club and online booking pages are not offline features.** | [ADDED – Stage 2 proposal] | Public pages need the internet and show a clear error offline. | Statement of what is not offline; already covered by OUT-01 and OUT-14. |
| MSG-03 | 3.18 Reminders and messaging: MSG | **Send log** with delivery status and cost per message. | [ADDED – Stage 2 proposal] (research 8.13) | Owner can see sent, delivered, failed and cost. | Reporting feature. Provider dashboards show delivery on day one. |
| MSG-04 | 3.18 Reminders and messaging: MSG | **Monthly cap** set by the salon, with a warning before the cap. | [ADDED – Stage 2 proposal] (research 8.13) | Sends stop at the cap and the owner is told. | Cost control feature, not needed on day one (costs pass through, MSG-02). |
| MSG-07 | 3.18 Reminders and messaging: MSG | **Message prices are shown only as Verified or Reported benchmarks** in the admin help, never as promised prices. | [ADDED – Stage 2 proposal] (never invent numbers) | Help text cites the source and date. | Help-text rule only. |
| RPT-02 | 3.20 Basic owner reports: RPT | **No-show and late-cancel list and rate.** | [ADDED – Stage 2 proposal] (brief says track no-shows) | List by client and date. | Report. No-shows are recorded (DIA-07) and visible on the client card (CLI-02). |
| RPT-04 | 3.20 Basic owner reports: RPT | **Every report shows its definition on screen.** | [ADDED – Stage 2 proposal] (research 8.11) | Definition text is visible on each report. | Report presentation rule, not day one. |
| RPT-05 | 3.20 Basic owner reports: RPT | **No benchmark numbers** from vendor blogs are shown as targets in the product. | [ADDED – Stage 2 proposal] (those ranges are Unverified) | None appear in the interface. | Help-text rule only. |
| CAT-16 | 3.21 Catalogue: treatments and products at scale: CAT | **Catalogue change log:** every create, edit, price change, import and delete is logged. | [ADDED – Stage 2 proposal] (supports the finance API and audit) | The history of a product shows who changed what and when. | Audit log of catalogue edits is not needed on day one. |
| NAI-06 | 3.22 Nails menu, design tiers and ranges: NAI | **Nail services need no patch test by default** but the flag can be set per service (for example acrylic or gel allergy history). | [ADDED – Stage 2 proposal] | The salon can switch the flag on. | Per-service patch-test flag already exists (SVC-13); nail-specific rule is redundant. |
| TFB-05 | 3.23 Treatment-first booking and duration fitting: TFB | **Buffers:** the salon can set clean-down or setup minutes per treatment. | [ADDED – Stage 2 proposal] | A buffer reduces the next available slot. | Buffers are a refinement; duration already includes setup (SVC-01). |
| TFB-08 | 3.23 Treatment-first booking and duration fitting: TFB | **If no slot fits,** the client sees the next dates, can try another artist, or can ask for a call-back (no automated waitlist, OUT-04). | [ADDED – Stage 2 proposal] | A fully booked treatment shows next available dates. | Online refinement; a client with no slot can phone the salon on day one. |
| HEV-06 | 3.25 Home visits, weddings and events: HEV | **Trial appointments** can be linked to an event booking. | [ADDED – Stage 2 proposal] | A trial links to the event record. | Refinement of event bookings, not day one. |
| LYC-08 | 3.26 Online loyalty club: LYC | **Frequency cap and quiet hours** set by the owner. | [ADDED – Stage 2 proposal] | A member is not sent more than the cap in a week. | Refinement; the owner controls sends manually on day one. |
| LYC-09 | 3.26 Online loyalty club: LYC | **Web push** works for browsers; on iPhone it needs the member to add the web app to the Home Screen (iOS 16.4 or later). The member page says so. | [ADDED – Stage 2 proposal] (research, Stage 1) | The page shows the iPhone steps. | Informational note about iPhone web push; not a requirement. |
| OFR-06 | 3.27 Offers and special offers: OFR | **Usage limits and dates** per offer (total, per client). | [ADDED – Stage 2 proposal] | An offer stops at its limit. | Refinement of offers. |
| OFR-09 | 3.27 Offers and special offers: OFR | **Offers do not apply to gift vouchers or to deposits already paid.** | [ADDED – Stage 2 proposal] | A voucher line shows no discount. | Rule for edge cases of offers; PRM-04 and voucher-as-tender cover day one. |
| BKJ-18 | 3.28 The end-to-end online booking journey: BKJ | **Accessibility and phone-first design** (ONL-13): the whole journey works on a phone, with keyboard and screen reader. | [ADDED – Stage 2 proposal] | The journey passes the automated WCAG check and a manual keyboard run. | Duplicate of ONL-13 (accessibility) which is kept. |
| ORT-21 | 3.29 Online shop: mail order and click and collect: ORT | **Commission on online retail:** attributed to a named staff member only where a staff recommendation link was used (a salon setting), otherwise none. | [ADDED – Stage 2 proposal] | A sale with a staff link credits that staff member's retail commission. | Commission on online sales is not needed on day one. |
| MKT-08 | 3.30 Optional extra: UK-wide mobile artist marketplace: MKT | **HMRC platform reporting** and employment-status flags are **adviser items**, not built into v1-lite (research 4.5). | [ADDED – Stage 2 proposal] | The help text lists them. | Optional marketplace reduced to a stub only by Tony (22:53). The full text is kept here for a later phase. |
| NFR-02 | 5.4 Failure cases the flow must survive | **Speed [TARGET]:** diary opens in 2 seconds or less on shop broadband; client search in 1 second or less; slot search 2 seconds or less; product search 1 second or less at 50,000 products (CAT-11). | [ADDED – Stage 2 proposal] | Measured on real hardware at Stage 8. | Performance targets; not needed to run the shop on day one. |
| NFR-03 | 5.4 Failure cases the flow must survive | **Availability [TARGET]:** shop functions (diary read, cash sale) keep working through internet loss (OFF). Online booking and shop depend on the host's uptime, shown on a status line. | [ADDED – Stage 2 proposal] | Offline test passes. | Availability target; offline behaviour is specified in OFF-01 to OFF-09. |
| NFR-06 | 5.4 Failure cases the flow must survive | **Accessibility:** WCAG 2.2 AA for public pages (ONL-13, BKJ-18). | [ADDED – Stage 2 proposal] (extends ONL-13) | Automated and manual check. | Duplicate of ONL-13, which is kept. |
| NFR-07 | 5.4 Failure cases the flow must survive | **Devices:** Chrome, Safari, Edge current versions; PC, iPad, Android tablet, phone view for stylists. | [ADDED – Stage 2 proposal] | Test on each at Stage 8. | Device list; tested in the build stage. |
| NFR-09 | 5.4 Failure cases the flow must survive | **Observability:** an error log, a failed-posting list, and a "needs attention" page (ADM-12). | [ADDED – Stage 2 proposal] | A forced error shows in the log and on the page. | Observability; not needed on day one (ADM-12 needs-attention list is kept). |

#### Marketplace rows moved to stub-only (10)

| ID | Module | Requirement (original text) | Original source | Original acceptance criteria | Why not needed on day one |
|---|---|---|---|---|---|
| ROL-08 | 2.2 Requirements | **Marketplace separation (optional module, MKT-01):** an Artist cannot see salon clients, salon staff, salon takings or other artists' data. | [ADDED – Amendments 01] | Artist test account gets "not allowed" for every salon and other-artist record. | Optional marketplace reduced to a stub only by Tony (22:53). The full text is kept here for a later phase. |
| FIN-09 | 3.17 Finance API and ledger: FIN | **Marketplace postings (optional module only):** client payment, commission, artist payable, payout, refund and fee lines post with the booking ID. | [ADDED – Amendments 01] | A marketplace booking produces a payment line, commission line and artist payable line. | Optional marketplace reduced to a stub only by Tony (22:53). The full text is kept here for a later phase. |
| MKT-01 | 3.30 Optional extra: UK-wide mobile artist marketplace: MKT | **Module switch:** the marketplace is off unless the owner turns it on. With it off, no marketplace screen, role or data exists. | [ADDED – Tony steer 21:45] | A site with the switch off shows no marketplace feature. | Optional marketplace reduced to a stub only by Tony (22:53). The full text is kept here for a later phase. |
| MKT-02 | 3.30 Optional extra: UK-wide mobile artist marketplace: MKT | **Artist profile and advert:** name, services, area covered (UK regions or postcode radius), photos, own prices (placeholders until set). Vetting is done by a person at the Site Operator before listing (ID, qualifications, insurance; [DEFAULT – Tony to confirm] D4). | [ADDED – Amendments 01] (A6) | An unvetted artist is not listed. | Optional marketplace reduced to a stub only by Tony (22:53). The full text is kept here for a later phase. |
| MKT-03 | 3.30 Optional extra: UK-wide mobile artist marketplace: MKT | **All enquiries go through the site** (no direct contact details published); the site relays messages and bookings. | [ADDED – Amendments 01] (A6) | A listing shows no phone or email. | Optional marketplace reduced to a stub only by Tony (22:53). The full text is kept here for a later phase. |
| MKT-04 | 3.30 Optional extra: UK-wide mobile artist marketplace: MKT | **Signed contract before listing:** the artist signs the agreement with the agreed commission **[COMMISSION %]** and payout day **[PAYOUT DAY]** (placeholders); the signed copy is stored and the version recorded. | [ADDED – Amendments 01] (A7) | An artist cannot be listed or paid without a stored signed agreement. | Optional marketplace reduced to a stub only by Tony (22:53). The full text is kept here for a later phase. |
| MKT-05 | 3.30 Optional extra: UK-wide mobile artist marketplace: MKT | **Scheduled payout:** a regular payout date per artist, statement per period, via Stripe Connect Express in test mode in the preview. | [ADDED – Amendments 01] (A7) | A test payout run produces a statement and a payout record. | Optional marketplace reduced to a stub only by Tony (22:53). The full text is kept here for a later phase. |
| MKT-06 | 3.30 Optional extra: UK-wide mobile artist marketplace: MKT | **Commission and payable** posted to the ledger (FIN-09). | [ADDED – Amendments 01] (A7) | A booking produces payment, commission and payable lines. | Optional marketplace reduced to a stub only by Tony (22:53). The full text is kept here for a later phase. |
| MKT-07 | 3.30 Optional extra: UK-wide mobile artist marketplace: MKT | **Merchant of record is the Site Operator** [DEFAULT – Tony to confirm] (D1); refunds and disputes sit with the site. | [DEFAULT – Tony to confirm] | The receipt shows the Site Operator. | Optional marketplace reduced to a stub only by Tony (22:53). The full text is kept here for a later phase. |
| MKT-09 | 3.30 Optional extra: UK-wide mobile artist marketplace: MKT | **Separation:** an Artist sees none of the salon's data (ROL-08). | [ADDED – Amendments 01] | As ROL-08. | Optional marketplace reduced to a stub only by Tony (22:53). The full text is kept here for a later phase. |

#### Role-matrix rows removed (marketplace stub)

Preserved text of the two permission-matrix rows removed from section 2: "Marketplace listings (optional)": Artist: own R/W; Site Operator Admin: R/W moderate; public: R. "Artist vetting, contracts, payouts": Artist: own R; Site Operator Admin: R/W.


---

## Appendix A. Locked service catalogue (copied exactly from the brief)

Prices are the brief's base prices and **do not change without Tony's yes**. The tier rule is SVC-03.

| Ref | Category | Item as in the locked brief |
|---|---|---|
| A1 | Hair – Cutting & Styling | Ladies Cut & Blow Dry Short – 45 min – Base £42 |
| A2 | Hair – Cutting & Styling | Ladies Cut & Blow Dry Long – 60 min – Base £52 |
| A3 | Hair – Cutting & Styling | Mens Cut – 30 min – Base £22 |
| A4 | Hair – Cutting & Styling | Restyle Cut – 75 min – Quote only |
| A5 | Hair – Cutting & Styling | Blow Dry Short – 30 min – Base £28 |
| A6 | Hair – Cutting & Styling | Blow Dry Long – 40 min – Base £36 |
| A7 | Hair – Cutting & Styling | Hair Up (occasion) – 60 min – Base £55 |
| A8 | Hair – Cutting & Styling | Fringe Trim – 15 min – Base £12 |
| A9 | Hair – Cutting & Styling | Child Cut (under 12) – 30 min – Base £18 |
| A10 | Hair – Colour & Chemical | Root Tint – 75 min – Base £48 |
| A11 | Hair – Colour & Chemical | Full Head Colour – 120 min – Base £85 |
| A12 | Hair – Colour & Chemical | Balayage Full – 180 min – Base £130 |
| A13 | Hair – Colour & Chemical | Half Head Highlights – 120 min – Base £95 |
| A14 | Hair – Colour & Chemical | Toner – 30 min – Base £28 |
| A15 | Hair – Colour & Chemical | Colour Correction – 240 min – Quote only |
| A16 | Hair – Colour & Chemical | Keratin Smoothing Short – 150 min – Base £140 |
| A17 | Hair – Colour & Chemical | Keratin Smoothing Long – 180 min – Base £180 |
| A18 | Hair – Treatments | Olaplex Stand-alone Treatment – 30 min – Base £35 |
| A19 | Hair – Treatments | K18 Molecular Repair Treatment – 20 min – Base £40 |
| A20 | Hair – Treatments | Deep Conditioning Mask – 20 min – Base £18 |
| A21 | Hair – Treatments | Scalp Treatment – 30 min – Base £32 |
| A22 | Beauty – Brows & Lashes | Brow Shape & Tint – 20 min – Base £18 |
| A23 | Beauty – Brows & Lashes | Brow Lamination – 45 min – Base £42 |
| A24 | Beauty – Brows & Lashes | Lash Lift & Tint – 60 min – Base £48 |
| A25 | Beauty – Brows & Lashes | Classic Lash Full Set – 90 min – Base £75 |
| A26 | Beauty – Brows & Lashes | Volume Lash Full Set – 120 min – Base £95 |
| A27 | Beauty – Brows & Lashes | Lash Infill – 45 min – Base £42 |
| A28 | Beauty – Nails | Gel Manicure – 45 min – Base £28 |
| A29 | Beauty – Nails | Gel Pedicure – 60 min – Base £35 |
| A30 | Beauty – Nails | Builder Gel Overlay – 60 min – Base £38 |
| A31 | Beauty – Nails | Full Set Extensions – 90 min – Base £48 |
| A32 | Beauty – Nails | Infill – 45 min – Base £32 |
| A33 | Beauty – Waxing | Half Leg – 20 min – Base £18 |
| A34 | Beauty – Waxing | Full Leg – 40 min – Base £32 |
| A35 | Beauty – Waxing | Hollywood – 30 min – Base £38 |
| A36 | Beauty – Waxing | Brazilian – 25 min – Base £34 |
| A37 | Beauty – Waxing | Underarm – 10 min – Base £12 |
| A38 | Beauty – Waxing | Brow Wax – 10 min – Base £10 |
| A39 | Beauty – Waxing | Full Face Wax – 25 min – Base £28 |
| A40 | Beauty – Facials | Express Facial 30 min – Base £38 |
| A41 | Beauty – Facials | Full Facial 60 min – Base £62 |
| A42 | Beauty – Facials | Dermaplaning – 45 min – Base £55 |
| A43 | Beauty – Facials | Hydrafacial-style – 50 min – Base £75 |
| A44 | Packages | Bridal Hair + Makeup – Quote only |
| A45 | Packages | Party Hair Up + Makeup – 90 min – Base £95 |
| A46 | Packages | Monthly Membership – Fixed monthly |
| A47 | Add-ons | Extra 15 min – £12 |
| A48 | Add-ons | Long/Thick Hair Supplement – £8–£15 |
| A49 | Add-ons | Toner Add-on – £18 |
| A50 | Add-ons | Deep Conditioning Add-on – £12 |

## Appendix B. Retail starter list (copied exactly from the brief)

Admin editable. Range-priced items follow RET-05. These 15 items are the **only** products with prices in the spec; no other SKU, EAN or price is supplied anywhere.

| Ref | Item as in the locked brief |
|---|---|
| R1 | Olaplex No.3 100ml – £30 |
| R2 | Olaplex No.4 Shampoo 250ml – £28 |
| R3 | Olaplex No.5 Conditioner 250ml – £28 |
| R4 | Olaplex No.7 Bonding Oil 30ml – £28 |
| R5 | K18 Leave-In Mask 50ml – £70 |
| R6 | K18 Oil 30ml – £55 |
| R7 | Kérastase Elixir Ultime 100ml – £42 |
| R8 | Redken Acidic Bonding Concentrate 300ml – £32 |
| R9 | Moroccanoil Treatment 100ml – £39 |
| R10 | Color Wow Dream Coat 200ml – £25 |
| R11 | ghd Heat Protect 120ml – £20 |
| R12 | Professional shampoo 250ml – £14–£18 |
| R13 | Professional conditioner 250ml – £14–£18 |
| R14 | Hair mask 200ml – £22–£28 |
| R15 | Styling cream/serum – £16–£24 |

## Appendix C. Catalogue seed and research summary

`_research/treatment-catalogue-seed.csv` has 703 rows: 603 names seen on fetched UK menus (cited by URL) and 100 taxonomy-only rows marked Judgement. 203 rows have a sourced typical duration. No price is in the seed. Market price evidence is kept separately in `_research/treatment-price-evidence.csv` and is **never a product default**. Competitor, wholesaler, courier and legal sources are in `_research/stage2-deep-research.md`.
