const API = 'https://pokeapi.co/api/v2';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error al consultar PokeAPI (${res.status}) en ${url}`);
  }
  return res.json();
}

function normalizePokemon(data) {
  return {
    id: data.id,
    nombre: data.name,
    imagen:
      data.sprites.other['official-artwork'].front_default ||
      data.sprites.front_default ||
      '',
    tipos: data.types.map((t) => t.type.name),
    stats: data.stats.map((s) => ({ nombre: s.stat.name, valor: s.base_stat })),
    habilidades: data.abilities.map((a) => a.ability.name)
  };
}

export async function getPokemonList(limit = 60, offset = 0) {
  const data = await fetchJSON(`${API}/pokemon?limit=${limit}&offset=${offset}`);
  const details = await Promise.all(data.results.map((p) => fetchJSON(p.url)));
  return details.map(normalizePokemon);
}

export async function getPokemonById(id) {
  const data = await fetchJSON(`${API}/pokemon/${id}`);
  return normalizePokemon(data);
}

export async function getPokemonTypes() {
  const data = await fetchJSON(`${API}/type`);
  return data.results
    .map((t) => t.name)
    .filter((name) => !['unknown', 'shadow'].includes(name));
}

export async function getPokemonListLite(limit = 151) {
  const data = await fetchJSON(`${API}/pokemon?limit=${limit}`);
  return data.results;
}
