// Pure helpers for the converter UI (no DOM access, so they can be unit tested).

//  Format numbers with commas 000,000.00 (add thousands seperator)
export function formatNumber(value) {
  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

// Remove commas from number string
export function unformatNumber(value) {
  return value.replace(/,/g, '');
}

// Strip everything but digits and one decimal point; returns null if more than one point was typed
export function sanitizeAmount(value) {
  const raw = value.replace(/[^\d.]/g, '');
  return raw.split('.').length > 2 ? null : raw;
}

// Parse a (possibly comma formatted) amount; returns NaN when it is not a usable number
export function parseAmount(value) {
  const amount = parseFloat(unformatNumber(value));
  return Number.isFinite(amount) && amount >= 0 ? amount : NaN;
}

// Convert an amount at the given rate, rounded to 2 decimals and formatted for display
export function formatResult(amount, rate) {
  return formatNumber((amount * rate).toFixed(2));
}
