# SalonOS: Stage 1 Research Report

**Status:** Stage 1 deliverable, awaiting Tony's approval. Nothing here has been sent, posted or published.
**Prepared:** 31 Oct 2026 (UK time). Sources were opened on 31 Oct 2026 unless stated otherwise.
**Scope:** Research only. No spec, no legal drafts, no build. Operator details stay as placeholders ([OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL], [VAT NUMBER], [OPERATOR VAT POSITION], [ICO REGISTRATION]).
**Amendments 01 (Tony, 21:30 GMT):** researched in **section 13**. Stage 1 is still awaiting approval; Stage 2 has not started.
**This is not legal, tax or accounting advice.** Where the report touches law or tax it points to the official source and flags what a qualified adviser must confirm.

## How to read the confidence labels

| Label | Meaning |
|---|---|
| **Verified** | I opened the primary page (vendor, regulator or standards body) on 31 Oct 2026 and the figure or statement is on it. |
| **Reported** | Taken from a search summary of a primary or reputable secondary page. I did not re-open the page. Re-check before it goes into a spec, contract or price list. |
| **Unverified** | Third-party, old, conflicting, or my own engineering judgement. Never treat as fact. |
| **Judgement** | A recommendation from me, not a fact. Marked so Tony can overrule it. |

Tony's note of 20:49 GMT on 31 Oct 2026: "it has to work in the real world, not cyber fantasy land." Section 8 is written to that standard. It starts from what happens at the front desk on a Saturday, then works back to the software.

---

## 1. Headline findings (read this if nothing else)

1. **The market is crowded at the bottom, thin in the middle.** Fresha, Booksy, Salon Iris and Treatwell all publish prices from about £10 to £60 a month. Phorest (quote-only, aimed at 3+ staff) sits at the top. A new entrant cannot win on price. It must win on the working day: till, walk-ins, cash-up, colour formulas, rent-a-chair, offline.
2. **Gaps found against the big names are real but narrow.** On the vendors' own pages I scanned (Fresha, Booksy, Treatwell, Phorest, Salon Iris), "walk-in" appears nowhere, and "formula" appears nowhere. "Cash up" appears only on Phorest. Fresha lists waitlists, patch tests, commissions and Xero (as a paid add-on). Booksy lists waitlists, gift cards and memberships. This is a keyword scan of public pages, not a product test. A hands-on trial of each product is a Stage 2 action.
3. **Tony's prices sit near the national median, below London.** For example his Cut & Blow Dry (long) base is £52 against a national "from" median of £48 and a London median of £62.50. Full Head Colour at £85 is above the national median (£65) and equal to London (£85). His tier multipliers (0.85, 1.0, 1.2, 1.4) fit real London ladders: Headmasters' published balayage ladder runs £130 to £177, which is 1.36 times the entry price.
4. **Tony's retail prices look low against current UK list prices.** Six of the eleven branded lines sit below the current UK list price, one matches and one is about 50p above; the rest could not be compared. K18 Oil is £65 on K18's UK site against Tony's £55. Kérastase Elixir Ultime is now sold refillable at 75ml for £58.50 against Tony's £42 for 100ml. All retail prices must stay editable by the owner.
5. **Money law and tax shape the design.** Patch-test results and skin notes are probably special category (health) data under UK GDPR. Deposits and no-show fees must be fair and clearly disclosed under the Consumer Rights Act 2015. Gift vouchers have a specific VAT treatment (single-purpose or multi-purpose). Chair rental is normally standard-rated for VAT. From 1 Oct 2024 employers must pass on all card tips. These are product requirements, not footnotes.
6. **Offline is not a feature, it is a survival requirement.** Stripe's own docs say its JavaScript SDK and server-driven integration do **not** support offline card payments. Only the iOS, Android, React Native, Java and .NET SDKs do. In the UK, offline payments need the card inserted and the PIN entered. Tap does not work offline in SCA markets. So a plain browser app cannot take cards during a broadband outage without a plan B.
7. **Double-booking must be stopped in the database, not the screen.** PostgreSQL can refuse overlapping bookings itself with an exclusion constraint. But a colour client has processing time during which the stylist is free, so the diary must model active segments and processing segments separately.
8. **One thing in the brief needs Tony's decision later (Stage 8, not now).** The brief says "Vercel Hobby preview only". Tony's standing rule is that Vercel stays paused and he uses Cloudflare Pages. This is flagged in the checkpoint summary. Nothing is deployed in Stage 1.

---

## 2. UK high-street salon operations: what actually happens

### 2.1 Reception, walk-ins and phone bookings
- **Walk-ins.** Independent high-street salons take walk-ins, mainly for cuts, blow dries and brow or wax services. The receptionist needs three answers in seconds: who is free, how long until they are free, and whether the service fits. Walk-in queue software is a niche. None of the official pages I scanned mention it (see 1.2 above). Fresha lists "waitlists", which is a different thing (a list of clients waiting for a cancelled slot).
- **Phone bookings.** The receptionist is often on the phone while a client stands at the desk. Booking entry must be fast (the brief sets a 15-second target) and safe when two people book at once (see 8.3).
- **Colour processing and timings.** A full-head colour is not one block of time. Processing is the time the colour sits on the hair, during which the stylist can serve someone else. Salon blog and search-summary sources (**Unverified** as industry norms, not official standards) give these typical times:
  - Full-head colour: about 90 to 150 minutes whole appointment, with about 35 minutes of dye processing.
  - Balayage: about 2.5 to 4 hours whole appointment.
  - Tony's own durations (Full Head Colour 120 min, Balayage 180 min) sit inside these ranges. The processing share of each service is not in Tony's brief, so it must be added as a configurable field (see 8.3).
