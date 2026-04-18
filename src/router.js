import { renderHomePage } from './pages/home.js';
import { renderDetailPage } from './pages/detail.js';
import { renderBattlePage } from './pages/battle.js';
import { renderPokedexPage } from './pages/pokedex.js';

const routes = [
  { pattern: /^#\/?$/, handler: renderHomePage },
  { pattern: /^#\/pokemon\/(\d+)$/, handler: renderDetailPage },
  { pattern: /^#\/battle$/, handler: renderBattlePage },
  { pattern: /^#\/pokedex$/, handler: renderPokedexPage }
];

function renderNotFound(app) {
  app.innerHTML = `
    <section class="rounded-2xl bg-white p-6 text-center shadow-lg dark:bg-slate-900">
      <h1 class="text-2xl font-extrabold">Ruta no encontrada</h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400">La ruta solicitada no existe.</p>
      <a href="#/" class="mt-4 inline-block rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white">Volver al inicio</a>
    </section>
  `;
}

async function handleRoute(app) {
  const hash = window.location.hash || '#/';
  for (const route of routes) {
    const match = hash.match(route.pattern);
    if (match) {
      await route.handler(app, match.slice(1));
      return;
    }
  }
  renderNotFound(app);
}

export function startRouter(app) {
  window.addEventListener('hashchange', () => handleRoute(app));
  handleRoute(app);
}
