**Full high-street SalonOS prompt for your Grok Chief**

Paste this as one message.

---

We have a paying customer. This is a locked specification for a complete high-street hair and beauty salon operating system. It is not a web-only booking site. It must run the physical shop: reception, till, walk-ins, phone bookings, staff on the floor, stock, client cards, and end-of-day cash-up. Online booking is only one part. Do not reduce scope. Run the full pipeline and deliver everything listed.

**Product name (working):** SalonOS  
**Customer:** Independent UK high-street hair and beauty salon (or small group of shops).  
**Core requirement:** One system that handles every transaction and every client interaction that happens inside a real shop, plus online booking, with every money movement posted to their finance API.

**What a high-street salon actually does (locked requirements)**

- Reception takes phone bookings and walk-ins all day.  
- Clients arrive with or without an appointment.  
- Stylists and therapists work from a paper or screen diary.  
- Colour and chemical services need timing notes and patch-test records.  
- Retail products are sold at the till while the client is still in the chair or at reception.  
- Deposits are taken in advance; balance is taken on the day (cash, card, or mixed).  
- End of day the shop does a cash-up and reconciles against the diary.  
- Staff are paid commission or tracked for performance.  
- Client history (formulas, notes, previous services, spend) must be available in seconds.  
- No-shows and late cancellations must be recordable and chargeable.  
- Stock must be countable and low-stock visible.  
- Online bookings must drop straight into the same diary the reception uses.

**Full locked specification**

**Diary and booking (online + shop)**  
- Single shared diary visible to reception and all staff.  
- Online bookings appear instantly with deposit status.  
- Reception can add phone bookings and walk-ins in under 15 seconds.  
- Drag-and-drop move between staff (only if qualified).  
- Colour timing notes and processing time visible on the appointment.  
- Block time for breaks, training, or cleaning.  
- No-show button and late-cancel button that can trigger a charge.  
- Walk-in queue that shows estimated wait.

**Client card**  
- Name, mobile, email, notes, patch-test dates and results.  
- Full history: every service, formula, retail purchase, spend, no-shows.  
- Photos of previous work (optional).  
- Loyalty points balance.  
- Preferred stylist.  
- Marketing consent.

**Services (exact structure)**  
Every service has: ID, category, name, duration, base price, price type (Fixed / Tier-multiplied / Quote only), staff qualified, patch test required, deposit rule, linked retail, photo set.

**Hair – Cutting & Styling**  
- Ladies Cut & Blow Dry Short – 45 min – Base £42  
- Ladies Cut & Blow Dry Long – 60 min – Base £52  
- Mens Cut – 30 min – Base £22  
- Restyle Cut – 75 min – Quote only  
- Blow Dry Short – 30 min – Base £28  
- Blow Dry Long – 40 min – Base £36  
- Hair Up (occasion) – 60 min – Base £55  
- Fringe Trim – 15 min – Base £12  
- Child Cut (under 12) – 30 min – Base £18  

**Hair – Colour & Chemical**  
- Root Tint – 75 min – Base £48  
- Full Head Colour – 120 min – Base £85  
- Balayage Full – 180 min – Base £130  
- Half Head Highlights – 120 min – Base £95  
- Toner – 30 min – Base £28  
- Colour Correction – 240 min – Quote only  
- Keratin Smoothing Short – 150 min – Base £140  
- Keratin Smoothing Long – 180 min – Base £180  

**Hair – Treatments**  
- Olaplex Stand-alone Treatment – 30 min – Base £35  
- K18 Molecular Repair Treatment – 20 min – Base £40  
- Deep Conditioning Mask – 20 min – Base £18  
- Scalp Treatment – 30 min – Base £32  

**Beauty – Brows & Lashes**  
- Brow Shape & Tint – 20 min – Base £18  
- Brow Lamination – 45 min – Base £42  
- Lash Lift & Tint – 60 min – Base £48  
- Classic Lash Full Set – 90 min – Base £75  
- Volume Lash Full Set – 120 min – Base £95  
- Lash Infill – 45 min – Base £42  

**Beauty – Nails**  
- Gel Manicure – 45 min – Base £28  
- Gel Pedicure – 60 min – Base £35  
- Builder Gel Overlay – 60 min – Base £38  
- Full Set Extensions – 90 min – Base £48  
- Infill – 45 min – Base £32  

**Beauty – Waxing**  
- Half Leg – 20 min – Base £18  
- Full Leg – 40 min – Base £32  
- Hollywood – 30 min – Base £38  
- Brazilian – 25 min – Base £34  
- Underarm – 10 min – Base £12  
- Brow Wax – 10 min – Base £10  
- Full Face Wax – 25 min – Base £28  

**Beauty – Facials**  
- Express Facial 30 min – Base £38  
- Full Facial 60 min – Base £62  
- Dermaplaning – 45 min – Base £55  
- Hydrafacial-style – 50 min – Base £75  