- Fresha lists "Processing and finishing times" as a feature on its UK pricing page (**Verified**: https://www.fresha.com/en-GB/pricing).

### 2.2 Patch tests (allergy alert tests)
- **48-hour convention.** The National Hair & Beauty Federation (NHBF) states allergy alert tests should be done at least 48 hours before the service, because a reaction can take up to 48 hours to develop. It also says to follow the manufacturer's instructions, which vary by product. (**Verified**, NHBF page dated 8 Mar 2021: https://www.nhbf.co.uk/news-and-blogs/blog/allergy-alert-tests-industry-tests-and-insurance/)
- NHBF's page also says: no colour service for under-16s, for a client with a previous reaction, or with damaged skin. Bleach and lightener need an industry test before every service. A re-test is needed when the brand or product range changes. (**Verified**, same page.)
- NHBF describes **insurer requirements** (it names Coversure and the Salonsure policy from Covea): re-test existing clients every six months, and keep a client-signed written record of every consultation and test for six years. This is one insurer's rule, so each salon must check its own policy. **Verified** as NHBF's statement, **Unverified** for any other insurer.
- HSE's hairdressing guidance covers staff skin protection, not client testing: https://www.hse.gov.uk/pubns/guidance/sr11.pdf (**Reported**).
- A negative test does not guarantee a future safe service (NHBF and manufacturer guidance, **Reported**).

### 2.3 Deposits, no-shows and cancellation
- Fresha data (summer 2024, 3m+ appointments): average no-show rate 3.8%. Hair salons 3.16%, nail salons 3.55%, beauty salons 3.59%, brows and lashes 6.55%, **barbershops 21.16%**. (**Verified**, reported in Professional Beauty, 2 Sep 2024: professionalbeauty.co.uk, article of 2 Sep 2024 on Fresha's May to Aug 2024 data; the exact URL was not captured, so re-find it before quoting.) It is summer data from one platform's users, so treat it as indicative.
- Treatwell and Fresha survey claims (for example that 17% of businesses require prepayment) appeared in secondary articles only. **Unverified**, not used.
- Legal frame: see section 6.4.

### 2.4 Cash-up
- End-of-day cash-up means: expected cash (opening float plus cash sales minus cash refunds minus cash paid out) against counted cash, plus card totals against the terminal's end-of-day report, with a variance explained.
- Phorest lists "Cash up" among its plan features (the page text does not make the plan clear) (**Verified**: https://www.phorest.com/gb/pricing/). I found no "cash up" on the Fresha, Booksy, Treatwell or Salon Iris pages scanned.

---

## 3. Pricing benchmarks against Tony's service list

**Source:** Appointica UK Salon Report, data collected 6 to 8 Oct 2026 from 29,266 UK salon websites. https://www.appointica.com/uk-salon-report. (**Verified** that I read the published data; saved copy at `_research/appointica.json`. **Caveat:** these are published "from" mid-points from salon websites, not what clients actually pay. Appointica sells salon software, so it is not a neutral party.)

| Service (Tony's name, Stylist base) | Tony base | National median | London median | Tony vs national |
|---|---|---|---|---|
| Ladies Cut & Blow Dry Short / Long | £42 / £52 | £48 | £62.50 | -12.5% / +8% |
| Mens Cut | £22 | £25 | £35 | -12% |
| Child Cut (under 12) | £18 | £20 | £25 | -10% |
| Blow Dry Short / Long | £28 / £36 | £32.50 | £42 | -14% / +11% |
| Root Tint | £48 | £52 | £65 | -8% |
| Full Head Colour | £85 | £65 (P25 to P75: £53 to £80.50) | £85 | +31%, above P75 |
| Half Head Highlights | £95 | £80 (highlights) | £107.50 | +19% |
| Balayage Full | £130 | £117.50 (P25 to P75: £87.49 to £150) | £152.50 | +11% |
| Gel Manicure | £28 | £30 | £33 | -7% |
| Gel Pedicure | £35 | £33 (pedicure) | £35 | +6% |
| Full Set Extensions (gel or acrylic) | £48 | £40 | £45 | +20% |
| Brow Wax | £10 | £10.97 (brow shape/wax) | £12.50 | -9% |
| Brow Shape & Tint | £18 | £10.97 shape, £10 tint | £12.50 / £13 | combined about £21, so below |
| Classic / Volume Lash Full Set | £75 / £95 | £45 (all lash extensions) | £60 | well above, but the benchmark mixes sets and infills |
| Full Leg Wax | £32 | £25 (leg waxing, size unspecified) | £27.50 | above, not like for like |
| Express / Full Facial | £38 / £62 | £50 (facial) | £57 | -24% / +24% |

**South-East examples** (same dataset, medians): Brighton cut & blow dry £52, full colour £61.25, balayage £137.50. Reading cut & blow dry £58, full colour £74.50. Watford cut & blow dry £48.25, balayage £140. Southampton cut & blow dry £44.50, full colour £60, balayage £120. Oxford balayage £138.75. Cambridge cut & blow dry £56.25.

**Services with no usable national benchmark** (mark **Unverified** in any price list): Hair Up (occasion), Keratin Smoothing, Olaplex and K18 stand-alone treatments, Scalp Treatment, Brow Lamination, Lash Lift & Tint, Hollywood and Brazilian waxes, Dermaplaning, Hydrafacial-style, Party Hair Up + Makeup, and the add-ons. BeautyStudioBox publishes ranges (Brazilian £25 to £50, Hollywood £28 to £46, brow lamination £40 to £52, lash lift £40 to £55) but I only saw them as a search snippet from beautystudiobox.co.uk (**Unverified**). Tony's Brazilian (£34), Hollywood (£38) and brow lamination (£42) fall inside those ranges.

### 3.1 Tiered pricing in real London salons (supports Tony's tier model)
- **Headmasters** (price list valid 1 Apr 2026 to 31 Mar 2027, **Verified**: https://www.headmasters.com/price-list/):
  - Cut & Blow-Dry: Stylist £62, Senior Stylist £70, Designer £76, Master Hair Designer £82, Team Designer £90, Consultant £96, Senior Consultant £103, Master Hair Consultant £115, Team Consultant £140.
  - Balayage & Highlights, full head: Technician £130, Senior Technician £147, Technical Consultant £166, L'Oréal Colour Specialist £177.
  - Reading across: Senior is 1.13 times entry on both ladders. The balayage top is 1.36 times entry. The cut & blow-dry top is 2.26 times entry. Tony's 1.2 (Senior) and 1.4 (Director) are sensible for a high-street salon, but a nine-step ladder exists, so the tier table must be editable.
- **Glasshouse Salon, Hackney** (page text only partly captured: https://glasshousesalon.co.uk/pages/services): Blow Dry from £75; highlights and balayage from £165 at Stylist level, up to £195 and above (face-brightening) and £285 and above (long or thick hair) at Creative Director level. This is a premium London salon, not a high-street comparator.
- Chroma Brixton and Taylor Taylor showed in search snippets only (Chroma's page returned a 403). **Unverified**, not used.

### 3.2 London and South-East versus national
London medians run roughly 25% to 45% above national medians for cutting and colour in this dataset (for example women's cut & blow dry £62.50 against £48, balayage £152.50 against £117.50). South-East cities sit between the two. The product must therefore never hard-code prices. It must ship with Tony's list as an editable seed.

---

## 4. Professional retail: Tony's list against current UK prices

Prices are UK prices including VAT, checked 31 Oct 2026. Retailers discount, so these are list or brand-site prices.

| Product (Tony) | Tony | Current UK price found | Status |
|---|---|---|---|
| K18 Leave-In Mask 50ml | £70 | £70 on k18hair.co.uk | **Verified** (matches) |
| K18 Oil 30ml | £55 | £65 on k18hair.co.uk | **Verified**, Tony £10 below |
| Olaplex No.3 100ml | £30 | Now sold as N°3PLUS 100ml: £32 list on uk.olaplex.com; page also showed £28.80 (a 10% promotion) | **Reported** (page opened, price read from page data) |
| Olaplex No.4 Shampoo 250ml | £28 | £30 list; page showed £27.00 | **Reported** |
| Olaplex No.5 Conditioner 250ml | £28 | Page not found at the URL I tried | **Unverified** |
| Olaplex No.7 Bonding Oil 30ml | £28 | £30 list; page showed £27.00 | **Reported** |
| Kérastase Elixir Ultime 100ml | £42 | Refillable 75ml £58.50 on kerastase.co.uk; the page also lists £44.00 and £29.00 for other pack sizes (labels not captured) | **Verified** for £58.50. No current 100ml found, so Tony's SKU may be discontinued. |
| Redken Acidic Bonding Concentrate 300ml | £32 | About £26.40 to £27.50 at retailers | **Unverified** (Redken's own page not checked) |
| Moroccanoil Treatment 100ml | £39 | £38.50 on uk.moroccanoil.com | **Verified** |
| Color Wow Dream Coat 200ml | £25 | About £29 on the official UK site | **Reported**, Tony about £4 below |
| ghd Heat Protect (Bodyguard) 120ml | £20 | £25.00 list, shown at £20.00 on ghdhair.com during a sale | **Verified** |

Sources: https://k18hair.co.uk/products/molecular-repair-hair-oil (K18 Oil; the Leave-In Mask was read on the same site), uk.olaplex.com (product pages for N°3PLUS, N°4 and N°7; the N°5 page returned 404), kerastase.co.uk, uk.moroccanoil.com, https://uk.colorwowhair.com/products/dream-coat-anti-frizz-treatment, ghdhair.com. Search-engine summaries gave the exact product URLs; re-confirm them before quoting in any customer material.

**Findings.** Of the eleven branded lines, Tony's price is below the current UK list price for six (K18 Oil, N°3, N°4, N°7, Color Wow, ghd), equal for one (K18 Mask), about 50p above for one (Moroccanoil), not comparable for one (Kérastase: different size), above retailer prices for one (Redken, unverified), and unchecked for one (N°5). The retail list needs: a barcode (EAN) field, VAT-inclusive price, cost price (for margin), and an owner-editable price. Brands change pack sizes (Olaplex renamed No.3, Kérastase moved to refillable), so SKUs must be editable and never baked into code.

**Generic lines in Tony's list** ("Professional shampoo 250ml £14 to £18", "Hair mask 200ml £22 to £28", "Styling cream/serum £16 to £24") have no benchmark and are marked **Unverified**.

---

## 5. Competitor gap analysis

Prices exclude VAT unless stated. All checked 31 Oct 2026 on the vendor's own UK page unless marked.

### 5.1 What they charge salons

| Product | Plan price | Other charges | Confidence |
|---|---|---|---|
| **Fresha** | Independent £14.95 per month (1 bookable member). Team £9.95 per bookable member per month. | Marketplace new clients: 20% one-time commission, minimum £4. Own links, returning clients: free. Payments: online 1.40% + 25p; in person 1.19% + 20p (+7p per Tap to Pay authorisation); manual entry 2.20% + 20p. Texts: 20 free, then 6p; WhatsApp 5p to 10p. Add-ons: Client Loyalty £49.95 per location per month, Xero Accounting £7.95, Data Connector £190. | **Verified** https://www.fresha.com/en-GB/pricing |
| **Booksy** | £40 per month including 1 user, £5 per extra user, plus VAT. | Optional "Boost" marketplace: 30% of a new client's first visit, minimum £5, plus VAT. No commission on own channels. | **Verified** https://biz.booksy.com/en-gb/pricing |
| **Treatwell** | Connect: Freelancer £9.99, Advanced £24.99, Expert £59 per month, plus VAT. | 35% + VAT on a new client's first marketplace booking (new = not served via Treatwell in the last 365 days). 2.5% + VAT on online pre-payments. 0% on repeat clients and own channels. Free SMS confirmations and reminders are advertised. | **Verified** https://www.treatwell.co.uk/partners/pricing/ (prices as of 26 Oct 2026) |
| **Phorest** | Quote only (plans named Starter, Grow, Ultimate on the page). Aimed at 3+ staff; unlimited staff and devices. | Third-party blogs quote about £155 to £169 per month, online booking fees £0.60 to £1.50 per booking and SMS at about 7p to 9.5p. | Plan names and features **Verified** https://www.phorest.com/gb/pricing/. All figures **Unverified**. |
| **Timely** | Third parties: from about £4, £7 and £9 per week by tier, no new-client fees; payments 1.85% + 30p online, 1.59% + 5p in salon. | Plan feature splits not established. | **Unverified**. gettimely.com not opened. Sources disagree (getyouin.co.uk, revyfy.com, tavix.app). |
| **Shortcuts (Aire)** | Grow £15, Pro £25 per month, +£15 per extra team member, plus VAT. | Fusion tier is quote-based. | **Unverified** (search snippet only; the pricing URL returned 404). |
| **Salon Iris (SI Cloud)** | From £39 per month plus VAT. Page has a staff-count selector. | No setup fees. Not a marketplace. | **Verified** https://saloniris.co.uk/pricing/ |

### 5.2 Feature comparison: the four areas Tony asked about, plus the rest

"Listed" means the feature name appears on the vendor's public page I scanned. "Not found" means the keyword did not appear on the pages I scanned. **It is not proof the feature does not exist.** Hands-on trials are needed before any marketing claim.

| Feature | Fresha | Booksy | Treatwell | Phorest | Timely | Shortcuts | Salon Iris |
|---|---|---|---|---|---|---|---|
| POS / till | Listed (point of sale; terminal devices from £99 per device) | Payments and Tap to Pay listed | Card machines and Tap to Pay listed | Listed ("Smart Point-of-Sale") | Unverified | Unverified | Integrated card payments listed |
| Walk-in queue | Not found. Waitlists listed. | Not found | Not found | Not found | Unverified | Unverified | Not found |
| Cash-up | Not found | Not found | Not found | **Listed** ("Cash up") | Unverified | Unverified | Not found |
| Client cards and formulas | Client forms, patch tests, documents listed. "Formula" not found. | "Formula" not found | "Formula" not found | Client cards, purchase history, patch tests, before and after photos listed. "Formula" not found. | Unverified | Unverified | "Formula" not found |
| Stock and retail | Retail and inventory listed | Not found | Inventory listed | Stock management, stock takes and "deduct professional products from stock" listed | Unverified | Unverified | Inventory and retail listed |
| Staff commission | Sales commissions, wages, pay runs, timesheets listed (Team plan; Independent column shows "-") | Not found on the page | Not found | Tiered or flat commission, timesheets and clock in/out listed | Unverified | Unverified | Not found |
| Deposits and no-show fees | Listed | "No-Show Protection" listed | Deposits listed | Deposits and "option to charge no-shows" listed | Cancellation fees from mid tier (unverified) | Unverified | Deposits and no-show protection listed |
| Loyalty | Add-on £49.95 | "Loyalty Cards" listed | Not found | Loyalty programme listed | Unverified | Unverified | Listed (plan-dependent) |
| Accounting integration | Xero add-on £7.95 | Not found | Not found | "Direct integration with Xero and Quickbooks" listed | Unverified | Unverified | Not found |
| Rent-a-chair / multi-merchant | "Multi merchant" payment routing listed | Not found | Not found | Not found | Unverified | Unverified | Not found |

Sources: the vendor URLs in 5.1, plus https://www.fresha.com/en-GB/for-business/features. Any third-party blog claim that a rival has (or lacks) a walk-in queue or cash-drawer reconciliation is **Unverified** and is not used here.

### 5.3 Where SalonOS can honestly differ
1. A real **cash-up** that reconciles cash, card terminal totals and gift vouchers, with a variance log.
2. A **walk-in queue with estimated wait** built on the diary, not a separate list.
3. **Colour formulas in grams** on the client card, with optional scale integration later.
4. A **finance ledger** that separates deposits held, vouchers outstanding and revenue earned, posted to Xero, QuickBooks, FreeAgent or Sage.
5. **Rent-a-chair** handling (section 8.8), where only Fresha shows a related feature.
6. A flat annual licence with no marketplace commission. (Pricing is for Stage 5. Not set here.)

---

## 6. UK legal and compliance: what the product must respect

**Draft, not legal advice.** Stage 3 will draft policies. Stage 1 only lists what the research says the product must handle. Operator identity stays as placeholders: [OPERATOR LEGAL NAME], [OPERATOR ADDRESS], [OPERATOR EMAIL], [ICO REGISTRATION], [VAT NUMBER], [OPERATOR VAT POSITION].

### 6.1 UK GDPR and the Data Protection Act 2018
- **Health data is special category data.** Allergies, skin conditions, patch-test reactions and medical notes on a client card are health data. That needs a normal lawful basis (Article 6) **and** a separate condition (Article 9), which in practice is usually explicit consent. ICO guidance on special category data: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-is-special-category-data (**Reported**; the page fetch timed out and I used the search summary).
- **Product consequences:** a consent record per client (who, when, wording version), the ability to export or delete one client's data (Phorest documents exactly this for its own users: https://support.phorest.com/hc/en-us/articles/360016273340), access controls so a junior can see allergies but not a full card history if the owner chooses, an audit log of who opened a client card, and a retention rule (see 8.6, six-year retention of patch-test records is an insurer rule that must be set against UK GDPR storage-limitation).
- Whether [OPERATOR LEGAL NAME] needs to register with the ICO and pay the data protection fee, and whether salons (as controllers) need it, is a question for Stage 3. Placeholder: [ICO REGISTRATION].

### 6.2 PECR (marketing by email and text)
- Marketing email or SMS needs consent, or the "soft opt-in" for existing customers: the salon obtained the contact details during a sale, the marketing is for its own similar services, and the client was offered a simple opt-out at collection and in every message (**Reported**, ICO PECR guidance, https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/).
- Appointment reminders are service messages, not marketing, but they must not be padded with promotions.
- **Product consequences:** a marketing-consent flag separate from reminder consent, a one-tap unsubscribe, and import rules (never import a Fresha or Phorest list with consent assumed, see 8.12).

### 6.3 Card data and PCI DSS
- If card entry happens only on a Stripe-hosted page or a certified terminal, the salon's software never touches card numbers. Stripe's hosted Checkout falls under the lightest PCI self-assessment (SAQ A); card-present readers under Stripe Terminal use point-to-point encryption (**Reported**, search summary of Stripe docs; confirm at build).
- **Product rule (Judgement):** never store or log card numbers. Store only processor tokens and the last four digits.

### 6.4 Deposits, no-show fees and cancellation (Consumer Rights Act 2015)
- A fee for a no-show or late cancellation is a contract term. Under the **Consumer Rights Act 2015 section 62** a term is unfair if, contrary to good faith, it causes a significant imbalance to the consumer's detriment. https://www.legislation.gov.uk/ukpga/2015/15/section/62 (**Reported**).
- GOV.UK's "Writing a fair contract for customers" says that a cancellation charge "must not be excessive and it should reflect steps you can take to minimise your losses (for example, finding another customer)", and that an unfair term cannot be relied on and risks CMA or Trading Standards action: https://www.gov.uk/guidance/writing-a-fair-contract-for-customers (**Verified**, page opened 31 Oct 2026). The CMA's unfair contract terms guidance is the longer reference.
- NHBF's published advice on salon cancellation terms is consistent with this: state the charge up front, at booking (**Reported**).
- **Product consequences:** the booking flow must show the deposit and the cancellation window **before** the client confirms, must record that the client saw and accepted the wording (timestamp, version, IP or device), must default to a **capped** fee (the brief's deposit default is 20% or £15 minimum, which is the owner's commercial choice), and must give the owner a manual override, because "waive it, they had a bereavement" is a real daily event.
- **Not verified this session, needs Stage 3 / adviser:** how the 14-day cancellation right in the Consumer Contracts Regulations 2013 interacts with online bookings for services starting inside 14 days, and whether a forfeited deposit counts as a penalty in a particular case.

### 6.5 VAT
- Registration threshold £90,000 of taxable turnover and deregistration threshold £88,000 (**Verified**: https://www.gov.uk/register-for-vat and https://www.gov.uk/how-vat-works/vat-thresholds). Many small salons are below this, so **the operator's VAT position is a placeholder**: [OPERATOR VAT POSITION], [VAT NUMBER]. The product must support both VAT-registered and unregistered salons, with prices entered VAT-inclusive.
- Gift vouchers, deposits, chair rental and tips each have a specific treatment: see 8.8 and 8.9.

### 6.6 Making Tax Digital
- **MTD for Income Tax** (sole traders and landlords): from 6 April 2026 if qualifying income in 2024/25 was over £50,000; from 6 April 2027 if over £30,000; from 6 April 2028 if over £20,000 (**Verified**: https://www.gov.uk/guidance/find-out-if-and-when-you-need-to-use-making-tax-digital-for-income-tax). **Consequence:** many independent salon owners (often sole traders) will need MTD-compatible software by 2027 or 2028. A clean, exportable ledger is a selling point. Whether SalonOS itself must be "MTD software" is not decided. Safer positioning (Judgement): feed an MTD-compatible accounting package (Xero, QuickBooks, FreeAgent, Sage) rather than submit to HMRC.
- **MTD for VAT** applies to all VAT-registered businesses already (**Reported**, not re-opened).

### 6.7 Employment and tips
- **Employment (Allocation of Tips) Act 2023**, in force from 1 October 2024 (**Verified** for the no-deductions rule, GOV.UK https://www.gov.uk/tips-at-work, opened 31 Oct 2026; the other points are from the code of practice and were checked earlier this session): employers must pass on qualifying tips in full (GOV.UK: "all tips must be given to workers without deductions"; tax is handled through the worker's tax code), allocate them fairly and transparently, keep a written tipping policy, keep records for three years, and pay out by the end of the month after the tip was paid. Tips paid directly to a worker (for example cash handed over) are not qualifying tips. Tips paid by card to the employer are.
- GOV.UK states that tips go to workers without deductions. Whether the code of practice allows any exception for card-processing costs is **not verified**: open for Stage 3.
- Holiday pay and rota rules (5.6 weeks statutory holiday: https://www.gov.uk/holiday-entitlement-rights, **Reported**) are for Stage 2 to spec once Tony says whether staff are employed, self-employed or mixed.

### 6.8 Accessibility
- Under the **Equality Act 2010**, a business serving the public must make reasonable adjustments for disabled people, including digital services. Size and resources affect what is "reasonable" but do not remove the duty (**Reported**, EHRC Code of Practice chapter 7: https://www.equalityhumanrights.com/guidance/codes-practice/code-practice-services-public-functions-and-associations/chapter-seven).
- The Act does not name a technical standard. **WCAG 2.2 AA** is the practical benchmark (**Reported**). Applies to the public online-booking page first and the till second.

---

## 7. Finance API options (every money movement posts)

Tony's brief requires a finance API posting for every money movement. The research suggests one internal ledger, then thin adapters per accounting package. All endpoint details below are **Reported** from developer documentation search summaries. Verify against the current docs at build time.

| Package | Relevant API objects | Notes |
|---|---|---|
| **Xero** | `POST /Invoices`, `/Payments`, `/BankTransactions`, `/ManualJournals`. https://github.com/XeroAPI/Xero-OpenAPI | Fresha already sells a Xero connector at £7.95 per location per month (**Verified**), so owners expect it. Phorest lists "Direct integration with Xero and Quickbooks" (**Verified**). |
| **QuickBooks Online** | `SalesReceipt` (paid at sale) or `Invoice` plus `Payment` linked via `LinkedTxn`. https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt | A `SalesReceipt` is the natural fit for a till sale. |
| **FreeAgent** | `POST /v2/bank_transaction_explanations` with `paid_invoice`. https://dev.freeagent.com/docs/bank_transaction_explanations | Popular with UK sole traders. |
| **Sage Business Cloud Accounting** | `/sales_invoices`, `/contact_payments`, `/ledger_accounts`. https://developer.sage.com/accounting/apis/sagebusinesscloudaccounting/3.1.0/accounting.md | Heavier. |

**Design implication (Judgement):** build an **append-only internal ledger** first: one row per money movement (sale, refund, deposit received, deposit applied, deposit forfeited, voucher sold, voucher redeemed, tip, cash paid-in or paid-out, processor fee, payout). The accounting adapters read from it. For Stage 1 and the Stage 7 demo, a stub adapter that writes the exact payload to a log is enough. Real credentials stay a placeholder. Section 8.9 shows the account mapping.

---

## 8. REAL-WORLD OPERATIONS & HARDWARE

*Added after Tony's steer: "it has to work in the real world, not cyber fantasy land". This section is about what happens at the front desk on a wet Saturday, not what a feature list promises. Facts about products carry a confidence label. Anything marked Judgement is my recommendation. Anything that goes beyond Tony's locked brief is a **proposal** for Tony to accept or drop at the Stage 2 gate, not a decision.*

### 8.1 Front-desk hardware

**Card terminals (UK).** Prices and fees were read from each provider's page on 31 Oct 2026 unless stated. Check VAT and current promotions before quoting to a customer.

| Provider | Hardware (UK) | Card-present fee | Notes that matter at a salon desk | Confidence |
|---|---|---|---|---|
| **Stripe Terminal** | Smart readers: WisePOS E (£179, dock £39), Stripe Reader S700/S710, T600, Verifone V660p/UX700/P630. Mobile: WisePad 3. | 1.4% + 10p EEA cards; 2.9% + 10p non-EEA; extra 10p per Tap to Pay authorisation. | Best fit for a custom-built till because it has an API. **Offline mode exists only in the mobile SDKs and the .NET/Java desktop SDKs.** The JavaScript SDK and server-driven integration do **not** support offline. | **Verified** (https://stripe.com/gb/pricing, https://docs.stripe.com/terminal/features/operate-offline/overview). One availability row for a UK reader said "Private preview": confirm with Stripe before buying. |
| **SumUp** | Solo Lite £25 + VAT; Solo; Terminal (with printer). | 1.69% pay-as-you-go. Payments Plus: 0.99% on domestic consumer cards for £19/month or £189/year (international, corporate, premium and Amex stay at 1.69%). | Cheap and well known. Battery per charge: Solo Lite about 1,000 transactions, Solo 300, Terminal 250 with printing. Payout by 7am next day. | **Verified** (SumUp UK pricing and product pages). Integration with a custom till is through SumUp's own APIs: not assessed. |
| **Dojo** | Go Max £149 (or £25/month), Pocket £239 (or £20/month), Wired £179 (or £15/month), Tap to Pay on iPhone £0. | 1.2% blended below £100k turnover, 5p authorisation fee, 50p per refund. £25/month per location (promotional £11.99 from 24 Aug 2026). Next-working-day settlement. | A 12-month minimum term was seen only in a third-party article. | **Verified** for fees (dojo.app); term **Unverified** (businessexpert). Developer API for a custom till: not assessed. |
| **Square UK** | Reader £19 + VAT; Terminal £149 + VAT; Hub £39 + VAT. | 1.75% card present; 1.4% + 25p online; 2.5% card on file. | The Hub has Ethernet and up to three USB ports for a cash drawer or barcode scanner. **Offline mode:** works up to 24 hours, payments must be uploaded within 72 hours (Terminal) or within a 24 hour session (Reader). Physical contactless cards do not work offline, Apple Pay and Google Pay taps do. The **merchant carries the risk** of declines and chargebacks on offline payments. | **Verified** (squareup.com/gb pricing and support pages). |

**What this means (Judgement).** There is no free lunch: the cheapest rate comes with the weakest developer integration, and the best integration (Stripe) has the least forgiving offline story in the UK. The practical v1 answer is **Stripe Terminal with a smart reader (WisePOS E or S700) connected by Ethernet or Wi-Fi, plus a 4G failover router**, and an **"external terminal" tender** (see 8.2) so the salon can take payment on any spare SumUp or Dojo reader and record it in SalonOS with a reference when the link is down. Whether to be Stripe-only is a decision for Tony.

**Cash drawer.** A standard till drawer plugs into the **receipt printer**, not the PC. On an **Epson TM-T20III** the "DK" port is a 6-pin RJ-style drawer connector (not a telephone socket). The printer opens the drawer when it receives the ESC/POS command **ESC p m t1 t2** (hex `1B 70 m t1 t2`): m = 0 selects pin 2, m = 1 selects pin 5. The drawer pulse is on for t1 × 2 ms and off for t2 × 2 ms; Epson's example is `1B 70 00 19 FA`. On the same model the drawer and the external buzzer cannot both be used. (**Verified**: Epson TM-T20III technical reference. Drawer pin wiring varies by drawer, so match the drawer's manual.) **Consequence:** the till must be able to "no-sale open drawer" (logged, with a reason) and open on cash tender only, never on card.

**Receipt printers.** Epson (TM-T20III, TM-m30 series) and Star (TSP100/TSP143 series) are the common UK thermal printers (**Reported**). Epson's **ePOS-Print XML** (HTTP print from a browser over the LAN) is available **only on Ethernet or Wi-Fi models**. Printing from a browser on an iPad has a hard limit: **Web Bluetooth and WebUSB are not supported in Safari on iOS/iPadOS** (**Verified**, caniuse), so a USB or Bluetooth printer cannot be driven by a pure web page on an iPad. Options (Judgement): (a) buy **network** printers and print through ePOS-Print, which needs an HTTPS-reachable, certificate-trusted printer address, which is fiddly; (b) a **small native companion app** or a print service on a spare PC at the desk. This is a genuine v1 risk and the reason the architecture in section 9 includes a thin native shell later.

**Barcode scanners.** Retail scanning is simplest with a USB or Bluetooth scanner in "keyboard wedge" mode, which types the barcode into the focused field. No special integration. Products without a barcode on file need a salon-assigned code and a label printer (**Judgement**).

**Reception tablet vs PC vs stylist phone (Judgement).**
- **Reception:** a desktop or all-in-one PC with a mouse beats a tablet for a busy diary because of the screen size. A tablet is fine at a small desk or as a second screen.
- **Stylist phone view:** read-only "my day" (next client, services, colour card and patch-test status) plus "start/finish service" and a photo upload. No till and no diary editing from a phone in v1, to reduce accidental changes.
- **Client-facing:** a patch-test or consent form on a tablet the client signs on (see 8.6).

### 8.2 Offline-first: when the broadband drops on a Saturday

The truth about UK high-street broadband is that outages happen, and a salon cannot stop cutting hair. I did not find a UK outage statistic worth quoting, so I do not give one. The requirement is simple: **reception must still be able to see today's diary, take bookings and take payment.**

**What must work with no internet (Judgement):**
1. The diary for the next 7 days, client cards, price list and product list, held on the device.
2. New bookings, edits, walk-ins, check-in and check-out. Queued locally and sent when the link returns.
3. Cash sales, including opening the drawer and printing a receipt (the printer is on the LAN, so does not need the internet).
4. Card payment via a **fallback**, not by pretending the card network is up.

**Card payments offline are the hard part, and the rules are strict:**
- **Stripe Terminal** offline needs a mobile SDK or the .NET/Java desktop SDK, a reader that has connected on the same network within the last 24 hours with software updated in the last 30 days, and in the UK/EEA (strong customer authentication markets) **tap is not available offline**: the customer must **insert the card and enter the PIN**. Swipe is not available. Tap to Pay on Android has no offline support. Offline limit is US$10,000 equivalent. (**Verified**, Stripe docs.) The JS SDK and server-driven mode cannot do it at all.
- **Square** offline accepts Apple Pay / Google Pay taps but not physical contactless cards, and **the merchant bears decline risk** (**Verified**).
- **Consequence (Judgement):** a pure browser till **cannot** take Stripe offline card payments. Two honest v1 options: (1) **4G failover router** (a second connection) so "offline" becomes rare, and (2) an **"external terminal" tender**: the receptionist takes the card on a standalone SumUp or Dojo reader (many work over their own 4G or Bluetooth to a phone), then records the sale in SalonOS as tender "External card" with the receipt number. This is reconciled in cash-up (see below). Full offline Stripe needs the native shell in section 9. Cost and delay: a native iOS/Android build, which is later-phase work.

**Sync rules (Judgement):**
- Every local write is an event with a unique ID (a client-generated UUID), a device ID and a local timestamp, so retries are safe (idempotent).
- The **server is authoritative**: when the link returns, the server accepts or rejects each queued change. A rejected double-booking appears in a "needs attention" list for the manager, not silently lost.
- Money events are **never overwritten**: a sale made offline is posted as a sale; a correction is a new refund event. This is the append-only ledger in 7.
- The screen shows a clear "OFFLINE, X changes waiting" banner. Receptionists must know.

**Realistic limits:** two receptionists both offline can both book the same slot, and the conflict is found only on sync. The product must say so and give the manager a 10-second fix. Reducing this risk is why the diary is held to a **single desk device per site** when offline, a limit worth confirming with Tony.

### 8.3 Multi-user concurrency on one diary

**The problem.** A phone booking, the online booking page and a walk-in can all want the same stylist at the same moment. The database, not the screen, has to say no.

**Recommended design (Judgement, using standard PostgreSQL).**
- Store each booking as one or more **time segments** on a **resource** (stylist, treatment room, basin, nail desk). Add a database **exclusion constraint** so two active segments for one resource cannot overlap. Postgres syntax (**Verified**, PostgreSQL docs on exclusion constraints and `btree_gist`):

```
CREATE EXTENSION btree_gist;
ALTER TABLE booking_segments ADD CONSTRAINT no_overlap
  EXCLUDE USING gist (resource_id WITH =,
                      tstzrange(start_time, end_time, '[)') WITH &&)
  WHERE (status = 'confirmed' AND blocks_resource);
```

- A clash raises SQLSTATE **23P01** (exclusion violation), which the app catches and turns into "that slot was just taken, here are the next three". The half-open `[)` range means one booking can end at 10:00 and the next start at 10:00 without clashing.
- **Processing time is the key real-world detail.** A colour appointment is **three segments**: *active* (apply colour) → *processing* (client sits, stylist free) → *active* (rinse and finish). Only **active** segments block the stylist. Processing blocks a **chair or basin** resource instead. This is how real salons double-book a stylist usefully, and the schema must model it from day one. Tony's brief gives one duration per service, so a `processing_minutes` field per service is a **proposal** to add to the service list (see 8.5).
- **Soft holds:** while a client is in the online booking flow, hold the slot for about 5 to 10 minutes with an expiry timestamp (a held row, not a confirmed one), so two clients do not both reach the pay step. The hold time is a design choice, not a standard.
- **Two receptionists at once:** realtime updates over WebSocket or server-sent events so each sees the other's change within a second; a visible "being edited by Sam" marker; optimistic updates with a **version number** on each booking so a stale edit is rejected rather than overwriting.
- **Stylist moves, double-booking by choice:** the manager can override the constraint for a deliberate overlap (for example an assistant shampoo). Model that as an explicit "allow overlap" resource flag, never as a way around the constraint.
- Cloudflare **Durable Objects** are an option for serialising all writes to one site's diary in a single-threaded object with transactional SQLite storage (**Reported**, https://developers.cloudflare.com/durable-objects/). Not required, because Postgres can do it alone. It is covered in section 9.

### 8.4 A realistic Saturday-peak walkthrough (SAMPLE, illustrative)

**This is a worked example I built from Tony's service durations and prices. It is not data from any salon.** It shows which screens, devices and edge cases a 3-chair Saturday exercises. Staff names are invented. Prices are Tony's base prices times tier.

**Set-up (SAMPLE):** Open 9:00 to 17:30. Team: Maya (Director, 1.4×), Ben (Senior, 1.2×), Priya (Stylist, 1.0×), Leo (Junior, 0.85×), Jess (beauty). Reception: Sam. Two walk-in chairs reserved until 10:30.

| Time | What happens | What the system must do |
|---|---|---|
| 08:40 | Sam opens up, floats £150 cash into the drawer. | Open shift, record the **opening float**; **no-sale drawer open** logged. Sync status checked: online. |
| 08:55 | The card reader shows "offline": the router has rebooted. | Banner "Card terminal offline". The 4G failover takes over. Sam keeps working. |
| 09:00 | Maya starts Full Head Colour (120 min, 1.4 × £85 = £119) for a returning client. | Colour card opens with last formula and **patch-test status: valid until 14 Jan** (see 8.6). Segment: 20 min active, 35 min processing, 30 min active, 35 min other (**SAMPLE** split; real values to be set). |
| 09:05 | A walk-in asks for a Ladies Cut & Blow Dry Short (£42). Ben has a gap at 09:15. | **Walk-in** flow: search by name or phone (30 seconds), no booking account needed. Slot found, booked, client added to **today's** diary. |
| 09:20 | Phone: client wants a Root Tint (75 min) at 11:00 with Priya. A web booking for the same slot arrives at the same time. | Database exclusion rejects the second. The web client sees "just taken, try 11:15 or 11:30". The phone booking stands. |
| 09:40 | Ben finishes the cut. The cut is £42 × 1.2 = £50.40. Client also buys a Moroccanoil Treatment (£39), total £89.40, and pays £20 cash + the rest by card. | **Split tender:** £20.00 cash (drawer opens), £69.40 on the terminal. **Stock** of Moroccanoil falls by 1. **Commission** posts: service commission to Ben, retail commission separately (see 8.8). **Ledger** gets the sale, two tender lines, and the card fee later. |
| 10:00 | A new client wants balayage (£130 base, Maya £182). Booking requires a **patch test** because she is new. | Online and phone booking **blocks** the colour appointment unless a valid patch test exists or a test is booked at least 48 hours before. A test appointment is offered, with consent form (see 8.6). |
| 10:20 | Client arrives for lash lift: allergic history on card. | Card shows a red flag. A reminder prompts the lash therapist. |
| 10:35 | A no-show is declared for a 10:30 appointment. | Manager confirms **charge no-show fee**. Stripe off-session charge on the card on file, with the logged mandate. If the bank demands authentication, the charge fails safely and the client gets a "pay now" link (see 8.7). |
| 11:15 | Sam sells a £50 gift voucher as a birthday gift. | Voucher is a **liability**, not income. Code created, printed or emailed (see 8.9). |
| 11:30 | Priya's 11:00 client runs 25 minutes over. | Stylist taps "running late" and the system **shifts** her later appointments with a 1-tap SMS "your stylist is running 20 minutes behind" for the client waiting (opt-in). |
| 12:00 | Both receptionists, Sam and a second in the back, edit the diary. | Realtime updates. A stale edit by the second is rejected with a clear message. |
| 12:40 | Broadband drops for 14 minutes (a SAMPLE outage). | Offline banner. Bookings and cash sales continue locally. Card sales go on the **external terminal** tender or 4G. 9 changes queued. |
| 12:54 | Link returns. | Queue uploads in order. One conflict: two bookings for one stylist. Manager "needs attention" list shows both, with a one-tap "move this one". |
| 13:30 | A client redeems a loyalty reward (points from 1 point per £1). | Balance check; redemption posts as a **discount line** with a reason. |
| 14:00 | A self-employed beauty renter (see 8.8) takes her own client. | Sale on **her** till profile; payment either on her own terminal or split-routed to her (see 8.8). |
| 15:30 | Product delivery, a **Salon Services** order arrives (see 8.10). | Goods-in scanned, quantities updated, discrepancy noted. |
| 17:30 | Close. Sam counts the drawer: £412.00 against expected £409.00. | Cash-up compares counted vs expected, shows the **£3 over**, asks for a reason, locks the day. |
| 17:45 | Owner opens the dashboard on her phone. | Sees takings by tender, services vs retail, no-shows, deposits held, voucher liability movement and rebooking rate (see 8.11). |

**What the walkthrough teaches:** the product must be fast on the screen (a walk-in in under 30 seconds), and it must survive offline moments, double-booking attempts, split payments and a manager's overrides all in one hour. The price of failure on a Saturday is a queue at the door. Any claim about target timings (30 seconds for a walk-in) is a **design target to test**, not a measured fact.

### 8.5 Colour formula recording, scales and waste

**What a stylist actually records (Judgement, based on how colour cards are described by Phorest, Vish and SalonScale).** One formula entry per colour service, attached to the client and the appointment:
- Brand and line (for example a professional permanent or demi range), shade codes and each shade's weight in **grams** (not "half a tube"). The total gram weight is what makes the formula repeatable and costable.
- **Developer volume** (for example 10, 20, 30 or 40 vol, or the brand's % equivalent) and **mix ratio** (for example 1:1 or 1:2).
- **Application area** (roots, lengths, ends, foils, face-frame) and technique (balayage, highlights, toner).
- **Processing time** in minutes and any heat.
- Additives (for example a bond builder), toner or gloss as a second formula.
- **Leftover (waste) in grams**, which is a one-tap entry after weighing the bowl.
- Before and after **photos**, and a free-text note.
- Link to the **patch-test record** and to the stock items used (so back-bar stock falls, see 8.10).
This is richer than what Tony's brief says ("formulas"). The extra fields are a **proposal** for Stage 2.

**Mixing-bowl scales.**
- **Vish**: a Bluetooth smart scale and a tablet/phone app. Integrates with SalonIQ, Kitomba and Mindbody (**Reported**: https://getvish.com/product-features/, https://docs.getvish.com/docs/tablet-mixing/, https://faq.saloniq.com/knowledge/what-is-vish). Scale about US$195 and subscriptions from about US$40 per month were seen, **Unverified**; no UK price was listed.
- **SalonScale**: plans US$49 to US$199 per month by stylist count, with a free Precision Scale on annual billing (**Reported**: https://www.salonscale.com/en-us/pricing). It integrates with **Phorest**: appointments flow in, formula notes and product totals flow back; the add-on was shown at about CAD $35 per month (**Reported**: https://support.phorest.com/hc/en-us/articles/35399954994706-How-do-I-connect-Phorest-with-SalonScale). No Fresha integration was shown on the pages I read.
- **Position (Judgement):** do not build scale hardware in v1. Support **manual gram entry** (a stylist reads the scale and types the number) with an import file or API hook for Vish and SalonScale later. A direct integration with either vendor needs a partner agreement and is **not assessed**.

**Colour waste.** Green Salon Collective's reports state that about half of respondents put chemical waste down the drain and that salons waste about 26% of their chemicals each year (22.9 kg of an average 85.3 kg), and SmartMix data suggests about 20% of colour is wasted on average before intervention, in a 20% to 50% range (**Reported**: https://www.greensaloncollective.com/pages/reports; vendor-linked data, treat as indicative). **Product consequence:** record leftover grams per service, then report **colour used vs colour charged**, cost of waste per stylist and per month. Whether waste data changes behaviour is a vendor claim, not proven here.

### 8.6 Patch-test workflow (48 hours, consent, signature)

The industry rule (**Verified**, NHBF) is a patch test at least 48 hours before a colour service, repeated per the rules in 2.2. The workflow that has to exist in software:
1. **Trigger:** booking a colour, tint or lash/brow tint service for a client with no valid patch test flags it. For online booking: block the colour slot and offer a patch-test slot instead. The brief marks "patch tests" in client cards, so the **48-hour rule engine** is the real-world completion of that item.
2. **Test appointment:** short, free or low-cost (a price is Tony's decision). Reminder SMS 24 hours before the colour: "your patch test must be at least 48 hours before".
3. **Consent form** with health questions, signed on a tablet (finger or stylus). Store the signature image, the time, the form version and the staff member, and a PDF copy. Under UK GDPR this is special category data (6.1).
4. **Result:** at the colour appointment, the stylist records "no reaction" or "reaction", with a photo option. A reaction **blocks** the service.
5. **Validity:** valid until a date set by the salon (insurer rule of six months is the NHBF-cited example, **not universal**). Expiry appears on the client card and on the diary entry.
6. **Retention:** records kept for the insurer's period (six years in the NHBF example) **versus** UK GDPR storage-limitation. The retention period must be a salon setting with a stated reason. Stage 3 decides the wording.
7. **Override:** a manager can proceed without a test only with a recorded "client declined test" waiver. Whether that is acceptable is an **insurer** question, so the product should make the override hard and visible.

### 8.7 Chargeable no-shows: card on file, SCA and what the law allows

**How to hold a card for later (Verified/Reported, Stripe docs):**
- At booking, create a Stripe **SetupIntent** with `usage: off_session` and confirm it with the client present. That completes authentication (3-D Secure/SCA) once and lets the salon charge later as a **merchant-initiated transaction**. https://docs.stripe.com/payments/setup-intents (**Reported**).
- Merchant-initiated transactions sit outside SCA scope, **but the bank can still demand authentication**, so a later charge can fail. A **recovery flow** brings the client back on-session with a "pay now" link. https://docs.stripe.com/payments/cits-and-mits (**Reported**).
- Stripe expects the client's **explicit consent or mandate** with terms (when you will charge, how much, how to cancel). The mandate text, timestamp and version must be stored (**Reported**).
- Deposits can be a PaymentIntent taken at booking. Both are separate ledger events.

**What UK consumer law appears to allow (see 6.4):** a no-show charge must be clear, brought to the client's attention **before** they book, must not be excessive, and should reflect losses the salon cannot avoid (GOV.UK, **Verified**). It is not verified here whether a 100% charge for a long colour is acceptable. Safer default (Judgement): charge up to the **deposit** for ordinary cases and a tiered percentage for long services, with the exact policy as a salon setting reviewed in Stage 3.
- **Not a lawyer's view.** Draft, not legal advice.
- **Fresha's own 2024 data** (via Professional Beauty, 2.3) shows no-shows are a real cost, which is why every competitor offers a version of this.

**Operational rules the software must enforce:** grace period (for example 24 hours' notice) is a salon setting; the manager sees a "no-show waiting to charge" list; a charge needs a second tap and a reason; refund and waive are one tap; every step posts to the ledger with the original booking ID.

### 8.8 Staff: rotas, holidays, clock-in, commission, rent-a-chair, tips

Tony's brief has staff **tiers and commission**. A real salon also needs:
- **Rota and availability:** weekly pattern per stylist, plus exceptions (holiday, sickness, training). The diary shows blocked time. Rota changes that clash with existing bookings must surface a list of affected clients.
- **Holidays:** statutory entitlement is 5.6 weeks for full-time workers (**Reported**, https://www.gov.uk/holiday-entitlement-rights; page opened to check the URL only). Part-time and irregular-hours rules are more complex and are for Stage 2/3.
- **Clock-in/out:** Phorest and Fresha both list timesheets with clock in and out (**Verified**), so this is expected. For small salons, a "clock in on the shared PIN pad" is typical (Judgement). Pay runs and wages are **not** proposed for v1: export hours to payroll software.
- **Commission:** separate rules for **services** and **retail**, tiered or flat (Phorest lists "tiered or flat commission", **Verified**). Questions Tony must answer: is commission on price before or after discount, before or after VAT, and is it reduced when a voucher or loyalty reward pays for the service. Defaults in Judgement: calculate on the net-of-VAT price actually earned after discount, with the rule shown to the stylist.
- **Rent-a-chair / self-employed stylists:**
  - HMRC says renting a chair does not automatically make someone self-employed. It looks at control (hours, prices, clients), financial risk, the right to send a substitute and who supplies the products (**Verified**: https://www.gov.uk/guidance/check-employment-status-if-you-work-in-hair-and-beauty).
  - VAT: chair rental is normally a standard-rated supply, not exempt, because it includes integral salon services (**Verified**: https://www.gov.uk/hmrc-internal-manuals/vat-land-and-property/vatlp19820). Who makes the supply to the client in a hairdressing business can be one of three arrangements (**Verified**: https://www.gov.uk/hmrc-internal-manuals/vat-taxable-person/vtaxper68600).
  - **Product consequence (proposal):** a "payee" on each stylist. **Employed**: the salon receives all money and pays commission. **Renter**: sales are attributed to the renter, and either (a) a **separate till profile** pays money to the renter, or (b) a **split payout** pays the salon's rent or percentage and the remainder to the renter. Fresha lists a "Multi merchant" feature that routes payments directly to independents (**Verified**), so this need is real. Stripe Connect is the standard tool for split payouts but **has not been assessed** for fit and fees.
  - The employment-status and VAT answers differ per case. SalonOS must record the setting and **not** decide it.
- **Tips:** under the **Employment (Allocation of Tips) Act 2023** (in force 1 Oct 2024), qualifying tips (including card tips paid to the employer) must go to workers without deductions, be allocated fairly under a written policy, be recorded for three years and paid by the end of the following month (6.7). The ledger therefore needs a **tips liability account** and a monthly tips-distribution report. Tips given directly in cash are not qualifying. This is **Draft, not legal advice**.

### 8.9 Gift vouchers, deposits and liability accounting

- **Gift vouchers are a liability until used.** The sale is not turnover in the salon's own books at the point of sale. Cash goes in, **voucher liability** goes up. When redeemed, liability goes down and revenue is recognised. (Accounting principle; **Reported** from general UK bookkeeping guidance, confirm with an accountant.)
- **VAT on vouchers (Reported):** a **single-purpose voucher** (UK supply and the VAT rate known at issue) has VAT charged on sale and not again on redemption. A **multi-purpose voucher** has VAT disregarded on sale and charged on redemption. Sources: https://www.gov.uk/guidance/business-promotions-and-vat-notice-7007, https://www.legislation.gov.uk/ukpga/1994/23/schedule/10B, https://www.gov.uk/government/publications/changes-to-the-vat-treatment-of-vouchers/vat-treatment-of-vouchers-from-1-january-2019. A salon voucher usable for any service with mixed VAT status may be multi-purpose in some cases: **an adviser must confirm**. VAT-registered status is a placeholder: [OPERATOR VAT POSITION].
- **Expiry:** whether and how a voucher may expire under UK consumer law was **not verified**. Stage 3 task. Do not hard-code an expiry rule.
- **Deposits held vs earned (Judgement, and standard bookkeeping):** a deposit paid at booking is **held** as a liability (customer deposits). It becomes **earned revenue** when the service is delivered, or when the **no-show or late-cancellation term** is applied and the deposit is forfeited. The VAT tax point for a deposit is **not verified** and is a Stage 3 item.
- **Suggested ledger accounts (proposal):** Cash/Till, Card clearing (Stripe), Deposits held (liability), Voucher liability, Loyalty liability (if points are valued), Tips payable (liability), Service revenue, Retail revenue, Discounts, Processor fees (expense), Refunds, Rounding/over-short. Each money event touches at least two accounts. The finance API adapters in section 7 post from this list.
- **Loyalty:** Tony's rule is 1 point per £1 with 12-month inactivity expiry. Whether points are a **financial liability** is an accounting judgement. Default (Judgement): treat points as marketing cost and record the discount when redeemed, rather than accruing a liability.

### 8.10 Stock: back-bar vs retail, purchase orders, suppliers, stock takes

- **Two stock pools.** **Retail** stock is sold at the till (Tony's retail list). **Back-bar** stock (colour tubes, developer, shampoo for the basin, foils) is consumed in services. Retail drops by one on sale. Back-bar drops by **grams used** from colour formulas (8.5) or by a per-service allowance. Phorest lists an option to "deduct professional products from stock" (**Verified**), so competitors already link the two.
- **Purchase orders:** low-stock alert (Tony's brief) creates a **suggested order** per supplier with a reorder level and pack size. The order is **drafted** in the product and sent by the owner outside it in v1 (email or the supplier's website). Direct supplier ordering integrations were **not found** and are not proposed.
- **Suppliers:** **Salon Services** is the trade brand of Sally Europe and needs a free Trade Card plus proof of trade status (Level 2+ qualification, public-liability insurance, Hairdressing Council ID or a Salon Services course certificate). **Sally Beauty** is the retail brand open to the public (**Verified**: https://www.salon-services.com/traderegister). Brand distributors for Olaplex, K18 and others set their own trade terms: **not assessed**.
- **Goods in:** scan or tick against the delivery note; record the cost price (so margin can be reported), quantities, and discrepancies.
- **Stock takes:** a count screen (scan or type), variance report, and an adjustment that posts to the ledger (loss or write-off). Phorest lists "Record stock takes" (**Verified**).
- **Expiry and batch tracking** for colours and treatments is **not proposed** for v1 (extra complexity). Flag to Tony.

### 8.11 Owner reports

The reports an owner uses every week, with definitions the code must follow. The benchmark ranges quoted in blogs are rules of thumb: **Unverified**, shown only as context.
- **Rebooking rate** = clients who book their next visit before leaving ÷ clients served × 100. Published examples range from 44% (SalonIQ, 2018) up to 78%, with 60% to 80% often suggested as a target (**Unverified**, vendor blogs).
- **Retail per client** (and **retail-to-service ratio** = retail ÷ service sales × 100). UK commonly quoted 15% to 25% (**Unverified**).
- **Chair/stylist utilisation** = booked service hours ÷ available (rota) hours × 100. A target of 75% to 85% is often quoted (**Unverified**).
- Also: takings by tender, takings by staff (services and retail separately), average ticket, new vs returning clients, no-show and late-cancel rate, deposits held, voucher liability movement, colour cost vs colour charged, stock value and low stock, and commission payable. Each is a query on the append-only ledger and bookings, not new data.
- Every report must state its definition on screen so staff do not argue about the number.

### 8.12 Data migration and multi-site

- **From Fresha:** Clients > Clients list > Options > CSV or Excel. Needs the "Can download clients" permission. On mobile: Clients > Actions > CSV (**Verified**: https://www.fresha.com/help-center/knowledge-base/clients/58-export-your-client-list). Appointment history and sales exports were **not assessed**.
- **From Phorest:** use the **Top Clients** report with the date range and client count set to the totals (**Verified**: https://support.phorest.com/hc/en-us/articles/360019038240). A **single client export** (Client Card > Client actions > Export) gives a ZIP with contact details, appointments and transactions.
- **From paper:** a bulk-entry screen for name, phone, last visit, formula and patch-test date. **Realistically, paper records are the least reliable data: formulas will be missing, and patch-test dates are the legal risk.** Treat every imported client as "patch test unknown" unless a dated, signed record is entered. (Judgement.)
- **Consent in migration:** import a client's contact details for service messages only. Marketing consent is **not** carried over unless the old system recorded it (6.2).
- **Import tooling (proposal):** column mapping, a dry-run preview with duplicates (same phone or email) flagged, and a rollback.
- **Multi-site:** the brief is one salon. Multi-site is **later**. The data model should carry a `site_id` from day one so that adding sites does not need a rewrite (Judgement). Fresha offers multiple locations on its Team plan (**Verified**).

### 8.13 SMS and WhatsApp reminders and costs

| Channel | Price | Notes | Confidence |
|---|---|---|---|
| Fresha (what a salon pays on that platform) | 20 free texts per month, then £0.06 per text, or £0.05 to £0.10 per WhatsApp; marketing email 50 free then £0.02 | Useful as a benchmark for what SalonOS can charge or pass through. | **Verified** (fresha.com/en-gb pricing) |
| Treatwell | Free SMS confirmations and reminders advertised | Funded by commission and plan fees. | **Verified** (treatwell.co.uk) |
| Twilio SMS to UK | US$0.056 per segment outbound (short code US$0.0524) | Billed per **segment** and in USD. Long messages are several segments. | **Reported** (https://www.twilio.com/en-us/sms/pricing/gb) |
| WhatsApp utility template (UK) | £0.0159 per delivered message from 1 Oct 2026; volume tiers down to £0.0119 | Utility templates are charged even inside the 24-hour window under this rate card. | **Reported** (Meta rate card, via search summary). **Re-verify before quoting.** |

**Illustration (not a forecast):** 400 reminders per week at 6p = £24 per week, about £1,248 per year, **before** any free allowance. WhatsApp at £0.0159 would be about £6.36 per week on the same volume (also before VAT or provider margin). Real volumes are Tony's to supply.

**Product rules:** a reminder send log, delivery status, an opt-out, cost per message shown to the owner, and a monthly cap. WhatsApp needs a registered business account and approved templates (**Reported**). Whether SalonOS resells messages or the salon brings its own provider is a **business-model decision for Tony**.

### 8.14 Accessibility, training time and support

- **Accessibility:** public booking page and till should meet **WCAG 2.2 AA** as the practical benchmark (6.8): contrast, keyboard use, labels, text resizing, touch targets sized for a tablet. The salon's duty under the Equality Act is to make reasonable adjustments, for example phone booking staying a first-class route.
- **Staff training:** these are **targets to validate with real users, not facts**: a receptionist should take a booking, a walk-in and a split payment unaided after about one hour of guided practice; a stylist should use the phone view after about 15 minutes. If testing shows longer, the interface needs to be simpler.
- **Support needs:** a printed one-page "if the internet is down" card; a visible sync status; a daily backup; a named support route (email and phone hours): **[OPERATOR EMAIL]**; a status page. Salon Iris advertises "stress-free UK based software support" (**Verified** on its page), so owners will expect a human.
- **Security basics:** per-user logins with roles (owner, manager, reception, stylist), two-factor for owner and manager, auto-lock on the till, and PIN switching so staff do not share a login.

---

## 9. Architecture recommendation (production-grade) and v1 vs later

**This is my recommendation (Judgement), not a decision.** It is chosen to match the real-world needs in section 8, not to be fashionable. All components are named products with public documentation.

### 9.1 Principles
1. **Postgres is the source of truth.** It guarantees double-booking prevention (8.3), money integrity and audit.
2. **Money is boring.** Integer pence only. An append-only ledger. Corrections as new events. Every external call (Stripe, accounting, SMS) goes through an **outbox** table with retries, and every inbound **Stripe webhook is idempotent** (processed once by event ID).
3. **Local-first client.** The front-desk app keeps a local SQLite database in the browser and a queue of pending writes, so it keeps working through an outage (8.2). A sync service such as **PowerSync** (local SQLite WASM, offline queue, server-authoritative conflict handling, Postgres replication; https://docs.powersync.com/) fits this. ElectricSQL is an alternative (**Reported**). The choice should be tested with a spike, because browser storage and iPad Safari have limits.
4. **Server decides conflicts.** The client proposes, the server accepts or rejects. Rejections surface to a human.
5. **Auditable by default.** Who did what and when on client cards, patch tests, refunds, voids and drawer opens. Point-in-time database backups.
6. **Privacy by design.** Role-based access to client health data. Row-level security per tenant if multi-tenant.

### 9.2 Components
| Layer | Recommendation | Why | Status |
|---|---|---|---|
| Front desk | Installable web app (PWA) on PC/tablet; stylist phone view; public booking page | One codebase; works on Windows, iPad, Android | Judgement |
| Local data | Browser SQLite with sync queue (PowerSync-style) | Offline diary and sales | Reported (docs) |
| API and database | A Postgres database (for example Supabase or any managed Postgres) behind an API | Exclusion constraints, transactions, row-level security, point-in-time recovery | Verified for constraints; hosting is a choice |
| Hosting | **Cloudflare Pages for the front end and Workers for the API**, per Tony's standing rule | See flag below | Per Tony's rule |
| Serialising writes (optional) | Cloudflare **Durable Objects**, one per site: single-threaded, transactional SQLite storage; `blockConcurrencyWhile` has a 30 s timeout | Could hold the live diary and push realtime updates | Reported (Cloudflare docs); not required for v1 |
| Payments | Stripe: Terminal reader, SetupIntent for cards on file, webhooks | Best API; limits in 8.1 and 8.2 | Verified |
| Printing | Network ePOS-Print for Epson, or a small native print bridge | Safari/iPad cannot use USB/Bluetooth from a web page | Verified (caniuse); Epson docs |
| Messages | SMS and WhatsApp provider behind an outbox | Costs and templates (8.13) | Reported |
| Finance | Internal ledger plus adapters (Xero, QuickBooks, FreeAgent, Sage) | Section 7 | Reported |
| Native shell (later) | iOS/Android wrapper to support Stripe Terminal offline and printing | Offline card needs native SDKs | Verified for the limits |

**Stage 8 hosting conflict (flag).** The pipeline spec's Stage 8 names **Vercel Hobby**. Tony's standing rule is that Vercel stays paused and he uses **Cloudflare Pages**. Also, Vercel's docs say the Hobby plan is restricted to non-commercial, personal use (**Verified**, https://vercel.com/docs/plans/hobby, opened 31 Oct 2026), which makes it unsuitable for a paying customer in any case. This report assumes **Cloudflare Pages** unless Tony says otherwise. **Tony must confirm.**

### 9.3 v1 for one shop vs later
| | **v1 (one salon, locked brief)** | **Later** |
|---|---|---|
| Diary | Shared diary, phone and walk-in booking, online booking into the same diary, exclusion constraint, active/processing segments, soft holds | Multi-resource optimisation, group bookings, waitlist automation |
| Till | Cash, card (Stripe smart reader on LAN + 4G failover), split tender, "external card" tender, drawer kick, receipts | Native offline Stripe, more terminals, customer-facing display |
| Offline | Local diary and cash sales with sync queue; offline banner | Offline card via native shell |
| Clients | Client cards, formulas (manual grams), patch tests with consent and signature | Scale integrations (Vish, SalonScale), photo AI |
| Money | Deposits, no-show charges with SetupIntent and recovery link, internal ledger, cash-up | Stripe Connect for renters, automated payouts |
| Staff | Tiers, commission (services and retail), rota basics, tips ledger | Payroll export, holiday automation, rent-a-chair split payouts |
| Retail | Stock, low-stock alert, goods-in, stock take, back-bar deduction | Supplier integrations, batch/expiry |
| Marketing | Reminders by SMS, promotions, loyalty (1 point per £1, 12-month expiry) | WhatsApp, campaigns, reviews |
| Finance | Ledger plus one adapter (stub) | All four adapters live |
| Scale | One site, `site_id` in the model | Multi-site and franchise |

Items in the **v1** column that go beyond the locked brief (active/processing segments, external-card tender, tips ledger, offline queue, drawer kick, back-bar deduction, goods-in) are **proposals**. Tony decides at the Stage 2 gate whether each is in or out. **No gift vouchers, rent-a-chair split payouts or offline card features are in the brief**, so they are flagged for decision.

---

## 10. Risks and recommended positioning

**Risks**
1. **Hardware and iPad limits** (printing, offline card). Mitigation: network printers, 4G failover, external-card tender, native shell later.
2. **Offline card payments in the UK are limited by card rules**, not by software (8.2). Mitigation: set expectations in writing.
3. **Legal wording** on deposits, no-show fees, tips, voucher VAT, retention. The product records the salon's settings and the customer's acceptance. It must **not** pretend to give legal or tax advice. Draft, not legal advice.
4. **Health data (patch tests, allergies).** Breach or over-retention is a regulator and trust risk (6.1).
5. **Competition is real and cheap.** Fresha charges per team member per month plus payment and text fees; Treatwell has a 35% + VAT commission only on new marketplace clients; Phorest is quote-based (**Verified**). A new product cannot win on price alone.
6. **Support burden.** A salon runs on one Saturday system. Downtime or a bad sync costs the owner money that day, so support is part of the product.
7. **Scope.** The brief is already large. Real-world additions (colour, patch test, offline, rent-a-chair, vouchers, stock) multiply it. See 9.3 for a split.
8. **Unverified competitor and pricing claims** (Shortcuts, Timely, Phorest prices) must not be used in marketing.

**Recommended positioning (Judgement).** An **independent-salon operating system built around the Saturday rush**: shared diary that cannot double-book, a till that handles split payments and drawer kicks, **patch-test and colour records done properly**, no-show deposits done fairly, and clean books (the ledger feeding Xero, QuickBooks, FreeAgent or Sage). Compete on **owner control, UK compliance and honest pricing** rather than marketplace reach. Avoid claims such as "works fully offline" until native offline card is built.

---

## 11. Sources (opened or searched on 31 Oct 2026)

**Competitors:** https://www.fresha.com/en-gb/pricing · https://www.fresha.com/help-center/knowledge-base/clients/58-export-your-client-list · https://biz.booksy.com/en-gb/pricing · https://www.treatwell.co.uk (partner pricing) · https://www.phorest.com/gb/pricing/ · https://support.phorest.com/hc/en-us/articles/360019038240 · https://support.phorest.com/hc/en-us/articles/360016273340 · Salon Iris (saloniris.com) · Timely and Shortcuts (no full published prices found).

**Pricing and retail benchmarks:** https://www.appointica.com/uk-salon-report · Headmasters and Glasshouse service pages · https://k18hair.co.uk/products/molecular-repair-hair-oil · uk.olaplex.com · kerastase.co.uk · uk.moroccanoil.com · https://uk.colorwowhair.com/products/dream-coat-anti-frizz-treatment · ghdhair.com · professionalbeauty.co.uk.

**Law and regulation:** https://www.gov.uk/guidance/writing-a-fair-contract-for-customers · https://www.legislation.gov.uk/ukpga/2015/15/section/62 · https://www.gov.uk/tips-at-work · https://www.gov.uk/register-for-vat · https://www.gov.uk/how-vat-works/vat-thresholds · https://www.gov.uk/guidance/find-out-if-and-when-you-need-to-use-making-tax-digital-for-income-tax · https://www.gov.uk/holiday-entitlement-rights · https://www.gov.uk/guidance/check-employment-status-if-you-work-in-hair-and-beauty · https://www.gov.uk/hmrc-internal-manuals/vat-land-and-property/vatlp19820 · https://www.gov.uk/hmrc-internal-manuals/vat-taxable-person/vtaxper68600 · https://www.gov.uk/guidance/business-promotions-and-vat-notice-7007 · https://www.legislation.gov.uk/ukpga/1994/23/schedule/10B · https://ico.org.uk (special category data; PECR) · https://www.equalityhumanrights.com (Code of Practice, chapter 7) · NHBF patch-test guidance.

**Payments and hardware:** https://stripe.com/gb/pricing · https://docs.stripe.com/terminal/features/operate-offline/overview · https://docs.stripe.com/payments/setup-intents · https://docs.stripe.com/payments/cits-and-mits · SumUp UK, Dojo UK, Square UK pricing pages · Epson TM-T20III technical reference · caniuse (Web Bluetooth/WebUSB).

**Colour, suppliers, messaging:** https://getvish.com/product-features/ · https://docs.getvish.com/docs/tablet-mixing/ · https://faq.saloniq.com/knowledge/what-is-vish · https://www.salonscale.com/en-us/pricing · https://www.greensaloncollective.com/pages/reports · https://www.salon-services.com/traderegister · https://www.twilio.com/en-us/sms/pricing/gb · Meta WhatsApp pricing (via search summary).

**Technology:** https://developers.cloudflare.com/durable-objects/ · https://docs.powersync.com/ · PostgreSQL documentation (exclusion constraints, `btree_gist`) · Xero, Intuit, FreeAgent and Sage developer documentation (links in section 7).

---

## 12. Consolidated Unverified list (do not rely on these)
1. Phorest, Timely and Shortcuts prices (third-party or snippet figures).
2. Dojo 12-month minimum term.
3. Vish scale and subscription prices; no UK price listed.
4. Kérastase Elixir Ultime 100ml £42 (the official page showed a different product and size); Olaplex N°5 price (page 404).
5. KPI benchmarks (rebooking, retail ratio, utilisation) are vendor-blog rules of thumb.
6. Colour processing times and training times (design targets to validate).
7. WhatsApp UK price and Twilio price (search summaries): re-verify.
8. Deposit VAT tax point, voucher expiry law, and the Consumer Contracts Regulations 2013 interaction with online bookings: not checked.
9. Any exception to "no deductions" on card tips under the tips code.
10. Whether terminal hardware prices are VAT-inclusive (Stripe, Dojo).
11. Stripe UK "Private preview" availability for one reader row.
12. Insurer rules on patch-test re-test and retention beyond the NHBF example.
14. Appointica's price data is published "from" mid-points on salon websites, not what clients pay, and Appointica sells salon software.
15. The exact URL of the Professional Beauty article (domain and date only).
16. Whether the salon (as a controller) must register for the ICO fee, and [ICO REGISTRATION] status.

---

## 13. Amendments 01: real-world research

*Added 31 Oct 2026, after Tony's amendments of 21:30 GMT (saved in `00b-amendments-01-from-tony.md`, requirements A1 to A7). Stage 1 is still open and not approved. Stage 2 has not been started. Draft, not legal advice. Same confidence labels as above. Where I only saw a search summary, it is marked **Reported**.*

**The short version.** Tony's amendments turn SalonOS from a salon diary into a salon plus a UK-wide marketplace. The nails and loyalty parts are ordinary and well supported by the market. The marketplace is the hard part. It brings real legal and money questions that Tony must decide before Stage 2: who the client is buying from, how artists are paid, and whether artists are treated as independent. Section 13.9 lists them.

### 13.1 Nails: real UK menus and prices (requirement A1)

**What the market publishes.** Appointica's UK Salon Report (collected 6 to 8 Oct 2026) holds published "from" prices taken from salon websites. It is **Verified** as published data (I read the dataset directly). It is **not** what clients pay, and Appointica sells salon software. Median, with the middle half of salons in brackets, and the number of price points (n):

| Service | UK median (middle half) | London median (middle half) |
|---|---|---|
| Manicure | £23 (£18 to £30), n=905 | £23.50 (£18 to £30), n=195 |
| Gel manicure | £30 (£25 to £35), n=1,175 | £33 (£28 to £42.50), n=228 |
| Pedicure | £33 (£27 to £39.50), n=841 | £35 (£30 to £42.62), n=158 |
| Gel extensions or acrylics | £40 (£34 to £46), n=465 | £45 (£35 to £60), n=86 |

Brighton and Manchester have thin data (gel manicure £32.50 in Brighton, n=13; £25 in Manchester, n=15). Do not use them as benchmarks.

**Tony's current nail prices (base, Stylist tier):** Gel Manicure £28 (45 min), Gel Pedicure £35 (60 min), Builder Gel Overlay £38 (60 min), Full Set Extensions £48 (90 min), Infill £32 (45 min). Against the table: gel manicure is slightly under the UK median (£28 v £30), pedicure slightly above it (£35 v £33), and extensions sit above the UK median (£48 v £40) but inside the London middle half. That is **Judgement**, from a single dataset.

**Real salon price lists, opened 31 Oct 2026 (Verified as that salon's published prices):**

| Salon | Item | Price |
|---|---|---|
| Nail Lounge & Spa, Brighton (nailloungeandspa.co.uk/prices-brighton) | BIAB gel manicure | £37 (French finish £42) |
| | BIAB overlay (regular polish / gel polish) | £44 / £49 |
| | BIAB infill (regular / gel polish) | £44 / £49 |
| | Acrylic, hard gel, soft gel full set, gel polish | £55 (ombre £58, French £60) |
| | Infills, gel polish | £50 (French finish £55) |
| | Nail art | from £2 per nail; French finish £5; cat eye £5; chrome £8; extra detail, 3D or gems from £5 |
| | Gel soak-off (with mani or pedi / alone) | £5 / £10 |
| | Extension soak-off | £15 or £20; repair from £3 per nail |
| Nails by Paige (nailsbypaige.shop/book-online), "from" prices | BIAB / BIAB with art | £25 / £27 |
| | BIAB infill / with art | £30 / £33 |
| | Acrylic extensions / French tips / with art / detailed | £35 / £38 / £37 / £40 |
| | Gel polish / with nail art | £20 / £22 |
| | Acrylic soak-off / gel soak-off / BIAB removal | £12 / £6 / £8 |
| The Lavender Spa, Epsom (thelavenderspa.co.uk) | Classic manicure (40 min) | £30 |
| | Quick manicure (20 min) | £18 |
| | Luxury manicure with paraffin mask (60 min) | £35 |
| | Gel manicure (45 min) | £35 |
| | Classic pedicure (45 min) | £40 |
| | Quick pedicure (20 min) | £20 |
| | Luxury pedicure with paraffin mask (60 min) | £45 |
| | Gel pedicure (45 min) | £45 |
| | Gel removal and buff (20 min) | £15 |

**Spa and luxury tier (Reported, search summary of five spa pages):** 60-minute luxury spa manicure about £35 to £50 and luxury spa pedicure about £40 to £50 outside London. Higher-end London spa menus were reported at £80 to £105 for signature pedicures and £70 to £80 for manicures. I opened only the Lavender Spa page. The London figures are **Reported** and not named, so treat as **Unverified**.

**Blog ranges (secondary, Reported, do not price from these):** SalonSearcher (BIAB full set £35 to £60 UK, London £55 to £75; simple nail art £1 to £5 per nail). NailAtlas (London gel polish £25 to £45; chrome all ten £10 to £20; simple art on 2 nails £8 to £18; freehand across ten £30 to £70; 3D £2 to £6 per nail; crystals £1.50 to £5 each). These are directory and guide sites, not salons.

**What this means for the menu (all Judgement, Tony decides the prices):**
- **The brief has no plain manicure, plain pedicure or spa tier.** Real menus all have them. Appointica's manicure median (£23) is the only wide-sample anchor. The Lavender Spa shows the usual ladder: quick (20 min), classic (40 to 45 min), luxury with paraffin (60 min), gel (45 min).
- **Nail art is priced in three real ways:** per nail (from £2 at Nail Lounge), as a finish for the whole set (French, cat eye, chrome, ombre at a flat add-on), and as "with art" variants of the base service (Nails by Paige adds £2 to £3). Tony asked for "designs and prices", so the menu needs a **nail art tier list** he can fill in. A suggested structure, with **no prices invented**: Tier 0 plain colour; Tier 1 simple (French, single-colour accent, chrome or cat eye as a flat finish); Tier 2 detailed (per-nail art, ombre); Tier 3 premium (3D, gems, freehand full set). Each tier adds **price and minutes**, which matters for booking (13.3).
- **Removal and repair are separate line items** in every real menu (soak-off, repair per nail). Treat as add-ons, with some free when rebooking (the Lavender Spa gives free gel removal before a gel service).
- **Photos of designs matter** (clients pick a look). A design gallery tied to a tier is a sensible proposal. Not researched further.

### 13.2 Loyalty club, promotional messages and the law (requirement A2)

**The law that governs marketing messages (UK).** The relevant rules are PECR (Privacy and Electronic Communications Regulations) and UK GDPR. ICO guidance is the source. The ICO pages appeared in search but **timed out when I tried to open them**, so everything below is **Reported** from the ICO guidance summaries. Re-open before the spec.
- Regulation 22 of PECR: no marketing email or text to an individual without specific consent, unless the **soft opt-in** applies. (Rules cover individual subscribers, including sole traders and some partnerships, not companies.)
- The soft opt-in needs all five: the details were obtained directly from the person; during a sale or negotiation for a sale; you market only your **own similar** products and services; an opt-out was offered when the details were taken; and every message carries a simple, free opt-out.
- Consent must be **specific to the channel**. A generic "contact me" is not specific enough, and consent to calls does not cover texts.
- Keep a record of **when and how** consent was given and what it covers, plus a do-not-contact list. Do not message someone after they opt out, even to ask them to opt back in.
- **Fines (Reported, ICO statement of Feb 2026 as shown in search):** the higher PECR penalty regime started on 5 February 2026: up to £17.5m or 4% of worldwide turnover, whichever is higher. Not opened. **Unverified** until checked on the ICO or legislation.gov.uk.

**Design consequence (Judgement).** Loyalty club sign-up should be a **tick-box per channel** (email, SMS, push), unticked by default, each stored as a consent record (who, when, which wording version, which page, channel). Appointment reminders and receipts are service messages and should be sent separately from marketing. Whether service messages count as "direct marketing" under ICO guidance was **not checked**: **Unverified**. "New product deals" in a salon retail context are probably fine for a salon's own similar products, but a deal from another business is not, which is why the per-channel consent matters.

**Channels and real costs:**

| Channel | What matters | Cost (source, label) |
|---|---|---|
| Web push | Needs a PWA. On iPhone and iPad (iOS 16.4 or later) it only works for a site added to the Home Screen and opened as a web app, and the permission prompt must come from a tap inside it. A Safari tab cannot subscribe. Each push must show a notification immediately or Safari removes permission. No Apple Developer membership needed. | Free to send. **Reported** from excerpts of Apple developer docs and the WebKit blog (apple.com, webkit.org). |
| Email, transactional | Resend: Free 3,000 emails a month, capped at 100 a day; Pro $20 a month for 50,000. | **Verified**, resend.com/pricing, opened 31 Oct 2026. Postmark: $15 a month for 10,000 (**Reported**). |
| Email, marketing | Resend marketing is priced by contacts: Free 1,000 contacts, $40 a month for 5,000. Broadcasts only go to stored contacts and handle unsubscribe links. | **Verified**, same page. |
| SMS | Fresha charges 6p per text to salons (**Verified**, earlier). Twilio GB list price US$0.056 a segment (**Reported**). Illustration: a club of 2,000 members getting one promotional text a month at 6p is £120 a month. | Arithmetic is mine; prices as stated. |
| WhatsApp | £0.0159 per UK utility message (**Reported**). Marketing template prices and opt-in rules **not checked**. | **Unverified** for marketing use. |

**Cost view (Judgement):** email and push are close to free for a single salon. SMS is where the money goes, so it should be an opt-in channel with a monthly cap per member, and the earlier question (do SMS costs pass through to the salon?) still stands.

**If the club is paid.** Tony's original brief already lists a Monthly Membership package (fixed monthly), and Bridal Hair + Makeup as quote-only. The DMCCA subscription-contract rules are reported as starting on **1 January 2027** for contracts made from that date (**Reported**, search summary of legislation.gov.uk and a law-firm note; not opened). A free points club is probably outside them. Check before any paid membership goes live.

**How competitors do loyalty (Reported).** Fresha: points, up to five tiers, referrals, rewards that are discounts, free services or products, redeemable online or at checkout; memberships are a separate recurring product. Phorest: "TreatCard" points from paid services and products, balances in the booking portal or app, rewards can be limited to first-time purchases. Neither was opened beyond help-page summaries.

**The locked loyalty rule stays.** The brief says 1 point per £1 on completed paid services and retail, points expire after 12 months of inactivity, optional tiers, fixed rewards, points only after final payment is confirmed, manual adjustments logged. Tony's amendment adds the **online club and the messaging** on top of that. It does not change the points rule. Competitors' points, tiers and fixed rewards (above) match its shape.

### 13.3 Booking engine design: variable durations, regular artist, home and wedding (requirements A3 to A5)

**What competitors do (Verified, Fresha help page opened 31 Oct 2026):** the client chooses treatments first, can pick several in one appointment, and (if enabled) a specialist per service. The client then sees real-time availability from the calendar and shifts, and confirms with price shown. A deposit or card capture can be required. Bookings need a client account. **Reported:** "any professional" is auto-assigned to an eligible free team member; extra time can be blocked per service and is invisible to clients; travel time must be added by hand; Fresha has no distance-based service-area limit, a travel fee is only available at in-person checkout, not online (Fresha help pages via search summary). So the competitor gap is genuine for **travel time, radius and travel fees online**.

**Design that fits Tony's wording (Judgement, built on the exclusion-constraint design in section 9):**

1. **Treatment first, slot second.** Total booked time = base duration of the service (per artist, since a junior takes longer) + add-ons (nail art tier, removal, repair) + after-service buffer (clean-down, patch-test wait). The slot search only offers start times where **that whole block** is free for the chosen artist. Different treatments therefore naturally take different lengths.
2. **Processing segments.** Colour keeps the active, processing, active segments from section 9: the artist is free during processing. Nails with curing do not need this.
3. **Regular artist.** A client profile stores "my artist" per service type (hair, make-up, nails). Online booking shows only that person's availability unless the client opts to see others. If the artist is off, offer the nearest slots with them first, then "any artist". Booking is never silently moved to someone else.
4. **Multi-service, multi-artist.** One visit can include a colour with one artist and a nail service with another. The engine holds both blocks together or neither (one database transaction). This is how real front desks work, and it matches Fresha's flow.
5. **Home visits.** Each artist has a base postcode, a service radius, working hours and a minimum gap between jobs. A home job blocks **travel time before and after** (from the previous job or base) as unavailable time. Offer slots only if the client's address is inside the radius and travel fits the gap. A **travel fee** is added online when outside the free radius. **Real examples (Verified, opened):** Suzanne Dusek Makeup: travel within 10 miles included, then £0.60 a mile; Libby Addyman MUA: 15-mile radius included, then £0.60 a mile for 2026 events. Travel time itself needs a mapping or routing service. **I did not research routing API cost: Unverified.** For v1, a straight-line distance or postcode-district check is a cheaper start (**Judgement**).
6. **Weddings and events.** One **event booking** with party members (bride, bridesmaids, mother, guests, flower girl), each with a service, an artist and a start time, built on top of the same slot engine. Needed extras that real artists charge: a **trial** (a separate earlier appointment), an **extra artist fee**, a **split venue or moving fee**, and a **minimum spend**. From Suzanne Dusek's price list (Verified): bridal trial from £215 (hair and make-up), day-of bride from £350, bridesmaid £165, additional artist £150, split venue £60, minimum spend £400 to £450. These are one artist's published "from" prices, **not a UK benchmark**.
7. **Deposit schedule for events.** Real terms found (Verified, both opened): Libby Addyman: 25% non-refundable deposit; balance 7 days before; cancel more than 6 weeks before forfeits the deposit; within 6 weeks charged in full; trial non-refundable; artist illness means a full refund and an attempt to find a replacement. Suzanne Dusek: £100 non-refundable booking fee deducted from the balance; trial paid the day before; balance 28 working days before; free cancellation with 16 weeks' notice, then a sliding fee. The engine should support a **configurable schedule** (deposit, trial payment, balance date, cancellation steps) per artist, shown to the client before they pay. GOV.UK says cancellation charges "must not be excessive and should reflect steps you can take to minimise your losses" (from section 6), so "non-refundable" terms must be set carefully. Consumer Contracts Regulations fit is still **Unverified** (item 8 in section 12).
8. **Capacity guard.** An artist's availability has to be a **calendar they control** (shifts and days off), because that is also what makes them independent (13.5).

### 13.4 Marketplace: the seller, the contract and the liability (requirement A6)

This is the biggest decision. Tony said artists place adverts, "all enquiries go through the sites channels and work sub contracted". Two ways to run it, and they change the law, the money and the VAT:

| | **Model 1: site sells** (site is the "merchant of record") | **Model 2: artist sells** (site is an introducer) |
|---|---|---|
| Client buys from | The site (customer sees the site brand) | The artist (customer sees the artist's name) |
| Who must perform with reasonable care and skill (CRA 2015 s49) | The site, as trader. **Reported:** a trader stays liable for a subcontractor. | The artist |
| Refunds, disputes and chargebacks | Site | Artist (site still handles the platform side) |
| Stripe set-up | Destination charge without `on_behalf_of`, or separate charges and transfers (**Verified** below) | Direct charge, or destination charge with `on_behalf_of` |
| VAT | Site likely supplies to the client (**Unverified**, adviser needed) | Artist supplies; site's VAT is on its commission (**Unverified**) |
| Fits Tony's words | **Yes**, "subcontracted" and "all enquiries through the site" | Partly |

**What I verified.**
- **CRA 2015 section 49 (Verified, legislation.gov.uk opened):** every contract to supply a service includes a term that the trader must perform the service with reasonable care and skill. That the trader cannot avoid this by subcontracting, and that the term cannot be excluded in a consumer contract, are **Reported** (Dispute Resolution Ombudsman, the TUI v Morgan case, CRA s57; not opened).
- **Stripe merchant of record (Verified, docs.stripe.com/connect/merchant-of-record, opened):** the MoR is "the entity that the customer understands they're buying from" and is responsible for refunds and disputes. It is decided from the customer's view, not the technical charge type. Your site, checkout, terms, receipts, statement descriptor and Stripe config must all show the same entity or card networks may scrutinise and fine. For a **platform MoR** the allowed flows are destination charges without `on_behalf_of`, or separate charges and transfers without `on_behalf_of`.
- **Hairdressing is unregulated in the UK (Verified, House of Commons Library, published 10 Jul 2026):** no licence, no statutory qualification; the register under the Hairdressers (Registration) Act 1964 is voluntary (about 10% are registered, estimated). Hairdressers are subject to the Consumer Rights Act 2015. Local authority byelaws may set requirements for premises. So the site **cannot rely on the law** to check hair artists. It must do its own vetting.

**Recommendation (Judgement):** use **Model 1** (platform sells, artist is a subcontractor) because it matches Tony's description, gives the client one point of contact and one set of terms, and is how Urban and Blow present themselves (13.7). The cost is that **SalonOS takes on the client's refund, dispute and care-and-skill risk**, so it needs vetting, insurance checks, a claims process and the right to recover from the artist by contract. Tony must confirm this (question 4 in the amendments file).

### 13.5 Marketplace: are artists really independent? (employment status, IR35)

- **HMRC hair and beauty page (Verified, opened, published 9 May 2025):** a mobile stylist or beauty therapist, working at their own home or a client's home, can be self-employed. Signs of self-employment: you decide your hours, days and time off; you provide your own clients; you may choose and buy your own products; you decide how much you charge. Signs of employment: the salon sets hours, provides clients and products, sets tasks and pays a set rate. A mixture means using HMRC's Check Employment Status for Tax tool. Even if self-employed for tax, a person may have **worker status** for employment law.
- **Risk for SalonOS (Judgement):** if the platform sets the price, assigns jobs, sets hours, supplies products or decides how the work is done, artists start to look employed. Design to keep them independent: artists set their own prices and hours, can decline jobs, bring their own kit and products, and can send a qualified replacement only if the contract allows.
- **IR35 (Verified, GOV.UK opened, updated 26 Feb 2026):** it applies when a worker provides services **through their own intermediary** (usually a limited company, a partnership or another individual) and would have been an employee if working directly. For a **small client** outside the public sector, the worker's intermediary decides status; otherwise the client does. So for artists who are sole traders, IR35 itself is **not** the test; the normal employment status test is. For artists who work through limited companies it can apply. **Whether SalonOS counts as a "small" client** was not checked: **Unverified**.
- **Chair-rental commission model (Verified, same HMRC page):** an example barbershop agrees a commission with each self-employed barber under a written contract, treats the commission as rent for the space, adds VAT, and invoices the barber. That is a salon-premises model, not a marketplace, but it shows HMRC accepts commission as a price for a service with a written contract. Whether it fits an online marketplace is **Unverified**.
- **Adviser question:** "Self-employed subcontractor with commission, site as principal" is a combination that an accountant or employment adviser should sign off before launch.

### 13.6 Marketplace: money, payouts and platform reporting

**Stripe Connect UK (Reported unless stated).**
- **Express accounts:** Stripe handles onboarding, identity checks and KYC for each artist. The platform can set payout schedules and is typically responsible for refunds, disputes and losses on Express accounts, so it must vet artists. (Reported from Stripe docs summaries.)
- **Fees (Reported from stripe.com/gb/connect/pricing summary):** if you handle pricing, £2 per monthly active account (an account that was paid that month) plus 0.25% + 10p per payout sent; Instant Payouts 1% of payout volume. If Stripe handles pricing, no platform fees and Stripe bills each artist for payment fees. These are on top of card processing fees, which I did not confirm for the platform (**Unverified**). Re-check on the pricing page before any budget.
- **Scheduled payout date (Verified, docs.stripe.com/connect/manage-payout-schedule, opened):** payouts can be set to manual, daily, weekly (chosen days of the week) or monthly (chosen days of the month; 29th to 31st are sent on the last day of shorter months). The platform can lengthen the delay before funds become available, up to 31 days, on accounts where it owns dispute liability. So Tony's "regular payment date set up with each personal artist" is supported directly (for example every Friday, or the 1st of each month).
- **Recommended money flow (Judgement):** take the card payment as the platform (destination charge or separate charge and transfer, without `on_behalf_of`, as the platform is the seller), hold funds until the job is marked complete, then release the artist's share (price minus commission) to their connected account, and let Stripe pay out on their set day. A refund then **reverses the transfer** (Reported) so the artist's share comes back. Use a ledger line for each step, as in section 9.
- **Competitor pay timing (Verified):** Urban pays every Friday, with a weekly statement by Tuesday 4pm; pros have 14 days to query a statement. Blow pays weekly (Reported). Good defaults to offer, Tony picks.
- **Open legal point (Unverified):** holding client money and paying it to others can bring payment-services rules (FCA). Marketplaces usually pass this risk to a regulated payments provider such as Stripe Connect. I did not research the exclusions. Ask an adviser.

**Platform reporting to HMRC from 1 January 2024 (Reported from GOV.UK pages: "selling goods or services on a digital platform", "check if you need to register as a digital platform operator"; not opened).**
- Digital platform operators must collect and verify seller details, and report each qualifying seller's income to HMRC each year by 31 January for the previous calendar year (first report due 31 Jan 2025). Sellers must also get a copy. Keep records for 5 years.
- Details collected: for individuals, full name, address, date of birth and National Insurance number (UK residents); for entities, legal name, address and company number; partnerships, UTR.
- The small-seller exemption for goods does not apply to **services**, so artists are in scope.
- A platform operator must register with HMRC as a reporting operator, or as excluded. A sole trader selling **only its own services** is not caught, but a marketplace for other people's services probably is. **SalonOS's status is [OPERATOR VAT POSITION] and an adviser must confirm.** Reporting does not mean tax is due.
- **Design consequence:** artist onboarding must collect and store those details, flagged "verified", with an annual export. Stripe KYC may help but does not replace the platform's own duty (Reported).

### 13.7 Marketplace: what real platforms take and how they vet

| Platform | Model | Take rate | Vetting and payment | Label |
|---|---|---|---|---|
| **Treatwell** | Salons list; clients book | 35% + VAT on **new** marketplace clients only; none on repeat clients (new again after 365 days without a Treatwell booking); 2.5% + VAT on pre-payments; plans £9.99, £24.99 or £59 a month | Treatwell is a booking marketplace for venues | **Verified** earlier (treatwell.co.uk, 26/10/2026). |
| **Fresha** | Marketplace and software | 20% one-time on new clients, £4 minimum per client; "Multi merchant" payments route direct to independents | Reviews only from clients; 30-day edit window | **Verified** (fresha.com pricing and help pages). |
| **Booksy** | Software with marketplace | £40 a month plus £5 per extra user; one-time commission applies under its Boost feature | | **Verified** earlier. |
| **Urban** | Mobile beauty and massage in London; the platform is the seller to the client | Take rate **not published**. One third-party listing says Urban "keeps about 72%" (unclear whether that is the pro's share or the platform's), and a 2026 therapist report says 45% for massage. | Checks identity, criminal record, qualifications for each service, and insurance. Minimum NVQ Level 2 beauty therapy for nails, facials, waxing, lashes and brows; Level 3 for massage. Pays every Friday. Group bookings by enquiry form, 2 to 3 working days. | Vetting and payment **Verified** (urban.co pages, opened). Take rate **Unverified**. |
| **Blow LTD** | Mobile hair and make-up across the UK; instant prices from a network; secure online payment | A 2018 source says 40% per service; **not current**. | Pros set availability, pick jobs, paid weekly; join via a WhatsApp onboarding team. | Instant prices, secure payment and WhatsApp onboarding **Verified** (blowltd.com opened). Weekly pay, job choice **Reported** (app listing). 40% **Unverified**. |
| **Bidvine** | Lead marketplace (pros paid for leads, not commission) | Credits at about £1 + VAT each, 3 to 10 per bid (**Reported**) | **Bidvine has gone into administration**; Bark says it cannot honour credits (**Verified**, bark.com page, opened). | Administration **Verified**; credit price **Reported**. |

**What this tells Tony (Judgement).** Real commissions in this space run from 20% to 35% (Fresha, Treatwell, only on new clients) up to a reported 40 to 45% on the mobile platforms that act as the seller (Urban, Blow; not confirmed). Treatwell and Fresha only charge on **new** clients, so they do not take a cut of repeat clients. If SalonOS charges on every booking and every repeat, artists have a strong reason to take regulars off the platform. This is the "non-circumvention" clause in 13.8 and a **commercial decision for Tony**. Bidvine's collapse is a reminder that a lead-selling model is fragile; Tony's model (commission on completed work) is closer to Urban and Blow.

**Reviews and disputes (Reported).** Fake and misleading reviews, and hidden incentivised reviews, have been banned under the Digital Markets, Competition and Consumers Act 2024 rules from 6 April 2025 (CMA fake reviews guidance; not opened). **Design:** reviews only from a verified completed booking; show the artist; allow a public reply (Fresha does, Verified); keep a dispute record; set a time limit for claims (Urban uses 14 days for statement queries, Verified). **Refunds:** reverse the transfer so the artist's share returns (Reported).

### 13.8 Artist agreements and e-signing (requirement A7)

**Is an online signature valid? (Reported, Law Commission and Law Society pages; not opened.)** In England and Wales, a simple electronic signature (typed name, tick box, scanned signature) can validly sign a contract if the person intended to sign. Section 7 of the Electronic Communications Act 2000 makes e-signatures admissible as evidence. Deeds and some formal documents are stricter. A normal commission agreement is not a deed. **Unverified for the final contract:** an adviser should confirm.

**Options and costs:**

| Option | Cost (Reported, not opened) | Fit |
|---|---|---|
| Dropbox Sign | Essentials $15 a month, Standard $25 per user a month; separate API from $75 a month for 50 requests | Works, but API tiers are priced in dollars and by request count |
| DocuSign | Personal $11 a month on an annual plan, 5 envelopes a month; Standard $30 per user a month, up to 100 envelopes per user a year | Well known, cost grows per envelope |
| **Built-in signed acceptance** | No extra licence | Needs us to keep good evidence |

**Recommendation (Judgement):** built-in signed acceptance for v1. At onboarding the artist reads the agreement, types their name, ticks a clear "I agree" box, confirms with a one-time code to their verified phone or email, and the system stores the **exact contract version text, a hash of it, the signer, timestamp, IP and device, then emails a PDF copy to both sides**. Changes to commission need re-acceptance with notice before they apply. No listing goes live until the signature is stored and Stripe KYC is complete. A paid e-sign service can be added later if an adviser wants a stronger audit trail.

**Clauses an artist agreement should cover (Draft, not legal advice; each is a topic for the lawyer, not final wording):**
1. Parties and status: independent self-employed subcontractor, no obligation to take any job, no set hours, own tools and products. [OPERATOR LEGAL NAME].
2. The service and standards: reasonable care and skill; hygiene; patch tests and consultation; qualifications held (named per service).
3. **Commission:** percentage fixed and signed, what it is calculated on (price with or without VAT, travel fees, tips), when it changes and the notice needed.
4. **Payout date and method:** the artist's chosen day, via Stripe Connect; funds released after completion; statement for each period.
5. **Refunds, chargebacks and clawbacks:** the platform may reverse the artist's share if it refunds the client for poor work, with a fair process.
6. **Non-circumvention:** no moving clients introduced by the platform off-platform, for a stated fair period, and what counts as "new". Must be reasonable, not wide (competition and restraint-of-trade risk: **Unverified**).
7. **Insurance:** public liability at a stated minimum [£ AMOUNT TO BE SET BY OPERATOR], proof on onboarding, notice if it lapses, and automatic pause if expired. (Public liability is **Reported** as not legally required for a self-employed hairdresser; employers' liability only if they employ staff. Business.gov.uk and an insurer guide via search; not opened.)
8. **Cancellations and no-shows:** how fees are set, shown to the client first, and fair (GOV.UK, section 6).
9. **Substitution and non-attendance:** what happens if the artist cannot attend (weddings especially).
10. **Data and privacy:** who is the controller of client data (to be decided with an adviser: **Unverified**), health and patch-test data, no marketing to platform clients without consent (13.2), deletion at the end.
11. **Tips:** pass to the artist in full (the Tips Act covers employers and workers: whether it applies to subcontractors is **Unverified**).
12. **Platform reporting:** the artist agrees to give name, address, date of birth, NI number or company number for HMRC reporting (13.6).
13. **Conduct, safeguarding and ID checks** (Urban runs background checks and a zero-tolerance policy on suggestive behaviour: Verified): what checks apply and for what.
14. Suspension, termination, liability, indemnity, disputes and governing law (England and Wales).

### 13.9 What Tony needs to decide (before Stage 2) and the risks

**Decisions:**
1. **Who sells?** Model 1 (site sells, artist subcontracts) is recommended and matches his words. It brings refund, care-and-skill and VAT responsibility. Confirm.
2. **One product or two?** Marketplace and salon diary are very different jobs (public listings, vetting, payments to third parties, tax reporting). I suggest the marketplace is a **separate module** on the same diary, shipped after the salon core. Judgement.
3. **Commission and payout day.** Real range 20% to 35% on new clients (Fresha, Treatwell), and an unconfirmed 40 to 45% where the platform is the seller (Blow 2018, Urban massage). Charged on every booking or only new clients? Weekly, fortnightly or monthly payout?
4. **Vetting.** Minimum: ID, qualification per service, public liability proof, and an agreed standard (Urban's NVQ Level 2 for beauty is one real example; the law requires none for hair).
5. **Nail art tiers and prices** (none given; structure in 13.1).
6. **Free or paid loyalty club**, and which channels (push, email, SMS), with SMS cost rules.

**Risks (Judgement unless stated):**
- **Legal:** consumer-law liability on subcontracted work (Reported), employment status if the platform controls too much (Verified HMRC guidance), HMRC platform reporting (Reported), payment-services regulation (Unverified). A specialist adviser must review before launch.
- **Money:** the platform carries refund and dispute losses on Express accounts (Reported). Needs clawback terms and a small reserve policy.
- **Marketing:** a PECR breach is now reported to carry fines of up to £17.5m or 4% (Reported); consent records are not optional.
- **Operations:** a wedding with five people and two artists is a different job from a Saturday blow-dry; a no-show by the artist on the day is the worst failure and needs a replacement process.
- **Commercial:** leakage of repeat clients; marketplaces are hard to start (Bidvine administration, Verified).
- **Design:** the "own prices, own hours" independence rules cut against any platform control over price and rota.

### 13.10 Sources for section 13 (opened or searched 31 Oct 2026)

**Nails and prices:** https://www.appointica.com/uk-salon-report (dataset read directly) · https://www.nailloungeandspa.co.uk/prices-brighton/ · https://www.nailsbypaige.shop/book-online · https://www.thelavenderspa.co.uk/beauty-treatments/hands-and-feet/ · https://www.salonsearcher.co.uk/blog/biab-nails-cost-uk-2026-prices-options-and-what-to-budget-for · https://nailatlas.com/guides/nail-salon-pricing-guide

**Marketing law and channels:** ICO electronic mail marketing (https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/, timed out), ICO plan direct marketing, ICO statement on DUAA commencement (https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/02/statement-on-the-commencement-of-the-data-use-and-access-act-duaa/, timed out) · https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers · https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/ · https://www.resend.com/pricing (opened) · https://www.postmarkapp.com/pricing (search summary) · https://www.fresha.com/help-center/knowledge-base/clients/101619-client-loyalty-overview · https://support.phorest.com/hc/en-us/articles/360018449479-How-do-I-set-up-TreatCard-Rewards · https://www.legislation.gov.uk/ukdsi/2026/9780348287912 (search summary)

**Booking and events:** https://www.fresha.com/help-center/knowledge-base/online-presence/102398-learn-how-clients-book-appointments-online (opened) · https://www.fresha.com/help-center/knowledge-base/catalog/101630-add-extra-time-to-services-and-appointments-1 (search summary) · https://www.libbyaddymanmua.co.uk/termsandconditions (opened) · https://www.suzannedusekmakeup.co.uk/pricing/ (opened)

**Marketplace, law and money:** https://www.legislation.gov.uk/ukpga/2015/15/section/49 (opened) · https://commonslibrary.parliament.uk/who-regulates-hairdressers/ (opened) · https://www.gov.uk/guidance/check-employment-status-if-you-work-in-hair-and-beauty (opened) · https://www.gov.uk/guidance/understanding-off-payroll-working-ir35 (opened) · https://docs.stripe.com/connect/merchant-of-record (opened) · https://docs.stripe.com/connect/manage-payout-schedule (opened) · https://stripe.com/gb/connect/pricing (search summary) · https://docs.stripe.com/connect/express-accounts (search summary) · https://docs.stripe.com/connect/destination-charges (search summary) · https://www.gov.uk/guidance/selling-goods-or-services-on-a-digital-platform and https://www.gov.uk/guidance/check-if-you-need-to-register-as-a-digital-platform-operator (search summaries) · https://www.lawsociety.org.uk/topics/business-management/execution-of-a-document-using-and-electronic-signature (search summary) · https://lawcom.gov.uk/project/electronic-execution-of-documents/ (search summary) · https://sign.dropbox.com/products/dropbox-sign/pricing and https://ecom.docusign.com/plans-and-pricing/esignature (search summaries) · https://www.business.gov.uk/support/regulations-and-licensing/insuring-your-business/ (search summary)

**Competitors:** https://urban.co/en-gb/beauty (opened) · https://urban.co/en-gb/hero/article/How-does-payment-work-and-what-should-I-do-if-I-haven-t-been-paid (opened) · https://blowltd.com/ and https://blowltd.com/support (opened) · https://www.bark.com/en/us/bidvine/ (opened) · https://europe.republic.com/blowltd/sections/idea (2018 crowdfunding page, search summary) · https://www.treatwell.co.uk and https://www.fresha.com/en-gb/pricing (opened earlier)

### 13.11 New Unverified items (add to section 12)
17. Third-party take rates: Urban ("72%", direction unclear, or 45% for massage) and Blow (40%, from 2018).
18. Bidvine credit price and credits-per-bid (search summaries).
19. London luxury spa nail prices (search summary, spas not named); Appointica regional medians with n below about 20.
20. ICO soft opt-in wording, "service messages are not marketing", and the PECR fine level of £17.5m or 4% (ICO pages timed out).
21. DMCCA subscription start date (1 Jan 2027) and fake-reviews start (6 Apr 2025): search summaries.
22. Stripe Connect UK fee numbers and Express liability wording (search summary); card fees for the platform.
23. Whether holding and paying out client money needs FCA authorisation or an exclusion.
24. VAT position when the platform is the principal supplier (full price or commission only) and the artist's VAT.
25. Whether SalonOS is a "small client" for IR35, and the platform operator reporting status.
26. Validity of a built-in e-signature for the final contract; Dropbox Sign and DocuSign prices (search summaries).
27. Public liability not being legally required, and any local council rules for mobile hair and beauty artists.
28. Whether the Tips Act covers subcontracted artists.
29. Routing or mapping API cost for travel time.
30. Fresha help-page behaviours (extra time, no radius limit, travel fee at checkout only) and Treatwell "mobile providers" (search summaries).

*Draft, not legal advice. Nothing in this report has been sent, posted or published.*
