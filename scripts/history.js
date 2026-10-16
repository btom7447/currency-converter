const HISTORY_KEY = 'conversionHistory';
const MAX_ENTRIES = 10;
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

// Read history from localstorage; corrupt or legacy (non-object) data is ignored
export function getHistory(storage = globalThis.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(HISTORY_KEY));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(e => e && typeof e === 'object' && e.amount && e.from && e.to);
  } catch {
    return [];
  }
}

// Save new conversions to localstorage (newest first, repeats of the latest entry are skipped)
export function saveToHistory(entry, storage = globalThis.localStorage) {
  const history = getHistory(storage);
  const last = history[0];
  if (last && last.amount === entry.amount && last.from === entry.from && last.to === entry.to) return;
  history.unshift({ amount: entry.amount, from: entry.from, to: entry.to });
  try {
    storage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_ENTRIES)));
  } catch (err) {
    console.error('Could not save history', err);
  }
}

// Remove all saved conversions
export function clearHistory(storage = globalThis.localStorage) {
  storage.removeItem(HISTORY_KEY);
}

// Build the list markup for a history array (values are escaped)
export function renderHistoryHtml(history) {
  if (!history.length) return '<li class="empty">No recent conversions</li>';
  const items = history.map(({ amount, from, to }) =>
    `<li>${escapeHtml(amount)} ${escapeHtml(from)} <i class="fa-solid fa-chevron-right"></i> ${escapeHtml(to)}</li>`
  ).join('');
  return `${items}<li class="clear-history"><button type="button" class="clear-history-btn">Clear history</button></li>`;
}

// Load history from localstorage and display it
export function loadHistory() {
  const list = document.querySelector('.conversion-history');
  if (!list) return;
  list.innerHTML = renderHistoryHtml(getHistory());
  const clearBtn = list.querySelector('.clear-history-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearHistory();
      loadHistory();
    });
  }
}
