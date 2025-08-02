const FIXER_API_KEY = '41ce3f90ef2ff43bb4bf43fdd9639264'; 
const BASE_URL = 'https://data.fixer.io/api';

function getCountryFlagFromCurrency(code) {
  const isoCode = code.slice(0, 2).toLowerCase(); 
  return `https://flagcdn.com/24x18/${isoCode}.png`;
}

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
            symbol: '', // Optional: add from local if needed
            flag: `<img src="${getCountryFlagFromCurrency(code)}" alt="${code} flag" width="24" height="18">`
        };
        }

        return merged;
    } catch (err) {
        console.error('Symbol Fetch Error:', err);
        alert('Unable to load currency symbols.');
    }
}

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

export { fetchCurrencySymbols, fetchConversionRate };
