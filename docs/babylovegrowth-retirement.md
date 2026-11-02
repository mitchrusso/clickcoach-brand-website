# BabyLoveGrowth retirement

Retired on 2026-11-02 after the ClickCoach subscription was discontinued.

- Removed the daily GitHub Actions sync workflow and manual/push triggers.
- Removed the dedicated API importer; no repository automation consumes
  BABYLOVE_API_KEY anymore.
- Preserved previously published articles, images, resource indexes, sitemap,
  article provenance markers and offline SEO/repair tools.
- No ClickCoach application, database, shared hosting or unrelated jobs changed.

The repository secret BABYLOVE_API_KEY may still exist in GitHub settings.
Its removal and provider-side credential revocation must be verified separately;
removing the workflow does not revoke credentials or cancel an already running job.
