// Run with: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';

const store = {};
globalThis.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};

const { getLatestRates, fetchConversionRate, rebase } = await import('../scripts/fixer.js');
const ok = (body) => ({ ok: true, status: 200, json: async () => body });
const good = { result: 'success', rates: { USD: 1, EUR: 0.5, NGN: 1500 } };

test.beforeEach(() => { for (const k in store) delete store[k]; });

test('rebase divides by the new base', () => {
  assert.equal(rebase({ USD: 1, EUR: 0.5 }, 'EUR').USD, 2);
  assert.throws(() => rebase({ USD: 1 }, 'XXX'));
});

test('computes cross rate from fallback source', async () => {
  globalThis.fetch = async () => ok(good);
  assert.equal(await fetchConversionRate('EUR', 'NGN'), 3000);
});

test('falls back to stale cache when network fails', async () => {
  store.exchangeRatesCache = JSON.stringify({ time: 0, rates: good.rates });
  globalThis.fetch = async () => { throw new Error('offline'); };
  assert.deepEqual(await getLatestRates(), good.rates);
});

test('throws friendly error with no network and no cache', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 500, json: async () => ({}) });
  await assert.rejects(getLatestRates(), /Unable to fetch exchange rates/);
});

test('unknown currency rejects', async () => {
  globalThis.fetch = async () => ok(good);
  await assert.rejects(fetchConversionRate('USD', 'ZZZ'), /not found/);
});
