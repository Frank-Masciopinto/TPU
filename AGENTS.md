# AGENTS.md

## Cursor Cloud specific instructions

### Repository overview

This repo contains multiple products for Trailer Parts Unlimited:

| Project | Path | Tech | Dev scope |
|---------|------|------|-----------|
| BigCommerce Stencil Theme | `old-tpu/` | Handlebars, SCSS, jQuery, React 19, Webpack 5 | `stencil start` (port 3000) |
| Forum API Worker | `old-tpu/workers/forum-api/` | Cloudflare Workers, TypeScript | `wrangler dev` (port 8787) |
| CE Autovoting Extension | `ce-autovoting/` | Chrome Manifest V3, vanilla JS | Load unpacked in Chrome |
| Reviews Generator | `reviews_generator/` | Python 3, httpx, openai | CLI tool |

### ce-autovoting (Chrome Extension)

- **No build step.** Load as unpacked extension: `chrome://extensions` → Developer mode → Load unpacked → select `/workspace/ce-autovoting`.
- After code changes, click the reload (circular arrow) button on the extension card in `chrome://extensions`.
- The extension uses **mail.tm** API for disposable temp emails. Domains rotate; current active domain is fetched dynamically from `GET https://api.mail.tm/domains`.
- **mail.tm gotcha**: mail.tm normalizes email addresses (strips dots from local part). The code uses the address from the create-account response for token requests — do not change this.
- CapSolver API key must be saved in the popup before voting works.
- **MV3 Service Worker lifecycle**: The popup uses `chrome.runtime.sendMessage({ type: 'EXECUTE_VOTE_ONCE' })` to start a vote (reliably wakes the SW). A legacy `storage.onChanged` listener still handles `voteCommand` if something writes it. A keepalive alarm (`sw_keepalive`, period 0.4 min) prevents SW termination during long operations.
- `background.js` is a service worker — its console logs disappear when it goes inactive. To debug, open the service worker DevTools via `chrome://extensions` **before** triggering a vote. Content script logs go to the **page console** of the vote tab.
- Persistent debug log: after a vote attempt, check `chrome.storage.local` key `debugLog` for step-by-step content script logs.
- **Cloud VM testing**: To test interactively, use Playwright to connect to Chrome via CDP (`http://localhost:9222`), navigate to `chrome-extension://{EXT_ID}/popup.html` as a full page tab (not popup), set the API key, then click Vote Once. The popup as a page stays open, unlike the real popup which auto-closes.

### old-tpu (Stencil Theme)

- Install deps: `npm install` (from `old-tpu/`).
- Global tools: `npm install -g @bigcommerce/stencil-cli grunt-cli`.
- Dev server: `stencil start` (from `old-tpu/`). Requires `secrets.stencil.json` with a valid BigCommerce access token.
- Webpack dev build: `npm run buildDev`.
- No `.eslintrc` config exists in the repo (ESLint is a devDependency but not configured).
- TypeScript typecheck for forum-api: `npm run typecheck` (from `old-tpu/workers/forum-api/`). Has a pre-existing duplicate property error.

### reviews_generator

- Python deps: `pip install -r requirements.txt` (from `reviews_generator/`).
- Requires `.env` with `BC_STORE_HASH`, `BC_API_KEY`, `OPENAI_API_KEY`.
- OpenAI **multi-chunk batch** resume: keep `output/.active_batch.json`; run `python generate_reviews.py --batch` (no `--batch-new-run`). **`--batch-parallel`** keeps up to **`OPENAI_BATCH_MAX_INFLIGHT`** concurrent batch jobs (default **3**), polls them, and refills the window as chunks complete (`parallel_chunk_mode` in the checkpoint).
