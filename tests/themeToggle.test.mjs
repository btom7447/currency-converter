// Run with: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { getSavedTheme, saveTheme, applyTheme, toggleTheme } from '../scripts/themeToggle.js';

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: k => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
  };
}

const throwingStorage = {
  getItem() { throw new Error('denied'); },
  setItem() { throw new Error('denied'); },
};

function fakeDom() {
  const classes = new Set();
  return {
    body: {
      classList: {
        contains: c => classes.has(c),
        toggle: (c, on) => { if (on) classes.add(c); else classes.delete(c); },
      },
    },
    moon: { style: {} },
    sun: { style: {} },
  };
}

test('getSavedTheme defaults to light and reads dark', () => {
  assert.equal(getSavedTheme(fakeStorage()), 'light');
  assert.equal(getSavedTheme(fakeStorage({ theme: 'dark' })), 'dark');
  assert.equal(getSavedTheme(fakeStorage({ theme: 'junk' })), 'light');
});

test('storage errors are tolerated', () => {
  assert.equal(getSavedTheme(throwingStorage), 'light');
  assert.doesNotThrow(() => saveTheme('dark', throwingStorage));
});

test('applyTheme sets class and icons', () => {
  const d = fakeDom();
  applyTheme('dark', d.body, d.moon, d.sun);
  assert.equal(d.body.classList.contains('dark'), true);
  assert.equal(d.moon.style.display, 'none');
  assert.equal(d.sun.style.display, 'inline');
  applyTheme('light', d.body, d.moon, d.sun);
  assert.equal(d.body.classList.contains('dark'), false);
  assert.equal(d.moon.style.display, 'inline');
  assert.equal(d.sun.style.display, 'none');
});

test('toggleTheme flips and persists the choice', () => {
  const d = fakeDom();
  const s = fakeStorage();
  assert.equal(toggleTheme(d.body, d.moon, d.sun, s), 'dark');
  assert.equal(s.getItem('theme'), 'dark');
  assert.equal(toggleTheme(d.body, d.moon, d.sun, s), 'light');
  assert.equal(s.getItem('theme'), 'light');
});

test('saved theme is restored on a new page load', () => {
  const s = fakeStorage();
  const first = fakeDom();
  toggleTheme(first.body, first.moon, first.sun, s);
  const second = fakeDom();
  applyTheme(getSavedTheme(s), second.body, second.moon, second.sun);
  assert.equal(second.body.classList.contains('dark'), true);
});
