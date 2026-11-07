# SalonOS: Stage 3 checkpoint summary (Legal and Contracts, Compliance)

**DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use.**
**Stage 3 of 8. Status: APPROVED by Tony at 23:58 GMT on 31 Oct 2026 with six fine-tunes. The fine-tunes are applied and delivered, awaiting Tony's review. No build.** Stage 2 was approved by Tony at 22:53 GMT on 31 Oct 2026 with locks. Nothing has been sent, posted, published or deployed. No code written. No other agent contacted. Nothing deleted.
Files: `03-legal/` (23 drafts plus `00-trace.md`). Spec: `02-product-spec.md`. Your messages: `00c-tony-instructions-log.md`.

## Fine-tunes applied (23:58)
| # | Tony's fine-tune | What changed | Where |
|---|---|---|---|
| 1 | Short home-visit / wedding booking agreement | **New LEG-22** (about two pages). Covers location and address, venue suitability (space, light, power, seating, mirror), travel fee and mileage placeholders, parking and access, trial, deposit and balance schedule, extra-artist and extra-people fees, early start and overrun, products, patch tests and under-16s, cancellation by client and by salon, insurance, safety, complaints. **The salon is the contracting party; SalonOS and the Operator are not.** Statutory 14-day cancellation wording left to the adviser (OI-05). Closes the HEV-05 gap. | 22; spec HEV-05 points to it |
| 2 | Declined test: manager must record risk warning and that insurance may not cover | LEG-01 clause 6.3 now needs the manager's record that the client **was told the risk, chose to decline, and the service may not be covered by insurance**; new 6.3A says some insurers refuse cover on declined tests and **the salon must check its own policy**. LEG-09 Part 4 rebuilt as a three-box manager record plus an insurance-policy check box. Spec PTT-06 now requires all three confirmations. | 01, 09; PTT-06 |
| 3 | Deposit and no-show fee editable; no-show cannot exceed deposit unless separately agreed | LEG-01 new 3.4: **"The salon may set a lower or zero deposit for any service"**; the greater-of-X%-or-£Y rule is kept and editable per service and per salon. LEG-01 4.3 rewritten: **a no-show fee will not exceed the deposit already taken unless the client separately agreed a card-on-file charge**; with a zero deposit and no card-on-file agreement, no fee can be charged. Deposit, fee and window stay placeholders. Spec TIL-13 and TIL-14 updated. | 01; TIL-13, TIL-14 |
| 4 | Vouchers in-shop only; VAT a placeholder | LEG-03 scope paragraph now says **online purchase is blocked in v1**, single-purpose vs multi-purpose VAT is **left for the adviser** (OI-03, no VAT position claimed) and **no expiry is hard-coded**. Clause 4.1 matches. LEG-02 already said vouchers are not sold online. | 03 |
| 5 | Operator privacy notice not buried in LEG-18 | **New LEG-23**, one page: who we are (all Operator details placeholders), what the Operator collects as controller (account, billing, support, security logs), lawful bases, sharing, retention placeholders, rights, ICO. LEG-18 Part B5 and LEG-20 now point to it. It must be completed before any salon signs up (new OI-18). | 23; 18 B5; 20 |
| 6 | Under-16 policy notes the salon checks manufacturer instructions | LEG-01 clause 7.2: **"Salon must check each product's manufacturer instructions before offering chemical services to under-16s"**; the salon records product, minimum age and date. LEG-09 notes and LEG-22 clause 7.3 say the same. Spec PTT-05 carries it (wording only). | 01, 09, 22; PTT-05 |

**Spec and trace:** 304 requirements, no new requirement rows; wording changed in PTT-05, PTT-06, TIL-13, TIL-14, HEV-05. Added trace row M-78 (this message) and OI-18. Traceability check re-run: nothing cited that does not exist, nothing defined that is not cited. `00-trace.md` now maps LEG-22 to HEV-01 to HEV-05, HEV-07, CAT-02, SVC-06, SVC-15, TIL-13, TIL-14, PTT-02, PTT-06, CMP-02, CLI-10, and LEG-23 to CMP-03, ROL-05, ROL-06, ROL-09, NFR-08.

