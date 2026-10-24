import { existsSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const html = 'dist/skyenergy-site/browser/netlify-forms.html';
assert.ok(existsSync(html), 'Netlify form static registration file is missing from the build.');
const source = readFileSync(html, 'utf-8');
for (const field of ['skyenergy-analise','form-name','name','email','phone','customerType','energyType','contactPreference','message','consent','bot-field']) {
  assert.ok(source.includes(field), `Missing Netlify form field: ${field}`);
}
console.log('Netlify form static registration: OK');
