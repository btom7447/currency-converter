// Run with: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderNewsHtml, requestNews, readCache } from '../scripts/news.js';

test('renderNewsHtml escapes text and drops unsafe links', () => {
  const html = renderNewsHtml([
    { title: '<script>x</script>', url: 'https://a.example/1', description: 'a & b', publishedAt: '2026-01-01T00:00:00Z' },
    { title: 'bad', url: 'javascript:alert(1)' },
    { title: 'img', url: 'https://a.example/2', image: 'javascript:alert(1)' },
  ]);
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('a &amp; b'));
  assert.ok(!html.includes('javascript:'));
  assert.equal((html.match(/<article/g) || []).length, 2);
});

test('renderNewsHtml tolerates a missing or invalid date', () => {
  const html = renderNewsHtml([{ title: 't', url: 'https://a.example', publishedAt: 'nope' }]);
  assert.ok(html.includes('<small></small>'));
});

test('requestNews returns articles and sends the encoded key', async () => {
  let called;
  const fetchFn = async url => { called = url; return { ok: true, json: async () => ({ articles: [{ title: 't' }] }) }; };
  const articles = await requestNews('a b', fetchFn);
  assert.equal(articles.length, 1);
  assert.ok(called.endsWith('apikey=a%20b'));
});

test('requestNews throws on HTTP errors and malformed bodies', async () => {
  await assert.rejects(requestNews('k', async () => ({ ok: false, status: 403 })), /403/);
  await assert.rejects(requestNews('k', async () => ({ ok: true, json: async () => ({ errors: ['x'] }) })), /Unexpected/);
});

test('readCache ignores corrupt data', () => {
  const s = v => ({ getItem: () => v });
  assert.equal(readCache(s('not json')), null);
  assert.equal(readCache(s(null)), null);
  assert.equal(readCache(s('{"articles":1}')), null);
  assert.equal(readCache(s('{"articles":[],"timestamp":5}')).timestamp, 5);
});
