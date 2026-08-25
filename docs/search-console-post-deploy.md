# Search Console Post-Deployment Checklist

Run this only after the audited changes are committed, pushed, and visible on `https://clickcoach.io`.

## 1. Confirm the live deployment

- Open `https://clickcoach.io/robots.txt`, `https://clickcoach.io/sitemap.xml`, and `https://clickcoach.io/llms.txt`; each must return `200`.
- View source on the homepage and a generated resource article. Confirm the expected title, description, canonical, Open Graph tags, and JSON-LD are present in the initial HTML.
- Confirm a generated article hero uses `https://clickcoach.io/images/resources/...`.
- Run `npm test` locally against the same commit that was deployed.

## 2. Submit discovery files

- In Google Search Console, select the canonical `https://clickcoach.io/` property.
- Open **Sitemaps** and submit `https://clickcoach.io/sitemap.xml`.
- Keep only the current canonical sitemap submission; remove obsolete sitemap paths only when Search Console shows they are no longer needed.

## 3. Request indexing for strategic URLs

Use **URL Inspection**, choose **Test live URL**, and request indexing for:

1. `https://clickcoach.io/`
2. `https://clickcoach.io/coaching-platform/`
3. `https://clickcoach.io/group-coaching-software/`
4. `https://clickcoach.io/resources/`
5. `https://clickcoach.io/resources/coaching-software-answers/`

Do not request every article manually. The sitemap and internal links should handle normal discovery.

## 4. Validate prior indexing findings

- For **Duplicate, Google chose different canonical**, inspect the affected URL and confirm the user-declared canonical matches the live canonical route.
- For **Crawled - currently not indexed**, validate only URLs intended to rank and included in `docs/seo-route-matrix.md`.
- Leave redirects, noindex utility pages, and alternate canonical URLs excluded.
- Start **Validate Fix** only after the live URL test shows the corrected version.

## 5. Monitor

- Review indexing after 7–14 days; Search Console reports lag behind live changes.
- Review search performance after 28 days by page and query, especially coaching practice management, group coaching software, client portal, accountability, progress tracking, and coaching notes topics.
- Recheck Core Web Vitals after enough field data accumulates. Lighthouse lab scores are useful but do not replace real-user field data.
