# Upgrade 14 — Rapport QA SEO & AI SEO

## Pages vérifiées

- `light/index-resume-one-page.html`
- `light/about-elboubakry-abdessamad.html`
- `light/insights.html`
- `light/case-studies.html`
- `light/insights/strategie-marketing-digital-maroc.html`
- `light/insights/publicite-digitale-maroc-meta-google-tiktok.html`
- `light/insights/landing-page-generation-leads-maroc.html`
- `light/insights/seo-content-strategy-maroc.html`
- `light/insights/analytics-tracking-marketing-maroc.html`
- `light/insights/automatisation-marketing-maroc.html`
- `light/insights/consultant-marketing-digital-maroc.html`
- `light/insights/consultant-marketing-digital-casablanca.html`
- `light/insights/generation-leads-qualifies-maroc.html`
- `light/insights/meta-ads-leads-qualifies-maroc.html`
- `light/insights/generation-leads-pme-maroc.html`
- `light/insights/seo-contenu-maroc.html`
- `light/insights/ia-strategie-marketing.html`
- `light/insights/growth-strategy-visibilite-croissance.html`
- `light/insights/presence-digitale-credible.html`
- `light/insights/tracking-kpi-marketing.html`
- `light/insights/whatsapp-leads-qualifies.html`
- `light/insights/calendrier-contenu-vente.html`
- `light/insights/landing-page-conversion-maroc.html`
- `light/insights/seo-local-maroc.html`
- `light/insights/erreurs-budget-meta-ads.html`
- `light/insights/ia-business-petite-entreprise.html`
- `light/insights/clarifier-offre-message-tunnel.html`
- `light/insights/confiance-levier-marketing.html`
- `light/insights/video-courte-message.html`
- `light/insights/parcours-client-avant-pub.html`
- `light/insights/bons-kpi-performance.html`
- `light/insights/strategie-digitale-pme-maroc.html`
- `light/insights/seo-maroc-visibilite-entreprise.html`
- `light/case-studies/footy-app-growth-campaign.html`
- `light/case-studies/femmesdemenage-lead-generation.html`
- `light/case-studies/school-registration-campaign.html`

## Corrections effectuées

- Titres : audit complet effectué sur les 36 pages publiques. Chaque page possède un seul titre, unique, en français et cohérent avec son sujet.
- Meta descriptions : audit complet effectué. Chaque page possède une meta description unique, descriptive et sans promesse artificielle.
- H1 : audit complet effectué. Chaque page possède un seul H1 visible et cohérent avec le sujet de la page.
- Canonical : audit complet effectué. Les canonicals sont absolus, alignés avec les URLs GitHub Pages actuelles et identiques aux URLs du sitemap.
- Open Graph et Twitter : ajout des métadonnées sociales manquantes sur deux anciens articles, ajout d’une image sociale professionnelle sur les pages qui n’en avaient pas, puis vérification de l’existence des images.
- Sitemap : `sitemap.xml` vérifié comme liste de pages publiques réelles uniquement. Aucun document, asset, fichier de test ou doublon n’est inclus.
- Robots : `robots.txt` vérifié. Googlebot, Bingbot, OAI-SearchBot et ChatGPT-User sont autorisés, GPTBot reste désautorisé, et le sitemap GitHub Pages est déclaré.
- Schema : JSON-LD vérifié sur toutes les pages. Aucun JSON invalide, aucun avis, note, prix, certification ou résultat garanti factice.
- FAQ : 10 pages avec FAQ vérifiées. Chaque FAQ visible correspond à un seul bloc `FAQPage`, sans contenu caché ni duplication de schema.
- Liens internes : audit complet effectué sur les liens et ancres internes. Aucun lien cassé, aucun lien localhost, aucun domaine factice.
- Contenu : correction de quelques libellés anglais visibles restants sur la homepage, les articles et les études de cas, sans réécrire les pages.
- Mobile : vérification navigateur sur les 36 pages publiques en largeur mobile. Aucun débordement horizontal détecté.
- Dark/light : vérification navigateur ciblée sur la homepage en thème clair et sombre. Le contenu reste lisible.
- Analytics : `analytics.js` vérifié. Le placeholder GA4 est présent, `gtag` n’est pas dupliqué, et les événements de contact ne transmettent pas les valeurs personnelles des champs.
- Search Console et Bing : placeholders présents une seule fois sur la homepage avec commentaires TODO. La checklist interne existe et n’est pas incluse dans le sitemap.

## Points à faire plus tard

- Remplacer les URLs GitHub Pages par le domaine final lors de la migration de domaine.
- Remplacer `G-XXXXXXXXXX` par le vrai Measurement ID GA4.
- Remplacer les placeholders Google Search Console et Bing Webmaster Tools par les vrais codes de vérification.
- Soumettre `https://abdozonetech-byte.github.io/Elboubakry/sitemap.xml` dans Google Search Console et Bing Webmaster Tools.
- Ajouter une notice confidentialité/cookies si nécessaire selon le contexte légal et le déploiement final.

## Résultat QA

- Pages publiques vérifiées : 36.
- Problèmes de métadonnées restants : 0.
- Problèmes JSON-LD restants : 0.
- Problèmes sitemap/canonical restants : 0.
- Liens internes cassés restants : 0.
- Problèmes navigateur détectés sur mobile : 0.
- Erreurs console détectées pendant la vérification navigateur : 0.
