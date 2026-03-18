# 🚀 Деплой Finance Tracker на GitHub Pages

## Предварительные требования
- Node.js 18+ (https://nodejs.org)
- Git (https://git-scm.com)
- Аккаунт на GitHub (https://github.com)

---

## Шаг 1 — Подготовь package.json

Открой `package.json` и добавь поле `homepage` (замени данные на свои):

```json
{
  "name": "finance-app",
  "homepage": "https://ВАШ_GITHUB_USERNAME.github.io/ВАШ_РЕПО",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  ...
}
```

---

## Шаг 2 — Создай репозиторий на GitHub

1. Зайди на https://github.com/new
2. Назови репозиторий (например `finance-app`)
3. Выбери **Public**
4. НЕ ставь галочки (без README/gitignore)
5. Нажми **Create repository**

---

## Шаг 3 — Загрузи код на GitHub

Открой терминал/командную строку в папке проекта:

```bash
# Инициализируй git (если первый раз)
git init

# Добавь все файлы
git add .

# Сделай первый коммит
git commit -m "Initial commit"

# Привяжи к GitHub (замени USERNAME и REPO!)
git remote add origin https://github.com/USERNAME/REPO.git

# Отправь код
git push -u origin main
```

---

## Шаг 4 — Задеплой на GitHub Pages

```bash
# Установи зависимости (если не делал)
npm install

# Запусти деплой (автоматически соберёт и загрузит)
npm run deploy
```

✅ Команда создаст ветку `gh-pages` и загрузит туда собранный сайт.

---

## Шаг 5 — Включи GitHub Pages в настройках репо

1. Открой репозиторий на GitHub
2. Нажми **Settings** → раздел **Pages** в левом меню
3. Под "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages` → `/ (root)`
4. Нажми **Save**

⏳ Через 1-2 минуты сайт будет доступен по адресу:
```
https://ВАШ_USERNAME.github.io/ВАШ_РЕПО
```

---

## Шаг 6 — Подключи к Telegram боту

### 6.1 Создай бота
1. Открой [@BotFather](https://t.me/BotFather) в Telegram
2. Отправь `/newbot`
3. Введи имя бота: `Finance Tracker`
4. Введи username: `myfinancetracker_bot` (должен заканчиваться на `_bot`)
5. Сохрани **токен** который пришлёт BotFather

### 6.2 Создай Mini App
```
/newapp → выбери бота → введи данные:
  - Title: Finance Tracker
  - Description: Личный учёт финансов
  - Photo: любое фото 640x360px
  - URL: https://ВАШ_USERNAME.github.io/ВАШ_РЕПО
  - Short name: finance
```

### 6.3 Добавь кнопку меню
```
/setmenubutton → выбери бота
  → URL: https://ВАШ_USERNAME.github.io/ВАШ_РЕПО
  → Текст: 💰 Мои финансы
```

---

## Шаг 7 — Запусти бота (опционально)

```bash
cd bot
npm install
cp .env.example .env
# Открой .env и вставь токен и URL
node index.js
```

---

## Шаг 8 — Обновление после изменений

После каждого изменения кода просто запускай:
```bash
npm run deploy
```

---

## ❓ Частые проблемы

| Проблема | Решение |
|----------|---------|
| `npm run deploy` — ошибка | Убедись что `homepage` прописан в package.json |
| Сайт не открывается | Подожди 2-5 минут, GitHub Pages иногда обновляется не сразу |
| Белый экран | Проверь правильность `homepage` URL в package.json |
| Telegram не видит HTTPS | GitHub Pages всегда HTTPS — должно работать |
| Бот не отвечает на /start | Запусти `node bot/index.js` и не закрывай терминал |

---

## 🔗 Полезные ссылки
- [BotFather](https://t.me/BotFather)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [Railway.app](https://railway.app) — бесплатный хостинг для бота
