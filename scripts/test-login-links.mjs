import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).trim().split('\n')
  .filter(file => file.endsWith('.html') || file === 'scripts/generate-coaching-software-answers.js');
let checked = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  assert.doesNotMatch(html, /ClickCoach Legacy|app\.clickcoach\.io\/secure-login|<details class="nav__login">/, file);
  if (!html.includes('nav__cta') || !/Log in/i.test(html)) continue;
  assert.match(html, /<a class="btn btn-secondary btn-sm" href="https:\/\/new\.clickcoach\.io\/login">Log in<\/a>/, file);
  checked++;
}
assert.ok(checked > 0);
console.log(`Verified direct ClickCoach login on ${checked} pages/templates.`);