## The 23 documents
| # | Document | Who it is for |
|---|---|---|
| 01 | Client terms of booking and service (deposit = greater of [DEPOSIT %] and [DEPOSIT MINIMUM £], lower or zero deposit allowed, no-show cap, declined-test record, under-16 manufacturer check) | Salon to clients |
| 02 | Online shop terms of sale, with model cancellation form (14 days, sealed-hygiene exception, click and collect) | Salon to shop customers |
| 03 | Gift voucher terms (**in-shop only**, online purchase blocked in v1, VAT for the adviser, no hard-coded expiry) | Salon to holders |
| 04 | Loyalty club terms | Salon to members |
| 05 | Client privacy notice | Salon (controller) |
| 06 | Staff privacy notice | Salon to staff, renters, contractors |
| 07 | Cookie policy and PECR approach (strictly necessary only in v1) | Website |
| 08 | Marketing consent wording (three separate unticked boxes, STOP wording) | Clients |
| 09 | Consultation and patch-test consent form with health questionnaire | Clients |
| 10 | Data retention schedule (20 rows, periods are placeholders) | Salon |
| 11 | DPIA (risks R1 to R12) | Salon with Operator |
| 12 | Records of processing (ROPA) | Salon and Operator |
| 13 | Data processor list | Salon and Operator |
| 14 | Rent-a-chair agreement template (split, fixed rent or record-only) | Salon and renter |
| 15 | Self-employed / contractor stylist agreement template | Salon and stylist |
| 16 | Staff tips policy (full pass-through) | Salon to workers |
| 17 | Marketplace artist agreement: **stub only** | Not in use |
| 18 | SalonOS licence / SaaS terms, plus Article 28 Data Processing Agreement (B5 points to 23) | Tony to the salon |
| 19 | Accessibility statement (not tested, so no compliance claim) | Public site |
| 20 | Website legal notice and company information | Public site |
| 21 | Complaints procedure | Clients |
| 22 | **New (fine-tune 1).** Home-visit and wedding / event booking agreement, short form | Salon (contracting party) to client |
| 23 | **New (fine-tune 5).** SalonOS operator privacy notice, one page | Operator to salon owners and staff |

Every document carries the header "DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use", keeps all names, addresses, company, VAT and ICO values, prices, percentages and periods as **[PLACEHOLDERS]**, cites its sources, and marks every claim **V** (verified: page opened), **R** (reported: search extract), **U** (unverified: general knowledge) or **J** (judgement for the adviser). `03-legal/00-trace.md` ties each document to the spec rows it serves.

## Locks reflected in the drafts
Deposit greater of 20% or £15, editable per service and per salon (placeholders in 01). Vouchers in-shop only (03). New products in-shop only (02). One site (18). Marketplace is a stub (17). Tips pass through in full (16). Soft opt-in is off by default (08). Health data is never used for marketing (05, 08).

## Key risks
1. **Cancellation and no-show fees** must be fair and clearly shown before booking (Consumer Rights Act 2015 s 62, V). The salon sets the amounts; 01 leaves them blank.
2. **Do appointments get the 14-day right to cancel at all?** Possible leisure-services exception (CCR reg 28(1)(h)) is an adviser question (OI-05). 01 and 02 are drafted so they work either way.
3. **Health data** (allergies, patch tests) is special category data. A DPIA is drafted, access is restricted by role and every opening is logged. A lost or stolen **offline device** has **no matching security requirement in the spec yet** (DPIA R7); Stage 4 must define one.
4. **Marketing consent:** PECR reg 22 rules and the new 2026 penalty and consent changes; three separate unticked boxes. Paid membership could fall under the DMCC subscription regime from 1 January 2027 (R).
5. **Tips:** all tips pass on in full, records kept 3 years (ERA 1996 s 27J, V). The revised statutory Code was **withdrawn on 29 July 2026** for a new consultation, so employers keep following the existing Code (V, GOV.UK). The Employment Rights Act 2025 will require staff consultation on the policy; commencement date is Unverified.
6. **Employment status:** a stylist labelled "self-employed" may be an employee or worker in law. SalonOS does not decide status; the salon bears the risk.
7. **Operator role:** Tony's entity is processor and software supplier, **not the seller**. It must not hold client money (18 clause 3.4).
8. **Heavy reliance on general legal knowledge:** many UK GDPR articles, DPA 2018 Schedule 1 and several CRA sections are U (not opened). Solicitor review is essential.

