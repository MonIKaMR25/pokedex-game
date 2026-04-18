import { startRouter } from './router.js';
import { getTheme, setTheme } from './store/storage.js';

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  if (theme === 'dark') {
    root.classList.add('dark');
    themeToggle.textContent = '☀️';
    return;
  }
  root.classList.remove('dark');
  themeToggle.textContent = '🌙';
}

function initTheme() {
  const stored = getTheme();
  const fallback = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = stored || fallback;
  applyTheme(theme);
  setTheme(theme);
}

themeToggle.addEventListener('click', () => {
  const current = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(current);
  applyTheme(current);
});

initTheme();
startRouter(document.getElementById('app'));
