# SalonOS Drive sync

Drive folder: SalonOS — id `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC`
Link: https://drive.google.com/drive/folders/1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC
Account: tonyadamscakes@gmail.com (My Drive root)

Subfolders:
- `_research` id `1OGhfeT_Ljwx9MsKvgDLMAnUu5HdEnrtm`
- `_spec` id `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9`
- `04-build` id `1lYv0_TiBHevY48XWkpJkdAc4YnPQhSN4` (https://drive.google.com/drive/folders/1lYv0_TiBHevY48XWkpJkdAc4YnPQhSN4)

## Method (tool: user-Google-drive connector, via CallDynamicTool)
- New file: `create_file` with `textContent: "$file:/workspace/salonos/<path>"`, `contentMimeType: text/markdown` + `targetMimeType: application/vnd.google-apps.document` (md -> Google Doc), or `text/csv` + `application/vnd.google-apps.spreadsheet` (csv -> Google Sheet). Title = filename without extension. Set `parentId` from the table.
- Existing file (anything in the map below): `update_file_content` with the file id, same `$file:` text and `contentMimeType` (text/markdown or text/csv). Verified: keeps the same id, name and link, stays a Google Doc. NEVER create a second copy of a mapped file.
- NEVER call trash_file or delete anything in Drive. If a local file is removed, leave the Drive copy alone.
- Not mirrored one by one (bulk raw scrapes: HTML, PDFs, pickles, python scripts, `_research/menus/*`, `_research/legal/*`): their text is bundled into three plain files in `_bundles/` and uploaded to Drive `_research/`. Rebuild the bundles with the commands at the bottom, then update in place.
- Docs are rewritten whole on update, so any edits Tony makes in the Google Doc itself are overwritten. Local files are the source of truth.

## Sync procedure
1. Compare current local sha256 with the hash column in `_drive-sync-hashes.txt` (run `sha256sum` on each mapped file). Update only changed files.
2. List local files not in the map (e.g. `02-product-spec.md`, `02-checkpoint-summary.md`, later stage files). Create them with `create_file`, then add a row below.
3. Refresh hashes after a sync.

## File map (local path relative to /workspace/salonos -> Drive id)
| Local path | Drive id | Drive type | Parent folder id |
|---|---|---|---|
| `00-locked-brief-from-tony.md` | `1IVoPyAMGPdfRWeZIVfzvA_dh0JiDlx5aXCCAnNVoK20` | doc | `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC` |
| `00b-amendments-01-from-tony.md` | `1WvJEUkB1xrjztfLAcPpk7oFGFvBPPCB2Q6m4woDYjcg` | doc | `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC` |
| `00c-tony-instructions-log.md` | `1CyOc2SvANYw7jDig_XAg_AvuYlFXwfUpRthDbrafhTc` | doc | `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC` |
| `01-checkpoint-summary.md` | `11MhYoVangY2d79lU4evoUGpzJwbwaDkrC6r4on2rhc8` | doc | `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC` |
| `01-research-report.md` | `1sMPUOFEdbNXMPviALjv2Hf3ZCZT-ZW3gXWqer8Y8VaU` | doc | `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC` |
| `task-log.md` | `1AVa46RfcEA0c8oA0aEKTlOO8cOa0BeO0RZFq8Msr7hs` | doc | `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC` |
| `_research/stage2-deep-research.md` | `1u9SAVRUg3B1eheCYveRO9h6AQqmVoBHaOltNXhqW4gc` | doc | `1OGhfeT_Ljwx9MsKvgDLMAnUu5HdEnrtm` |
| `_spec/p1.md` | `12FtYeWpB0EWGSSYU6L9OXLRqjr0BOHvTX_Daq4JMs7o` | doc | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |
| `_spec/p2.md` | `1G3k7kDDodY1lYsv3dXbxShZn_G8868xY8SGyhCrrPM0` | doc | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |
| `_spec/p3a.md` | `1Rlw7nlpqDayHeYJa4UCA2_H4yGGUbHlC7bodNhjobLs` | doc | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |
| `_spec/p3b.md` | `1pM6_YByLW0mDf5jTyq2-atCJM5aYtowB0vZrxrEDMHk` | doc | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |
| `_spec/p3c.md` | `1FUG1wxboo8_liG1FOAGVgyWeSBOdDRlyZUOtErjs6ig` | doc | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |
| `_spec/p3d.md` | `1UmozxrsfcSJVJZSlNLZKLFnvq_6jV4zm_OAxaeHveUw` | doc | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |
| `_research/treatment-catalogue-seed.csv` | `1zFj58t0p0tIVl7uvpGogmUmRJobtCJ3sz3-KspyL8BA` | sheet | `1OGhfeT_Ljwx9MsKvgDLMAnUu5HdEnrtm` |
| `_research/treatment-price-evidence.csv` | `11nQX-fTQVEyEK8JB1My-brJYFNtWLTL6XwQhkBWw3KU` | sheet | `1OGhfeT_Ljwx9MsKvgDLMAnUu5HdEnrtm` |
| `_research/menu-extract-auto.csv` | `1QTTY0XSFupVOy1NoIJn49AI8h0fERYL1d2bz4WYUcbs` | sheet | `1OGhfeT_Ljwx9MsKvgDLMAnUu5HdEnrtm` |
| `_research/menu-extract-custom.csv` | `1Mfc7Ndx_9mM8eiVD3OTcjSkN8oR9yS8etZELHySBdek` | sheet | `1OGhfeT_Ljwx9MsKvgDLMAnUu5HdEnrtm` |
| `_research/raw-candidates.csv` | `18vVAPXZ-DsuwfXpe1StJUlesfmWHRvxtX4l7lVfbqA0` | sheet | `1OGhfeT_Ljwx9MsKvgDLMAnUu5HdEnrtm` |
| `02-product-spec.md` | `12zZXSVbfqE0i7C0kaUeaFF79MS8cNDuDPYY6FGslvT4` | doc | `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC` |
| `02-checkpoint-summary.md` | `1rgXkzzRVnmd6TVfjSnmiHO4wo-uNlZLbNW6zy-OxVac` | doc | `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC` |
| `_spec/p4a.md` | `1vJRzx2xrZz2AypW_sxA5CDjzXWJnC7rGDvHs3WxIW2g` | doc | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |
| `_spec/p4b.md` | `1UXPSkBr3GVXVv8FqGerx8qDSbdpIq7W-X3MNqMOlZlw` | doc | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |
| `_spec/p4c.md` | `1K9HvgkdKNjajrvjUyDffjeyFPpXOk4jxqrU6CEHm6Sk` | doc | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |
| `04-build/PREFLIGHT.md` | `1HuxbYAYheYLUDpxJQMu0gFB0x2xSpE7INF7Je-FFKo4` | doc | `1lYv0_TiBHevY48XWkpJkdAc4YnPQhSN4` |
| `04-build/src/docs/requirements-coverage.md` | `1hPqAttapIogkrAT5fESJQM9ZP040TQUeFYVEt7Wshw8` | doc | `1lYv0_TiBHevY48XWkpJkdAc4YnPQhSN4` |
| `04-build/SalonOS-build-files-v2.txt` | `1c-5rFccUeiFz1jdPSVwEJHv8aKsq-WCB` | plain (text/plain) | `1lYv0_TiBHevY48XWkpJkdAc4YnPQhSN4` |
| `04-build/SalonOS-build-files-v3.txt` | `1RrKNIcEHEYs_3-fn1MsxPx-jFYwPuHxs` | plain (text/plain) | `1lYv0_TiBHevY48XWkpJkdAc4YnPQhSN4` |
| `04-build/SalonOS-build-files-v4.txt` | `1Aii4ElZM_ZVX0Bm6PQTr1fzX9z6gNzcG` | plain (text/plain) | `1lYv0_TiBHevY48XWkpJkdAc4YnPQhSN4` |
| `04-build/SalonOS-build-files-v5.txt` | `1JJcnlxVVN3icy6L4mTBtCVIG0M4-5AR7` | plain (text/plain) | `1lYv0_TiBHevY48XWkpJkdAc4YnPQhSN4` |
| `_bundles/raw-menu-extracts.txt` | `1RL10U12ua3mS_rKt1-xl0_OisVSJVL77` | plain (Drive: _research/) | `1OGhfeT_Ljwx9MsKvgDLMAnUu5HdEnrtm` |
| `_bundles/legal-source-extracts.txt` | `1yHrh6sWtYNgNvlrWz7iYYTlxoeWmanYt` | plain (Drive: _research/) | `1OGhfeT_Ljwx9MsKvgDLMAnUu5HdEnrtm` |
| `_bundles/competitor-source-extracts.txt` | `1no1BOEjVxFAyWC_94lcVjQ2kOpJxeuwQ` | plain (Drive: _research/) | `1OGhfeT_Ljwx9MsKvgDLMAnUu5HdEnrtm` |

Synced at 22:07 GMT on 31 Oct 2026 (Stage 2 delivery): `02-product-spec.md`, `02-checkpoint-summary.md`, `_spec/p4a-c.md` created; `task-log.md`, `_spec/p1..p3d.md`, `_research/stage2-deep-research.md` updated in place. `/workspace/master-task-log.md` is not mirrored. Nothing deleted. 02-product-spec.md is the concatenation of `_spec/p1, p2, p3a, p3b, p3c, p3d, p4a, p4b, p4c` in that order.

## Rebuild bundles
```
cd /workspace/salonos/_research
for f in menus/*.txt; do [ $(wc -c <$f) -gt 10 ] && { echo "=== FILE: $f ==="; cat $f; echo; }; done > ../_bundles/raw-menu-extracts.txt
for f in legal/*.txt; do echo "=== FILE: $f ==="; cat $f; echo; done > ../_bundles/legal-source-extracts.txt
for f in treatwell.txt saloniris.txt booksy.txt fresha-pricing.txt phorest.txt shortcutsaire.txt urls.tsv; do echo "=== FILE: $f ==="; cat $f; echo; done > ../_bundles/competitor-source-extracts.txt
```

## PDF subfolder (added 31 Oct 2026, 22:40 UTC+0)
Drive folder `PDF` id `1pw3gbfS0abC7OM0znbLrWKau-1rkVURA` (https://drive.google.com/drive/folders/1pw3gbfS0abC7OM0znbLrWKau-1rkVURA). Built by `/workspace/salonos/_make_pdfs.py` (venv `/workspace/.pdfvenv`, weasyprint + markdown) into `/workspace/salonos/pdf/`. Uploaded with `create_file` using base64 text files in `_b64/` (`disableConversionToGoogleType: true`, so they stay PDFs). To refresh: rerun the script, rebuild `_b64/*.b64` (`base64 -w0`), and `update_file_content` is for text only, so for PDFs create a new version via create_file only if the id cannot be reused (never delete the old one).
Link sharing: the connector's share_file does not offer anyone-with-the-link, so folder and files are still private (owner only).
| Local path | Drive id | Pages |
|---|---|---|
| `pdf/SalonOS-complete-pack.pdf` | `12o5UGMmlXsAj0EIQUnAO1HHkx6lQ8FDe` | 128 |
| `pdf/02-product-spec.pdf` | `1whumlhqqu-2yTCT7FrHT_aQw9vwdmiDH` | 60 |
| `pdf/02-checkpoint-summary.pdf` | `15JlWTfeGUfk-Obk-zmhg0IuQr7AyD8BJ` | 2 |
| `pdf/01-checkpoint-summary.pdf` | `15WL5G_uRixcCiBBJmLn_3TsVg3ui3hz3` | 3 |
| `pdf/01-research-report.pdf` | `1lfPz0po82yiecocWzCgwfR3ziTsK_uXr` | 36 |
| `pdf/00-locked-brief-from-tony.pdf` | `11YmEftC-QtaOhhe7fZHFG0HLvpOht-LF` | 5 |
| `pdf/00b-amendments-01-from-tony.pdf` | `1ubxsvZ3-ET32gFh3ikoizbA_LU8G9hTO` | 2 |
| `pdf/00c-tony-instructions-log.pdf` | `1lOK576pQQNtip5g-ol6a0VlqVr8JWgcP` | 3 |
| `pdf/stage2-deep-research.pdf` | `1dIjfUt4Mcls9w5LbLzCw103PyiPJ8Joj` | 14 |


## Stage 3 sync (31 Oct 2026, 23:2x GMT)
New Drive folder `03-legal` id `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` (https://drive.google.com/drive/folders/1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn) under the SalonOS folder. Rows added to `_drive-sync-map.tsv` (also 03-checkpoint-summary, 02-product-spec, 02-checkpoint-summary, p4a-p4c).
| Local path | Drive id | Parent |
|---|---|---|
| `03-legal/00-trace.md` | `1OQ9yV6W7EPEM_vnJfYSEGjd4J2HYvlbX0kPdaTqaEwM` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/01-client-terms-of-booking-and-service.md` | `1S7h9j_VZDiYheO16oLIDTKSY2ijy52j0ZiD4DOH4jDY` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/02-online-shop-terms-of-sale.md` | `1OUJZrDx_fHMJ2Kg5i9axeZc_S4qpPYEc7p7EW7711-w` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/03-gift-voucher-terms.md` | `1HRhnOFcnAanIhUhZq81Nar42jqBGyZWq2nyRd_NW0qw` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/04-loyalty-club-terms.md` | `1fnbHKLq_w3VwOA8W9KkbhhwSdcyfswTrX7jWFuM3aVw` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/05-client-privacy-notice.md` | `10ftTGvIqFOdI5Hn_7QLy-gVW2EWPgyg_fRmOvA3kmms` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/06-staff-privacy-notice.md` | `12tb0HKvozkxioGcJnNvrBlN7fKEbVDNJE4DSDau2HC0` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/07-cookie-policy-and-pecr-approach.md` | `13Lr0TMeg1S5_RkqBU-zY3GedFZnpmQKzHQDYeuU-53Y` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/08-marketing-consent-wording.md` | `1l6JLGPGljB1i4WzYXGqaC95tow6jcsj77L8-nLnsFlQ` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/09-consultation-patch-test-consent-form.md` | `12T_kWWvNvvEd2BCuHKHOUCLXlS76e98kjpAH2BAk-gc` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/10-data-retention-schedule.md` | `1-utkQqyKOPZ1uUUWBNTrEgtWH4wTcGYqeQohuVFTAfA` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/11-dpia.md` | `1ohyrjlcTE716_OlM8XqU52_jv4s_3NftUCqCx-9b-nI` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/12-records-of-processing-ropa.md` | `1I0Iu8vkVVz4vzlFzXHImDQsxep46IO3WwR-TXKgqyyQ` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/13-data-processor-list.md` | `1KyspNM4tcdPzcW7mvVgV5v2ulbMp61-naZYTW-O6i9Y` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/14-rent-a-chair-agreement-template.md` | `1i0lZNDy-9lA3vbaLXveqRzLA4aW-AOLavFix8c9WMVA` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/15-self-employed-contractor-stylist-agreement-template.md` | `1wRLydftBE9oqJjmvgi8a1K2jWvTFiKod-NQXo9PehUw` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/16-staff-tips-policy.md` | `1YTNrQ9IW4WsQ4IdjtrRaXchHBW6m7Xcp5yU_RunFXEA` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/17-marketplace-artist-agreement-stub.md` | `11TEAfuVHSsCR2F4bwjXkEamG3Q_AajLKGwtmE6KU8tg` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/18-salonos-licence-saas-terms-and-dpa.md` | `1C3lmOzmCsD2C8F7SZYul63MxMrTr8wFBi3FPHZcL-q0` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/19-accessibility-statement.md` | `1PDADsZwCBM1kDIdedQeh422thsdqJepsf-C-HMNizRw` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/20-website-legal-notice-and-company-info.md` | `12WNQxDfaOr01kAaHdO6wOPWtD2Oa5blq2nHTpVRN7Jk` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-legal/21-complaints-procedure.md` | `1LsuAAQ10Q_U5vP1gnOk09IiIoC5HMljkCApQLqWsYXE` | `1vZ9zusskHJknLSq9qv7g5Gs0sOz6uGBn` |
| `03-checkpoint-summary.md` | `1XyE5q19btN5LVNOlp7OE_73IhWwEdSs-MIRwT8fdfIs` | `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC` |
| `02-product-spec.md` | `12zZXSVbfqE0i7C0kaUeaFF79MS8cNDuDPYY6FGslvT4` | `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC` |
| `02-checkpoint-summary.md` | `1rgXkzzRVnmd6TVfjSnmiHO4wo-uNlZLbNW6zy-OxVac` | `1u8SZSnU50YkgXQRe9xR7S_Cg_Rb5yXgC` |
| `_spec/p4a.md` | `1vJRzx2xrZz2AypW_sxA5CDjzXWJnC7rGDvHs3WxIW2g` | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |
| `_spec/p4b.md` | `1UXPSkBr3GVXVv8FqGerx8qDSbdpIq7W-X3MNqMOlZlw` | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |
| `_spec/p4c.md` | `1K9HvgkdKNjajrvjUyDffjeyFPpXOk4jxqrU6CEHm6Sk` | `1oh9i5wEpNBlAmw9qmEUg_h2wvHb6G5Y9` |

Updated in place (same id) at Stage 3: 02-product-spec, 02-checkpoint-summary, 00c, task-log, p1, p2, p3a-p3d, p4a-p4c.

### PDFs added at Stage 3 (PDF folder `1pw3gbfS0abC7OM0znbLrWKau-1rkVURA`)
The connector cannot overwrite a binary, so changed PDFs were uploaded as NEW files; the older Stage 2 PDFs (complete pack `12o5UGMmlXsAj0EIQUnAO1HHkx6lQ8FDe`, 02-product-spec, 02-checkpoint-summary, 00c) are untouched and now stale. Nothing deleted. The single complete pack is 865 KB, above the connector's 1,000,000-character base64 limit, so Drive gets it as two volumes. The single-file pack is in `pdf/SalonOS-complete-pack.pdf` locally (210 pages).
| Local path | Drive id |
|---|---|
| `pdf/03-legal-pack.pdf` (71 pp) | `1UFguLfK7KB7TBaZ5P9lFLgcgZ1Cd9PS4` |
| `pdf/03-checkpoint-summary.pdf` (3 pp) | `1qDVevysj_DnMUOTykoIm9EdI2zU7Tsxu` |
| `pdf/02-product-spec.pdf` as 02-product-spec-stage3-revised.pdf | `1EXERgKOPBobpp7QrMzw9WBiU4Uw_gboB` |
| `pdf/02-checkpoint-summary.pdf` as 02-checkpoint-summary-stage3-revised.pdf | `1M-Btig827u6P0uDipM3cgG8ItOkpdMOq` |
| `pdf/00c-tony-instructions-log.pdf` as 00c-...-stage3-revised.pdf | `1vXPr_QtFX3FxFhHXbIPk4GesUX_l61JX` |
| `pdf/SalonOS-complete-pack-vol1.pdf` (68 pp, Parts 1-7) | `1q1aLkqU2pJlEcwCG3xiQ3lDlJ5Jqo97T` |
| `pdf/SalonOS-complete-pack-vol2.pdf` (144 pp, Parts 8-10) | `10_Gu-PAZK01sqhbjas3eBC4EcUx-h5WR` |

## Fine-tunes sync (00:0x GMT, 1 Nov 2026; Tony's 23:58 message)
Updated in place: LEG-01, 03, 09, 18, 20 and 00-trace (03-legal folder); 03-checkpoint-summary, 00c, task-log, 02-product-spec (SalonOS folder); spec parts p1, p3a, p3b, p3d, p4b, p4c (_spec folder).
New Docs in 03-legal: LEG-22 `14ow22SoMWO_Ywk6kKZdVs1RUA9vcghHDmcX2v4AFmjg`; LEG-23 `1MHZZShdWN7I66l7_j5RDz_2yj7kYEX-K89alTsR7em4`.
New PDFs (all passed through `pdftocairo -pdf`; local copies in `pdf/finetuned/`), PDF folder:
| File | Drive id |
|---|---|
| 03-legal-pack-finetuned.pdf (86 pp, 23 documents + trace) | `10BHlX4KjWMDRPIHVZxiyjpQjLOoHd1LI` |
| 03-checkpoint-summary-finetuned.pdf | `1Ic2vdyLQsyccxxY0clXUKq2H05NUk0QW` |
| 02-product-spec-finetuned.pdf | `1M0FZNanBpaLWSwN6XC6sH1mpc8oXPNR7` |
| 00c-tony-instructions-log-finetuned.pdf | `1Dmu2I3ej_5bUlwBBNnaJ5ka35LB6Vy2Z` |
| SalonOS-complete-pack-vol1-finetuned.pdf | `1Kj3vg9uekXLh3CN7iHnZg6uQwZl5pok6` |
| SalonOS-complete-pack-vol2-finetuned.pdf | `13IuAIb1A3_5Y3PAhdhKfbNUzainVhFB9` |
Nothing deleted. Older PDFs (Stage 2 and the Stage 3 first uploads) remain in the folder and are stale. Local backups before the edits: `_spec/_pre-2358/`.

Synced at 00:49 GMT on 1 Nov 2026 (Stage 4): created 04-build folder, PREFLIGHT and requirements-coverage Docs; updated task-log in place. Nothing deleted. The 04-build/src tree is NOT mirrored (code lives in the private GitHub repo).
Synced at 01:35 GMT on 1 Nov 2026 (redesign redeploy): PREFLIGHT and task-log Docs updated in place; SalonOS-build-files-v2.txt created in 04-build (about 924 KB uploaded fine). Nothing deleted.
Synced at 01:5x GMT on 1 Nov 2026 (polish redeploy): PREFLIGHT and task-log Docs updated in place; SalonOS-build-files-v3.txt created. Nothing deleted.
Synced at 02:0x GMT on 1 Nov 2026 (photo-match redeploy): PREFLIGHT and task-log Docs updated in place; SalonOS-build-files-v4.txt created. Nothing deleted.
Synced at 02:2x GMT on 1 Nov 2026 (nav + Stage 5 redeploy): PREFLIGHT and task-log Docs updated in place; SalonOS-build-files-v5.txt created. Nothing deleted.