## Items that need a solicitor or adviser (not me, not Tony)
| ID | Item |
|---|---|
| OI-02 | VAT registration and position of the salon and of the operator |
| OI-03 | **VAT on gift vouchers** (single-purpose vs multi-purpose) |
| OI-04 | VAT and status of **chair rental**, licence vs tenancy |
| OI-05 | CCR reg 28(1)(h) leisure exception for appointments |
| OI-12 | Whether any **card-cost deduction** from tips is allowed |
| OI-15 | Whether the operator is a digital platform operator (**marketplace only, parked**) |
| OI-16 | Courier restrictions on aerosols, flammables and similar goods |
| New | **FCA**: whether closed-loop vouchers or any held funds touch client-money or payment-services rules; keep SalonOS out of holding money |
| New | **IR35 and employment status** for contractor stylists and renters (IR35 only if a company is used) |
| New | Voucher expiry, insolvency and unredeemed vouchers; **under-16 policy**; insurer position on declined patch tests and on mobile and event cover (the salon must check its own policy) |
| New | **Liability cap** wording in the SaaS terms (Unfair Contract Terms Act reasonableness) |
| New | **Stripe and Cloudflare** roles (controller or processor), transfer tools (IDTA or UK Addendum) and DPA terms |
| New | Whether a **DPO** is needed; ICO fee tier; **PECR penalty** level; ADR scheme position |

## Honest flags
- **The 21:39 original** of your Stage 1 message is not available; the log holds a relay (OI-17).
- **Not opened in full (Reported only):** ICO special category guidance, DMCC subscription guidance, ICO storage and access technologies guidance, ICO complaints duty, NHBF patch-test timings, HMRC platform reporting. The model cancellation form wording is Reported and must be compared with CCR Schedule 2.
- **Stripe and Cloudflare terms were not opened.** Their roles in 13 are Unverified.
- **Verified from legislation.gov.uk:** CCR 2013 regs 13, 28, 29, 30, 34, 36 and Schedule 2; CRA 2015 ss 22, 49, 54, 62; UK GDPR Art 28; PECR reg 6 and 22; E-Commerce Regs reg 6; Equality Act 2010 s 29; ERA 1996 ss 27G, 27J (and the amendment list at s 27I). **Verified from GOV.UK:** the tips Code withdrawal.
- The accessibility statement must not claim compliance until the site is tested.
- **Closed by the fine-tunes:** the HEV-05 template gap (now LEG-22) and the buried Operator privacy notice (now LEG-23).
- **Still open:** LEG-23 is a skeleton until the Operator's legal name, address, email, VAT and ICO details exist (OI-18). LEG-22 prices, travel fee, mileage, trial, cancellation schedule and liability wording are all placeholders for you and the adviser. The salon's **insurer position** on declined tests and on mobile and event cover is unverified (U). Manufacturer age limits for hair colour are unchecked by us (U).

## What Tony is approving
That the 23 drafts (21 plus LEG-22 and LEG-23) with the six fine-tunes are the right set and shape to hand to a UK solicitor, and that Stage 4 (data model and architecture) may start. A plain "yes" is approval. **No build starts until you say so.**

## Pre-checkpoint check
Brief reduced: no. Prices or legal details invented: no (all placeholders). Every document headed "not legal advice": yes. Sources cited and labelled: yes. Nothing sent or published: yes. Other agents contacted: no. Nothing deleted: yes.
