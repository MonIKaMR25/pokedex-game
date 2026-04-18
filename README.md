# Pokédex Game SPA

Aplicación SPA estática estilo juego de Pokémon, construida con **HTML + TailwindCSS (CDN) + JavaScript modular** y consumo de **PokeAPI**.

## Funcionalidades

- Inicio (`#/`): listado de Pokémon, búsqueda por nombre, filtro por tipo, skeleton loading, tarjetas con microinteracciones y lazy loading de imágenes.
- Detalle (`#/pokemon/:id`): imagen grande, número, tipos, stats, habilidades y captura persistente sin duplicados.
- Batalla (`#/battle`): selección de Pokémon, rival aleatorio, simulación con animación, sonido local y control de mute.
- Mi Pokédex (`#/pokedex`): colección capturada desde localStorage con opción de eliminar.
- Modo oscuro persistido en localStorage.

## Estructura

- `index.html`
- `assets/`
  - `icons/pokeball.svg`
  - `sfx/*.wav`
- `src/`
  - `main.js`
  - `router.js`
  - `api/pokeapi.js`
  - `store/storage.js`
  - `ui/components/`
  - `pages/`
  - `styles/app.css`

## Ejecutar localmente

Como es una SPA estática con módulos ES, usa un servidor local:

```bash
cd /home/runner/work/pokedex-game/pokedex-game
python3 -m http.server 8080
```

Abrir: `http://localhost:8080`

## Deploy con Nginx

Ejemplo de bloque de servidor:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    root /var/www/pokedex-game;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Copiar los archivos del repositorio dentro de `/var/www/pokedex-game` y recargar Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```
