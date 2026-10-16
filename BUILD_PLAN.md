# Build plan

Derived from the code as it exists on this branch. Status key: done / todo.

## Architecture

Static, browser-only app. No build step, no dependencies. ES modules loaded from `index.html`.

| Area | Files | Status |
| --- | --- | --- |
| Markup and script loading | `index.html` | done |
| Currency data and country mapping | `data/currency.json`, `data/currency-to-country.js` | done (tested) |
| Exchange rates with error handling and fallback | `scripts/fixer.js` | done (tested) |
| Converter form, swap, result | `scripts/converterUI.js`, `scripts/converterLogic.js` | done (tested) |
| History in `localStorage`, escaped display, clear | `scripts/history.js` | done (tested) |
| News from GNews, runtime key, escaping, cache fallback | `scripts/news.js` | done (tested) |
| Theme toggle with storage error tolerance | `scripts/themeToggle.js` | done (tested) |
| Main styles | `style/styles.css` | done |
| Mobile styles | `style/mobile.css` | todo |

Tests live in `tests/*.test.mjs` and run with `node --test tests` (Node built-in runner, no install).

## Remaining work

1. Polish `style/mobile.css` (step 9)
   - Check layout at roughly 320, 375 and 768 px widths: selectors, swap button, result, history list, news cards.
   - Make sure tap targets are comfortable and nothing overflows horizontally.
   - Confirm dark theme still reads correctly in the mobile rules.
   - Manual check only; CSS has no unit tests.
2. End-to-end manual test and key hygiene (step 10)
   - Serve with `python3 -m http.server 8000` and walk through: convert, swap, history save and clear, news with and without a key, theme persistence across reload, offline or failed-API fallback.
   - Secure keys: `git rm --cached .env`, add `.env` to `.gitignore`, add a placeholder `.env.example`. Only Boss can revoke the keys already exposed in git history on the provider dashboards.
   - Fix any bugs found, with a test for each behaviour change.
3. Open decision for Boss: the browser cannot read `.env`, so a Fixer key used from client code stays visible to users. Hiding it needs a small proxy or build step, which is out of scope unless Boss asks for it.

## Constraints

Free tiers and free tools only. No secrets in code or git. Do not delete user data.
