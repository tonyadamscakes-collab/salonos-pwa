# SalonOS: Tony's instructions log (00c)

Purpose: one place where every instruction from Tony is kept, with a timestamp, so nothing is dropped. Times are GMT (UK time on 31 Oct 2026). Source: relayed by the parent agent; the Grok Bot chief is the only one who talks to Tony.

**Honesty note on "verbatim" (revised 22:53 for OI-17):** entries marked VERBATIM are Tony's exact words as they reached me. The 21:45 entry now carries Tony's own words, supplied by the parent at 22:53. The **21:39 entry is still a RELAY**: it is the parent's written "verbatim summary", and Tony's long original ("Stage 1 review – clear decisions for Stage 2") was not passed to me. I looked in the parent transcript and shared memory and could not find it. The parent should paste it in if it must be exact. The 22:53 entry is exactly as the parent relayed it to me. Typos in Tony's words are kept.

Earlier messages (the original locked brief, 00-locked-brief-from-tony.md, and the 20:49 "has to work in the real world. not cyber fantasy land" steer) are kept in their own files and are covered by the traceability matrix in 02-product-spec.md.

---

## 1. 21:30 GMT, 31 Oct 2026: Amendments 01 (VERBATIM)
(Also saved in 00b-amendments-01-from-tony.md, message id pt754u.)

