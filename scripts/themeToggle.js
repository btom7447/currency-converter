const themeToggleBtn = document.querySelector('.theme-toggle-btn');
const moonIcon = themeToggleBtn.querySelector('.fa-moon');
const sunIcon = themeToggleBtn.querySelector('.fa-sun');

function setDarkMode() {
    document.body.classList.add('dark');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'inline';
}

function setLightMode() {
    document.body.classList.remove('dark');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'inline';
}

function toggleTheme() {
    if (document.body.classList.contains('dark')) {
        setLightMode();
        localStorage.setItem('theme', 'light');
    } else {
        setDarkMode();
        localStorage.setItem('theme', 'dark');
    }
}

themeToggleBtn.addEventListener('click', toggleTheme);

// On page load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        setDarkMode();
    } else {
        setLightMode();
    }
});
