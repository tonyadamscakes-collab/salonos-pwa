# SalonOS: Stage 1 checkpoint summary

**Stage 1 of 8 (research). Status: delivered, awaiting Tony's approval.** Draft, not legal advice. Nothing sent, posted or published. Stage 2 has not been started.
Full report: `/workspace/salonos/01-research-report.md` (sources and an Unverified list are at the end).

## What the research found
1. **Crowded market, so SalonOS must win on the working day, not price.** Fresha, Booksy, Salon Iris and Treatwell publish prices from about £10 to £60 a month; Phorest is quote-only. Gaps are narrow: on the pages scanned, "walk-in" and "formula" appear nowhere, and "cash up" only on Phorest. (Keyword scan of public pages, not a product test.)
2. **Tony's prices are plausible.** Cut & blow-dry long £52 vs national median £48 and London £62.50. Full head colour £85 vs £65 national, £85 London. Tier multipliers fit real London price ladders (Headmasters' balayage ladder is 1.36×).
3. **Retail list needs checking.** Six of eleven lines are below current UK list price (K18 Oil is £65 vs Tony's £55). Kérastase 100ml could not be found (now a 75ml refill at £58.50). Olaplex No.5 and Redken could not be confirmed. Prices must stay owner-editable.
4. **The real-world constraint that shapes the build is offline cards.** Stripe's JavaScript SDK and server-driven mode do not support offline. In the UK, offline means insert card and PIN only (no tap). So v1 needs 4G failover plus an "external terminal" tender, and a native app shell later for true offline cards.
5. **Double-booking must be blocked in the database** (Postgres exclusion constraint). Colour needs active and processing segments, because the stylist is free while colour processes.
6. **Law shapes the design:** patch tests and allergies are health data (UK GDPR), no-show fees must be fair and shown before booking (GOV.UK: not excessive, reflect real loss), tips must pass to staff without deductions (from 1 Oct 2024), vouchers and chair rental have specific VAT treatment, and MTD for Income Tax hits sole traders from £50k (Apr 2026), £30k (2027), £20k (2028).
7. **Hardware reality:** the cash drawer opens from the receipt printer (ESC/POS command), and iPad Safari cannot print over USB or Bluetooth from a web page, so use network printers or a small native bridge.

## What Tony is approving
- The research findings and the confidence labels (Verified, Reported, Unverified, Judgement).
- The **recommended positioning**: an independent-salon operating system built around the Saturday rush, competing on owner control, UK compliance and honest pricing.
- The **architecture direction** in section 9 (Postgres as source of truth, local-first PWA, append-only ledger, Stripe, finance adapters) and the v1-for-one-shop vs later split.
- Moving to Stage 2 (specification). A plain "yes" is approval.

## Decisions for Tony (they are proposals, not in the locked brief)
- Include or drop: processing-time segments, external-card tender, tips ledger, offline queue, colour-formula fields (grams, developer, waste), back-bar stock deduction, goods-in and stock takes.
- **Gift vouchers, rent-a-chair split payouts and offline card** are not in the brief. Decide whether they are in v1, later, or out.
- Stripe only, or also support SumUp and Dojo as external tenders?
- Do SMS/WhatsApp costs pass through to the salon, or does the salon bring its own provider?
- Employed, self-employed or mixed staff?

## Flag: Stage 8 hosting conflict
The brief says **Vercel Hobby preview only**. Tony's standing rule is that **Vercel stays paused and he uses Cloudflare Pages**. Vercel's own docs also say the Hobby plan is restricted to non-commercial personal use. The report assumes **Cloudflare Pages** unless Tony says otherwise. **Tony must confirm.**

## Unverified (headline)
Phorest, Timely and Shortcuts prices; Dojo minimum term; Vish prices; KPI benchmarks; deposit VAT tax point; voucher expiry law; Consumer Contracts Regulations fit; WhatsApp and Twilio prices (re-check); insurer rules beyond the NHBF example. Full list: report section 12.

## Placeholders kept
[OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL], [VAT NUMBER], [OPERATOR VAT POSITION], [ICO REGISTRATION].

## Pre-checkpoint check
Files saved: yes. Locks applied (placeholders, price rule, deposit default, loyalty rule): yes. No features added to the brief as decisions (extras flagged as proposals): yes. Unverified items flagged: yes. Nothing sent or published: yes.

---

## Amendments 01 (Tony, 21:30 GMT): research added
Tony's words are saved verbatim in `/workspace/salonos/00b-amendments-01-from-tony.md` (requirements A1 to A7). Full research: report **section 13**. **Stage 1 is still open and not approved. Stage 2 has not started.** Draft, not legal advice. Nothing sent.

**Key findings**
1. **Nails:** real UK prices are published. UK medians: manicure £23, gel manicure £30, pedicure £33, gel extensions or acrylics £40 (Appointica, published "from" prices). Nail art is priced per nail (from £2 at one Brighton salon), as a flat finish, or as a "with art" variant. Tony's brief has no plain manicure, plain pedicure or spa tier, and no nail art tiers. Real menus do.
2. **Loyalty messages:** email and web push are close to free. SMS is the cost (6p a text at Fresha). Marketing needs a separate opt-in per channel with a stored record. iPhone push only works if the client adds the site to their Home Screen. The new PECR fines are reported as up to £17.5m or 4% (ICO pages timed out, re-check).
3. **Booking:** treatment-first booking with different lengths, a chosen regular artist, and several artists in one visit are standard (Fresha does it, verified). The gap in competitors is **travel time, radius and travel fees online** for home visits. Weddings need a trial, a deposit schedule and extra-artist fees, as real UK artists charge.
4. **Who sells is the big decision.** If the site sells and subcontracts (matches Tony's words), the site carries the client's refund and care-and-skill risk (Consumer Rights Act s49, verified). Stripe needs the site shown as the seller everywhere (verified).
5. **Artists must stay independent.** HMRC says a mobile stylist can be self-employed if they set their own hours, prices and clients. If the site controls those, they look employed. Hairdressing needs no legal qualification in the UK (verified), so the site must vet.
6. **Payments:** Stripe Connect supports a set payout day per artist (weekly or monthly, verified). Reported cost: £2 per active artist a month plus 0.25% and 10p per payout. HMRC platform reporting (from 2024) means collecting artists' name, address, date of birth and NI number (reported).
7. **Commissions:** Fresha 20% and Treatwell 35% on **new** clients only (verified). Urban and Blow take rates are not published (old reports say 40 to 45%, unconfirmed). Bidvine, a lead marketplace, went into administration (verified).

**Risks:** consumer-law liability on subcontracted work; employment status; money-handling rules (FCA, unverified); marketing fines; artists taking regulars off the platform; a no-show by an artist on a wedding day.

**Recommendations (Judgement, Tony decides)**
- Site is the seller (Model 1), with a signed artist agreement, vetting (ID, qualification per service, public liability proof) and a claims process.
- Treat the marketplace as a **separate module** on the same diary, after the salon core.
- Built-in signed acceptance for artist contracts in v1 (stores exact wording, time and device, emails a copy). A paid e-sign tool can come later.
- Charge commission only on completed jobs. Decide whether repeat clients are charged.
- Get an accountant and a lawyer to check status, VAT, platform reporting, payments and the artist contract before launch.

**Decisions for Tony (new):** who sells; one product or two; commission level and payout day; vetting level; nail art tiers and prices; free or paid loyalty club and which channels.

**New Unverified items:** report section 13.11 (items 17 to 30).
