<!-- id: LEG-12 | title: Records of processing activities (ROPA) | who: [SALON LEGAL NAME] (controller); [OPERATOR LEGAL NAME] (processor) | reqs: DAT-01, DAT-07, CLI-01 to CLI-10, PTT-*, TIP-*, ORT-*, LYC-*, NFR-08, CMP-02 -->

*Article 30 requires controllers and processors to keep a record of processing (U: not opened this session). Small organisations can be exempt, but not if processing is not occasional or includes special category data, which a salon's does, so a ROPA is needed (J: ICO guidance, R).*

## Part A. Controller record — [SALON LEGAL NAME]
Controller: **[SALON LEGAL NAME]**, **[ADDRESS]**, **[SALON EMAIL]**; ICO **[ICO REG NO]**; DPO/privacy lead **[NAME]**. Joint controller: none. Processor: **[OPERATOR LEGAL NAME]**.

| # | Activity | Purpose | Data subjects | Categories of data | Special category? | Lawful basis | Recipients | Transfers outside UK | Retention (LEG-10) | Security |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Booking and diary | run appointments | clients | name, contact, services, notes | No | Contract | SalonOS, [EMAIL / SMS PROVIDER] | per LEG-13 | item 9 | roles, TLS, audit |
| 2 | Client card | one client record | clients | contact, history, flags, preferences | Allergy flag (Yes) | Contract; legitimate interests | SalonOS | per LEG-13 | item 5 | roles; health restricted |
| 3 | Consultation and patch tests | safe service | clients (incl. under-16s) | health answers, patch-test results, signature, photos | **Yes** | Explicit consent; legal claims | SalonOS | per LEG-13 | item 6 | restricted view, audit |
| 4 | Hair formulas | repeat service | clients | formula, timings, stylist | No | Legitimate interests; contract | SalonOS | per LEG-13 | item 7 | roles |
| 5 | Till and payments | take payment | clients | items, amount, tender, last 4 digits, tips | No | Contract; legal obligation | Stripe, card machine provider, accountant | Stripe (US) | item 1 | no card numbers stored |
| 6 | Online booking and checkout | online services and products | clients | contact, basket, deposit | No | Contract | Stripe, SalonOS | Stripe (US) | items 9, 10 | TLS, rate limits |
| 7 | Orders and delivery | mail order, click and collect | customers | name, address, order, tracking | No | Contract | [COURIER] | [COURIER – confirm] | item 10 | roles |
| 8 | Gift vouchers | sell and redeem in shop | purchasers, recipients | name, amount, code | No | Contract | SalonOS | per LEG-13 | item 14 | roles |
| 9 | Loyalty Club | points and rewards | members | contact, points | No | Contract | SalonOS | per LEG-13 | item 13 | roles |
| 10 | Marketing | consented offers | members | contact, preferences, consent log | No (never health) | Consent | [EMAIL / SMS / PUSH PROVIDER] | per LEG-13 | items 11–12 | opt-out stops send |
| 11 | Staff, rota, commission, tips, rent | run the business | staff, renters | LEG-06 list | Absence/health (limited) | Contract; legal obligation | [PAYROLL PROVIDER], HMRC | none expected | items 2–4, 16 | roles; renter sees own only |
| 12 | Audit log and security | security | all users | user, action, time | No | Legitimate interests | SalonOS, Cloudflare | per LEG-13 | items 15, 19 | restricted |
| 13 | Backups | resilience | all | all | Yes | as source | hosting provider | per LEG-13 | item 18 | encrypted |

## Part B. Processor record — [OPERATOR LEGAL NAME] (Tony as processor)
Processor: **[OPERATOR LEGAL NAME]**, **[OPERATOR ADDRESS]**, **[OPERATOR EMAIL]**. Controller: each salon licensee. Categories of processing: hosting and operating the SalonOS application on the salon's behalf. Sub-processors: LEG-13. Transfers: **[TRANSFER MECHANISM PER SUB-PROCESSOR]**. Security: see DPA (LEG-18) Annex 2.

## Notes
- Kept in a single place; updated when a feature, provider or data type changes.
- Provide to the ICO on request.
- **Not verified this session (U):** Article 30 text and ICO exemption wording.

---
### Sources and labels
- UK GDPR Art 30 (U): https://www.legislation.gov.uk/eur/2016/679/article/30
- ICO documentation guidance (R): https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/documentation/
