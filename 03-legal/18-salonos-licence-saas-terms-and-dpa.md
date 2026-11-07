**DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use**

# LEG-18. SalonOS licence / SaaS terms and Data Processing Agreement

| | |
|---|---|
| **Document** | LEG-18 (SalonOS Stage 3, Legal and Compliance) |
| **For** | [OPERATOR LEGAL NAME] (Tony) to the salon |
| **Status** | Draft v0.1 for Tony's approval. **Not published. Not in use.** |
| **Prepared** | 31 October 2026 (Europe/London) |
| **Spec requirements served** | ROL-09, ROL-05, ADM-10, ADM-11, MSG-02, MSG-06, NFR-04, NFR-05, NFR-08, NFR-10, DAT-07, CMP-03 |

**Placeholders are kept on purpose.** Anything in [SQUARE BRACKETS] (names, addresses, company, VAT and ICO numbers, prices, percentages, dates, periods) is for Tony or the salon to fill. **Nothing has been invented, and no price or legal detail has been approved.**

**Labels used in this document:** **(V) Verified**: the source page was opened in this project. **(R) Reported**: from a search extract or secondary source, not opened in full. **(U) Unverified**: general legal knowledge, not opened. **(J) Judgement**: a drafting choice for your adviser to confirm.

---

*Between Tony's operating entity (the **"Operator"**) and the salon (the **"Customer"**). Customer is the **seller and data controller**; Operator is the **software supplier and data processor**. The Operator is **not** the seller of services or products to the salon's clients. **Every price, legal name, address, VAT and ICO value below is a placeholder; Tony has not approved any.** Business-to-business terms: the Consumer Rights Act 2015 does not apply to a salon buying software for its business, but the Unfair Contract Terms Act 1977 does (U). **Solicitor to review. Adviser items: liability cap, data location, Stripe and Cloudflare roles, DPO need, FCA (SalonOS must not hold client money).***

# Part A. Licence and service terms

**Between:** **[OPERATOR LEGAL NAME]**, **[OPERATOR COMPANY NO]**, **[OPERATOR ADDRESS]**, **[OPERATOR EMAIL]**, VAT **[VAT NUMBER]** / **[OPERATOR VAT POSITION]**, ICO registration **[ICO REG NO]** (**"Operator"**); and **[SALON LEGAL NAME]**, **[COMPANY NO]**, **[ADDRESS]** (**"Customer"**).

## 1. The service
1.1 The Operator gives the Customer a **non-exclusive, non-transferable right to use SalonOS** for **one site: [SITE ADDRESS]** (one site only, D21), for the Customer's own salon business, for the licence period.
1.2 SalonOS covers: diary, till, cash-up, client records and formulas, stock, online booking and shop (if enabled), loyalty club, messaging, reports. Features not listed in the order form are not included.
1.3 SalonOS is a **web app** that keeps working offline for core tasks (diary read, cash sale) through internet loss; online booking and shop depend on internet and host availability (NFR-01).
1.4 **Preview/test period:** during any preview, **nothing is sent to clients and no payment is taken**; the preview uses test data only (NFR-10).

## 2. Fees
2.1 Licence fee: **[PRICE – Tony to set]** per **[MONTH / YEAR]** for one site. Setup fee (if any): **[PRICE – Tony to set]**. Fees exclude VAT, which is added **[if the Operator is VAT-registered; OPERATOR VAT POSITION]**.
2.2 **Pass-through costs** are charged at cost to the Customer, or the Customer **brings its own provider**: SMS and WhatsApp messages (MSG-02), card-payment fees from Stripe, and any courier or delivery label costs. They are **not** included in the licence fee. Message and fee rates are **never promised** in the help text (working default).
2.3 Fee changes: on **[NOTICE]** written notice, **not** during a fixed term **[Operator to set]**. *(J)*
2.4 Payment terms and late payment: **[Operator sets]**.

## 3. Customer responsibilities
3.1 The Customer is responsible for: the content and prices it enters; having lawful grounds and **consents** for its clients' data; **its own terms of sale and booking** (LEG-01 to LEG-03 are templates only); **tax and VAT**; its staff's logins (individual logins, second factor for Owner and Manager); **tipping policy**; and compliance with insurance, patch-test and health and safety rules.
3.2 **The Customer, not the Operator, is the trader and controller.** The Customer decides whether a stylist is employed or self-employed, whether VAT applies, and whether to sell online.
3.3 **Card data** is handled by Stripe or the Customer's card terminal provider. The Operator does not store card numbers (NFR-05).
3.4 **The Operator does not hold client or customer money.** Payments go directly to the Customer's own Stripe account (or external terminal). *(J. **Adviser: if this changes, FCA permissions may be needed.**)*
3.5 Acceptable use: no unlawful content, no use to send spam, no attempt to access other customers' data, no reverse engineering.

