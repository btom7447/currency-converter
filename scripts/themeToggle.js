const THEME_KEY = 'theme';

export function getSavedTheme(storage) {
    try {
        return storage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
    } catch {
        return 'light';
    }
}

export function saveTheme(theme, storage) {
    try {
        storage.setItem(THEME_KEY, theme);
    } catch {
        // storage unavailable (private mode / quota): theme still applies for this visit
    }
}

export function applyTheme(theme, body, moonIcon, sunIcon) {
    const dark = theme === 'dark';
    body.classList.toggle('dark', dark);
    moonIcon.style.display = dark ? 'none' : 'inline';
    sunIcon.style.display = dark ? 'inline' : 'none';
}

export function toggleTheme(body, moonIcon, sunIcon, storage) {
    const next = body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next, body, moonIcon, sunIcon);
    saveTheme(next, storage);
    return next;
}

function init() {
    const btn = document.querySelector('.theme-toggle-btn');
    if (!btn) return;
    const moonIcon = btn.querySelector('.fa-moon');
    const sunIcon = btn.querySelector('.fa-sun');
    applyTheme(getSavedTheme(localStorage), document.body, moonIcon, sunIcon);
    btn.addEventListener('click', () => toggleTheme(document.body, moonIcon, sunIcon, localStorage));
}

if (typeof document !== 'undefined') init();
