# SalonOS task log

| Date (Europe/London) | Stage | Action | Status |
|---|---|---|---|
| 31 Oct 2026 | Setup | Locked brief saved to `00-locked-brief-from-tony.md` | Done |
| 31 Oct 2026 | 1 | Research report `01-research-report.md` written (sections 1 to 12), with the real-world operations and hardware section added after Tony's 20:49 steer | Delivered |
| 31 Oct 2026 | 1 | Checkpoint summary `01-checkpoint-summary.md` written | Delivered |
| 31 Oct 2026 | 1 | **Stage 1 delivered, awaiting Tony's approval.** Not approved. Stage 2 not started. | Waiting on Tony |
| 31 Oct 2026 | 1 | Tony's amendments 01 (21:30 GMT) saved verbatim in `00b-amendments-01-from-tony.md`, with locked requirements A1 to A7 | Done |
| 31 Oct 2026 | 1 | Report section 13 "Amendments 01: real-world research" added (nails, loyalty messaging law, booking engine, marketplace, e-signing, competitors) | Delivered |
| 31 Oct 2026 | 1 | Checkpoint summary updated with an "Amendments 01" part | Delivered |
| 31 Oct 2026 | 1 | **Stage 1 still awaiting Tony's approval** (he has not finished reviewing). Stage 2 not started. | Waiting on Tony |
| 31 Oct 2026 | 1 | **Stage 1 APPROVED by Tony at 21:39 GMT.** | Done |
| 31 Oct 2026 | 2 | Stage 2 started: locked v1 product spec. Steers received at 21:45, 21:46, 21:52, 21:53 GMT and the Drive sync request at 22:02 GMT. | Done |
| 31 Oct 2026 | 2 | `00c-tony-instructions-log.md` created (two entries are relays, to be replaced with Tony's own words) | Done |
| 31 Oct 2026 | 2 | `_research/stage2-deep-research.md` and `_research/treatment-catalogue-seed.csv` (703 rows) written | Delivered |
| 31 Oct 2026 | 2 | `02-product-spec.md` written: 347 requirements, 20 out-of-scope rows, traceability matrix (101 brief clauses, 66 Tony clauses, 0 gaps) | Delivered |
| 31 Oct 2026 | 2 | `02-checkpoint-summary.md` written | Delivered |
| 31 Oct 2026 | 2 | **Stage 2 delivered, awaiting Tony's approval.** Stage 3 not started. | Waiting on Tony |

Notes: nothing sent, posted or published. No other agent contacted. Stage 8 hosting conflict (Vercel Hobby vs Cloudflare Pages) flagged in the checkpoint summary.
Stage 2 notes: nothing sent, posted or published. No code. No other agent contacted. Drive sync done per `_drive-sync.md`; nothing deleted.

## Stage 2 approval and Stage 3 (31 Oct 2026, GMT)
| Date | Stage | Entry | Status |
|---|---|---|---|
| 31 Oct 2026 22:53 | 2 | **Stage 2 APPROVED by Tony with locks** (keep approved real-shop items; deposit 20% or £15 editable per service and per salon; new products in-shop only; one site; strike non-day-one proposals; marketplace stub only; Cloudflare Pages preview; 703 seed deletable). Logged in `00c` entry 7. | Done |
| 31 Oct 2026 | 2 | Spec revised: **304 requirements**, 20 out rows; 109 proposals became **72 kept, 37 struck**; 10 marketplace rows moved to a stub; 47 rows in 11.6; 4 rows added (SVC-15, CAT-19, MKS-01, MKS-02); traceability 0 gaps | Done |
| 31 Oct 2026 | 3 | Stage 3 started: Legal and Contracts plus Compliance | Done |
| 31 Oct 2026 | 3 | 21 drafts written in `03-legal/` (each headed "DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use"), `03-legal/00-trace.md`, `03-checkpoint-summary.md` | Delivered |
| 31 Oct 2026 | 3 | Stage 3 delivered. | Done |
| 31 Oct 2026 23:58 | 3 | **Stage 3 APPROVED by Tony with six fine-tunes** (logged in 00c section 8, pt765u) | Done |
| 31 Oct 2026 | 3 | Fine-tunes applied: new LEG-22 (home-visit / wedding agreement) and LEG-23 (operator privacy notice); changes to LEG-01, 03, 09, 18, 20; spec PTT-05, PTT-06, TIL-13, TIL-14, HEV-05, M-78, OI-18; trace and checkpoint updated | Delivered |
| 31 Oct 2026 | 3 | **Fine-tunes delivered, awaiting Tony's review.** No build; Stage 4 not started. | Waiting on Tony |

Stage 3 notes: nothing sent, posted or published. No code. No other agent contacted. Nothing deleted.
- 23:2x GMT: Stage 3 synced to Drive (03-legal folder, 21 docs + trace, checkpoint 03, in-place updates, 7 new PDFs).

## Stage 4 – Build (started 01 Nov 2026 00:13 GMT, Tony's approval t767u)
- Locks: Cloudflare Pages preview only, no Vercel prod, no live deploy, private GitHub repo first, written pre-flight before any deploy, Stripe test mode only, no paid add-ons/custom domain/production traffic, placeholders kept, stop and ask on any lock or cost.
- 00:15 Private repo created: https://github.com/travisleeswift-creator/salonos (PRIVATE). No GitHub block.
- 00:16 Cloud build agent launched: https://cursor.com/agents/bc-58ae1a6e-bb30-507b-a56b-c7a02964b88d (branch + PR, no deploys by builder).
- Next: review PR, write pre-flight checklist, Cloudflare Pages PREVIEW branch deploy only (noindex), Drive sync, stop for Tony's approval.

## 1 Nov 2026 — Stage 4 build deployed (preview only)
- Source: PR https://github.com/travisleeswift-creator/salonos/pull/1 (branch cursor/salonos-stage4-preview-b88d), tarball to 04-build/src. Not edited, nothing pushed.
- npm ci OK; npm test 33/33 pass; npm run build OK; e2e 1/1 pass (system Chrome).
- PREFLIGHT.md written, 12/12 PASS (04-build/PREFLIGHT.md).
- Deployed new Pages project salonos-preview, branch preview, deploy id 4baccc93-8669-4a75-9a47-345ec5836432. URL https://preview.salonos-preview.pages.dev
- Production alias salonos-preview.pages.dev: 404 "Deployment Not Found". No custom domain, no D1/KV/R2, no Stripe keys set (stub mode), Vercel untouched.
- Headless check: 6 routes, 0 console errors. Status: awaiting Tony's approval. No live launch.

## 1 Nov 2026 — Stage 4 redesign redeployed (preview only)
- Fresh tarball of PR #1 branch (redesign). Old tree kept at 04-build/src-prev-0048.
- npm ci OK; npm test 33/33; npm run build OK; e2e 1/1.
- Pre-flight re-run 12/12 PASS (PREFLIGHT.md, "Redesign redeploy 01 Nov").
- Deployed to salonos-preview, branch preview, deploy id 73d61e68-3a85-480f-bf48-5cece6834104. https://preview.salonos-preview.pages.dev
- Production alias still 404. 0 console errors, 0 broken images. Screenshots preview-*-v2.png in 04-build.
- Visual issues: stretched staff avatars, repeated photos on /book, membership uses bridal photo, 2-tile orphan row on /book, low-contrast "OS" in header wordmark.
- SalonOS-build-files-v2.txt uploaded to Drive 04-build. Awaiting Tony's approval. No live launch.

## 1 Nov 2026 — Stage 4 polish pass redeployed (preview only)
- Fresh tarball of PR #1 branch at 6720c9a. Old tree kept at 04-build/src-prev-0129.
- npm ci OK; npm test 33/33; npm run build OK; e2e 1/1.
- Pre-flight re-run 12/12 PASS (PREFLIGHT.md, "Polish redeploy 01 Nov").
- Deployed to salonos-preview, branch preview, deploy id 7a2c5c90-443d-4f58-b173-6da539d244d9. https://preview.salonos-preview.pages.dev
- Production alias still 404. 0 console errors, 0 broken images. Screenshots preview-*-v3.png in 04-build.
- All 7 earlier visual issues fixed or mostly fixed; remaining: some photo/label mismatches on waxing, Hair Up, Child Cut; shop has 3 distinct images; home door-tile photos repeat in later sections.
- SalonOS-build-files-v3.txt uploaded to Drive 04-build. Awaiting Tony's approval. No live launch.

## 1 Nov 2026 — Stage 4 photo-match pass redeployed (preview only)
- Fresh tarball of PR #1 branch at 2d037d5. Old tree kept at 04-build/src-prev-0140.
- npm ci OK; npm test 33/33; npm run build OK; e2e 1/1.
- Pre-flight re-run 12/12 PASS (PREFLIGHT.md, "Photo-match redeploy 01 Nov").
- Deployed to salonos-preview, branch preview, deploy id f776ff0e-d707-4dff-ab4f-6205c2396a2c. https://preview.salonos-preview.pages.dev
- Production alias still 404. 0 console errors, 0 broken images. Screenshots preview-*-v4.png in 04-build.
- Photo fixes confirmed (wax, updo, child cut, shop K18, lashes, home duplicates, shop hero, white buttons, flush photos). New defects: /book card titles lose left padding and "Request a quote" is clipped on quote-only cards; updo photo used 3 times on home; /book K18 treatment still beard photo.
- SalonOS-build-files-v4.txt uploaded to Drive 04-build. Awaiting Tony's approval. No live launch.

## 1 Nov 2026 — Stage 4 nav pass + Stage 5 finance-sync scaffold redeployed (preview only)
- Deployed PR #2 head (cursor/salonos-stage5-finance-scaffold-b88d, 095d270, stacked on PR #1 with polish fixes and new navigation). Old tree kept at 04-build/src-prev-0148.
- npm ci OK; npm test 39/39; build OK; e2e 4/4. Pre-flight 12/12 PASS plus 3 extra checks (no network code in finance-sync, toggle off by default, bundle makes no non-preview requests).
- Deploy id d0f6ac7b-1ca9-4e3b-b958-85e3c97fe853 on salonos-preview (branch preview). Production alias still 404. 432 requests, all to the preview host, 0 non-GET, 0 console errors.
- Finance sync: OPTIONAL / NOT CONNECTED, off by default, mock adapter only, HTTP adapter throws "NOT ENABLED: awaiting Tony approval".
- Earlier /book regressions fixed (title padding, Request a quote, K18/Mens photos, unique photos, home updo, underlines, shop hero 360px, footer width). Browser back/forward through booking works.
- Cosmetic leftovers: mobile menu drawer layout, Diary and Finance both highlighted in staff menu.
- Screenshots preview-*-v5.png in 04-build. SalonOS-build-files-v5.txt uploaded to Drive 04-build. Awaiting Tony's approval. No live launch.
