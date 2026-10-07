# Public website security report remediation

Scope: report 383e4c6e-d4fa-4a64-b1dc-260700c4d82f, clickcoach.io.
These are local changes, not a production deployment or an authenticated app audit.

## Code changes

- Added enforced CSP protection against objects, foreign base URLs, and framing.
- Added a broader script/resource CSP in report-only mode. It reports in the browser console, not a collection endpoint. Do not enforce the full policy until real checkout, chat, offers, and consented analytics are tested and violations reviewed.
- Added COOP same-origin-allow-popups to retain popup compatibility.
- Added CORP same-site, with public images, fonts, and downloads explicitly cross-origin to retain sharing/embedding.
- Gated Meta Pixel, ConvertBox, and Rybbit behind explicit marketing consent. Analytics-only consent cannot enable marketing. Removed unconditional HTML/noscript pixels, including the homepage's separate loader.
- Retained optional Google Analytics consent and added separate analytics-only, all-category, and decline choices. GPC/DNT prevent optional tracking. Revocation reloads to unload trackers; cross-tab changes reload other tabs. No tracking is enabled on preview/app hosts.
- Versioned script URLs to avoid the existing year-long immutable cache serving old consent code.
- Fixed the privacy preferences button's foreground/background contrast.
- Added visible privacy choices, data-request, and accessibility footer links, with an honest accessibility statement and corrected marketing disclosures.
- Updated the resource page generator so regenerated pages do not restore unconditional tracking.

## Infrastructure findings still open

DNS checked October 7: Cloudflare nameservers eugene/liberty; DMARC p=none and sp=none; no DS returned.

1. DMARC: review aggregate reports and all legitimate senders first (including application and marketing mail). Confirm SPF or DKIM aligns with the visible From domain. Then stage quarantine/reject with monitoring and preserve the report mailbox. Changing this without sender validation can reject real customer mail.
2. DNSSEC: enable signing at Cloudflare, obtain its exact DS values, publish those at the registrar, and validate the DNSSEC chain. Do not invent DS values or publish them before the zone is signed.
3. HSTS: existing max-age=63072000 is already protective. No preload or includeSubDomains was added because a full subdomain HTTPS inventory is unavailable. This is optional hardening, not a confirmed defect.

## Verification and limits

- npm test passes, including consent/host isolation/GPC/DNT/deduplication tests and SEO checks for 122 routes.
- Browser smoke script: scripts/test-privacy-browser.mjs; uses local files served through intercepted requests under the production hostname. External requests are intercepted, not transmitted. This checks consent control logic, not third-party integration functionality.
- Actual deployment headers and actual checkout still need post-deployment verification.
- Original scan examined only unauthenticated pages and 16 of 57 planned exposed-file paths. Untested paths and signed-in permissions remain unknown.
- Several report verification examples are invalid: DNSSEC is a DNS check, while privacy controls and accessibility require document/browser checks, not invented HTTP headers.
- Existing unpublished homepage structured-data edits were preserved.
