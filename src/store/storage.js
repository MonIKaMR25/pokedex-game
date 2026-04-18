const KEYS = {
  captured: 'pokedex-game.captured',
  theme: 'pokedex-game.theme',
  config: 'pokedex-game.config'
};

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn('No se pudo parsear dato de localStorage.', error);
    return fallback;
  }
}

export function getCaptured() {
  return safeParse(localStorage.getItem(KEYS.captured), []);
}

export function isCaptured(id) {
  return getCaptured().some((p) => p.id === Number(id));
}

export function capturePokemon(pokemon) {
  const captured = getCaptured();
  if (captured.some((p) => p.id === pokemon.id)) {
    return false;
  }
  captured.push(pokemon);
  localStorage.setItem(KEYS.captured, JSON.stringify(captured));
  return true;
}

export function removeCaptured(id) {
  const updated = getCaptured().filter((p) => p.id !== Number(id));
  localStorage.setItem(KEYS.captured, JSON.stringify(updated));
}

export function getTheme() {
  return localStorage.getItem(KEYS.theme);
}

export function setTheme(theme) {
  localStorage.setItem(KEYS.theme, theme);
}

export function getConfig() {
  return safeParse(localStorage.getItem(KEYS.config), { muted: false });
}

export function setConfig(config) {
  localStorage.setItem(KEYS.config, JSON.stringify({ ...getConfig(), ...config }));
}
