const FIXER_API_KEY = '41ce3f90ef2ff43bb4bf43fdd9639264'; 
const BASE_URL = 'https://data.fixer.io/api';

// Get country flag url from currency code (taking just the first 2 letters)
function getCountryFlagFromCurrency(code) {
  const isoCode = code.slice(0, 2).toLowerCase(); 
  return `https://flagcdn.com/24x18/${isoCode}.png`;
}

// Fetch local currency names/symbols from currencyNames json file
async function fetchLocalCurrencyData() {
    try {
        const res = await fetch('/data/currencyNames.json');
        if (!res.ok) throw new Error('Failed to load local currency data');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Local currency data fetch error:', err);
        return {};
    }
}

// Fetch currency symbols from Fixer API and merge with local data & flags
async function fetchCurrencySymbols() {
    try {
        const res = await fetch(`${BASE_URL}/symbols?access_key=${FIXER_API_KEY}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error?.info || 'Failed to load currency list.');

        const fixerSymbols = data.symbols;
        const localData = await fetchLocalCurrencyData();

        const merged = {};
        for (const code in fixerSymbols) {
        merged[code] = {
            name: localData[code] || fixerSymbols[code],
            flag: `<img src="${getCountryFlagFromCurrency(code)}" alt="${code} flag" width="24" height="18">`
        };
        }

        return merged;
    } catch (err) {
        console.error('Symbol Fetch Error:', err);
        alert('Unable to load currency symbols.');
    }
}

// Fetch conversion rate between two currencies using Fixer API latest rates
async function fetchConversionRate(from, to) {
    try {
        const res = await fetch(`${BASE_URL}/latest?access_key=${FIXER_API_KEY}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error?.info || 'Failed to fetch exchange rate.');

        const rates = data.rates;
        if (!rates[from] || !rates[to]) throw new Error('Currency code not found in rates.');

        const rate = rates[to] / rates[from];
        return rate;
    } catch (err) {
        console.error('Rate Fetch Error:', err);
        alert('Unable to fetch exchange rate.');
    }
}

// Fetch all latest rates with optional base currency 
async function fetchRatesList(base = 'USD') {
    try {
        const res = await fetch(`${BASE_URL}/latest?access_key=${FIXER_API_KEY}&base=${base}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error?.info || 'Failed to fetch rates list.');

        return data.rates; // object with currency codes and rates
    } catch (err) {
        console.error('Rates List Fetch Error:', err);
        alert('Unable to load rates list.');
        return {};
    }
}

export { fetchCurrencySymbols, fetchConversionRate, fetchRatesList };
