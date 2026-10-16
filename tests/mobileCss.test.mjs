// Run with: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../style/mobile.css', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('mobile.css has balanced braces', () => {
  assert.equal(css.split('{').length, css.split('}').length);
});

test('page declares a responsive viewport and loads mobile.css after styles.css', () => {
  assert.match(html, /name="viewport" content="width=device-width/);
  assert.ok(html.indexOf('styles.css') < html.indexOf('mobile.css'));
});

test('small-screen rules keep news grid and history panel inside the viewport', () => {
  assert.match(css, /max-width:\s*450px/);
  assert.match(css, /news-container\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(css, /conversion-history\s*\{[^}]*left:\s*15px;[^}]*right:\s*15px/);
});
