const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const lightDir = path.join(root, "light");
const dataPath = path.join(lightDir, "assets/data/insights-articles.js");
const outputDir = path.join(lightDir, "insights");
const siteUrl = "https://elboubakry.com";

function loadArticles() {
  const source = fs.readFileSync(dataPath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: dataPath });
  return sandbox.window.ELBOUBAKRY_INSIGHTS_ARTICLES;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("fr-MA", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

function articlePath(article) {
  return `insights/${article.slug}.html`;
}

function articleUrl(article) {
  return `${siteUrl}/light/${articlePath(article)}`;
}

function relatedFor(article, articles) {
  const related = (article.relatedArticles || [])
    .map((slug) => articles.find((item) => item.slug === slug))
    .filter(Boolean);
  if (related.length >= 3) return related.slice(0, 3);
  return related.concat(articles.filter((item) => item.slug !== article.slug && !related.includes(item)).slice(0, 3 - related.length));
}

function sectionParagraphs(article, heading) {
  const sections = article.fullContentSections || article.fullContent || [];
  const find = (text) => sections.find((section) => section.heading.toLowerCase().includes(text)) || {};
  const intro = sections[0] || {};
  const important = find("important");
  const method = find("appli");
  const takeaway = find("retenir");
  const keyword = article.keywords && article.keywords[0] ? article.keywords[0] : "marketing digital";
  const secondKeyword = article.keywords && article.keywords[1] ? article.keywords[1] : "stratégie digitale Maroc";

  const map = {
    "Introduction": (intro.paragraphs || []).concat([
      `Pour une PME ou une marque marocaine, ce sujet doit rester concret : comprendre le besoin, clarifier le message, organiser le parcours et mesurer ce qui se passe après le premier contact. C’est cette logique qui transforme un simple contenu en levier de décision.`
    ]),
    "Pourquoi ce sujet est important": (important.paragraphs || []).concat([
      `Le marché marocain impose souvent des cycles de décision rapides, des échanges sur WhatsApp et une forte attente de clarté. Une approche solide de ${keyword} aide à éviter les actions dispersées et à concentrer l’effort sur les signaux qui rapprochent vraiment du client.`,
      `L’enjeu n’est pas de produire plus de bruit. L’enjeu est de créer un système lisible : une promesse, une preuve, une action et une mesure.`
    ]),
    "Les erreurs fréquentes": [
      `La première erreur consiste à démarrer par l’outil au lieu de démarrer par le problème client. Une campagne, un article ou une page peut être bien exécuté techniquement et rester faible si l’offre n’est pas compréhensible.`,
      `La deuxième erreur est de regarder uniquement les indicateurs visibles : clics, vues, impressions ou messages reçus. Ces données sont utiles, mais elles ne disent pas toujours si les prospects sont qualifiés.`,
      `La troisième erreur est l’absence de suivi. Sans statut, relance, source et prochaine action, une opportunité peut disparaître alors que le marketing a fait son travail.`
    ],
    "La méthode recommandée": (method.paragraphs || []).concat([
      `Commencez par écrire l’objectif principal en une phrase. Ensuite, reliez cet objectif à une action mesurable : demande de devis, prise de rendez-vous, clic WhatsApp, formulaire envoyé ou conversation qualifiée.`,
      `Travaillez avec peu de priorités à la fois. Pour ${secondKeyword}, une méthode simple vaut mieux qu’un plan trop large : cible, message, canal, preuve, CTA et suivi.`
    ]),
    "Exemple d’application": [
      `Imaginons une entreprise de services à Casablanca qui veut attirer plus de demandes qualifiées. Au lieu de lancer plusieurs actions en même temps, elle choisit une offre prioritaire, crée une page claire, prépare trois messages publicitaires ou éditoriaux et définit les questions de qualification à poser sur WhatsApp.`,
      `Après une semaine, l’analyse ne se limite pas au volume. L’entreprise regarde la source, la qualité des conversations, les objections fréquentes et les prochaines actions commerciales. Cette lecture permet d’améliorer le message sans repartir de zéro.`
    ],
    "À retenir": (takeaway.paragraphs || []).concat([
      `La bonne stratégie est celle qui aide une personne réelle à comprendre, comparer et agir. Les mots-clés comptent pour être trouvé, mais la clarté compte pour être choisi.`
    ]),
    "Prochaine action": [
      `Choisissez une action à améliorer cette semaine : clarifier une page, structurer un formulaire, revoir un message, ajouter une preuve ou mesurer un événement important. Gardez la démarche simple et observez l’impact sur la qualité des demandes.`,
      `Pour aller plus loin, vous pouvez aussi consulter les autres insights marketing ou discuter de votre stratégie afin de transformer cette idée en plan d’action concret.`
    ]
  };

  return map[heading] || [];
}

function renderArticleSections(article) {
  const headings = [
    "Pourquoi ce sujet est important",
    "Les erreurs fréquentes",
    "La méthode recommandée",
    "Exemple d’application",
    "À retenir",
    "Prochaine action"
  ];
  const intro = sectionParagraphs(article, "Introduction").map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n");
  return `<div class="ea-article-intro">${intro}</div>
${headings.map((heading) => `
<section>
<h2>${escapeHtml(heading)}</h2>
${sectionParagraphs(article, heading).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
</section>`).join("\n")}`;
}

function renderHeader(activeInsightsHref = "../insights.html") {
  return `<header>
<div class="rs-header-area header-transparent" id="header-sticky">
<div class="container">
<div class="rs-header-inner">
<div class="rs-header-left">
<div class="rs-header-logo">
<a class="ea-premium-logo" href="../index-resume-one-page.html#homeonepage" aria-label="Elboubakry home">Elboubakry<span>.</span></a>
</div>
</div>
<div class="rs-header-menu">
<nav class="main-menu" id="mobile-menu">
<ul class="onepage-menu">
<li><a href="../index-resume-one-page.html">Accueil</a></li>
<li><a href="../index-resume-one-page.html#homeservices">Services</a></li>
<li><a href="../index-resume-one-page.html#homeportfolio">Réalisations</a></li>
<li><a href="${activeInsightsHref}">Insights</a></li>
<li><a href="../index-resume-one-page.html#homecontact">Contact</a></li>
</ul>
</nav>
</div>
<div class="rs-header-right">
<div class="rs-header-btn style-one d-none d-sm-block">
<a class="rs-btn has-color has-icon" href="../index-resume-one-page.html#homecontact">Parlons-En<span class="icon-box"><i class="ri-arrow-right-up-line" aria-hidden="true"></i></span></a>
</div>
</div>
</div>
</div>
</div>
</header>`;
}

function renderFooter() {
  return `<footer class="rs-footer-area rs-footer-one primary-bg ea-footer-premium">
<div class="container">
<div class="row align-items-start g-5 ea-footer-top">
<div class="col-xl-4 col-lg-4">
<div class="ea-footer-brand">
<a class="ea-premium-logo" href="../index-resume-one-page.html#homeonepage" aria-label="Elboubakry home">Elboubakry<span>.</span></a>
<p>Consultant en marketing digital, stratégie et growth au Maroc. J’aide les marques et PME à structurer leur acquisition grâce à Meta Ads, SEO, contenu, analytics et systèmes de lead generation.</p>
</div>
</div>
<div class="col-xl-3 col-lg-3 col-md-6">
<div class="ea-footer-block">
<h6>Navigation</h6>
<ul>
<li><a href="../index-resume-one-page.html#homeservices"><i class="ri-arrow-right-line" aria-hidden="true"></i>Services</a></li>
<li><a href="../index-resume-one-page.html#homeportfolio"><i class="ri-arrow-right-line" aria-hidden="true"></i>Réalisations</a></li>
<li><a href="../insights.html"><i class="ri-arrow-right-line" aria-hidden="true"></i>Insights</a></li>
</ul>
</div>
</div>
<div class="col-xl-3 col-lg-3 col-md-6">
<div class="ea-footer-block">
<h6>Expertise</h6>
<ul>
<li><i class="ri-line-chart-line" aria-hidden="true"></i>Growth Strategy</li>
<li><i class="ri-megaphone-line" aria-hidden="true"></i>Meta Ads & Lead Generation</li>
<li><i class="ri-search-2-line" aria-hidden="true"></i>SEO & Content Marketing</li>
<li><i class="ri-folder-chart-line" aria-hidden="true"></i>Analytics & Project Management</li>
</ul>
</div>
</div>
<div class="col-xl-2 col-lg-2">
<div class="ea-footer-block ea-footer-contact">
<h6>Contact</h6>
<a class="ea-footer-cta" href="https://www.linkedin.com/in/elboubakry-abdessamad-a77360192/" target="_blank" rel="noopener noreferrer"><i class="ri-linkedin-fill" aria-hidden="true"></i>LinkedIn</a>
<a class="ea-footer-cta" href="https://wa.me/212687321925" target="_blank" rel="noopener noreferrer"><i class="ri-whatsapp-line" aria-hidden="true"></i>WhatsApp</a>
<a class="ea-footer-cta" href="mailto:abdozonetech@gmail.com"><i class="ri-mail-line" aria-hidden="true"></i>Email</a>
</div>
</div>
</div>
</div>
<div class="rs-footer-copyright-area rs-copyright-one ea-footer-bottom">
<div class="container">
<div class="row align-items-center g-3">
<div class="col-lg-6 text-center text-lg-start"><p>© <span id="year"></span> Elboubakry. Personal portfolio.</p></div>
<div class="col-lg-6 text-center text-lg-end"><p>Marketing Digital • Lead Generation • SEO • Maroc</p></div>
</div>
</div>
</div>
</footer>`;
}

function jsonScript(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function renderPage(article, articles) {
  const related = relatedFor(article, articles);
  const canonical = articleUrl(article);
  const title = article.metaTitle;
  const description = article.metaDescription;
  const tags = article.tags || article.keywords || [];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": description,
      "url": canonical,
      "mainEntityOfPage": canonical,
      "author": { "@type": "Person", "name": article.author },
      "publisher": { "@type": "Person", "name": article.author },
      "datePublished": article.publishDate,
      "dateModified": article.updatedDate,
      "inLanguage": "fr-MA",
      "keywords": article.keywords.join(", "),
      "articleSection": article.category
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Accueil", "item": `${siteUrl}/` },
        { "@type": "ListItem", "position": 2, "name": "Insights", "item": `${siteUrl}/light/insights.html` },
        { "@type": "ListItem", "position": 3, "name": article.title, "item": canonical }
      ]
    }
  ];

  return `<!doctype html>
<html class="no-js" lang="fr">
<head>
<meta charset="utf-8"/>
<meta http-equiv="x-ua-compatible" content="ie=edge"/>
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<meta name="author" content="${escapeHtml(article.author)}"/>
<link rel="canonical" href="${canonical}"/>
<link href="../assets/images/logo-e-blue.png" rel="icon" type="image/png" sizes="76x76"/>
<link href="../assets/images/logo-e-blue.png" rel="shortcut icon" type="image/png"/>
<link href="../assets/images/logo-e-blue.png" rel="apple-touch-icon"/>
<link href="../assets/images/site.webmanifest" rel="manifest"/>
<meta property="og:title" content="${escapeHtml(title)}"/>
<meta property="og:description" content="${escapeHtml(description)}"/>
<meta property="og:type" content="article"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:image" content="${siteUrl}/light/assets/images/banner/abdessamad-hero.png"/>
<meta property="og:locale" content="fr_MA"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${escapeHtml(title)}"/>
<meta name="twitter:description" content="${escapeHtml(description)}"/>
<meta name="twitter:image" content="${siteUrl}/light/assets/images/banner/abdessamad-hero.png"/>
<link href="../assets/css/vendor/bootstrap.min.css" rel="stylesheet"/>
<link href="../assets/css/vendor/animate.min.css" rel="stylesheet"/>
<link href="../assets/css/plugins/swiper.min.css" rel="stylesheet"/>
<link href="../assets/css/plugins/nice-select.css" rel="stylesheet"/>
<link href="../assets/css/vendor/magnific-popup.css" rel="stylesheet"/>
<link href="../assets/css/vendor/spacing.css" rel="stylesheet"/>
<link href="../assets/css/vendor/remixicon.css" rel="stylesheet"/>
<link href="../assets/css/main.css" rel="stylesheet"/>
<link href="../assets/css/abdessamad-polish.css" rel="stylesheet"/>
<link href="../assets/css/elboubakry-hero-official-fix.css" rel="stylesheet"/>
<link href="../assets/css/elboubakry-icons-polish.css" rel="stylesheet"/>
<link href="../assets/css/elboubakry-contact-leads.css" rel="stylesheet"/>
<link href="../assets/css/elboubakry-conversion-cleanup.css" rel="stylesheet"/>
<link href="../assets/css/elboubakry-insights-page.css" rel="stylesheet"/>
<link href="../assets/css/elboubakry-mobile-final-qa.css" rel="stylesheet"/>
${jsonScript(jsonLd)}
</head>
<body class="rs-smoother-yes">
<div id="pre-load"><div class="loader" id="loader"><div class="loader-container"><div class="loader-icon"><img alt="Logo Elboubakry E." src="../assets/images/logo-e-blue.png" width="64" height="64"/></div></div></div></div>
<div id="rs-mouse"><div id="cursor-ball"></div></div>
${renderHeader()}
<main>
<article>
<section class="ea-article-hero secondary-bg">
<div class="container">
<nav class="ea-breadcrumb" aria-label="Fil d’Ariane">
<a href="../index-resume-one-page.html">Accueil</a><span>›</span><a href="../insights.html">Insights</a><span>›</span><span>${escapeHtml(article.title)}</span>
</nav>
<div class="ea-article-meta">
<span>${escapeHtml(article.category)}</span>
<span>${escapeHtml(article.readingTime)}</span>
<span>Publié le ${formatDate(article.publishDate)}</span>
<span>Mis à jour le ${formatDate(article.updatedDate)}</span>
</div>
<h1 class="ea-article-title">${escapeHtml(article.title)}</h1>
<p class="ea-article-excerpt">${escapeHtml(article.excerpt)}</p>
<div class="ea-article-tags" aria-label="Sujets de l’article">
${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
</div>
</div>
</section>
<section class="section-space">
<div class="container">
<div class="ea-article-shell">
<div class="ea-article-content">
${renderArticleSections(article)}
<div class="ea-article-cta">
<h2>Vous voulez appliquer cette stratégie à votre projet ?</h2>
<p>Discutons de votre situation et transformons cette idée en actions concrètes.</p>
<a class="rs-btn has-color has-icon" href="../index-resume-one-page.html#homecontact">Me contacter<span class="icon-box"><i class="ri-arrow-right-up-line" aria-hidden="true"></i></span></a>
</div>
</div>
<aside class="ea-article-sidebar" aria-label="Informations article">
<div class="ea-article-side-card">
<h2>À propos</h2>
<ul>
<li>${escapeHtml(article.author)}</li>
<li>${escapeHtml(article.category)}</li>
<li>${escapeHtml(article.readingTime)}</li>
</ul>
</div>
<div class="ea-article-side-card">
<h2>Explorer</h2>
<p><a href="../insights.html">Voir les autres insights marketing</a></p>
<p><a href="../index-resume-one-page.html#homecontact">Discuter de votre stratégie marketing</a></p>
</div>
</aside>
</div>
<section class="ea-related-section" aria-labelledby="related-title">
<h2 id="related-title">Articles liés</h2>
<div class="ea-related-grid">
${related.map((item) => `<div class="ea-related-card"><span>${escapeHtml(item.category)}</span><h3>${escapeHtml(item.title)}</h3><a href="${item.slug}.html">Lire l’article</a></div>`).join("")}
</div>
</section>
</div>
</section>
</article>
</main>
${renderFooter()}
<script src="../assets/js/vendor/jquery-3.7.1.min.js"></script>
<script src="../assets/js/plugins/waypoints.min.js"></script>
<script src="../assets/js/vendor/bootstrap.bundle.min.js"></script>
<script src="../assets/js/plugins/meanmenu.min.js"></script>
<script src="../assets/js/plugins/swiper.min.js"></script>
<script src="../assets/js/plugins/wow.js"></script>
<script src="../assets/js/vendor/magnific-popup.min.js"></script>
<script src="../assets/js/vendor/isotope.pkgd.min.js"></script>
<script src="../assets/js/vendor/imagesloaded.pkgd.min.js"></script>
<script src="../assets/js/plugins/nice-select.min.js"></script>
<script src="../assets/js/plugins/jarallax.min.js"></script>
<script src="../assets/js/vendor/ajax-form.js"></script>
<script src="../assets/js/plugins/easypie.js"></script>
<script src="../assets/js/plugins/headding-title.js"></script>
<script src="../assets/js/plugins/lenis.min.js"></script>
<script src="../assets/js/plugins/gsap.min.js"></script>
<script src="../assets/js/plugins/rs-anim-int.js"></script>
<script src="../assets/js/plugins/rs-scroll-trigger.min.js"></script>
<script src="../assets/js/plugins/rs-splitText.min.js"></script>
<script src="../assets/js/plugins/jquery.lettering.js"></script>
<script src="../assets/js/plugins/parallax-effect.min.js"></script>
<script src="../assets/js/vendor/purecounter.js"></script>
<script src="../assets/js/main.js"></script>
<script src="../assets/js/elboubakry-preloader-safe.js"></script>
</body>
</html>
`;
}

function writeSitemap(articles) {
  const urls = [
    { loc: `${siteUrl}/`, priority: "1.0" },
    { loc: `${siteUrl}/light/index-resume-one-page.html`, priority: "1.0" },
    { loc: `${siteUrl}/light/insights.html`, priority: "0.8" },
    ...articles.map((article) => ({
      loc: articleUrl(article),
      lastmod: article.updatedDate,
      priority: "0.7"
    }))
  ];
  const body = urls.map((url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ""}
    <priority>${url.priority}</priority>
  </url>`).join("\n");
  fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`);
}

function main() {
  const articles = loadArticles();
  fs.mkdirSync(outputDir, { recursive: true });
  for (const article of articles) {
    fs.writeFileSync(path.join(outputDir, `${article.slug}.html`), renderPage(article, articles));
  }
  writeSitemap(articles);
  console.log(`Generated ${articles.length} article pages in ${path.relative(root, outputDir)}`);
}

main();
