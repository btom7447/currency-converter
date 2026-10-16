// Currency news from GNews (free tier). The API key is never committed: supply it at runtime via
// window.GNEWS_API_KEY or localStorage 'gnewsApiKey'. Without a key the section shows a notice.
const API_BASE = 'https://gnews.io/api/v4/search?q=forex%20OR%20currency&lang=en&max=5';
const CACHE_KEY = 'currencyNews';
const CACHE_TIME = 60 * 60 * 1000; // 1 hour caching
const LAST_UPDATED_ID = 'news-last-updated';
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

// Only allow http(s) links/images so API data cannot inject javascript: URLs
function safeUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : '';
  } catch {
    return '';
  }
}

export function getApiKey() {
  if (typeof window !== 'undefined' && window.GNEWS_API_KEY) return window.GNEWS_API_KEY;
  try {
    return localStorage.getItem('gnewsApiKey') || '';
  } catch {
    return '';
  }
}

// Read cached news; corrupt data is ignored
export function readCache(storage = globalThis.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(CACHE_KEY));
    if (parsed && Array.isArray(parsed.articles) && typeof parsed.timestamp === 'number') return parsed;
  } catch { /* fall through */ }
  return null;
}

// Build the markup for a list of articles (all API values escaped, unsafe links dropped)
export function renderNewsHtml(articles) {
  return articles
    .filter(a => a && a.title && safeUrl(a.url))
    .map(a => {
      const image = safeUrl(a.image);
      const date = a.publishedAt ? new Date(a.publishedAt) : null;
      const dateText = date && !isNaN(date) ? date.toLocaleDateString() : '';
      return `
      <article class="news-item">
        <a href="${escapeHtml(safeUrl(a.url))}" target="_blank" rel="noopener noreferrer">
          <h3>${escapeHtml(a.title)}</h3>
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(a.title)}" />` : ''}
          <p>${escapeHtml(a.description)}</p>
          <small>${escapeHtml(dateText)}</small>
        </a>
      </article>`;
    })
    .join('');
}

// Fetch articles; throws on network, HTTP or API-reported errors
export async function requestNews(apiKey, fetchFn = globalThis.fetch) {
  const res = await fetchFn(`${API_BASE}&apikey=${encodeURIComponent(apiKey)}`);
  if (!res.ok) throw new Error(`News request failed (${res.status})`);
  const data = await res.json();
  if (!data || !Array.isArray(data.articles)) throw new Error('Unexpected news response');
  return data.articles;
}

function updateLastUpdated(timestamp) {
  const el = document.getElementById(LAST_UPDATED_ID);
  if (el) el.textContent = `Last updated: ${new Date(timestamp).toLocaleString()}`;
}

// Show cached articles (used when fresh data is unavailable)
function showCached(container, cached) {
  container.innerHTML = renderNewsHtml(cached.articles);
  updateLastUpdated(cached.timestamp);
}

// Fetch Currency news (with optional forced refresh); falls back to stale cache on failure
export async function fetchCurrencyNews(forceRefresh = false) {
  const container = document.getElementById('news-container');
  if (!container) return;

  const cached = readCache();
  if (cached && !forceRefresh && Date.now() - cached.timestamp < CACHE_TIME) {
    showCached(container, cached);
    return;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    if (cached) showCached(container, cached);
    else container.innerHTML = '<p>News is unavailable: no GNews API key configured.</p>';
    return;
  }

  if (!cached) container.innerHTML = '<p>Loading latest currency news...</p>';

  try {
    const articles = await requestNews(apiKey);
    const timestamp = Date.now();
    if (articles.length === 0) {
      container.innerHTML = '<p>No recent currency news found.</p>';
      updateLastUpdated(timestamp);
      return;
    }
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ articles, timestamp }));
    } catch (err) {
      console.error('Could not cache news', err);
    }
    container.innerHTML = renderNewsHtml(articles);
    updateLastUpdated(timestamp);
  } catch (err) {
    console.error('Error fetching news:', err);
    if (cached) showCached(container, cached);
    else container.innerHTML = '<p>Error loading news. Please try again later.</p>';
  }
}

// On page load: fetch news & set auto-refresh
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    fetchCurrencyNews();
    setInterval(() => fetchCurrencyNews(true), CACHE_TIME);
  });
}
