// Exchange-rate access layer.
// Primary source: Fixer (only if the user supplies a key at runtime, never committed).
// Fallback source: open.er-api.com (free, no key). Last resort: rates cached in localStorage.
const FIXER_URL = 'https://data.fixer.io/api';
const FALLBACK_URL = 'https://open.er-api.com/v6/latest';
const CACHE_KEY = 'exchangeRatesCache';
const CACHE_TTL_MS = 60 * 60 * 1000;

// Optional Fixer key: window.FIXER_API_KEY or localStorage 'fixerApiKey'. Empty means use the fallback source.
function getApiKey() {
    if (typeof window !== 'undefined' && window.FIXER_API_KEY) return window.FIXER_API_KEY;
    try {
        return localStorage.getItem('fixerApiKey') || '';
    } catch {
        return '';
    }
}

// Get country flag url from currency code (taking just the first 2 letters)
function getCountryFlagFromCurrency(code) {
  const isoCode = code.slice(0, 2).toLowerCase();
  return `https://flagcdn.com/24x18/${isoCode}.png`;
}

// Fetch local currency names from currency.json
async function fetchLocalCurrencyData() {
    try {
        const res = await fetch('./data/currency.json');
        if (!res.ok) throw new Error('Failed to load local currency data');
        return await res.json();
    } catch (err) {
        console.error('Local currency data fetch error:', err);
        return {};
    }
}

// Rebase a rates table (rates relative to some base) onto a new base currency
function rebase(rates, base) {
    if (!rates[base]) throw new Error(`Currency code ${base} not found in rates.`);
    const out = {};
    for (const code in rates) out[code] = rates[code] / rates[base];
    return out;
}

async function getJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    return res.json();
}

// Latest rates table (base EUR with Fixer, USD with fallback; callers rebase)
async function fetchFromNetwork() {
    const key = getApiKey();
    if (key) {
        try {
            const data = await getJson(`${FIXER_URL}/latest?access_key=${encodeURIComponent(key)}`);
            if (!data.success) throw new Error(data.error?.info || 'Fixer request failed.');
            return data.rates;
        } catch (err) {
            console.warn('Fixer unavailable, using fallback source:', err);
        }
    }
    const data = await getJson(`${FALLBACK_URL}/USD`);
    if (data.result !== 'success') throw new Error('Fallback rates request failed.');
    return data.rates;
}

function readCache() {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY));
    } catch {
        return null;
    }
}

// Get the latest rates table: fresh cache -> network -> stale cache -> throw
async function getLatestRates() {
    const cached = readCache();
    if (cached?.rates && Date.now() - cached.time < CACHE_TTL_MS) return cached.rates;
    try {
        const rates = await fetchFromNetwork();
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), rates }));
        } catch { /* storage full or unavailable; ignore */ }
        return rates;
    } catch (err) {
        if (cached?.rates) {
            console.warn('Network unavailable, using stale cached rates:', err);
            return cached.rates;
        }
        throw new Error('Unable to fetch exchange rates. Check your connection and try again.');
    }
}

// Fetch currency list (names + flags) from the rates table, with names from local data
async function fetchCurrencySymbols() {
    const [rates, localData] = await Promise.all([getLatestRates(), fetchLocalCurrencyData()]);
    const merged = {};
    for (const code in rates) {
        merged[code] = {
            name: localData[code] || code,
            flag: `<img src="${getCountryFlagFromCurrency(code)}" alt="${code} flag" width="24" height="18">`
        };
    }
    return merged;
}

// Conversion rate between two currencies. Throws on failure; the UI shows the message.
async function fetchConversionRate(from, to) {
    const rates = await getLatestRates();
    if (!rates[from] || !rates[to]) throw new Error('Currency code not found in rates.');
    return rates[to] / rates[from];
}

// All latest rates relative to a base currency
async function fetchRatesList(base = 'USD') {
    return rebase(await getLatestRates(), base);
}

export { fetchCurrencySymbols, fetchConversionRate, fetchRatesList, getLatestRates, rebase };
