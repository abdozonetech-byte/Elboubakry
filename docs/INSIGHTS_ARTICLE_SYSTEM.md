# Insights Article System

This site now uses a simple static Insights system:

- `light/insights.html` is the Insights hub.
- `light/assets/data/insights-articles.js` is the article data source.
- `light/insights/*.html` are dedicated SEO article pages.
- `scripts/generate-insights-pages.js` regenerates article pages and `sitemap.xml`.

## Add A New Article

1. Add a new object to `window.ELBOUBAKRY_INSIGHTS_ARTICLES` in `light/assets/data/insights-articles.js`.
2. Include at least:
   - `id`
   - `slug`
   - `title`
   - `category`
   - `excerpt`
   - `readingTime`
   - `keywords`
   - `publishDate`
   - `updatedDate`
   - `author`
   - `relatedTopics`
   - `fullContent`
3. Run:

```bash
node scripts/generate-insights-pages.js
```

4. Review the generated article page manually before publishing.

## Choose A Slug

Use a short, readable, lowercase French slug without accents:

```text
meta-ads-leads-qualifies-maroc
seo-local-maroc
strategie-digitale-pme-maroc
```

Good slug rules:

- Use the primary search intent.
- Keep it human-readable.
- Avoid dates unless the article is time-specific.
- Do not reuse an existing slug.

## Meta Title

Keep the title useful and specific. A good pattern:

```text
Primary topic + business context | Insights marketing Maroc
```

Example:

```text
SEO local au Maroc : comment aider les clients à vous trouver | Insights marketing Maroc
```

## Meta Description

Write one clear sentence that explains the value of the article. Keep it people-first:

- What the reader will understand.
- Who it helps.
- Why it matters.

Avoid keyword lists. Use the main keyword naturally once if it fits.

## Related Articles

Use `relatedArticles` when you want precise control:

```js
relatedArticles: [
  "generation-leads-pme-maroc",
  "landing-page-conversion-maroc",
  "tracking-kpi-marketing"
]
```

If `relatedArticles` is missing, the generator uses category/topic proximity and fallback articles.

## Sitemap

The generator updates `sitemap.xml` with:

- Home page.
- Insights hub.
- All generated article pages.
- `lastmod` from `updatedDate`.

After adding or updating articles, run the generator and review the sitemap diff.

## People-First Content Rules

Every article should help a real entrepreneur, PME, or brand in Morocco make a better decision.

Use:

- Clear examples.
- Practical steps.
- Short paragraphs.
- Specific marketing context.
- Honest limits and no unsupported claims.

Avoid:

- Keyword stuffing.
- Repeating the same phrase unnaturally.
- Fake statistics.
- Generic “SEO article” filler.
- Publishing AI-generated text without review.

## Future Upgrade

A future upgrade can add weekly article automation with manual review before publishing. Automation should draft, validate metadata, generate pages, update the sitemap, and then wait for human approval.
