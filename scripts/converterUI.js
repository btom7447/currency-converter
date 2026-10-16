import { fetchCurrencySymbols, fetchConversionRate } from './fixer.js';
import { saveToHistory, loadHistory } from './history.js';
import { formatNumber, sanitizeAmount, parseAmount, formatResult } from './converterLogic.js';

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

const DEFAULT_FROM = 'USD';
const DEFAULT_TO = 'EUR';

let currencyData = {};
let selectedFrom = '';
let selectedTo = '';
let requestId = 0; // ignore out-of-order rate responses

//  Show a currency on its dropdown button and remember the choice
function selectCurrency(side, code) {
  const button = side === 'from' ? fromBtn : toBtn;
  button.innerHTML = `${currencyData[code].flag} ${code} `;
  button.dataset.code = code;
  if (side === 'from') selectedFrom = code;
  else selectedTo = code;
}

//  Create dropdown items for currency selection
function createDropdownItems(button, list, side) {
  list.innerHTML = '';

  Object.entries(currencyData).forEach(([code, { name, flag, country }]) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.innerHTML = `${flag} ${code} - ${name}${country ? ` (${country})` : ''}`;
    li.addEventListener('click', () => {
      selectCurrency(side, code);
      list.classList.remove('show');
      button.setAttribute('aria-expanded', 'false');
      calculateConversion(true);
    });
    list.appendChild(li);
  });
}

//  Conversion calculation (record = also save the conversion to history)
async function calculateConversion(record = false) {
  const amount = parseAmount(fromInput.value);
  if (isNaN(amount)) {
    toInput.value = '';
    return;
  }
  if (!selectedFrom || !selectedTo) return;

  const id = ++requestId;
  let rate;
  try {
    rate = await fetchConversionRate(selectedFrom, selectedTo);
  } catch (err) {
    if (id !== requestId) return;
    console.error(err);
    toInput.value = '';
    rateDisplay.textContent = err.message;
    return;
  }
  if (id !== requestId) return;

  toInput.value = formatResult(amount, rate);
  rateDisplay.textContent = `1 ${selectedFrom} = ${formatNumber(rate.toFixed(2))} ${selectedTo}`;
  if (record) {
    const formatted = `${formatNumber(amount)} ${selectedFrom} <i class="fa-solid fa-chevron-right"></i> ${selectedTo}`;
    saveToHistory(formatted);
    loadHistory();
  }
}

//  Handle dropdown toggles
function setupDropdownToggle(dropdown, list) {
  const btn = dropdown.querySelector('.dropdown-btn');
  btn.addEventListener('click', () => {
    const open = list.classList.toggle('show');
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      list.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

//  Format input while typing; the conversion is saved to history once the user finishes editing
function setupInputFormatting() {
  fromInput.addEventListener('input', () => {
    const raw = sanitizeAmount(fromInput.value);
    if (raw === null) return;
    fromInput.value = formatNumber(raw);
    calculateConversion();
  });
  fromInput.addEventListener('change', () => calculateConversion(true));
}

//  Swap currencies
function setupSwapButton() {
  swapBtn.addEventListener('click', () => {
    if (!selectedFrom || !selectedTo) return;
    const [newFrom, newTo] = [selectedTo, selectedFrom];
    selectCurrency('from', newFrom);
    selectCurrency('to', newTo);
    calculateConversion(true);
  });
}

//  Init
async function init() {
  try {
    currencyData = await fetchCurrencySymbols();
  } catch (err) {
    console.error(err);
    rateDisplay.textContent = err.message;
    return;
  }

  createDropdownItems(fromBtn, fromList, 'from');
  createDropdownItems(toBtn, toList, 'to');

  setupDropdownToggle(fromDropdown, fromList);
  setupDropdownToggle(toDropdown, toList);
  setupInputFormatting();
  setupSwapButton();
  loadHistory();

  if (currencyData[DEFAULT_FROM]) selectCurrency('from', DEFAULT_FROM);
  if (currencyData[DEFAULT_TO]) selectCurrency('to', DEFAULT_TO);

  document.querySelector('.dropdown-toggle').addEventListener('click', () => {
    document.querySelector('.dropdown-wrapper').classList.toggle('open');
  });
}

init();
