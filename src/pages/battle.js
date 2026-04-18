import { getPokemonById, getPokemonListLite } from '../api/pokeapi.js';
import { getConfig, setConfig } from '../store/storage.js';
import { renderTypeBadge } from '../ui/components/badges.js';

let cachedChoices = null;

function basePower(pokemon) {
  return pokemon.stats.reduce((sum, stat) => sum + stat.valor, 0);
}

function card(pokemon, hp = 100, side = 'left') {
  return `
    <article class="rounded-2xl bg-white p-4 shadow-lg dark:bg-slate-900 ${side === 'left' ? 'battle-left' : 'battle-right'}">
      <img src="${pokemon.imagen}" alt="${pokemon.nombre}" class="mx-auto h-36 w-36 object-contain" />
      <h3 class="mt-2 text-center text-xl font-black capitalize">${pokemon.nombre}</h3>
      <p class="text-center text-sm font-bold text-indigo-500">#${String(pokemon.id).padStart(3, '0')}</p>
      <div class="mt-2 flex flex-wrap justify-center gap-2">${pokemon.tipos.map(renderTypeBadge).join('')}</div>
      <div class="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><div style="width:${hp}%" class="battle-hp h-3 bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-700"></div></div>
    </article>
  `;
}

export async function renderBattlePage(app) {
  app.innerHTML = `
    <section class="rounded-2xl bg-white p-4 shadow dark:bg-slate-900">
      <h1 class="text-3xl font-black">Modo batalla</h1>
      <p class="text-slate-500 dark:text-slate-400">Elige tu Pokémon y enfrenta a un rival aleatorio.</p>
      <div class="mt-4 grid gap-3 md:grid-cols-[1fr,1fr,auto,auto]">
        <input id="battle-search" type="search" placeholder="Buscar Pokémon..." class="rounded-xl border border-slate-200 bg-transparent px-3 py-2 outline-none ring-indigo-400 focus:ring dark:border-slate-700" />
        <select id="battle-select" class="rounded-xl border border-slate-200 bg-transparent px-3 py-2 outline-none ring-indigo-400 focus:ring dark:border-slate-700"></select>
        <button id="battle-btn" class="rounded-xl bg-rose-500 px-4 py-2 font-bold text-white transition hover:scale-105">¡Batallar!</button>
        <button id="mute-btn" class="rounded-xl border border-slate-200 px-4 py-2 font-bold transition hover:scale-105 dark:border-slate-700"></button>
      </div>
    </section>
    <section id="battle-arena" class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2"></section>
    <p id="battle-result" class="mt-4 text-center text-2xl font-black"></p>
  `;

  if (!cachedChoices) {
    try {
      cachedChoices = await getPokemonListLite(151);
    } catch {
      app.querySelector('#battle-arena').innerHTML =
        '<p class="rounded-2xl bg-white p-6 text-center shadow dark:bg-slate-900 lg:col-span-2">No se pudieron cargar los Pokémon para batalla.</p>';
      return;
    }
  }

  const search = app.querySelector('#battle-search');
  const select = app.querySelector('#battle-select');
  const battleBtn = app.querySelector('#battle-btn');
  const muteBtn = app.querySelector('#mute-btn');
  const arena = app.querySelector('#battle-arena');
  const result = app.querySelector('#battle-result');

  const hitSfx = new Audio('/assets/sfx/hit.wav');
  const winSfx = new Audio('/assets/sfx/win.wav');

  function syncMuteUI() {
    const muted = !!getConfig().muted;
    hitSfx.muted = muted;
    winSfx.muted = muted;
    muteBtn.textContent = muted ? '🔇 Silenciado' : '🔊 Sonido';
  }

  function fillOptions() {
    const query = search.value.trim().toLowerCase();
    const filtered = cachedChoices.filter((c) => c.name.includes(query)).slice(0, 40);
    select.innerHTML = filtered
      .map((c) => `<option value="${c.name}">${c.name}</option>`)
      .join('');
  }

  search.addEventListener('input', fillOptions);
  muteBtn.addEventListener('click', () => {
    const muted = !getConfig().muted;
    setConfig({ muted });
    syncMuteUI();
  });

  battleBtn.addEventListener('click', async () => {
    const selectedName = select.value;
    if (!selectedName) {
      return;
    }

    result.textContent = 'Cargando combate...';
    battleBtn.disabled = true;

    const playerRef = cachedChoices.find((p) => p.name === selectedName);
    const randomPool = cachedChoices.filter((p) => p.name !== selectedName);
    const rivalRef = randomPool[Math.floor(Math.random() * randomPool.length)];

    let player;
    let rival;
    try {
      [player, rival] = await Promise.all([
        getPokemonById(playerRef.url.split('/').filter(Boolean).pop()),
        getPokemonById(rivalRef.url.split('/').filter(Boolean).pop())
      ]);
    } catch {
      result.textContent = 'No se pudo iniciar la batalla por un error de red.';
      battleBtn.disabled = false;
      return;
    }

    arena.innerHTML = card(player, 100, 'left') + card(rival, 100, 'right');
    app.querySelectorAll('.battle-left, .battle-right').forEach((el) => el.classList.add('shake'));

    hitSfx.currentTime = 0;
    hitSfx.play().catch(() => {});

    const playerPower = basePower(player) + Math.floor(Math.random() * 40);
    const rivalPower = basePower(rival) + Math.floor(Math.random() * 40);
    const playerHp = playerPower >= rivalPower ? Math.floor(Math.random() * 20) + 45 : Math.floor(Math.random() * 25);
    const rivalHp = playerPower >= rivalPower ? Math.floor(Math.random() * 25) : Math.floor(Math.random() * 20) + 45;

    setTimeout(() => {
      const [playerHpBar, rivalHpBar] = app.querySelectorAll('.battle-hp');
      playerHpBar.style.width = `${playerHp}%`;
      rivalHpBar.style.width = `${rivalHp}%`;

      const winner = playerPower >= rivalPower ? player.nombre : rival.nombre;
      const winnerCard = playerPower >= rivalPower ? app.querySelector('.battle-left') : app.querySelector('.battle-right');
      winnerCard.classList.add('flash');
      result.textContent = `🏆 Ganador: ${winner}`;

      winSfx.currentTime = 0;
      winSfx.play().catch(() => {});
      battleBtn.disabled = false;
    }, 700);
  });

  fillOptions();
  syncMuteUI();
}
