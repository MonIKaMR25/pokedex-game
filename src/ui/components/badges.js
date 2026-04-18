const typeColors = {
  normal: 'bg-zinc-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400 text-slate-900',
  grass: 'bg-green-500',
  ice: 'bg-cyan-400 text-slate-900',
  fighting: 'bg-red-700',
  poison: 'bg-purple-600',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-600',
  rock: 'bg-stone-500',
  ghost: 'bg-violet-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-neutral-800',
  steel: 'bg-slate-500',
  fairy: 'bg-rose-400'
};

export function renderTypeBadge(type) {
  const color = typeColors[type] || 'bg-slate-400';
  return `<span class="rounded-full ${color} px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">${type}</span>`;
}
