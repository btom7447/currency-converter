// Run with: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { getHistory, saveToHistory, clearHistory, renderHistoryHtml } from '../scripts/history.js';

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: k => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: k => { delete data[k]; },
  };
}

const entry = (amount, from = 'USD', to = 'EUR') => ({ amount, from, to });

test('saveToHistory stores newest first and caps at 10', () => {
  const s = fakeStorage();
  for (let i = 1; i <= 12; i++) saveToHistory(entry(String(i)), s);
  const h = getHistory(s);
  assert.equal(h.length, 10);
  assert.equal(h[0].amount, '12');
});

test('saveToHistory skips an immediate duplicate', () => {
  const s = fakeStorage();
  saveToHistory(entry('5'), s);
  saveToHistory(entry('5'), s);
  assert.equal(getHistory(s).length, 1);
});

test('getHistory ignores corrupt and legacy data', () => {
  assert.deepEqual(getHistory(fakeStorage({ conversionHistory: '{bad' })), []);
  assert.deepEqual(getHistory(fakeStorage({ conversionHistory: '["1 USD > EUR"]' })), []);
});

test('clearHistory empties the history', () => {
  const s = fakeStorage();
  saveToHistory(entry('5'), s);
  clearHistory(s);
  assert.deepEqual(getHistory(s), []);
});

test('renderHistoryHtml shows empty state, escapes values and adds a clear button', () => {
  assert.match(renderHistoryHtml([]), /No recent conversions/);
  const html = renderHistoryHtml([entry('1', '<b>', 'EUR')]);
  assert.ok(html.includes('&lt;b&gt;'));
  assert.ok(!html.includes('<b>'));
  assert.match(html, /clear-history-btn/);
});