**Packages**  
- Bridal Hair + Makeup – Quote only  
- Party Hair Up + Makeup – 90 min – Base £95  
- Monthly Membership – Fixed monthly  

**Add-ons**  
- Extra 15 min – £12  
- Long/Thick Hair Supplement – £8–£15  
- Toner Add-on – £18  
- Deep Conditioning Add-on – £12  

Pricing rule: Base × stylist tier (Junior 0.85, Stylist 1.0, Senior 1.2, Director 1.4). Deposit default 20% or £15 minimum. Quote-only cannot be booked online.

**Retail (high-street till)**  
Starter catalogue (admin editable, full price list):  
- Olaplex No.3 100ml – £30  
- Olaplex No.4 Shampoo 250ml – £28  
- Olaplex No.5 Conditioner 250ml – £28  
- Olaplex No.7 Bonding Oil 30ml – £28  
- K18 Leave-In Mask 50ml – £70  
- K18 Oil 30ml – £55  
- Kérastase Elixir Ultime 100ml – £42  
- Redken Acidic Bonding Concentrate 300ml – £32  
- Moroccanoil Treatment 100ml – £39  
- Color Wow Dream Coat 200ml – £25  
- ghd Heat Protect 120ml – £20  
- Professional shampoo 250ml – £14–£18  
- Professional conditioner 250ml – £14–£18  
- Hair mask 200ml – £22–£28  
- Styling cream/serum – £16–£24  

Till must allow: add product to an open appointment, sell product only (walk-in retail), apply staff discount, mixed payment (cash + card), and print or email receipt. Stock level drops on sale. Low-stock alert.

**Till and payments**  
- Take deposit online or in shop.  
- Take final balance in shop (cash, card, or split).  
- Quick sale for retail only.  
- Void and refund with reason.  
- End-of-day cash-up: expected vs actual cash, card totals, variance.  
- Every transaction posts to finance API with clear lines (service, retail, discount, VAT if applicable).

**Staff management**  
Each staff: name, photo, bio, tier, services qualified, working hours and breaks, calendar colour, optional commission %, active status.  
Reception and owner see all. Stylist sees own column and today’s clients. Commission report available (optional).

**Promotions**  
% off, fixed amount, BOGO, time-limited, code or automatic, new-client or all, min spend or specific service. One promo per booking. Discount before deposit. Logged and posted to finance API.

**Loyalty**  
1 point per £1 on completed paid services and retail. Expire after 12 months inactivity. Optional tiers. Fixed rewards. Points only after final payment confirmed. Manual adjust with log. Separate invoice line.

**Admin and reception screens**  
- Today’s diary (all staff columns)  
- Client search and card  
- Till / checkout  
- Walk-in queue  
- Stock levels and quick sale  
- End-of-day cash-up  
- Staff hours and performance  
- Promo and loyalty settings  
- Finance sync log  

**Client-facing (online)**  
Home with category tiles, service detail with photos and tier pricing, stylist + time, add-ons and recommended retail, checkout with deposit, confirmation, My bookings. Must drop into the same diary reception uses.

**Finance API**  
Every deposit, final payment, retail sale, promo, loyalty, cancellation, refund, and cash-up summary posts clear lines and status.

**What you must deliver (full pipeline)**

1. Research checkpoint – UK high-street salon operations, pricing benchmarks, top retail brands, gaps vs Fresha/Booksy/Treatwell/Phorest on till, walk-in, cash-up and client cards. Save full report.  
2. Product Spec agent – locked v1 spec from the above. No new features.  
3. Legal & Contracts + Compliance – all legally binding documents marked “Draft, not legal advice”: terms of service, privacy notice (UK GDPR), data processing agreement outline, cookie notice, salon customer contract template, disclaimers.  
4. Invoicing Quotes & Billing – sample quote and sample invoice forms (PDF-ready) for the annual licence. VAT placeholder. Clear line items.  
5. Advertising Creative – 5 draft X posts (text only) and a full brand + product + business launch plan aimed at high-street salon owners (positioning, target, launch sequence, pricing, first 90 days, how it replaces paper diary + till + spreadsheet).  
6. Operations Admin – full task log of every stage, decisions, file locations.  
7. Chief Editor – one short supporting note on why high-street salons need one system for diary, till, stock and finance.  
8. Builder – only after all above are approved and you have explicit written confirmation. Grok CLI + private GitHub repo + Vercel Hobby preview only. No production. Stripe test mode or stub. Pre-flight checklist in writing first. Raise any GitHub limitation immediately.

**Rules**  
- Follow pipeline-rules.md exactly.  
- Stop after every stage for my approval.  
- Nothing published, queued or sent.  
- All placeholders kept.  
- Save every output in /workspace/salonos/ with clear filenames.  
- Update master-task-log.md after each approved stage.  

Start with Stage 1 research now. Do not proceed further until I approve the checkpoint.
