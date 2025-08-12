const API_KEY = "f0a71d0179895ff66069780d96f686b4";
const API_URL = `https://gnews.io/api/v4/search?q=forex%20OR%20currency&lang=en&max=5&apikey=${API_KEY}`;

const CACHE_KEY = "currencyNews";
const CACHE_TIME = 60 * 60 * 1000; // 1 hour
const LAST_UPDATED_ID = "news-last-updated";

async function fetchCurrencyNews(forceRefresh = false) {
    const container = document.getElementById("news-container");
    const lastUpdatedEl = document.getElementById(LAST_UPDATED_ID);

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached && !forceRefresh) {
        const { articles, timestamp } = JSON.parse(cached);
        const now = Date.now();
        if (now - timestamp < CACHE_TIME) {
            renderNews(articles);
            updateLastUpdated(timestamp);
            console.log("Showing cached currency news");
            return;
        }
    }

    if (!cached) {
        container.innerHTML = `<p>Loading latest currency news...</p>`;
    }

    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (!data.articles || data.articles.length === 0) {
            container.innerHTML = `<p>No recent currency news found.</p>`;
            updateLastUpdated(Date.now());
            return;
        }

        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
                articles: data.articles,
                timestamp: Date.now(),
            })
        );

        renderNews(data.articles);
        updateLastUpdated(Date.now());
        console.log("Fetched fresh currency news");
    } catch (err) {
        console.error("Error fetching news:", err);
        if (!cached) {
            container.innerHTML = `<p>Error loading news. Please try again later.</p>`;
            updateLastUpdated(Date.now());
        }
    }
}

function renderNews(articles) {
    const container = document.getElementById("news-container");
    container.innerHTML = articles
        .map(
            (article) => `
        <article class="news-item">
            <a href="${article.url}" target="_blank" rel="noopener">
                <h3>${article.title}</h3>
                ${article.image ? `<img src="${article.image}" alt="${article.title}" />` : ""}
                <p>${article.description || ""}</p>
                <small>${new Date(article.publishedAt).toLocaleDateString()}</small>
            </a>
        </article>
    `
        )
        .join("");
}

function updateLastUpdated(timestamp) {
    const lastUpdatedEl = document.getElementById(LAST_UPDATED_ID);
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = `Last updated: ${new Date(timestamp).toLocaleString()}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchCurrencyNews();
    setInterval(() => {
        fetchCurrencyNews(true);
    }, CACHE_TIME);
});
