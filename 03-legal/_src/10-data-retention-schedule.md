<!-- id: LEG-10 | title: Data retention schedule | who: [SALON LEGAL NAME] (controller); SalonOS settings | reqs: DAT-07, PTT-08, TIP-06, CLI-09, CLI-10, LYC-06, NFR-04, FIN-*, CMP-02 -->

*Retention periods below are **proposed settings**, not hard-coded. Each has a stated reason. The salon sets the final period with its adviser. UK GDPR requires personal data to be kept no longer than necessary (storage limitation, Art 5(1)(e): U). The product flags records past their period for review and deletion with a log; it never deletes silently (DAT-07).*

| # | Data | Proposed period | Reason / source | Label |
|---|---|---|---|---|
| 1 | **Ledger rows** (sales, payments, refunds, voucher movements: amount, date, tax) | **[6 years after the end of the accounting period – adviser]** | HMRC record keeping for VAT and tax: at least 6 years for VAT records; companies keep accounting records 3 years (Companies Act 2006 s 388) (R/U) | R, U |
| 2 | **Tips records** (tips received, allocation, payment) | **3 years minimum** | Employment Rights Act 1996 s 27J (inserted by the Employment (Allocation of Tips) Act 2023): keep records for 3 years (TIP-06) | V |
| 3 | **Payroll and pay records** | **[adviser; HMRC: at least 3 years after the tax year]** | HMRC (R) | R |
| 4 | **Renter settlement records** | **[6 years]** | Tax record purpose | J |
| 5 | **Client contact data** (active) | **While a client**, then **[2–3 years after last visit – salon sets]** | Purpose ends when relationship ends; legitimate interest in rebooking | J |
| 6 | **Consultation and health questionnaire, patch-test records** | **[PATCH TEST RETENTION – salon sets, with reason. Common reasoning: limitation period for injury claims is 3 years from knowledge for adults (Limitation Act 1980 s 11); for a minor, from 18; insurers sometimes ask longer.]** | Defend legal claims (Art 9(2)(f)); SalonOS does **not** hard-code 6 years | J, U |
| 7 | **Hair formula records** | **With the client record** (item 5) | Safe repeat service | J |
| 8 | **Photos** | **Until consent is withdrawn, or [period]** | Consent | J |
| 9 | **Booking history, no-show and cancellation records, accepted terms version** | **[6 years]** | Contract claims; fees disputes (CMP-02) | J |
| 10 | **Online orders and returns** | **[6 years]** | Contract claims and accounts | J |
| 11 | **Marketing consent record** | **Until withdrawn + evidence kept for [6 years]** | Prove consent | J |
| 12 | **Suppression list** (people who opted out) | **Indefinite (minimal data)** | To avoid re-contacting | J |
| 13 | **Loyalty points record** | **While a member + [PERIOD]** | Contract | J |
| 14 | **Gift voucher record** | **[6 years after redemption or expiry]** | Accounts | J |
| 15 | **Audit log** (card opens, voids, refunds, exports, role changes) | **[12 months or 6 years – adviser]** | Security and dispute evidence | J |
| 16 | **Staff personnel records** | **[6 years after leaving – adviser]** | Employment claims | J |
| 17 | **Job applicant data** | **[6 months after decision]** | Fair recruitment | J |
| 18 | **Backups** | **Daily backups kept [N] days (NFR-04)** | Recovery; deleted data leaves backups on expiry | J |
| 19 | **Server and security logs** | **[30–90 days]** | Security | J |
| 20 | **Cookie / consent preference** | **[6–12 months]** | Re-ask interval | J |

**Erasure.** On a valid erasure request, the client record is anonymised; ledger rows the law requires remain (amount, date) with the reason recorded, and without name where possible (CLI-09).
**Backups.** Erased data may remain in backups until they expire. State this in responses to requests.
**Review.** Reviewed yearly. Version **[RETENTION SCHEDULE VERSION AND DATE]**.

---
### Sources and labels
- Employment Rights Act 1996 s 27J, inserted by the Employment (Allocation of Tips) Act 2023 (V): https://www.legislation.gov.uk/ukpga/1996/18/section/27J
- HMRC record keeping (R): https://www.gov.uk/keeping-your-pay-tax-records/how-long-to-keep-your-records
- Companies Act 2006 s 388 (U): https://www.legislation.gov.uk/ukpga/2006/46/section/388
- Limitation Act 1980 s 11 (U): https://www.legislation.gov.uk/ukpga/1980/58/section/11
- ICO storage limitation (R): https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/
- Adviser: all periods; insurer requirement.
