import { fetchCurrencySymbols, fetchConversionRate } from './fixer.js';
import { saveToHistory, loadHistory } from './history.js';

// DOM elements
const fromDropdown = document.querySelector('#from-dropdown');
const toDropdown = document.querySelector('#to-dropdown');
const fromBtn = fromDropdown.querySelector('.dropdown-btn');
const toBtn = toDropdown.querySelector('.dropdown-btn');
const fromList = fromDropdown.querySelector('.dropdown-list');
const toList = toDropdown.querySelector('.dropdown-list');
const fromInput = document.querySelector('#from-amount');
const toInput = document.querySelector('#to-amount');
const swapBtn = document.querySelector('#swap-btn');
const rateDisplay = document.querySelector('#conversion-rate');

let currencyData = {};
let selectedFrom = '';
let selectedTo = '';

//  Format numbers with commas 000,000.00 (add thousands seperator)
function formatNumber(value) {
  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

// Remove commas from number string
function unformatNumber(value) {
  return value.replace(/,/g, '');
}

//  Create dropdown items for currency selection
function createDropdownItems(dropdown, button, list, side) {
  list.innerHTML = '';

  Object.entries(currencyData).forEach(([code, { name, flag }]) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.innerHTML = `${flag} ${code} - ${name}`;
    li.addEventListener('click', () => {
      button.innerHTML = `${flag} ${code} `;
      button.dataset.code = code;
      if (side === 'from') selectedFrom = code;
      if (side === 'to') selectedTo = code;
      list.classList.remove('show');
      calculateConversion();
    });
    list.appendChild(li);
  });
}

//  Conversion calculation
async function calculateConversion() {
  const raw = unformatNumber(fromInput.value);
  const amount = parseFloat(raw);
  if (!selectedFrom || !selectedTo || isNaN(amount)) return;

  const rate = await fetchConversionRate(selectedFrom, selectedTo);
  const result = amount * rate;
  toInput.value = formatNumber(result.toFixed(2));
  const formatted = `${formatNumber(amount)} ${selectedFrom} <i class="fa-solid fa-chevron-right"></i> ${selectedTo}`;
  saveToHistory(formatted);
  loadHistory();
  rateDisplay.textContent = `1 ${selectedFrom} = ${formatNumber(rate.toFixed(2))} ${selectedTo}`;
}

//  Handle dropdown toggles
function setupDropdownToggle(dropdown, list) {
  const btn = dropdown.querySelector('.dropdown-btn');
  btn.addEventListener('click', () => {
    list.classList.toggle('show');
  });
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) list.classList.remove('show');
  });
}

//  Format input while typing
function setupInputFormatting() {
  fromInput.addEventListener('input', () => {
    const raw = fromInput.value.replace(/[^\d.]/g, '');
    const parts = raw.split('.');
    if (parts.length > 2) return;
    fromInput.value = formatNumber(raw);
    calculateConversion();
  });
}

//  Swap currencies
function setupSwapButton() {
  swapBtn.addEventListener('click', () => {
    [selectedFrom, selectedTo] = [selectedTo, selectedFrom];

    const fromData = currencyData[selectedFrom];
    const toData = currencyData[selectedTo];

    fromBtn.innerHTML = `${fromData.flag} ${selectedFrom} `;
    toBtn.innerHTML = `${toData.flag} ${selectedTo} `;

    calculateConversion();
  });
}

//  Init
async function init() {
  currencyData = await fetchCurrencySymbols();

  createDropdownItems(fromDropdown, fromBtn, fromList, 'from');
  createDropdownItems(toDropdown, toBtn, toList, 'to');

  setupDropdownToggle(fromDropdown, fromList);
  setupDropdownToggle(toDropdown, toList);
  setupInputFormatting();
  setupSwapButton();
  loadHistory();

  document.querySelector('.dropdown-toggle').addEventListener('click', () => {
    document.querySelector('.dropdown-wrapper').classList.toggle('open');
  });
}

init();