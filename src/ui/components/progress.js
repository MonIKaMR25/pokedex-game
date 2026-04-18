const MAX_POKEMON_STAT_VALUE = 255;

export function renderStatBar(name, value) {
  const percentageValue = Math.min(100, Math.max(0, (value / MAX_POKEMON_STAT_VALUE) * 100));
  return `
    <div>
      <div class="mb-1 flex items-center justify-between text-sm">
        <span class="font-semibold capitalize">${name.replace('-', ' ')}</span>
        <span class="text-slate-500 dark:text-slate-400">${value}</span>
      </div>
      <div class="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div class="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-700" style="width:${percentageValue}%"></div>
      </div>
    </div>
  `;
}
