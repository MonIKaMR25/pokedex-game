import { renderTypeBadge } from './badges.js';

export function renderPokemonCard(pokemon) {
  return `
    <a href="#/pokemon/${pokemon.id}" class="group block overflow-hidden rounded-2xl bg-white p-4 shadow transition duration-300 hover:-translate-y-1 hover:shadow-glow dark:bg-slate-900">
      <div class="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
        <img src="${pokemon.imagen}" alt="${pokemon.nombre}" loading="lazy" class="mx-auto h-36 w-36 object-contain transition duration-300 group-hover:scale-110" />
      </div>
      <div class="mt-4">
        <p class="text-sm font-bold text-indigo-500">#${String(pokemon.id).padStart(3, '0')}</p>
        <h3 class="text-lg font-extrabold capitalize">${pokemon.nombre}</h3>
        <div class="mt-2 flex flex-wrap gap-2">${pokemon.tipos.map(renderTypeBadge).join('')}</div>
      </div>
    </a>
  `;
}
