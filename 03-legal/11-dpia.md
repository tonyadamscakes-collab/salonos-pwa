**DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use**

# LEG-11. Data Protection Impact Assessment (DPIA)

| | |
|---|---|
| **Document** | LEG-11 (SalonOS Stage 3, Legal and Compliance) |
| **For** | [SALON LEGAL NAME] (controller), prepared with [OPERATOR LEGAL NAME] (processor) |
| **Status** | Draft v0.1 for Tony's approval. **Not published. Not in use.** |
| **Prepared** | 31 October 2026 (Europe/London) |
| **Spec requirements served** | CLI-08, CLI-09, CLI-10, PTT-01, PTT-02, PTT-03, PTT-04, PTT-05, PTT-06, PTT-08, ROL-01, ROL-04, ROL-05, ROL-06, ROL-09, NFR-04, NFR-05, NFR-08, LYC-05, DAT-07 (struck or deferred, for reference: PTT-07) |

**Placeholders are kept on purpose.** Anything in [SQUARE BRACKETS] (names, addresses, company, VAT and ICO numbers, prices, percentages, dates, periods) is for Tony or the salon to fill. **Nothing has been invented, and no price or legal detail has been approved.**

**Labels used in this document:** **(V) Verified**: the source page was opened in this project. **(R) Reported**: from a search extract or secondary source, not opened in full. **(U) Unverified**: general legal knowledge, not opened. **(J) Judgement**: a drafting choice for your adviser to confirm.

---

*A DPIA is required where processing is likely to result in a high risk to individuals (UK GDPR Art 35: U). A salon processes **special category health data** (allergies, patch tests, consultation answers) at scale on an app with online booking, so a DPIA is the safe course (J). This is a **template first pass**. The salon (controller) must review, complete and sign it. Reference: ICO DPIA guidance (R).*

**DPIA version:** **[DPIA VERSION AND DATE]**  Controller: **[SALON LEGAL NAME]**  Processor: **[OPERATOR LEGAL NAME]**  Completed by: **[NAME, ROLE]**

## 1. Description of the processing
- **Nature:** collecting, storing and using client contact, booking, health and patch-test data, formulas, payments and marketing preferences on a cloud booking and till system used offline-first in the salon and online by clients.
- **Scope:** all clients, shop customers and Club members of one salon; staff data (LEG-06). Volume **[NUMBER OF CLIENTS]**. Data held as set in LEG-10.
- **Context:** clients expect confidentiality about health information; some are young (under-16s with a parent); the salon is a small business.
- **Purposes:** deliver and safely perform services; take payments; sell products; comply with law; (with consent) marketing.
- **Systems:** SalonOS (see ROPA LEG-12, processors LEG-13).

## 2. Consultation
Staff consulted: **[SALON TO RECORD]**. Clients: privacy notice and consent forms. Advisers: **[SOLICITOR / DPO]**. Processor input: [OPERATOR LEGAL NAME] security summary **[ATTACH]**.

## 3. Necessity and proportionality
| Question | Answer (draft) |
|---|---|
| Lawful basis | LEG-05 section 3 (contract; legitimate interests; legal obligation; explicit consent for health data) |
| Data minimisation | Only questions needed for the treatment; no health data in marketing; photos optional and separate |
| Accuracy | Client confirms details; staff can correct; forms superseded not edited |
| Storage limitation | LEG-10 with flags for review |
| Individual rights | Export and erase from client card (CLI-09); one-month reply |
| Processors | Written Art 28 terms (LEG-18 DPA); sub-processors listed (LEG-13) |
| International transfers | Hosting region **[DATABASE HOST]**; Stripe and others per LEG-13 |

## 4. Risk assessment
Likelihood and severity: Low / Medium / High (J: for the salon to adjust).

| # | Risk to individuals | L | S | Overall | Mitigation in the product / process | Residual |
|---|---|---|---|---|---|---|
| R1 | **Unauthorised access to health data** by staff who do not need it | M | H | **High** | Role-based access (ROL-01); restrict health data by role (ROL-04); audit log of client card opens (ROL-05); no shared logins; 2FA for Owner and Manager (ROL-06) | Low |
| R2 | **Software supplier access** to client data | L | H | Medium | Support access off by default; logged, time-limited grant (ROL-09); Art 28 DPA | Low |
| R3 | **Data breach / hosting compromise** | L | H | Medium | HTTPS; server-side permission checks; secrets outside code; rate limits; card data never stored (NFR-05); backups tested (NFR-04); breach procedure: salon reports to ICO within **72 hours** where required (UK GDPR Art 33: U) | Low |
| R4 | **Health data used for marketing** | L | H | Medium | Audience builder has no health field (LYC-05); policy in LEG-08 | Low |
| R5 | **Over-retention** | M | M | Medium | Retention settings and review flags (DAT-07, PTT-08) | Low |
| R6 | **Inaccurate allergy record leads to harm** | L | H | Medium | Signed form with version; reaction blocks product (PTT-04); flags at booking (CLI-08) | Low |
| R7 | **Offline device lost or stolen** with client data | M | H | **High** | Device login, auto-lock, minimal data cached, remote sign-out, session expiry **[SPEC TO DEFINE – Stage 4]** | Medium (adviser) |
| R8 | **Children's data** | L | M | Low | Parent consent and policy (LEG-01 clause 7) | Low |
| R9 | **Transfers outside the UK** | L | M | Low | Adequacy / IDTA / data bridge per processor (LEG-13) | Low |
| R10 | **Consent not freely given or recorded poorly** | L | M | Low | Separate unticked boxes; records with wording version (CMP-02) | Low |
| R11 | **Cookie / local storage without lawful basis** | L | L | Low | Strictly necessary only in v1 (LEG-07) | Low |
| R12 | **Loss of data (failure)** | L | M | Low | Daily backups, tested restore (NFR-04) | Low |

## 5. Outcome
- **High residual risk remaining?** **[DECISION – owner and adviser]**. If high risk remains that cannot be mitigated, the controller must consult the ICO **before** processing (Art 36: U).
- **Measures approved by:** **[NAME]**  Date **[DATE]**. DPO advice (if appointed): **[ADVICE]**.
- **Review:** yearly, and when features change (new channel, new processor, new data type).

---
### Sources and labels
- UK GDPR Arts 33, 35, 36 (U, not opened): https://www.legislation.gov.uk/eur/2016/679/contents
- ICO DPIA guidance (R): https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/
- Adviser: whether the salon's scale triggers a mandatory DPIA; offline device security design.

---
**DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use**
