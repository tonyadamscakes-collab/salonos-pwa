# SalonOS: Stage 2 checkpoint summary

**Stage 2 of 8 (locked v1 product spec). Status: APPROVED by Tony at 22:53 GMT on 31 Oct 2026, with locks (below).** Stage 1 was approved at 21:39 GMT. Draft, not legal advice. No code written. Nothing sent, posted or published. **Stage 3 (legal and compliance drafts) is delivered and awaiting approval:** see `03-checkpoint-summary.md`.
Full spec: `02-product-spec.md`. Research: `_research/stage2-deep-research.md`. Your messages, in order: `00c-tony-instructions-log.md`.

## Tony's 22:53 locks (all applied in the spec)
- Keep every previously approved real-shop item (processing segments, external-card tender, tips ledger, offline diary and cash, formulas, back-bar, goods-in, stock take, in-shop gift vouchers, rent-a-chair basic, mail-order and click and collect).
- **Deposit default stays the greater of 20% or £15**, editable **per service and per salon** (SVC-06, SVC-15).
- **New products default to in-shop only. One site only.**
- Any proposal not needed for one high-street shop to run diary, till, cash-up and formulas on day one is **struck** (37 rows). **Marketplace is a stub only** (MKS-01, MKS-02).
- The **703-treatment seed is freely editable and deletable** by the salon (CAT-19).
- **Hosting: Cloudflare Pages preview.**

## What is in the spec
- **304 requirements** in 33 groups after Tony's 22:53 strike (each with a source tag and a yes/no test), plus **20 "not in v1" rows**. Of the 109 Stage 2 proposals, **72 are kept and 37 are struck**; **10 marketplace rows were also moved to a stub**. The 47 deferred rows are kept in spec section 11.6 with the reason. Four rows were added (SVC-15 deposit per salon, CAT-19 catalogue seed editable and deletable, MKS-01 and MKS-02 marketplace stub).
- **Nothing from your brief is dropped.** The traceability matrix checks 101 brief clauses and 66 of your later messages. Gaps: **0**. Three honest limits are stated (below).
- **One integrated flow** (section 5): one client record, one catalogue, one stock count, one payments ledger. Booking, till, online shop, loyalty club, formulas and finance all use them.

## The 6 points that matter most
1. **Your 7-step booking journey is built in as one flow:** pick treatment, pick the branded product, see and apply offers, pick your regular artist or anyone, pick a slot that fits the total time, add retail, pay by Stripe (deposit, full, or pay in salon). One booking, one payment, one client record.
2. **Mail-order shop** for products the salon chooses, plus click and collect, sharing stock with the till. Each product has a flag: online, in shop only, or both. New products default to **in shop only**.
3. **Catalogue built for thousands of treatments and tens of thousands of products,** with bulk import and search. We ship **703 treatment names** (603 seen on real UK menus with links, 100 filled in from the category list and marked as such). **No SKUs, prices or product data are invented.** Your 15 retail items stay as in the brief.
4. **Real-world rules kept:** no true offline card (UK offline card means insert and PIN, so v1 uses an external card machine tender), diary and cash sales work offline, health data is protected, no-show fees are shown first, tips pass through in full.
5. **Distance-selling law checked against the legislation text:** 14-day cancellation for online goods, with an exception for sealed hygiene items only if the seal is broken. All legal text is "Draft, not legal advice" and needs an adviser.
6. **Marketplace for mobile artists is a stub only** (Tony, 22:53): a switch and data hooks, no screens or flows in v1. Commission, payout day and prices stay placeholders.

## Research behind it
73 menu and source pages tried, 40 gave usable names; 603 sourced treatment names; 203 with a sourced duration; 17 brands; 5 wholesalers; 7 competitors; 8 legislation pages read. Where a page could not be opened, it is marked Reported or Unverified, never presented as checked.

## Three limits to know
1. **One site only in v1** (you deferred multi-site). Every record carries a site ID so more can be added later.
2. **"Every product of every brand"** cannot lawfully be bundled (brand and database rights), so products come from the salon's own supplier price lists by import.
3. **"Chosen by salonOS"** is read as **chosen by the salon inside SalonOS**. Please confirm (D9).

## Defaults to confirm (each marked [DEFAULT – Tony to confirm] in the spec)
D1 to D6 (from Stage 1, section 1.3): merchant of record for the marketplace, marketplace optional, commission and payout placeholders, vetting, nail prices "Prices on request", free loyalty club with email and web push.
D7 round to the nearest penny. **D8 gift vouchers are in-shop only (locked 22:53).** **D9 "chosen by salonOS" means the salon chooses.** D10 pay-in-salon needs a card on file where the salon requires it. D11 points on online orders earned at dispatch. D12 commission on the net price. D13 points on the amount paid. D14 points are a marketing cost. D15 voucher points earned on use. D16 one desk device queues offline. D17 add-ons and packages are fixed price. D18 deposit is the greater of 20% and £15. D19 soft opt-in off. D20 no automatic swap of a regular artist. D21 single site.

## What Tony approved
**Approved by Tony at 22:53 GMT with the locks above.** Stage 3 followed.

## Placeholders kept
[OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL], [VAT NUMBER], [OPERATOR VAT POSITION], [ICO REGISTRATION], [DATABASE HOST], [EMAIL PROVIDER], plus the spec ones in section 11.1 (commission, payout day, prices, shipping rates, travel fee, providers, membership benefits).

## Pre-checkpoint check
Brief reduced: no. Every addition tagged: yes. SKUs or prices invented: no. Placeholders kept: yes. Traceability gaps: 0. Nothing sent or published: yes. Other agents contacted: no.
