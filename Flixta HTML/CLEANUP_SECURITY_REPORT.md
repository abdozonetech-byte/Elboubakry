# Upgrade 14 — Final Security, Clean Code & Performance QA

## Active production pages
- `index.html`
- `light/index-resume-one-page.html`
- `light/insights.html`

## Cleanup performed
- Confirmed that only the light-mode production structure remains in this cleaned build.
- Removed unused blog thumbnail assets that were no longer referenced after moving Insights to a standalone SEO page.
- Kept required animation, layout, icon, CSS, JS, font, background, and personal-image assets used by the active pages.
- Kept the secured `assets/mailer.php` because the active contact form still references it.

## Security checks performed
Scanned the active project for:
- `eval()`
- `new Function`
- suspicious external redirects
- `document.cookie`
- `sendBeacon`
- hidden iframes
- suspicious external JS
- unsafe file types such as `.exe`, `.bat`, `.cmd`, `.ps1`, `.dll`, `.jar`, `.scr`, `.vbs`
- missing `rel="noopener noreferrer"` on `target="_blank"` links
- broken local assets referenced by active pages

## Result
No malware-like code or dangerous file type was found in the cleaned active project.

## Remaining external links
The only intentional external links are contact/brand links:
- LinkedIn profile
- WhatsApp contact link
- canonical/SEO domain references

## Contact form note
The contact form posts to `light/assets/mailer.php`. On a PHP-enabled host, configure the environment variable `CONTACT_EMAIL` before enabling live sending. On a static host, the visible WhatsApp, Email, and LinkedIn buttons remain the safest direct conversion paths.
