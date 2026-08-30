#!/usr/bin/env node

import assert from "node:assert/strict";
import { formatSeoTitle, SEO_TITLE_MAX_LENGTH } from "./seo-title.mjs";

const shortTitle = formatSeoTitle("Coaching Accountability Systems");
assert.equal(shortTitle, "Coaching Accountability Systems | ClickCoach");

const longTitle = formatSeoTitle(
  "Coaching Assessment Tools: How to Evaluate Client Progress and Results"
);
assert.ok(longTitle.length <= SEO_TITLE_MAX_LENGTH);
assert.ok(longTitle.endsWith(" | ClickCoach"));
assert.ok(!/[,:;.\-\u2013\u2014] \| ClickCoach$/u.test(longTitle));

const htmlTitle = formatSeoTitle("<strong>Coach</strong> Performance Benchmarks");
assert.equal(htmlTitle, "Coach Performance Benchmarks | ClickCoach");

console.log("SEO title formatter checks passed.");
