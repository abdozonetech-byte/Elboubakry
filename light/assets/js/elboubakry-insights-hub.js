(function () {
  "use strict";

  const articles = window.ELBOUBAKRY_INSIGHTS_ARTICLES || [];
  const grid = document.querySelector("[data-insights-grid]");
  const filters = document.querySelector("[data-insights-filters]");
  const count = document.querySelector("[data-insights-count]");
  let activeFilter = "Tous";

  const filterMap = {
    "Tous": () => true,
    "Acquisition": (article) => ["ACQUISITION", "META ADS", "LANDING PAGE", "STRATEGY"].includes(article.category),
    "Lead Generation": (article) => ["LEAD GENERATION", "WHATSAPP & CRM", "LANDING PAGE"].includes(article.category),
    "SEO & Contenu": (article) => ["SEO & CONTENU", "SEO LOCAL", "CONTENT STRATEGY"].includes(article.category),
    "IA & Marketing": (article) => ["IA & MARKETING", "AI BUSINESS"].includes(article.category),
    "Growth Strategy": (article) => ["GROWTH STRATEGY", "STRATEGY", "CUSTOMER JOURNEY"].includes(article.category),
    "Analytics": (article) => ["TRACKING & DATA", "PERFORMANCE"].includes(article.category),
    "Branding": (article) => ["BUSINESS & BRANDING", "BRAND TRUST", "SHORT VIDEO"].includes(article.category)
  };

  const iconMap = {
    "ACQUISITION": "ri-megaphone-line",
    "LEAD GENERATION": "ri-filter-3-line",
    "SEO & CONTENU": "ri-search-2-line",
    "IA & MARKETING": "ri-brain-2-line",
    "GROWTH STRATEGY": "ri-line-chart-line",
    "BUSINESS & BRANDING": "ri-id-card-line",
    "TRACKING & DATA": "ri-bar-chart-box-line",
    "WHATSAPP & CRM": "ri-whatsapp-line",
    "CONTENT STRATEGY": "ri-calendar-todo-line",
    "LANDING PAGE": "ri-layout-4-line",
    "SEO LOCAL": "ri-map-pin-line",
    "META ADS": "ri-advertisement-line",
    "AI BUSINESS": "ri-sparkling-2-line",
    "STRATEGY": "ri-route-line",
    "BRAND TRUST": "ri-shield-check-line",
    "SHORT VIDEO": "ri-video-line",
    "CUSTOMER JOURNEY": "ri-user-search-line",
    "PERFORMANCE": "ri-speed-up-line"
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderFilters() {
    if (!filters) return;
    filters.innerHTML = Object.keys(filterMap).map((label) => (
      `<button class="ea-insight-filter${label === activeFilter ? " is-active" : ""}" type="button" data-filter="${escapeHtml(label)}" aria-pressed="${label === activeFilter}">
        ${escapeHtml(label)}
      </button>`
    )).join("");
  }

  function articleUrl(article) {
    return `insights/${encodeURIComponent(article.slug || article.id)}.html`;
  }

  function renderArticles() {
    if (!grid) return;
    const matcher = filterMap[activeFilter] || filterMap.Tous;
    const visible = articles.filter(matcher);

    grid.innerHTML = visible.map((article, index) => {
      const icon = iconMap[article.category] || "ri-article-line";
      const keyword = article.keywords && article.keywords[0] ? article.keywords[0] : "Insight pratique";
      return `
        <article class="ea-insight-card wow fadeInUp" data-wow-delay="${Math.min(index % 3, 2) * 0.08 + 0.12}s" data-wow-duration=".8s">
          <a class="ea-insight-card-button" href="${articleUrl(article)}" aria-label="Lire l’article : ${escapeHtml(article.title)}">
            <span class="ea-insight-top">
              <span class="ea-insight-tag"><i class="${icon}" aria-hidden="true"></i>${escapeHtml(article.category)}</span>
              <span class="ea-insight-time">${escapeHtml(article.readingTime)}</span>
            </span>
            <span class="ea-insight-body">
              <h3>${escapeHtml(article.title)}</h3>
              <p>${escapeHtml(article.excerpt)}</p>
              <span class="ea-insight-keyword">${escapeHtml(keyword)}</span>
              <span class="ea-insight-link">Lire l’article <i class="ri-arrow-right-up-line" aria-hidden="true"></i></span>
            </span>
          </a>
        </article>
      `;
    }).join("");

    if (count) {
      count.textContent = `${visible.length} insights affichés`;
    }

    if (!visible.length) {
      grid.innerHTML = '<p class="ea-insights-empty">Aucun insight dans ce filtre pour le moment.</p>';
    }
  }

  function injectStructuredData() {
    if (!articles.length) return;
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://elboubakry.com/light/insights.html#articles",
      "itemListElement": articles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": article.title,
        "url": `https://elboubakry.com/light/insights/${article.slug || article.id}.html`
      }))
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(itemList);
    document.head.appendChild(script);
  }

  if (!grid) return;

  renderFilters();
  renderArticles();
  injectStructuredData();

  filters && filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    renderFilters();
    renderArticles();
  });
})();
