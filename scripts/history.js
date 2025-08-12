// Save new conversions to localstorage
export function saveToHistory(entry) {
  const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
  history.unshift(entry);
  localStorage.setItem('conversionHistory', JSON.stringify(history.slice(0, 10)));
}

// Load history from localstorage 
export function loadHistory() {
  const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
  const list = document.querySelector('.conversion-history');
  if (!list) return;

  list.innerHTML = history.length
    ? history.map(item => `<li>${item}</li>`).join('')
    : '<li class="empty">No recent conversions</li>';
}
