import { getPokemonList, getPokemonTypes } from '../api/pokeapi.js';
import { renderPokemonCard } from '../ui/components/card.js';
import { renderSkeletonCards } from '../ui/components/skeleton.js';

let cachedPokemon = null;
let cachedTypes = null;
const HOME_POKEMON_LIMIT = 80;

function renderFilters(types) {
  return `
    <section id="home-filters" class="mb-4 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow dark:bg-slate-900 md:grid-cols-2">
      <input id="search-input" type="search" placeholder="Buscar por nombre..." class="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 outline-none ring-indigo-400 focus:ring dark:border-slate-700" />
      <select id="type-filter" class="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 outline-none ring-indigo-400 focus:ring dark:border-slate-700">
        <option value="">Todos los tipos</option>
        ${types.map((type) => `<option value="${type}">${type}</option>`).join('')}
      </select>
    </section>
  `;
}

function renderList(list) {
  if (!list.length) {
    return '<p class="rounded-2xl bg-white p-6 text-center shadow dark:bg-slate-900">No se encontraron Pokémon con ese filtro.</p>';
  }
  return `<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">${list.map(renderPokemonCard).join('')}</section>`;
}

export async function renderHomePage(app) {
  app.innerHTML = `
    <section class="mb-4">
      <h1 class="text-3xl font-black">Explora Pokémon</h1>
      <p class="text-slate-500 dark:text-slate-400">Busca, filtra y descubre tus favoritos.</p>
    </section>
    ${renderFilters(cachedTypes || [])}
    <div id="home-content">${renderSkeletonCards(12)}</div>
  `;

  if (!cachedPokemon) {
    try {
      const [pokemon, types] = await Promise.all([
        getPokemonList(HOME_POKEMON_LIMIT),
        getPokemonTypes()
      ]);
      cachedPokemon = pokemon;
      cachedTypes = types;
    } catch {
      app.querySelector('#home-content').innerHTML =
        '<p class="rounded-2xl bg-white p-6 text-center shadow dark:bg-slate-900">No se pudo cargar la lista de Pokémon. Intenta de nuevo más tarde.</p>';
      return;
    }
  }

  app.querySelector('#home-filters').outerHTML = renderFilters(cachedTypes);

  const content = app.querySelector('#home-content');
  const searchInput = app.querySelector('#search-input');
  const typeFilter = app.querySelector('#type-filter');

  function updateList() {
    const query = searchInput.value.trim().toLowerCase();
    const type = typeFilter.value;
    const filtered = cachedPokemon.filter((p) => {
      const byName = p.nombre.includes(query);
      const byType = type ? p.tipos.includes(type) : true;
      return byName && byType;
    });
    content.innerHTML = renderList(filtered);
  }

  searchInput.addEventListener('input', updateList);
  typeFilter.addEventListener('change', updateList);
  updateList();
}
