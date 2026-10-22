# Еда калькулятор — сайт-витрина

Статический сайт (HTML/CSS/JS без сборки) про сервис, который подбирает ужин из реальных товаров SPAR Калининграда под бюджет, исключения и КБЖУ. Бот: https://t.me/Top_FoodBot

- `index.html` — главная страница. `recipes.html` — 7 реальных расчётов, фильтры и калькулятор Миффлина. `bot.html` — страница про бота.
- `data.json` — снимок выдачи `/api/plan` прототипа от 21.10.2026 (цены из общего каталога SPAR Online).
- Деплой: `.github/workflows/pages.yml` запускается при push в main (Settings → Pages → Source: GitHub Actions).
- Локальный запуск: `python3 -m http.server` → http://localhost:8000/

## Новое
- `variants/` — три варианта дизайна (a: «Таблица питания», b: «Огород», c: «Терминал») и сравнение `variants/index.html`.
- PWA: `manifest.webmanifest`, `sw.js`, `offline.html`, `icons/`. Общий слой функций `app.js`: поиск (/ и ⌘K), избранное, список покупок с Web Share, режим готовки с Wake Lock, переключатель магазина в чеке (по умолчанию чек обезличен).

## v2 (21.10.2026): редизайн
Светлая тёплая палитра (#faf6ef, акцент терракота #c8553d), шрифты Playfair Display и Manrope (woff2 с кириллицей, хостятся локально в `fonts/`), фото еды с Wikimedia Commons (`img/`, webp и avif в 480/960/1600 px, srcset и lazy loading; авторы и лицензии в `img/credits.json` и в подвале). Старые варианты A/B/C лежат в `archive/`, в навигацию и кэш service worker не входят. Критика скриншотов: `screens/v2/critique.md`.
