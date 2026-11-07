<!-- id: LEG-07 | title: Cookie policy and PECR consent approach | who: [SALON LEGAL NAME] website and booking app | reqs: ONL-13, ONL-14, NFR-05, OFF-* (offline PWA storage), CMP-02, CMP-03 -->

## Part A. Approach for the build (for Tony and the adviser)
1. **Law (V).** PECR regulation 6 now reads: a person must not store information, or gain access to information stored, in the terminal equipment of a subscriber or user, **subject to Schedule A1** (reg 6 substituted 5 February 2026 by the Data (Use and Access) Act 2025, s 112) (V: https://www.legislation.gov.uk/uksi/2003/2426/regulation/6). "Storage" covers cookies, local storage, IndexedDB and service-worker caches (J).
2. **v1 design principle (J): use only storage the service needs, and run no advertising or cross-site tracking.** That keeps v1 inside the strictly-necessary exceptions and avoids a consent banner on day one, which is simpler and safer.
3. **Schedule A1 exceptions (R from ICO guidance finalised 29 April 2026; Schedule A1 text itself not opened):** strictly necessary to provide a service the user asked for; communications; security and fraud prevention; **statistical purposes** (with clear information and a simple, free way to object); appearance / functionality preferences; emergency assistance.
4. **What counts as strictly necessary in SalonOS v1 (J):**
   - login session cookie and anti-forgery token;
   - basket and booking-in-progress storage;
   - offline diary and cash queue in IndexedDB / service-worker cache (the app function the salon asked for, OFF-*);
   - Stripe scripts on checkout pages (fraud prevention and payment; confirm in Stripe's own documentation, U);
   - cookie-consent preference itself (if any banner is used).
5. **Not allowed in v1 without a consent banner:** Google Analytics or equivalent, Meta pixel, advertising or retargeting tags, third-party embedded video or maps that set cookies, social sharing widgets that track.
6. **If the salon wants analytics:** use a privacy-friendly tool configured to meet the **statistical-purposes exception** (R) and publish it in the table below; otherwise add a consent banner with **Accept and Reject at equal prominence**, no pre-ticked boxes, no loading of non-essential tags before consent, and a preferences link in the footer (J, ICO guidance R).
7. **Records:** if consent is used, store the choice, date and policy version (CMP-02).
8. **Push notifications** (web push) need the browser's permission **and** the member's marketing consent (LEG-08).
9. **Enforcement note (U):** the Data (Use and Access) Act 2025 aligned PECR penalties with UK GDPR levels. Adviser to confirm current maximum.

## Part B. Cookie policy (public text for the salon site) — DRAFT
**What are cookies?** Small files or storage on your device. Some are essential to make our booking site work.

**What we use**

| Name | Purpose | Type | Duration | Provider | Consent needed? |
|---|---|---|---|---|---|
| [SESSION COOKIE NAME] | keeps you signed in | strictly necessary | [DURATION] | [SALON NAME] | No |
| [CSRF TOKEN NAME] | security | strictly necessary | session | [SALON NAME] | No |
| [BASKET STORAGE KEY] | remembers your basket / booking | strictly necessary | [DURATION] | [SALON NAME] | No |
| [OFFLINE STORAGE NAME] | lets staff use the diary and till offline | strictly necessary (staff app) | until cleared | [SALON NAME] | No |
| [STRIPE COOKIES – confirm from Stripe docs] | card payment and fraud prevention | strictly necessary | [DURATION] | Stripe | No |
| [ANALYTICS – only if used] | counts visits | statistical | [DURATION] | [PROVIDER] | **[Yes unless statistical exception is met]** |

**Managing them.** You can delete cookies in your browser settings. Blocking essential cookies may stop booking, basket or sign-in working.
**More information.** See the client privacy notice (LEG-05). Contact **[SALON EMAIL]**.
**Version** **[COOKIE POLICY VERSION AND DATE]**.

---
### Sources and labels
- PECR reg 6 as substituted 5.2.2026 (V): https://www.legislation.gov.uk/uksi/2003/2426/regulation/6
- ICO storage and access technologies guidance, finalised 29 April 2026 (R, from search summary; not opened): https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/
- Adviser: PECR Schedule A1 conditions for statistical exception, Stripe cookie status, penalty level.