## 4. Operator's service commitments
4.1 Reasonable care and skill. **Availability target [TARGET %]; status page [URL] (NFR-01).** Planned maintenance on **[NOTICE]** notice, outside salon opening hours where possible.
4.2 **Backups:** daily backup and a tested restore; retention **[PERIOD]** (NFR-04).
4.3 **Security:** HTTPS; server-side permission checks; second factor for Owner and Manager; secrets stored outside the code; rate limits (NFR-05). **No security promise is absolute.** An offline-device security requirement is **[TO BE SPECIFIED – Stage 4]** and is a known gap (see DPIA R7).
4.4 **Support:** **[CHANNELS, HOURS, RESPONSE TARGETS – Operator to set]**. The Operator's support staff **cannot open a client card unless the Customer owner has granted time-limited, logged access** (ROL-09).
4.5 **Customer data export:** the Customer can export clients, bookings, sales and stock at any time as files (ADM-11) and on ending (clause 9).

## 5. Intellectual property
The Operator owns SalonOS. The Customer owns its data (clients, formulas, sales, stock, content), and gives the Operator a limited licence to host and process it to run the service. The treatment catalogue seed supplied with SalonOS is **editable and deletable by the Customer** (CAT-19) and carries no ongoing licence restriction on edited entries **[Operator to confirm source of seed content; J]**.

## 6. Liability
6.1 Nothing limits liability for **death or personal injury caused by negligence, fraud, or anything the law does not allow to be limited**. *(U: Unfair Contract Terms Act 1977 s 2(1).)*
6.2 Otherwise, the Operator's total liability in each year is limited to **[CAP AMOUNT – adviser; e.g. fees paid in the previous 12 months]**, and the Operator is not liable for **loss of profit, loss of business or indirect loss** **[SOLICITOR TO CONFIRM REASONABLENESS]**. *(U: reasonableness test.)*
6.3 **Specific exclusions to be considered by the adviser:** loss of data where the Customer did not use backups or exports; loss caused by internet loss during offline use; client claims arising from a salon's own patch-test decisions (SalonOS records, it does not decide); third-party provider failure (Stripe, SMS). **[ADVISER]**

## 7. Data protection
Each party complies with data protection law. The **Data Processing Agreement in Part B** forms part of this agreement. **Operator details placeholders appear in the footer, emails and receipts until the Customer fills in its own** (CMP-03).

## 8. Confidentiality
Each party keeps the other's confidential information secret except as required by law.

## 9. Term, ending and data return
9.1 Starts **[DATE]**, continues for **[INITIAL TERM]**, then renews **[AUTOMATICALLY / ON NOTICE]** unless either party gives **[NOTICE]** notice.
9.2 Either party may end immediately for **material breach** not fixed in **[DAYS]** days, or insolvency.
9.3 On ending, the Operator gives the Customer **[DAYS]** days to export its data; then deletes it (except where the law requires keeping it) and confirms deletion on request. Records the Customer must keep by law (tips records for three years, accounts) must be **exported before deletion**; the Customer is responsible for this (DAT-07).

## 10. General
Entire agreement; variation in writing; no assignment without consent; force majeure; notices to **[OPERATOR EMAIL]**; governing law England and Wales **[JURISDICTION]**.

---

# Part B. Data Processing Agreement (UK GDPR Article 28)

*Draft, not legal advice. Article 28(3) requires a contract that sets out subject matter, duration, nature and purpose, type of personal data and categories of data subjects, and obliges the processor as listed. The paragraphs below follow Article 28(3)(a) to (h) as summarised by the ICO (R); the exact wording was verified for Art 28 in Stage 1 (V) but the ICO checklist was not opened in this stage.*

## B1. Details of processing
| Item | Entry |
|---|---|
| Controller | Customer **[SALON LEGAL NAME]** |
| Processor | **[OPERATOR LEGAL NAME]** |
| Subject matter | Hosting and running SalonOS for the Customer's salon |
| Duration | The term of the agreement plus the return/deletion period (clause 9.3) |
| Nature and purpose | Storing, organising, retrieving, sending (reminders) and deleting data to run diary, till, shop, loyalty and messaging |
| Types of personal data | Names, contact details, appointment history, purchase history, loyalty points, consents, messages; **health-related data** (allergies, patch-test results, skin or scalp conditions) (special category data); staff records (name, role, hours, pay and tips records); card **tokens** only (no card numbers) |
| Data subjects | Salon clients, online shop customers, salon staff and renters |
| Special category data | Yes: **health data**, only for safe service delivery (see LEG-09, LEG-11) |