> nails designs and prices, manicure, pedicure, loyalty club online with regular notifications and emails on promotions, treatments, new products deals. aclient must be able to pick what treatment they want and book a slot that fits there treatment with different treatments taking longer. personal beauty artist - picking a slot with your regular hairdresser, make up artist, etc. home and wedding or event bookings. mobile hair and beauty artists can p[lace adds on the site for around the uk, with there own services but all enquiries go through the sites channels and work sub contracted. with a regular payment date set up with each personal artist. agreed commission pre signed and contracts good.

## 2. 21:39 GMT, 31 Oct 2026: Stage 1 approved; locked decisions (RELAY, parent's "verbatim summary"; Tony's long original "Stage 1 review – clear decisions for Stage 2" NOT AVAILABLE to me, OI-17 still open for this entry)
Tony approved Stage 1 and started Stage 2: the locked v1 product spec only. No code, nothing published or sent, no contact with other agents, stop for approval before Stage 3. Decisions relayed:

- IN v1: colour active/processing segments; external-card tender; tips ledger with full pass-through; offline diary plus cash sales queue; colour formula fields (grams, developer, waste); back-bar stock deduction from formulas; goods-in and basic stock take; simple gift vouchers (VAT flagged for adviser); rent-a-chair basic tracking (revenue split recorded, full payout later).
- Hosting: Cloudflare Pages preview. Vercel stays paused.
- Payments: Stripe primary, plus external tender for SumUp, Dojo and others. No deep terminal integration.
- Messaging: SMS/WhatsApp costs pass through to the salon, or the salon brings its own provider.
- Staff: mixed employed and self-employed/rent-a-chair; employment status is the salon's responsibility.
- Deferred from v1: true offline card payments, full multi-site, automated supplier ordering, advanced waitlist automation.
- Amendments 01 (A1 to A7) are locked scope; defaults D1 to D6 each marked "[DEFAULT – Tony to confirm]".
- Also asked: surface the "small group" vs multi-site tension (recommend single-site v1 with a multi-site-ready data model); every added proposal marked [ADDED] with its source; requirement counts, the 5 to 6 key points and the defaults in the report.
- Constraints: "Keep all placeholders." "Don't reduce the scope of the locked brief." "Never invent SKUs or prices."

## 3. 21:45 GMT, 31 Oct 2026: Main shop focus and catalogue (VERBATIM, Tony's original, supplied by the parent at 22:53; replaces the earlier RELAY)

> you know even when you employ staff you take responsibility in shop. no difference sub contracting, price structure might change yet. the artist market place is just an extra. the main shop site is what yoou need to concentrate on. getting full product databases of every different available products and treatments available. there are 1000s

(The earlier relay entry paraphrased this into five points. Those paraphrases were the parent's expansion, not Tony's words. The spec's catalogue section CAT still follows the parent's instruction to cover the taxonomy and fields listed there; Tony's own words are the text above.)

## 4. 21:46 GMT, 31 Oct 2026: Deeper research (VERBATIM)

> you didnt do much research i noticed

Relayed instruction that followed (parent's words, summarised): do a much deeper research pass before finalising; 15+ real UK salon and spa menus with names, durations and price ranges and URLs, aiming for 300+ distinct treatments; wholesaler catalogues and brand pro ranges; retry the ICO PECR, direct-marketing, UK GDPR, GOV.UK, HMRC platform-reporting and DMCCA pages until verified; patch-test guidance (HABIA/NHBF 48-hour rule, manufacturer instructions); competitor feature lists in depth (Phorest, Fresha, Timely, Shortcuts, Salon Iris, Booksy, Treatwell); "Cite every claim with a URL and never invent anything"; give source counts in the report.

## 5. 21:52 GMT, 31 Oct 2026: Booking journey and mail order (VERBATIM)

> they must be able to book their treatments and get to choose what branded product or special offers going and follow through booking system with options you have like select your regular artist/therapist/hairdresser etc. leading to check out. with a mail order service for selected products chosen by salonOS to retail online and some in shop.

Relayed instruction that followed (parent's words, summarised): spec one end-to-end online journey (1 pick a treatment; 2 choose the branded product used where relevant, price difference as a placeholder; 3 see and apply current offers; 4 choose regular or preferred artist or "anyone"; 5 slot that fits total duration; 6 add retail to basket; 7 check out with deposit, full pay or pay in salon via Stripe). Also online retail: per-SKU channel flag (online-only, in-shop-only, both); delivery options and placeholder shipping rates; fulfilment, dispatch and tracking emails; stock shared with the till; returns under the Consumer Contracts Regulations 14-day right with hygiene exceptions for sealed cosmetics verified from legislation.gov.uk or GOV.UK; distance-selling pre-contract information. Deep research to add how Phorest, Fresha and others handle online retail and add-ons, and UK courier options and rates (Royal Mail Click & Drop, Evri, DPD) with sources. Mark all [ADDED – Tony 21:52].

## 6. 21:53 GMT, 31 Oct 2026: Keep it together (VERBATIM)

> make sure everything stays together

Relayed instruction that followed (parent's words, summarised): "the most complicated site he's built". Save every Tony message verbatim in this file; add a traceability matrix to 02-product-spec.md mapping every clause of the original brief and every Tony message to requirement IDs with coverage status, gaps flagged, nothing dropped or reduced; add one integrated end-to-end flow section (prose and tables, no diagrams) showing how booking, catalogue, offers, loyalty, checkout, till, stock, online retail, staff and commission, cash-up and finance posting connect through shared entities (one client record, one stock ledger, one payments ledger); report the coverage result.

## 7. 22:53 GMT, 31 Oct 2026: Stage 2 approved with locks; proceed to Stage 3 (VERBATIM as relayed by the parent; message id pt763u)

> Stage 2 approved with these locks:
> - Keep all previously approved real-shop items (processing segments, external-card tender, tips ledger, offline diary/cash, formulas, back-bar, goods-in, stock take, in-shop gift vouchers, rent-a-chair basic, mail-order + click & collect).
> - Deposit default remains 20% or £15 (higher), fully editable per service.
> - New products default to in-shop only.
> - One site only.
> - Strike any Stage 2 proposal that is not required for a single high-street shop to run diary, till, cash-up and formulas on day one. Keep the optional marketplace as a stub only.
> - Hosting: Cloudflare Pages preview.
> Now proceed to Stage 3 (Legal & Contracts + Compliance). Draft all documents marked 'Draft, not legal advice'. Stop for my approval. No build.

Extra points from Tony, as relayed by the parent in the same hand-over (parent's wording): the 703-treatment catalogue seed must be freely editable and deletable by the salon; the deposit must be editable per service AND per salon.

How this was applied: see `02-product-spec.md` (tag [ADDED – Tony 22:53], [LOCKED – Tony 22:53], section 11.6 for the 47 rows moved out, MKS-01 and MKS-02 for the marketplace stub, SVC-15 and CAT-19 for the two extra points) and `03-legal/` for Stage 3.

---

## 8. 23:58 GMT, 31 Oct 2026: Stage 3 approved with six fine-tunes (VERBATIM as relayed by the parent; message id pt765u)

> Stage 3 approved with these fine-tunes:
> 1. Add a short home-visit / wedding booking agreement as LEG-22 (location, travel, cancellation, products, insurance, salon is the contracting party).
> 2. Strengthen declined-test wording so a manager must record the risk warning and that insurance may not cover it.
> 3. Confirm deposit and no-show fee stay fully editable and a no-show charge cannot exceed the deposit already taken unless separately agreed.
> 4. Keep gift vouchers in-shop only; VAT treatment remains a placeholder for the adviser.
> 5. Flag or extract the Operator privacy notice so it is not left buried in LEG-18.
> 6. Under-16 policy must note that the salon checks manufacturer instructions.
> Apply these, then stop. No build yet. Bring me the updated Stage 3 checkpoint.

Context from the same message (relayed as a summary by the parent, not word for word): Tony's "Stage 3 review" said the pack is high quality; the tight points were LEG-01 (salon as trader, CCR flag), LEG-02 and vouchers in-shop with the 14-day rule, LEG-16 (July 2026 Code withdrawal), the marketplace stub and the HEV-05 gap; the fine-tunes keep the pack tight, close the one real gap and make the high-risk clauses (patch tests, deposits, tips, vouchers) clearer for the solicitor without adding scope; once the updated checkpoint lands he will decide on Stage 4. **The full original wording of that review paragraph was not passed to me beyond this summary.**

How this was applied: see `03-checkpoint-summary.md`, section "Fine-tunes applied (23:58)"; `03-legal/` documents 01, 03, 09, 18, 20, new 22 and 23; spec rows PTT-05, PTT-06, TIL-13, TIL-14, HEV-05, trace row M-78, OI-18. No build.

## 01 Nov 2026 (Stage 4 preview feedback)
- 01:05 t778u: "now your going to add photos everywhere on the salon site. add a banner name and photos to all options, treatments, products, make a image of a high street hair and beauty shop on the highstreet with same name as site salonOS. bring the site into the modern world"
- 01:06 t779u: "this isnt up to my specs yet"
- 01:07 t780u: "change colours to nice flourescent colours mainly pink"
- 01:17 t781u: "and home page you have 9 noptions makeb it even number odd squares dont look good symeticly. spread them over the home bpage with better marketing"

## t784u — 01 Nov 2026 01:57 GMT — Stage 5 Finance Integration (verbatim)
Stage 5: Add Finance Integration (post-preview).
Connect SalonOS to Tony's own finance app / API (already built).
Rules:
- Exact sync to be confirmed after preview review. Start with a daily cash-up + sales push (tenders, deposits, tips, refunds, commission). Optional later: product cost pull or invoice sync.
- Keep as a separate module so it does not change the core till, ledger, Stripe test-mode flow, or IndexedDB adapter.
- Use the existing finance outbox and idempotency key pattern in src/domain/finance.ts. Every posting is append-only.
- No live data and no real keys until Tony approves the connection details and a successful test run.
- Mark as optional and configurable per salon. Default off in the preview.
- Preserve all existing locks: preview only, no production deploy, no custom domain, Stripe test mode only, all placeholders kept.
- Update docs/requirements-coverage.md and the task log. Stop for approval before any code that writes to an external API.
File reference: SalonOS-build-files-v2.txt (repo travisleeswift-creator/salonos, preview https://preview.salonos-preview.pages.dev).
