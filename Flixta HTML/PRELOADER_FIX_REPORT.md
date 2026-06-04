# Preloader Fix Report

## Issue
The page stayed stuck on the Flixta loading screen because `assets/js/main.js` called the removed demo helper `rs_settings_append(true)` after the dark/theme settings cleanup. Since that function no longer existed, JavaScript stopped before the preloader hide handler could run.

## Fixes applied
- Patched `light/assets/js/main.js` so theme/demo settings helpers are only called if they exist.
- Added `light/assets/js/elboubakry-preloader-safe.js` as a small safety fallback to hide the preloader after the page is ready.
- Added a top-level `index.html` redirect to avoid directory listing when the server is started from the extracted ZIP root.
- Added the preloader fallback script to:
  - `light/index-resume-one-page.html`
  - `light/insights.html`

## QA
- Checked active HTML pages for missing local assets: no missing CSS/JS/images.
- Checked JavaScript syntax with Node.
- Checked for risky patterns in active project files: no `eval`, no `document.cookie`, no `sendBeacon`, no suspicious external redirect.
- Checked for dangerous executable files: none found.

## How to run
If you start the server from the extracted folder root, open:
`http://localhost:5500/`

If you start the server from inside `Flixta HTML`, open:
`http://localhost:5500/light/index-resume-one-page.html`
