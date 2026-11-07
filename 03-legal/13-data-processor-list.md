**DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use**

# LEG-13. Data processor and sub-processor list

| | |
|---|---|
| **Document** | LEG-13 (SalonOS Stage 3, Legal and Compliance) |
| **For** | [SALON LEGAL NAME] and [OPERATOR LEGAL NAME] |
| **Status** | Draft v0.1 for Tony's approval. **Not published. Not in use.** |
| **Prepared** | 31 October 2026 (Europe/London) |
| **Spec requirements served** | TIL-06, TIL-03, TIL-04, TIL-05, TIL-07, TIL-08, NFR-08, MSG-06, ROL-09, DAT-01, CMP-03 |

**Placeholders are kept on purpose.** Anything in [SQUARE BRACKETS] (names, addresses, company, VAT and ICO numbers, prices, percentages, dates, periods) is for Tony or the salon to fill. **Nothing has been invented, and no price or legal detail has been approved.**

**Labels used in this document:** **(V) Verified**: the source page was opened in this project. **(R) Reported**: from a search extract or secondary source, not opened in full. **(U) Unverified**: general legal knowledge, not opened. **(J) Judgement**: a drafting choice for your adviser to confirm.

---

*Under UK GDPR Art 28, a controller must use only processors that give sufficient guarantees and must have a written contract (V: Art 28(1), (3), (9)). A processor may not engage another processor without the controller's written authorisation (V: Art 28(2)); where it does, it must impose the same obligations on it and remains liable (V: Art 28(4)). This list is the **general written authorisation** list for sub-processors.*

**Roles:** the salon is **controller**. **[OPERATOR LEGAL NAME]** (SalonOS) is **processor**. The suppliers below are **sub-processors** of the operator, or **processors of the salon directly** where the salon holds the account.

| # | Supplier | Service | Role | Data | Location of processing | Transfer mechanism | Contract / terms | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | **Stripe** (entity: [STRIPE ENTITY – confirm: Stripe Payments UK Ltd / Stripe, Inc.]) | online card payment, Terminal | Independent controller for some data (fraud, regulation); processor for others (J: **adviser to confirm**) | payer name, email, card data (Stripe only), amount | UK / EU / US **[CONFIRM]** | **[UK-US data bridge / IDTA – confirm]** | Stripe DPA (U: not opened) | **Unverified** |
| 2 | **Cloudflare** | Pages, Workers, network security | Sub-processor | IP addresses, requests, application data | global network **[CONFIRM]** | **[CONFIRM]** | Cloudflare DPA (U) | **Unverified** |
| 3 | **[DATABASE HOST]** (Postgres) | stores client, booking and ledger data | Sub-processor | all application data | **[UK or EU region – preferred]** (NFR-08) | **[CONFIRM]** | **[PROVIDER DPA]** | Placeholder |
| 4 | **[EMAIL PROVIDER]** | service and marketing email | Sub-processor | name, email, message content | **[CONFIRM]** | **[CONFIRM]** | **[DPA]** | Placeholder |
| 5 | **[SMS PROVIDER]** | SMS | Sub-processor | name, mobile, message | **[CONFIRM]** | **[CONFIRM]** | **[DPA]** | Placeholder |
| 6 | **[WHATSAPP PROVIDER]** | WhatsApp messages | Sub-processor | name, mobile | **[CONFIRM]** | **[CONFIRM]** | **[DPA]** | Placeholder |
| 7 | **[CARD MACHINE PROVIDER]** (external card tender) | in-shop card payments outside Stripe | Salon's own processor | payment data held by provider | **[CONFIRM]** | n/a | salon's contract | Placeholder |
| 8 | **[COURIER]** | delivery of orders | Independent controller (J) | name, address, phone | UK | n/a | courier terms | Placeholder |
| 9 | **[PAYROLL PROVIDER]**, **[ACCOUNTANT]** | pay, tax | Salon's processors | staff and financial data | UK | n/a | salon's contract | Placeholder |
| 10 | **[ERROR LOGGING / MONITORING TOOL]** | error logs | Sub-processor | technical data | **[CONFIRM]** | **[CONFIRM]** | **[DPA]** | Placeholder |

**Changes.** The operator gives the salon **[30] days'** notice of a new or replaced sub-processor; the salon may object (Art 28(2), V). Version **[PROCESSOR LIST VERSION AND DATE]**.

**Honest flags.** No provider terms were opened in Stage 3. Stripe's and Cloudflare's roles, locations and transfer tools must be checked against their current published DPAs before this list is published. Providers shown as placeholders are not chosen (MSG-06).

---
### Sources and labels
- UK GDPR Art 28 (V): https://www.legislation.gov.uk/eur/2016/679/article/28
- Stripe privacy and DPA (U, not opened): https://stripe.com/gb/legal/dpa ; https://stripe.com/gb/privacy
- Cloudflare DPA (U, not opened): https://www.cloudflare.com/cloudflare-customer-dpa/
- ICO controllers and processors guidance (R): https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/controllers-and-processors/

---
**DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use**
