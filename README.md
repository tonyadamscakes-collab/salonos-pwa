# SalonOS PWA

Sanitized source and handoff documents for the SalonOS progressive web app. This copy keeps the saved archive layout. It does not include `.env` files, installed dependencies, or build outputs.

## Layout

Application source is in `04-build/src/`. Specs and checkpoint notes sit at the repository root. Legal drafts are in `03-legal/`. The handoff note is `_handoff/03-legal-all.md`.

| Path | Contents |
|---|---|
| `04-build/src/` | App source, `package.json`, tests, Pages functions, D1 migration notes, and public media |
| `04-build/PREFLIGHT.md` | Pre-flight notes saved with the build |
| `04-build/REDESIGN-BRIEF.md` | Redesign brief saved with the build |
| `00-locked-brief-from-tony.md` | Locked brief |
| `00b-amendments-01-from-tony.md` | Amendments |
| `00c-tony-instructions-log.md` | Instructions log |
| `01-research-report.md` | Research report |
| `01-checkpoint-summary.md` | Checkpoint 1 |
| `02-product-spec.md` | Product spec |
| `02-checkpoint-summary.md` | Checkpoint 2 |
| `03-checkpoint-summary.md` | Checkpoint 3 |
| `03-legal/` | Legal drafts |
| `_handoff/` | Handoff copy of the legal trace |
| `task-log.md` | Task log |
| `_drive-sync.md` | Drive sync note |

The app’s own notes are in `04-build/src/README.md`.

## Run and build

From `04-build/src/`, the scripts in `package.json` are:

```bash
npm install
npm run dev
npm run build
npm run preview
npm test
npm run test:e2e
npm run typecheck
```

| Script | Command |
|---|---|
| `dev` | `vite` |
| `build` | `tsc --noEmit && vite build` |
| `preview` | `vite preview` |
| `test` | `vitest run` |
| `test:e2e` | `playwright test` |
| `typecheck` | `tsc --noEmit` |

`npm install` restores dependencies from `package.json` and `package-lock.json`. `04-build/src/.gitignore` already ignores `node_modules/`, `dist/`, and `.env*`.
