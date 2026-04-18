import { getPokemonById } from '../api/pokeapi.js';
import { capturePokemon, isCaptured } from '../store/storage.js';
import { renderTypeBadge } from '../ui/components/badges.js';
import { renderStatBar } from '../ui/components/progress.js';
import { renderSkeletonCards } from '../ui/components/skeleton.js';

function captureButtonState(id) {
  if (isCaptured(id)) {
    return 'disabled class="w-full rounded-xl bg-emerald-500 px-4 py-3 font-bold text-white"';
  }
  return 'class="w-full rounded-xl bg-indigo-500 px-4 py-3 font-bold text-white transition hover:scale-[1.02]"';
}

export async function renderDetailPage(app, [id]) {
  app.innerHTML = renderSkeletonCards(1);

  let pokemon;
  try {
    pokemon = await getPokemonById(id);
  } catch {
    app.innerHTML =
      '<section class="rounded-2xl bg-white p-6 text-center shadow dark:bg-slate-900">No se pudo cargar el detalle del Pokémon.</section>';
    return;
  }
  app.innerHTML = `
    <article class="grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-lg dark:bg-slate-900 lg:grid-cols-2">
      <section class="rounded-2xl bg-slate-100 p-6 dark:bg-slate-800">
        <img src="${pokemon.imagen}" alt="${pokemon.nombre}" class="mx-auto h-72 w-72 object-contain" />
      </section>
      <section>
        <p class="text-sm font-bold text-indigo-500">#${String(pokemon.id).padStart(3, '0')}</p>
        <h1 class="text-4xl font-black capitalize">${pokemon.nombre}</h1>
        <div class="mt-4 flex flex-wrap gap-2">${pokemon.tipos.map(renderTypeBadge).join('')}</div>
        <h2 class="mt-6 text-lg font-extrabold">Habilidades</h2>
        <ul class="mt-2 list-inside list-disc text-slate-600 dark:text-slate-300">
          ${pokemon.habilidades.map((h) => `<li class="capitalize">${h.replace('-', ' ')}</li>`).join('')}
        </ul>
        <button id="capture-btn" ${captureButtonState(pokemon.id)}>${isCaptured(pokemon.id) ? 'Capturado' : 'Capturar'}</button>
      </section>
    </article>

    <section class="mt-4 rounded-2xl bg-white p-5 shadow-lg dark:bg-slate-900">
      <h2 class="mb-4 text-xl font-extrabold">Stats</h2>
      <div class="space-y-3">${pokemon.stats.map((s) => renderStatBar(s.nombre, s.valor)).join('')}</div>
    </section>
  `;

  const captureBtn = app.querySelector('#capture-btn');
  if (!isCaptured(pokemon.id)) {
    captureBtn.addEventListener('click', () => {
      const saved = capturePokemon({
        id: pokemon.id,
        nombre: pokemon.nombre,
        imagen: pokemon.imagen,
        tipos: pokemon.tipos
      });
      if (saved) {
        captureBtn.textContent = 'Capturado';
        captureBtn.disabled = true;
        captureBtn.className = 'w-full rounded-xl bg-emerald-500 px-4 py-3 font-bold text-white';
      }
    });
  }
}
