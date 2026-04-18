import { getCaptured, removeCaptured } from '../store/storage.js';
import { renderTypeBadge } from '../ui/components/badges.js';

function renderCollection(captured) {
  if (!captured.length) {
    return `
      <div class="rounded-2xl bg-white p-6 text-center shadow dark:bg-slate-900">
        <p class="text-lg font-semibold">Tu colección está vacía.</p>
        <a href="#/" class="mt-3 inline-block rounded-xl bg-indigo-500 px-4 py-2 font-bold text-white">Capturar Pokémon</a>
      </div>
    `;
  }

  return `
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      ${captured
        .map(
          (p) => `
        <article class="rounded-2xl bg-white p-4 shadow transition hover:-translate-y-1 dark:bg-slate-900">
          <div class="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
            <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" class="mx-auto h-32 w-32 object-contain" />
          </div>
          <p class="mt-3 text-sm font-bold text-indigo-500">#${String(p.id).padStart(3, '0')}</p>
          <h2 class="text-xl font-black capitalize">${p.nombre}</h2>
          <div class="mt-2 flex flex-wrap gap-2">${p.tipos.map(renderTypeBadge).join('')}</div>
          <div class="mt-4 flex gap-2">
            <a href="#/pokemon/${p.id}" class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-center font-bold dark:border-slate-700">Ver detalle</a>
            <button data-remove="${p.id}" class="flex-1 rounded-xl bg-rose-500 px-3 py-2 font-bold text-white">Eliminar</button>
          </div>
        </article>
      `
        )
        .join('')}
    </section>
  `;
}

export async function renderPokedexPage(app) {
  const captured = getCaptured();
  app.innerHTML = `
    <section class="mb-4">
      <h1 class="text-3xl font-black">Mi Pokédex</h1>
      <p class="text-slate-500 dark:text-slate-400">Aquí están tus Pokémon capturados.</p>
    </section>
    <div id="pokedex-content">${renderCollection(captured)}</div>
  `;

  app.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeCaptured(btn.dataset.remove);
      renderPokedexPage(app);
    });
  });
}
