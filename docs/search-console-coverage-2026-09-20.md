# Search Console Coverage Review - 2026-09-20

Source export: `clickcoach.io-Coverage-2026-09-20.xlsx`

The export contains issue counts only. It does not include the affected URL lists, so this ledger maps the reported issue types to confirmed live/repo evidence.

| Search Console issue | Count | Classification | Code-owned action |
| --- | ---: | --- | --- |
| Not found (404) | 11 | Mixed: five fixed or already fixed; six retired app endpoints | `vercel.json` now redirects Cloudflare email-protection and three old top-level article URLs. `/go` already redirects to pricing. Six obsolete `app.clickcoach.io` AJAX endpoints belong to the legacy app server. |
| Page with redirect | 39 | Expected canonicalization | Canonical hostname, trailing-slash, `/index.html`, legacy offer, and old utility paths are redirect stubs and excluded from the sitemap. |
| Excluded by `noindex` tag | 4 | Already fixed / stale report | All four examples are obsolete `/join` hostname/path variants that now redirect to `/pricing/`. |
| Alternate page with proper canonical tag | 3 | Expected duplicate handling | Alternate URLs are excluded from the sitemap and resolve toward canonical indexable routes. |
| Duplicate without user-selected canonical | 1 | Legacy app configuration | The example is `https://app.clickcoach.io/home.php`, an authenticated application page that should remain outside public search. |
| Duplicate, Google chose different canonical than user | 56 | Already fixed / awaiting recrawl | All examples are old `www.clickcoach.io/resources/.../` URLs. Live `www` requests permanently redirect to the matching non-`www` canonical URL. |
| Crawled - currently not indexed | 11 | Mixed | Three current articles are valid and recently crawled; the other examples are app/static assets, retired app endpoints, or an old noncanonical path. |
| Discovered - currently not indexed | 7 | Google discovery lag or quality evaluation | All local indexable HTML routes are present in `sitemap.xml`; validate after deployment and resubmission. |

Code-owned 404 URLs addressed during this review:

- `https://clickcoach.io/cdn-cgi/l/email-protection`
- `https://clickcoach.io/white-label-client-portal/`
- `https://clickcoach.io/role-of-shared-progress-visibility-teams/`
- `https://clickcoach.io/why-structured-feedback-loops-matter/`

The remaining six reported 404s are obsolete root-level AJAX URLs on `app.clickcoach.io`. The legacy repository already contains Apache `410 Gone` and `X-Robots-Tag` rules, but the live host is Nginx and is not applying `.htaccess`; that server configuration must be corrected separately.

Current canonical and discovery evidence:

- All 116 sitemap URLs return `200`, are indexable, and emit exact self-referencing canonicals.
- `https://www.clickcoach.io/...` permanently redirects to `https://clickcoach.io/...`.
- Seven discovered articles and three current crawled-but-unindexed articles are linked from the resource hub and included in the sitemap.
- Tracking-query homepage URLs correctly canonicalize to `https://clickcoach.io/`.

Post-deploy checks:

1. Confirm each URL above redirects to its intended live destination.
2. Replace the submitted `https://www.clickcoach.io/sitemap.xml` entry with `https://clickcoach.io/sitemap.xml` in Search Console.
3. Start validation for the 404 and canonical issue groups after deployment.
4. Configure the legacy `app.clickcoach.io` Nginx host to serve `/robots.txt` directly, emit `X-Robots-Tag: noindex, nofollow, noarchive`, and return `410` for the six retired AJAX endpoints.
