# RENTSAFE

RENTSAFE is a static, multilingual information and checklist site for people renting out residential property in Kazakhstan. It includes a persistent checklist, document guidance, practical scenarios, a tax information section and a calculator.

## Run locally

Serve this folder over HTTP so the browser can load JavaScript modules. On Windows, double-click `start.bat`; it uses Python 3 and starts the included server at `http://127.0.0.1:8766/`. The server serves `.mjs` files with the JavaScript MIME type required by browsers. Keep its console window open while using the site.

Alternatively, use a local static server that serves `.mjs` files as JavaScript.

## Legal-source status

`src/js/legal-sources.js` is the source catalog for checklist references. References are locator leads only: their article numbers, current text and applicability to a particular situation have not been independently verified. All checklist references therefore remain `NEEDS_REVIEW`. Do not present them as legal advice or verified interpretations.

The document and scenario guides are practical information, not official forms or individualized legal advice. Check the current official text and the parties' signed agreement for a specific situation. A missing official URL is shown as unavailable rather than replaced with a guessed link.

## Checklist behavior

Checklist marks are stored locally in the browser. Search and status filters only change which items are shown; reset requires confirmation and clears the saved marks.

## Tests

Run the state-model tests with Node.js:

```powershell
node --test tests/checklist-state.test.mjs
```
