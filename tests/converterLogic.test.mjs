// Run with: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { formatNumber, unformatNumber, sanitizeAmount, parseAmount, formatResult } from '../scripts/converterLogic.js';

test('formatNumber adds thousands separators and keeps decimals', () => {
  assert.equal(formatNumber('1234567.891'), '1,234,567.891');
  assert.equal(formatNumber('1234.'), '1,234.');
  assert.equal(formatNumber(12), '12');
});

test('unformatNumber strips commas', () => {
  assert.equal(unformatNumber('1,234,567.80'), '1234567.80');
});

test('sanitizeAmount drops junk and rejects a second decimal point', () => {
  assert.equal(sanitizeAmount('1,2a3'), '123');
  assert.equal(sanitizeAmount('1.5'), '1.5');
  assert.equal(sanitizeAmount('1.5.2'), null);
});

test('parseAmount returns NaN for empty or invalid input', () => {
  assert.equal(parseAmount('1,000.50'), 1000.5);
  assert.ok(isNaN(parseAmount('')));
  assert.ok(isNaN(parseAmount('.')));
});

test('formatResult multiplies, rounds to 2 decimals and formats', () => {
  assert.equal(formatResult(1000, 1.5), '1,500.00');
  assert.equal(formatResult(2, 0.3333), '0.67');
});