## B2. Processor's obligations (Art 28(3))
B2.1 **Instructions (28(3)(a)).** The Operator processes personal data **only on the Customer's documented instructions**, including as set by Customer's use of the settings and by this agreement, unless the law requires otherwise (then it tells the Customer unless forbidden). It tells the Customer if an instruction appears to infringe data protection law.
B2.2 **Confidentiality (28(3)(b)).** Everyone authorised to process the data is under a duty of confidentiality.
B2.3 **Security (28(3)(c), Art 32).** The Operator applies the measures in clause 4.3 and **Annex 1** **[ANNEX TO BE COMPLETED AT STAGE 4/8]**.
B2.4 **Sub-processors (28(3)(d), 28(2) and (4)).** The Customer gives **general written authorisation** for the sub-processors in the **Data Processor List (LEG-13)**. The Operator gives the Customer **[30] days'** notice of additions or replacements and the Customer may object; the Operator flows the same data protection duties down in writing and stays **fully liable** for them. **[Stripe and Cloudflare act as independent controllers or processors depending on the service. Role and transfer position Unverified. Adviser.]**
B2.5 **Data subject rights (28(3)(e)).** The Operator helps the Customer, with appropriate technical and organisational measures, to respond to requests under Articles 12 to 22. SalonOS gives the Customer export, correction and erasure tools (ADM-11, DAT-07). The Operator forwards to the Customer any request it receives directly, within **[X] working days**, and does not respond itself.
B2.6 **Assistance (28(3)(f)).** The Operator helps the Customer with security, breach notification, DPIAs and prior consultation (Arts 32 to 36), taking account of the nature of processing.
B2.7 **Personal data breaches.** The Operator tells the Customer **without undue delay and in any event within [24 / 48] hours** after becoming aware of a breach affecting the Customer's data **[time to be agreed]**, with the information the Customer needs for its own notification to the ICO (within 72 hours of the Customer becoming aware where required: U).
B2.8 **Return and deletion (28(3)(g)).** At the end of the services, the Operator **deletes or returns** all personal data at the Customer's choice, as in clause 9.3, and deletes existing copies unless the law requires storage. **Backups** are overwritten within **[PERIOD]**.
B2.9 **Audit (28(3)(h)).** The Operator gives the Customer the information needed to show compliance and allows and contributes to audits, including inspections, by the Customer or its auditor on **[NOTICE]** notice, **[COST BASIS]**.
B2.10 **Support access.** Operator staff access to client records is **off by default** and requires a **logged, time-limited grant by the Customer's owner** (ROL-09). Every grant and access is in the audit log (ROL-05).

## B3. International transfers
Data is hosted at **[DATABASE HOST], [REGION]** (NFR-08; UK or EU preferred). Transfers outside the UK only with a transfer mechanism **[IDTA / UK Addendum / adequacy regulations: adviser to confirm]**. *(U.)*

## B4. Customer's obligations
The Customer is the controller and must have a lawful basis, give privacy information (LEG-05, LEG-06), keep consents (CMP-02), and decide retention (LEG-10).

## B5. Operator also as controller
The Operator is a **controller** only for its own account, billing and security logs. Its own privacy notice for that is **LEG-23 (Operator privacy notice, one page)**, with every Operator detail left as a placeholder. **LEG-23 must be completed and published before any salon signs up.** *(J. Extracted from this clause at Tony's request, 23:58, fine-tune 5.)*

---
### Sources and labels
- UK GDPR Article 28 (V, Stage 1): https://www.legislation.gov.uk/eur/2016/679/article/28 ; ICO controllers and processors guidance (R): https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/contracts-and-liabilities-between-controllers-and-processors/
- Unfair Contract Terms Act 1977 (U): https://www.legislation.gov.uk/ukpga/1977/50
- Operator privacy notice: LEG-23; Data Processor List: LEG-13; DPIA: LEG-11; ROPA: LEG-12.
- Adviser: liability cap, Stripe and Cloudflare roles, transfer mechanism, DPO need, FCA position if money is ever held.

---
**DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use**
