# SalonOS Stage 4: Pre-flight checklist

Draft, not legal advice. Prepared 1 Nov 2026 (Europe/London). Source: branch `cursor/salonos-stage4-preview-b88d` (PR #1, private repo travisleeswift-creator/salonos), extracted to `/workspace/salonos/04-build/src`. Code not edited, nothing pushed.

## Build and test results

| Step | Result |
|---|---|
| `npm ci` | OK, 0 vulnerabilities |
| `npm test` (vitest) | 3 files, **33 passed** |
| `npm run build` (tsc + vite) | OK. `dist/` built (one warning: JS chunk 775 kB, not an error) |
| e2e (Playwright, system Chrome 156, local dev server) | **1 passed**: booking, simulated checkout, staff lock, diary |

## Tony's locks (00:13 GMT, 1 Nov 2026)

Cloudflare Pages preview only. No Vercel production. No live deploy. Private GitHub repo first. Pre-flight confirmed in writing before any deploy. Stripe test mode only. No real payments. No paid add-ons, no custom domain, no production traffic. All placeholders kept. Stop and ask if anything breaks a lock or costs money.

## Result: all 12 items PASS (summary)

| # | Item | Result |
|---|---|---|
| 1 | Target is a Cloudflare Pages PREVIEW branch only | PASS |
| 2 | Vercel untouched | PASS |
| 3 | Stripe test or stubbed, no live keys, live keys refused | PASS |
| 4 | No custom domain | PASS |
| 5 | No paid features (free plan, no D1/KV/R2) | PASS |
| 6 | No production traffic or public production URL | PASS |
| 7 | noindex meta and X-Robots-Tag present | PASS |
| 8 | Test-mode banner visible | PASS (re-checked on the deployed URL after deploy) |
| 9 | Placeholders kept, no invented prices | PASS |
| 10 | Sample data labelled SAMPLE | PASS |
| 11 | No analytics | PASS |
| 12 | No secrets committed | PASS |

## Evidence (commands and output)

```

### 1. Target: Cloudflare Pages preview branch only
$ cat wrangler.toml (non-comment lines)
name = "salonos"
compatibility_date = "2026-11-01"
pages_build_output_dir = "dist"

$ planned command: wrangler pages deploy dist --project-name=salonos-preview --branch=preview
$ wrangler pages project list | grep -c salonos-preview  (project must not exist yet)
0

### 2. Vercel untouched
$ ls vercel.json .vercel
ls: cannot access 'vercel.json': No such file or directory
ls: cannot access '.vercel': No such file or directory
$ grep -rniE "vercel" src functions public index.html wrangler.toml package.json | wc -l
0
$ grep -n vercel package.json (deps)
(no matches)
No Vercel MCP/CLI call is made in this task.

### 3. Stripe test mode or stubbed; live keys refused
$ grep -rnIE "sk_live|pk_live|rk_live|whsec_[A-Za-z0-9]|sk_test_[A-Za-z0-9]{10,}|pk_test_[A-Za-z0-9]{10,}" (excluding node_modules, dist, lockfile)
./.env.example:2:# Live keys (sk_live_ / pk_live_) are refused.
(only match is the comment in .env.example saying live keys are refused)
$ grep -n "sk_test_\|Refusing" functions/api -r
functions/api/health.ts:21:  if (key.startsWith("sk_test_")) return "test";
functions/api/stripe/webhook.ts:12:  if (key && !key.startsWith("sk_test_")) {
functions/api/stripe/webhook.ts:13:    return json({ error: "Refusing a non-test Stripe key." }, 400);
functions/api/stripe/checkout.ts:23:  if (!key.startsWith("sk_test_")) {
functions/api/stripe/checkout.ts:24:    return json({ error: "Refusing a non-test Stripe key. Live payments are not allowed." }, 400);
$ .env.example
# Stripe TEST keys only. Leave blank to use the simulated-payment stub.
# Live keys (sk_live_ / pk_live_) are refused.
# STRIPE_SECRET_KEY is read by the Pages Function, not by the browser.
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
VITE_STRIPE_PUBLISHABLE_KEY=
$ ls -a | grep -i "^.env"
.env.example
$ Cloudflare Pages env vars set by this deploy: none (no STRIPE_SECRET_KEY => functions run in "stub" mode)
$ grep -rn "js.stripe.com\|loadStripe\|@stripe" src index.html package.json | wc -l
0

### 4. No custom domain
$ grep -rniE "custom_domain|routes|zone_id|domains" wrangler.toml
(no matches)
Deploy uses *.pages.dev only; no `wrangler pages project ... domains` command is run.

### 5. No paid features
$ grep -nE "d1_databases|kv_namespaces|r2_buckets|durable_objects|queues|ai|vectorize|hyperdrive|analytics_engine|placement|observability|services|browser" wrangler.toml (non-comment)
(no bindings)
$ grep -rn "env\.\(DB\|KV\|R2\|AI\|QUEUE\)" functions
functions/api/health.ts:12:      persistence: context.env.DB ? "d1-binding-present" : "browser-indexeddb",
(health.ts reads optional DB only to report "d1-binding-present" or "browser-indexeddb"; not required)
$ cat d1/README.md | head -4
# D1 adapter (not created)

This preview does not create a Cloudflare D1 database, a KV namespace, or any other cloud resource.

Cloudflare Pages Free plan: unlimited static requests; Functions count against the free 100k requests/day; no Pro feature used.

### 6. No production traffic / public production URL
$ wrangler pages project list | grep salonos-preview  (before deploy)
(project does not exist yet: NEW project will be created, production branch main, deploy only with --branch=preview)
Plan: only https://preview.salonos-preview.pages.dev is served; production alias salonos-preview.pages.dev stays empty (no --branch=main deploy).

### 7. noindex meta + X-Robots-Tag
$ grep -n robots index.html dist/index.html
index.html:6:    <meta name="robots" content="noindex" />
dist/index.html:6:    <meta name="robots" content="noindex" />
$ cat dist/_headers
/*
  X-Robots-Tag: noindex
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY
$ cat dist/robots.txt
User-agent: *
Disallow: /
$ grep -n "x-robots-tag" functions -r
functions/api/health.ts:28:    "x-robots-tag": "noindex",
functions/api/stripe/webhook.ts:55:    headers: { "content-type": "application/json; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "no-store" },
functions/api/stripe/checkout.ts:55:      "x-robots-tag": "noindex",
(NOTE: Tony’s standing rule is no noindex on his public sites; this preview is a deliberate exception under the Stage 4 lock.)

### 8. Test-mode banner visible
$ grep -rn "TEST MODE – no real payments" src/ui src/main.tsx | cut -c1-120
src/ui/public.tsx:313:          <p className="banner" role="status"><strong>TEST MODE – no real payments</strong></p>
src/ui/public.tsx:395:      <p className="banner"><strong>TEST MODE – no real payments</strong></p>
src/ui/staff.tsx:268:      <p className="banner"><strong>TEST MODE – no real payments</strong>. Card means a simulated
src/main.tsx:33:        <strong>TEST MODE – no real payments</strong>
$ e2e asserts banner: grep -n "TEST MODE" e2e/booking.spec.ts
6:  await expect(page.getByRole("status").first()).toContainText("TEST MODE – no real payments");
(live render check repeated on the deployed URL after deploy)

### 9. Placeholders kept, no invented prices
$ grep -rhoE "\[[A-Z][A-Z0-9 ./&–-]{3,}[^]]{0,40}\]" src --include=*.md --include=*.ts --include=*.tsx | sort | uniq -c | sort -rn | head -25
     40 [SALON LEGAL NAME]
     28 [OPERATOR LEGAL NAME]
     24 [SALON NAME]
     23 [SQUARE BRACKETS]
     17 [ADDRESS]
     16 [PRICE]
     13 [CONFIRM]
     12 [SALON EMAIL]
     12 [DATE]
     11 [PERIOD]
     11 [OPERATOR ADDRESS]
     10 [OPERATOR EMAIL]
      9 [NUMBER]
      8 [VAT NUMBER]
      8 [SALON SETS]
      6 [OPERATOR VAT POSITION]
      6 [NAME]
      6 [COMPANY NO]
      5 [TRAVEL FEE – Tony to set]
      5 [SHIPPING RATE – Tony to set]
      5 [PRICE – Tony to set]
      5 [JURISDICTION – solicitor to confirm]
      5 [ICO REG NO]
      5 [EMAIL PROVIDER]
      5 [DAYS]
$ grep -rn "\[PRICE\]" src | wc -l
16
$ grep -rn "Prices on request" src | wc -l
713
$ source of every £ amount in UI/data code
src/ui/public.tsx:205:              <label>£8 to £15
src/ui/staff.tsx:293:      <button className="btn" type="button" onClick={() => void salon.sellVoucher(5000, "SAMPLE till").then((code) => s
src/domain/money.ts:235:/** 1 point per £1, fractions round down. Tips are excluded by the caller. */
(£8 to £15 = Long/Thick Hair Supplement range, from Tony brief line 115. Seed booking 5040p = SAMPLE base x Stylist 1.2 tier, from brief price list. Voucher 5000p labelled SAMPLE till. No price outside the brief and spec.)

### 10. Sample data labelled SAMPLE
$ grep -c SAMPLE src/data/seed.ts
56
$ sed -n 8,18p src/data/seed.ts
export const SAMPLE_DEVICE_PIN = "2580";

export const SAMPLE_LOGINS: { username: string; pin: string; second: string | null; label: string }[] = [
  { username: "owner", pin: "258013", second: "482913", label: "SAMPLE Owner" },
  { username: "manager", pin: "258014", second: "482914", label: "SAMPLE Manager" },
  { username: "reception", pin: "1111", second: null, label: "SAMPLE Reception" },
  { username: "jordan", pin: "2222", second: null, label: "SAMPLE – Jordan Hale" },
  { username: "casey", pin: "3333", second: null, label: "SAMPLE – Casey Brook" },
  { username: "morgan", pin: "4444", second: null, label: "SAMPLE – Morgan Ellis" },
  { username: "sam", pin: "5555", second: null, label: "SAMPLE – Sam Patel" },
  { username: "alex", pin: "6666", second: null, label: "SAMPLE – Alex Nguyen" },

### 11. No analytics
$ grep -rniE "google-analytics|gtag|googletagmanager|plausible|mixpanel|hotjar|fbq\(|clarity\.ms|web-analytics|cloudflareinsights|sentry|posthog|datadog|amplitude" src index.html public functions package.json wrangler.toml | wc -l
0
$ grep -n "No analytics" src/main.tsx
75:        <p>Preview build. <a href="/legal/LEG-23">Operator privacy notice</a>. No analytics. Database host: [DATABASE HOST].</p>
$ grep -rhoE "https?://[^\" )]+" dist/index.html dist/assets/*.js | grep -vE "w3.org|reactjs.org|react.dev|rolldown|developer.mozilla|github.com/facebook" | sort -u | head -20
http://localhost
https://assets.publishing.service.gov.uk/media/6acf97da2de3184ccf8b814e/subscription-contracts-rules-guidance.pdf
https://beautyatyours.co.uk/spray-tanning/,0,Verified
https://beautyatyours.co.uk/spray-tanning/,Salon
https://bluetitlondon.com/hairdresser-price-list/,0,Verified
https://bluetitlondon.com/hairdresser-price-list/,1,Verified
https://bluetitlondon.com/hairdresser-price-list/,Salon
https://dg5r53r4bbz7q.cloudfront.net/media/pdf/city-spas/cityspapricelist2024.pdf,0,Verified
https://dg5r53r4bbz7q.cloudfront.net/media/pdf/city-spas/cityspapricelist2024.pdf,1,Verified
https://dg5r53r4bbz7q.cloudfront.net/media/pdf/city-spas/cityspapricelist2024.pdf,2,Verified
https://dg5r53r4bbz7q.cloudfront.net/media/pdf/city-spas/cityspapricelist2024.pdf,Salon
https://effleuragehair.co.uk/m/PriceList.pdf,0,Verified
https://effleuragehair.co.uk/m/PriceList.pdf,1,Verified
https://effleuragehair.co.uk/m/PriceList.pdf,2,Verified
https://effleuragehair.co.uk/m/PriceList.pdf,4,Verified
https://effleuragehair.co.uk/m/PriceList.pdf,Salon
https://github.com/markedjs/marked.
https://github.com/ungap/url-search-params.
https://ico.org.uk/for-organisations/
https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/

### 12. No secrets committed
$ grep -rnIE "AKIA[0-9A-Z]{12}|ghp_[A-Za-z0-9]{20}|gho_[A-Za-z0-9]{20}|github_pat_|-----BEGIN|CLOUDFLARE_API_TOKEN|VERCEL_TOKEN|GEMINI_API_KEY|CHAT_PIN|xox[bp]-" (excl node_modules, dist, lockfile)
(no matches)
$ ls -a | grep -iE "^\.env|\.pem|\.key"
.env.example
(.env.example holds blank placeholders only)
```

## Notes

- The preview is noindex by design (lock). This is an exception to Tony's usual "everything indexable" rule for his own sites, because this is a customer's salon system in test mode.
- Sample staff logins and PINs are fictional and shown on the staff lock screen (`/team`), file `src/ui/staff.tsx` line 34.
- Deploy plan: new project `salonos-preview`, production branch `main`, `wrangler pages deploy dist --project-name=salonos-preview --branch=preview` from the source root so `functions/` is included. No env vars or secrets set on the project.

## Deploy and post-deploy verification (1 Nov 2026)

- Project `salonos-preview` was NEW (not in `wrangler pages project list` before). Created with production branch `main`. Nothing deleted anywhere.
- Command: `wrangler pages deploy dist --project-name=salonos-preview --branch=preview --commit-dirty=true` from the source root (7 files + Functions bundle uploaded).
- Deploy id: `4baccc93-8669-4a75-9a47-345ec5836432` (Environment: Preview, Branch: preview).
- Preview URL: https://preview.salonos-preview.pages.dev (the first minutes after deploy gave a TLS handshake error while Cloudflare issued the certificate; it then worked)
- Hash URL: https://4baccc93.salonos-preview.pages.dev (200)
- 200 + `x-robots-tag: noindex` on: `/`, `/book`, `/shop`, `/shop/checkout`, `/legal`, `/legal/LEG-23`, `/team` (staff lock), `/club`, `/my`, `/enquiry`, `/api/health`, `/robots.txt`, `/manifest.webmanifest`.
- `/api/health` -> `{"ok":true,"preview":true,"payments":"test-or-stub","persistence":"browser-indexeddb","stripe":"stub"}`
- `POST /api/stripe/checkout` -> `{"mode":"stub","banner":"TEST MODE – no real payments", ...}`
- Production alias `https://salonos-preview.pages.dev/` -> HTTP 404 Cloudflare "Deployment Not Found" page ("Nothing is here yet"). Nothing served.
- Headless Chrome 156 on `/`, `/book`, `/shop`, `/legal`, `/legal/LEG-23`, `/team`: test-mode banner present, meta robots noindex, **0 console errors, 0 page errors, 0 failed requests, 0 third-party hosts**.
- Item 8 (banner visible on the deployed URL): PASS.
- Screenshots: `04-build/preview-home.png`, `04-build/preview-team.png`.

---

## Redesign redeploy 01 Nov 2026 (about 01:25 to 01:35 Europe/London)

Source: fresh tarball of branch `cursor/salonos-stage4-preview-b88d` (PR #1) after the redesign push (photos, neon pink, even home grid, marketing sections). Previous tree kept at `04-build/src-prev-0048`. Code not edited, nothing pushed.

**Build and tests:** `npm ci` OK (0 vulnerabilities). `npm test` 33 of 33 passed. `npm run build` OK (JS 808 kB, CSS 6.6 kB; `dist` 6.9 MB, 66 files in `dist/media`, none over 25 MB). e2e 1 of 1 passed (system Chrome).

**All 12 pre-flight checks re-run: 12 of 12 PASS.** Full command output was regenerated; it matches the first run, with these differences:

| # | Item | Result | Redesign-specific evidence |
|---|---|---|---|
| 1 | Pages preview branch only | PASS | Same project `salonos-preview` (created in the first deploy, nothing deleted). Deploy uses `--branch=preview`. |
| 2 | Vercel untouched | PASS | 0 "vercel" matches in src, functions, public, config. |
| 3 | Stripe test or stubbed | PASS | Only match for live-key patterns is the `.env.example` comment. Functions still refuse non-`sk_test_` keys. No key set; `/api/health` says `"stripe":"stub"`. |
| 4 | No custom domain | PASS | No domain config. |
| 5 | No paid features | PASS | No D1/KV/R2 bindings. 66 static media files only (WebP). |
| 6 | No production traffic | PASS | Production alias still returns 404 "Deployment Not Found". |
| 7 | noindex | PASS | Meta, `_headers` X-Robots-Tag, robots.txt Disallow all. |
| 8 | Test-mode banner | PASS | Visible on all 13 routes/viewports checked on the deployed URL. |
| 9 | Placeholders kept, no invented prices | PASS | `[PRICE]` 16, "Prices on request" 714, new `[TESTIMONIAL]` placeholder ("No review is shown until the salon adds one"), `[SALON NAME]`, `[SALON ADDRESS]`, `[TRAVEL FEE]`, `[SHIPPING RATE]` kept. Prices shown come from Tony's brief (e.g. Olaplex No.3 £30, Party Hair Up + Makeup £95, tiered ranges). No fake reviews, awards or ratings found (grep). One default to note: "One point per £1" is the brief's starting rate, still marked to confirm in the legal pack. |
| 10 | Sample data labelled SAMPLE | PASS | Staff cards say "SAMPLE – name"; page strip says "SAMPLE DATA. Fictional clients and staff." |
| 11 | No analytics | PASS | 0 analytics matches; 0 third-party hosts requested in headless Chrome. |
| 12 | No secrets committed | PASS | Secret grep: no matches. Image manifest says images are AI-generated, unbranded, no real people or trademarks. |

**Deploy:** `wrangler pages deploy dist --project-name=salonos-preview --branch=preview --commit-dirty=true` (134 files, 4 already uploaded, plus Functions bundle).
- Deploy id: `73d61e68-3a85-480f-bf48-5cece6834104`
- Preview URL: https://preview.salonos-preview.pages.dev
- Hash URL: https://73d61e68.salonos-preview.pages.dev
- Previous deploy `4baccc93` still exists (not deleted).

**Verification on the deployed URL:**
- 200 and `x-robots-tag: noindex` on `/`, `/book`, `/shop`, `/shop/checkout`, `/club`, `/my`, `/enquiry`, `/legal`, `/legal/LEG-23`, `/team`, `/api/health`, `/robots.txt`.
- 16 `/media` URLs sampled (hero, hero-mobile, treatment, product, thumbs): all 200, `image/webp`, byte-identical to `dist`.
- Production alias https://salonos-preview.pages.dev: 404 "Deployment Not Found". Nothing served.
- Headless Chrome 156: `/`, `/book`, `/shop` (desktop and mobile), `/shop/checkout`, `/club`, `/my`, `/enquiry`, `/legal`, `/legal/LEG-23`, `/team`: 0 console errors or warnings, 0 page errors, 0 failed requests, 0 broken images (35 images on home, 49 on /book, 7 on /shop), no horizontal scroll at 390 px.
- Screenshots: `04-build/preview-home-v2.png`, `preview-home-mobile-v2.png`, `preview-book-v2.png`, `preview-shop-v2.png`.

**Visual review (found by looking at each screenshot):**
1. Staff avatars on the home "Choose your stylist" row are stretched into wide flat ellipses (desktop and mobile) and the cards have empty space under them. Visible defect.
2. The /book treatment list reuses one photo for many items (the same haircut shot on about 9 hair cards, the same treatment-room shot on all waxing cards, the same facial shot on 3). It looks repetitive but nothing is broken.
3. Monthly Membership on /book uses the bridal photo, which does not match.
4. The /book list is a 4-column grid with an odd number of tiles, so the last row has 2 tiles and 2 empty slots (orphan row). The home grids are even (8 treatments, 8 doors, 8 stylist cells).
5. In the header, the "OS" of the SalonOS wordmark is dark violet on the pink-violet gradient and is hard to read.
6. The home "Offers", "Loyalty club", "Gift vouchers" and "Visit us" panels have a big image beside a short text block, leaving a lot of empty dark space under the text. Cosmetic.
7. "Anyone qualified" and "Choose your stylist" reuse the same team photo on the home page. Cosmetic.
8. Contrast: body text is light on dark plum and reads fine; lime prices and pink buttons are readable. The sample-data strip text is small.
No broken images and no layout overflow.

**Text export:** `04-build/SalonOS-build-files-v2.txt` (64 text files, 122 image files listed by name only) uploaded to Drive 04-build as `SalonOS-build-files-v2.txt`.

---

## Polish redeploy 01 Nov 2026 (about 01:37 to 01:50 Europe/London)

Source: fresh tarball of branch `cursor/salonos-stage4-preview-b88d` at commit `6720c9a` ("Polish the neon layout: circles, full rows, and varied photos"). The previous tree is kept at `04-build/src-prev-0129` (and `src-prev-0048`). Code not edited, nothing pushed.

**Build and tests:** `npm ci` OK (0 vulnerabilities). `npm test` 33 of 33 passed. `npm run build` OK (JS 811 kB, chunk-size warning only; `dist` 7.3 MB, 73 files in `dist/media`, none over 25 MB). e2e 1 of 1 passed (system Chrome).

**All 12 pre-flight checks re-run: 12 of 12 PASS.** Same command set as the redesign run; output matches it except for line numbers.

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Pages preview branch only | PASS | Same project `salonos-preview`; deploy uses `--branch=preview`. |
| 2 | Vercel untouched | PASS | 0 "vercel" matches in src, functions, public, config. |
| 3 | Stripe test or stubbed | PASS | Only match for live-key patterns is the `.env.example` comment. Functions refuse non-`sk_test_` keys. `/api/health` says `"stripe":"stub"`. |
| 4 | No custom domain | PASS | No domain config. |
| 5 | No paid features | PASS | No D1/KV/R2 bindings; static WebP media only. |
| 6 | No production traffic | PASS | Production alias returns 404 "Deployment Not Found". |
| 7 | noindex | PASS | Meta, `_headers` X-Robots-Tag, robots.txt Disallow all. |
| 8 | Test-mode banner | PASS | Visible on all 13 route/viewport loads on the deployed URL. |
| 9 | Placeholders kept, no invented prices | PASS | `[PRICE]` 16, "Prices on request" 714, `[TESTIMONIAL]` shown with "Nothing here is invented". Only £ amounts in code are the brief's (Olaplex £30 etc.), the £8 to £15 supplement, the points rate and the SAMPLE till voucher. No reviews, awards or ratings found. "One point per £1" is still the brief's default to confirm. |
| 10 | Sample data labelled SAMPLE | PASS | 56 SAMPLE labels in seed; staff cards say "SAMPLE – name"; page strip says "SAMPLE DATA". |
| 11 | No analytics | PASS | 0 analytics matches; 0 third-party hosts requested in headless Chrome. (URLs in the JS bundle are source citations in catalogue data, not requests.) |
| 12 | No secrets committed | PASS | Secret grep: no matches. |

**Deploy:** `wrangler pages deploy dist --project-name=salonos-preview --branch=preview --commit-dirty=true` (152 files, 18 new uploads, plus Functions bundle).
- Deploy id: `7a2c5c90-443d-4f58-b173-6da539d244d9`
- Preview URL: https://preview.salonos-preview.pages.dev
- Hash URL: https://7a2c5c90.salonos-preview.pages.dev
- Earlier deploys `73d61e68` and `4baccc93` still exist (not deleted).

**Verification on the deployed URL:**
- 200 and `x-robots-tag: noindex` on `/`, `/book`, `/shop`, `/shop/checkout`, `/club`, `/my`, `/enquiry`, `/legal`, `/legal/LEG-23`, `/team`, `/api/health`, `/robots.txt`.
- 34 `/media` and `/media/thumbs` files sampled (every 4th): all 200, `image/webp`, byte-identical to `dist`.
- Production alias https://salonos-preview.pages.dev: 404 "Deployment Not Found".
- Headless Chrome: 13 loads (desktop and 390 px mobile), 0 console errors or warnings, 0 page errors, 0 failed requests, 0 broken images (35 images on home, 51 on /book, 7 on /shop), no third-party hosts, no horizontal scroll.
- Screenshots: `04-build/preview-home-v3.png`, `preview-home-mobile-v3.png`, `preview-book-v3.png`, `preview-shop-v3.png`.

**Visual check of the 7 earlier issues:**
1. Staff avatars stretched: FIXED. Circular, six SAMPLE staff plus two filler tiles (floor, consultation), cards even.
2. Repeated photos on /book: MOSTLY FIXED. Each hair, nail and facial card now differs from its neighbours. Still some repeats further apart (waxing set uses 4 photos across 8 cards; the two lash cards at the start and end of the lash row share a photo).
3. Membership used bridal photo: FIXED. Uses a membership card image.
4. Orphan row on /book: FIXED. The list ends on a full row with two filler tiles ("Can't see it? Ask us", "Current offers").
5. Wordmark "OS" unreadable: FIXED. White glowing wordmark is clear.
6. Half-empty home panels: FIXED. Offers, Loyalty, Vouchers and Visit us panels are balanced.
7. Duplicate team photo: FIXED. The team photo appears once.

**Still off:** waxing photos do not match some labels (Hollywood and Underarm use an underarm waxing shot, Brazilian and Full Face Wax use a face threading shot); Hair Up (occasion) uses a fade-cut photo; Child Cut uses an adult curly-hair portrait. Shop has 4 products and 3 distinct images (K18 reuses the Olaplex No.3 image) and the hero banner crops the laptop and phone. The wedding, home-visit, shop and delivery photos appear twice on the home page (door tile and the later section). Pink buttons still have dark underlined text (readable). Card photos sit a few pixels inset from the card edge on /book. No broken images, no overflow.

**Text export:** `04-build/SalonOS-build-files-v3.txt` (64 text files, 136 image files listed by name only) uploaded to Drive 04-build as a new file.

---

## Photo-match redeploy 01 Nov 2026 (about 01:50 to 02:00 Europe/London)

Source: fresh tarball of branch `cursor/salonos-stage4-preview-b88d` at commit `2d037d5` ("Match treatment and product photos more carefully"; the commit carries a Co-authored-by trailer for tonyadamscakes-collab). Previous tree kept at `04-build/src-prev-0140` (and the older `src-prev-0129`, `src-prev-0048`). Code not edited, nothing pushed.

**Build and tests:** `npm ci` OK (0 vulnerabilities). `npm test` 33 of 33 passed. `npm run build` OK (JS 812 kB, chunk-size warning only; `dist` 7.8 MB, 83 files in `dist/media`, none over 25 MB). e2e 1 of 1 passed (system Chrome).

**All 12 pre-flight checks re-run: 12 of 12 PASS.** The full command output is identical to the polish run apart from a timestamp, so the evidence table in "Polish redeploy 01 Nov" applies unchanged (no Vercel references, only the `.env.example` comment matches live-key patterns, no bindings, noindex three ways, test-mode banner, placeholders and "Prices on request" kept, SAMPLE labels, no analytics, no secrets). Extra check: 0 reviews, awards or ratings in UI code; the image manifest still says AI-generated, unbranded, no real people or trademarks. "One point per £1" is still the brief's default to confirm.

**Deploy:** `wrangler pages deploy dist --project-name=salonos-preview --branch=preview --commit-dirty=true`.
- Deploy id: `f776ff0e-d707-4dff-ab4f-6205c2396a2c`
- Preview URL: https://preview.salonos-preview.pages.dev
- Deployment hash URL: https://f776ff0e.salonos-preview.pages.dev
- Earlier deploys `7a2c5c90`, `73d61e68` and `4baccc93` still exist (not deleted).

**Verification on the deployed URL:**
- 200 and `x-robots-tag: noindex` on `/`, `/book`, `/shop`, `/shop/checkout`, `/club`, `/my`, `/enquiry`, `/legal`, `/legal/LEG-23`, `/team`, `/api/health`, `/robots.txt`.
- `/media` and `/media/thumbs` files sampled: all 200 and `image/webp`.
- Production alias https://salonos-preview.pages.dev: 404.
- Headless Chrome: 13 loads (desktop and 390 px mobile), 0 console errors or warnings, 0 page errors, 0 failed requests, 0 broken images (35 images on home, 51 on /book, 7 on /shop), no third-party hosts, no horizontal scroll.
- Screenshots: `04-build/preview-home-v4.png`, `preview-home-mobile-v4.png`, `preview-book-v4.png`, `preview-shop-v4.png`.

**Visual check of the requested items:**
1. Wax photos: FIXED. the wax treatments now have distinct, mostly matched photos. Still a little abstract: Full Face Wax shows wax strips on a pale blob.
2. Updo: FIXED. Hair Up (occasion) shows an updo.
3. Child cut: FIXED. A child-size salon chair with a pink cape, no adult portrait.
4. K18: FIXED for the shop product (a mask jar). NOT matched on /book, where "K18 Molecular Repair Treatment" still shows a man's beard-trim photo.
5. Lashes: FIXED. the lash cards each have their own image.
6. No duplicates between home tiles and sections: FIXED for the door tiles (Weddings, Home visits, Online shop, Delivery now differ from the section photos). NEW repeat: the updo photo appears three times on the home page (Hair Up tile, Party Hair Up + Makeup tile, and the "At your address" home-visit panel), and a home-visit panel with an updo photo does not suit the text.
7. Shop hero: FIXED (contained, full image visible) but it is now about 600 px tall and pushes the products below the first screen.
8. White button text: FIXED. Pink buttons ("Book a treatment", "Use an offer", "Join free", "How vouchers work", "Book before you come in") have white text and no underline. "Shop the edit" (outline) and the "Add and check out" links are still underlined.
9. Flush card photos: FIXED on the photo, but it caused NEW defects on /book. The treatment title now sits against the card's left edge with no padding while the lines below are indented, and the "Request a quote" link on quote-only cards (Restyle Cut, Colour Correction, Bridal Hair + Makeup) is clipped at the bottom of the card.

**Still off:**
- /book still repeats photos across non-adjacent cards (8 photos used twice: hair cut 2, beard, curls, updo, vivid colour, hair colour 1, highlights, hydra facial).
- Mens Cut and K18 treatment show similar beard photos.
- Footer salon photo is slightly narrower than the content column on /book and /shop.
No broken images and no overflow.

**Text export:** `04-build/SalonOS-build-files-v4.txt` (64 text files, 156 image files listed by name only) uploaded to Drive 04-build as a new file.

---

## Nav + Stage 5 scaffold redeploy 01 Nov 2026 (pre-flight, written before deploy)

Source: fresh tarball of PR #2 head `cursor/salonos-stage5-finance-scaffold-b88d` at commit `095d270` (PR #2 "Stage 5 finance sync scaffold", stacked on PR #1; it is 1 commit ahead of PR #1 head `a22767e`, which carries the polish/regression fixes and the new navigation). Previous tree kept at `04-build/src-prev-0148`. Code not edited, nothing pushed.

**Build and tests:** `npm ci` OK (0 vulnerabilities). `npm test` 39 of 39 passed (4 files). `npm run build` OK (JS 832 kB, chunk-size warning only; `dist` 8.0 MB, 86 files in `dist/media`, none over 25 MB). e2e 4 of 4 passed (system Chrome).

**12 standard pre-flight checks: 12 of 12 PASS** (same commands as the earlier sections): Pages preview branch only, wrangler.toml has no bindings; no Vercel files or references; no live Stripe keys, non-`sk_test_` keys refused, functions in stub mode; no custom domain or routes; no paid features or bindings; production alias unused; noindex meta, `_headers` and robots.txt all present; test-mode banner in place; placeholders kept (`[PRICE]` 16 times, "Prices on request" 716 times, no invented prices); sample data labelled SAMPLE; no analytics; no secrets or `.env` files.

**Extra checks for the Stage 5 scaffold: all PASS**
- 13. `grep -rnE "fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|import\(|https?://"` over `src/modules/finance-sync` and `src/domain/finance.ts`: no matches. `HttpFinanceAdapter.postCashUp` only throws "NOT ENABLED: awaiting Tony approval". The panel uses the mock payload builder only and says "Not sent".
- 14. The toggle is off by default: `defaultFinanceSyncConfig` sets `enabled: false`, a missing or corrupt stored value falls back to off, `pushDailyCashUp` returns "OPTIONAL / NOT CONNECTED" without calling the adapter; three unit tests assert `enabled` is false. Base URL and auth stay as placeholders ("[FINANCE API BASE URL – Tony to set]").
- 15. Production bundle: no `XMLHttpRequest`, `sendBeacon`, WebSocket or EventSource. The only `fetch(` is `fetch(e.href,n)` from the router/React runtime. Absolute `https://` strings in the bundle are source-citation and legal reference links shown as text in the product data, plus w3.org namespaces, not requests. A runtime check of every network request on the deployed URL follows after deploy.

No FAIL, so the deploy goes ahead.

### Deploy and verification (Nav + Stage 5 scaffold)

`wrangler pages deploy dist --project-name=salonos-preview --branch=preview --commit-dirty=true` (9 new files uploaded, 169 already there, plus `_headers`, `_redirects` and the Functions bundle).
- Deploy id: `d0f6ac7b-1ca9-4e3b-b958-85e3c97fe853`
- Preview URL: https://preview.salonos-preview.pages.dev
- Deployment hash URL: https://d0f6ac7b.salonos-preview.pages.dev
- Earlier deploys `f776ff0e`, `7a2c5c90`, `73d61e68` and `4baccc93` still exist (not deleted).

Verification on the deployed URL:
- 200 and `x-robots-tag: noindex` on `/`, `/book`, `/shop`, `/shop/checkout`, `/club`, `/my`, `/enquiry`, `/vouchers`, `/legal`, `/legal/LEG-23`, `/team`, `/team/finance`, `/api/health`, `/robots.txt`. `/api/health` reports `stripe: stub`, `payments: test-or-stub`. noindex meta tag present.
- 27 sampled `/media` files: all 200, `image/*` and byte-identical to `dist`.
- Production alias https://salonos-preview.pages.dev: 404.
- Headless Chrome, 20 page loads plus the staff finance flow: 0 console errors or warnings, 0 page errors, 0 failed requests, 0 broken images, no horizontal scroll, test-mode banner on every public page.
- Network: 432 requests in total, every one to `preview.salonos-preview.pages.dev`; 0 requests to any other host; 0 non-GET requests (so nothing was posted anywhere). That includes clicking "Preview cash-up payload" with the toggle off and on: 0 new requests either time.
- Finance screen (`/team/finance`, signed in as SAMPLE Owner): the toggle is unchecked by default, "OPTIONAL / NOT CONNECTED" shows, and the preview prints the `salonos.cash-up.v1` payload ("SAMPLE 2026-10-28 ... Not sent.").

Screenshots: `04-build/preview-home-v5.png`, `preview-home-mobile-v5.png` (menu open; viewport-only crop `preview-home-mobile-menu-v5.png`), `preview-book-v5.png` (step 3 "Artist", tabs and breadcrumb visible), `preview-shop-v5.png`, `preview-finance-v5.png`.

### Visual check of the earlier /book regressions

1. Card title padding: FIXED. Titles on all 46 /book/treatment cards sit 16 px in from the card edge, matching the body text.
2. Clipped "Request a quote": FIXED. All 3 links (Restyle Cut, Colour Correction, Bridal Hair + Makeup) are inside their cards, no card overflows (also asserted by e2e).
3. K18 and Mens Cut photos: FIXED. K18 Molecular Repair Treatment uses `product-k18-600.webp` (a jar) and Mens Cut uses its own `treatment-mens-600.webp`; the beard photo is gone from K18.
4. Unique photos: FIXED. 46 cards, 46 distinct photos. One small repeat: the /book hero banner and the first card (Ladies Cut & Blow Dry Short) use `treatment-hair-cut-1`.
5. Home updo duplicates: FIXED. Hair Up (occasion) and Party Hair Up + Makeup now show different updo photos, and "At your address" shows a home-visit scene (mirror, kit bag, chair). No photo repeats on home apart from SAMPLE avatar placeholders (two SVGs each used twice).
6. Underlined links: FIXED. "Book a treatment", "Shop the edit", "Use an offer", "Join free", "How vouchers work", "Book before you come in" and "Add and check out" all compute `text-decoration: none`, with white text on pink.
7. Shop hero height: FIXED. 360 px tall (was 600), contained, and the first product row now begins on the first screen at about 700 px.
8. Footer width: FIXED. Footer image, footer and main content are all 1180 px wide at x=130 on /, /book and /shop.

New navigation: sticky header confirmed (stays at top 0 after scrolling 2000 px), breadcrumbs on /book, /shop and staff pages, step tabs "1. Treatment" to "6. Checkout" with Back/Next, shop Back and Continue shopping, footer sitemap with Visit / Book / Shop / Legal columns.

Browser back and forward through booking: treatment to product to artist to time via Next; browser Back returns to artist (Jordan Hale still selected), product, then treatment (Ladies Cut still selected); Forward returns to product and artist; the in-page Back button returns to product; the 24 time slots are still there after a back and forward, a chosen slot stays selected after going back from extras; clicking tab "1. Treatment" goes to treatment; the Home breadcrumb goes to `/`.

Still off (cosmetic, no FAIL):
- On mobile the open menu is a 320 px right-hand drawer that covers the logo, with the Close button floating to the right of the centred links.
- In the staff area both "Diary" and "Finance" are highlighted in the side menu on `/team/finance`.
- Full-page screenshots show the sticky header floating mid-page where it was scrolled (a capture effect, not a layout bug).
- The staff finance panel is only reachable after the device PIN and owner login, as designed.
