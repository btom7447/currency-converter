// Run with: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { currencyToCountry, countryNames, getCountryCode, getCountryName, getFlagUrl } from '../data/currency-to-country.js';

test('every mapped currency has a country name', () => {
  for (const [currency, country] of Object.entries(currencyToCountry)) {
    assert.ok(countryNames[country], `${currency} -> ${country} has no name`);
  }
});

test('lookups return country code, name and flag url', () => {
  assert.equal(getCountryCode('NGN'), 'NG');
  assert.equal(getCountryName('EUR'), 'European Union');
  assert.equal(getFlagUrl('GBP'), 'https://flagcdn.com/24x18/gb.png');
});

test('unknown currencies give empty results instead of a guessed flag', () => {
  assert.equal(getCountryName('XXX'), '');
  assert.equal(getFlagUrl('XXX'), '');
});

test('flagHtml is empty for unknown and names the country for known currencies', async () => {
  globalThis.localStorage = { getItem: () => null, setItem() {} };
  const { flagHtml } = await import('../scripts/fixer.js');
  assert.equal(flagHtml('XXX'), '');
  assert.match(flagHtml('JPY'), /alt="Japan flag"/);
});
