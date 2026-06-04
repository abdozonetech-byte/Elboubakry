# Elboubakry Portfolio — Deployment Notes

## Active pages
- `index.html` redirects to `light/index-resume-one-page.html`
- Main landing page: `light/index-resume-one-page.html`
- SEO blog/insights page: `light/insights.html`

## Run locally
```bash
python3 -m http.server 5500
```
Then open `http://localhost:5500/`.

## Deployment
Upload the full `Flixta HTML` folder contents to Netlify, Vercel, Hostinger, or any static hosting.

## Contact privacy
The phone number and email are used only inside WhatsApp/mail buttons. They are not displayed as plain visible text on the page.

## Security notes
The `_headers` file adds basic browser security headers for static hosting platforms that support it, without changing the UI/UX or animations.
