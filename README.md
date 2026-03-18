# 💰 Finance Tracker — Telegram Mini App

Личный учёт финансов прямо в Telegram. React + Vite + Tailwind CSS.

---

## 🚀 Быстрый старт (запуск в Telegram за 5 шагов)

### Шаг 1 — Создай бота в @BotFather

1. Открой Telegram → найди [@BotFather](https://t.me/BotFather)
2. Отправь `/newbot`
3. Введи **имя бота** (например: `Finance Tracker`)
4. Введи **username** (например: `myfinancebot` — должен заканчиваться на `bot`)
5. BotFather даст тебе **токен** вида:
   ```
   1234567890:AABBccDDeeffGGhhIIjjKKllMMnnOOppQQ
   ```
   ⚠️ Сохрани токен — он нужен на следующем шаге!

---

### Шаг 2 — Запусти Mini App и создай HTTPS-туннель

**Вариант А — Локально через ngrok (для теста):**

```bash
# Установи зависимости и запусти dev-сервер
npm install
npm run dev
# Запустится на http://localhost:5173

# В другом терминале — установи ngrok (https://ngrok.com)
ngrok http 5173
# Получишь URL вида: https://xxxx-xx.ngrok-free.app
```

**Вариант Б — Деплой на Vercel (для продакшна, бесплатно):**

```bash
# Загрузи код на GitHub
git init && git add . && git commit -m "Finance Tracker"
git remote add origin https://github.com/ВАШ_НИК/finance-tracker.git
git push -u origin main

# Зайди на vercel.com → New Project → импортируй репо
# Build Command: npm run build
# Output Directory: dist
# Получишь URL: https://finance-tracker-xxx.vercel.app
```

---

### Шаг 3 — Настрой и запусти бота

```bash
# Перейди в папку bot/
cd bot

# Установи зависимости
npm install

# Создай .env файл
cp .env.example .env
```

Открой `bot/.env` и заполни:

```env
BOT_TOKEN=1234567890:AABBccDDeeff...   # токен от BotFather
APP_URL=https://xxxx.ngrok-free.app    # URL мини-аппа (ngrok или Vercel)
USE_WEBHOOK=false                       # false для локального теста
```

Запусти бота:

```bash
node index.js
```

✅ Если всё ОК, увидишь:
```
✅  Бот запущен в режиме polling
🤖 Finance Tracker Bot запущен!
🌐 Mini App URL: https://...
```

Проверь — напиши боту в Telegram `/start`

---

### Шаг 4 — Настрой кнопку меню в BotFather

Это добавит кнопку 🌐 слева от поля ввода в чате с ботом:

1. Открой [@BotFather](https://t.me/BotFather)
2. Отправь `/setmenubutton`
3. Выбери своего бота
4. Введи URL: `https://твой-app-url.vercel.app`
5. Введи название кнопки: `💰 Finance Tracker`

---

### Шаг 5 — (Опционально) Создай прямую ссылку t.me/бот/приложение

```
1. @BotFather → /newapp
2. Выбери бота
3. Название: Finance Tracker
4. Описание: Личный учёт финансов
5. Short name: finance
6. URL: https://твой-app-url.vercel.app
```

Получишь ссылку: `https://t.me/myfinancebot/finance` — поделись с друзьями!

---

## 🏗️ Архитектура

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│ Пользователь│────▶│   Telegram  │────▶│  Mini App (React)│
└─────────────┘     └──────┬──────┘     │  dist/ (статика) │
                           │            └──────────────────┘
                           ▼
                    ┌─────────────┐
                    │ Bot Server  │
                    │  (Node.js)  │
                    │   bot/      │
                    └─────────────┘
```

| Компонент | Технологии | Хостинг |
|-----------|-----------|---------|
| Mini App (фронтенд) | React, Vite, Tailwind | Vercel / ngrok |
| Bot Server | Node.js, node-telegram-bot-api | Railway / VPS |

---

## 📁 Структура проекта

```
finance-tracker/
├── src/                    # React Mini App
│   ├── App.tsx             # Главный компонент
│   ├── views/
│   │   ├── Dashboard.tsx   # Главная страница
│   │   ├── AddTransaction  # Добавить транзакцию
│   │   ├── Transactions    # История
│   │   ├── Analytics       # Аналитика / графики
│   │   ├── Settings        # Профиль
│   │   └── SetupGuide      # Инструкция по запуску
│   ├── hooks/
│   │   ├── useTelegram.ts  # Telegram WebApp API
│   │   └── useFinance.ts   # Логика финансов
│   └── types/index.ts
│
├── bot/                    # Telegram Bot Server
│   ├── index.js            # Основной файл бота
│   ├── package.json
│   └── .env.example        # Шаблон переменных окружения
│
├── index.html
└── README.md
```

---

## ⚙️ Команды бота

| Команда | Описание |
|---------|----------|
| `/start` | Приветствие + кнопка открытия приложения |
| `/app` | Быстрая кнопка открытия |
| `/help` | Справка |

---

## 🔐 Безопасность

- ❌ Никогда не публикуй `BOT_TOKEN` в открытый код / GitHub
- ✅ Используй переменные окружения (`.env`)
- ✅ Файл `.env` добавлен в `.gitignore`
- ✅ На Vercel токен задаётся через `Settings → Environment Variables`
- ✅ На Railway токен задаётся через `Variables`

---

## 📊 Возможности приложения

- 💰 Учёт доходов и расходов
- 🏷️ 12 категорий (еда, транспорт, жильё, зарплата и др.)
- 📊 Графики: Area, Bar, Pie (Recharts)
- 📅 История транзакций с фильтрами
- 👤 Авторизация через Telegram (имя, фото, ID)
- 💾 Хранение данных в localStorage (по Telegram User ID)
- 📱 Нативный UI: haptic feedback, тема Telegram
- 🚀 Пошаговая инструкция по запуску прямо в приложении

---

## 🛠️ Разработка

```bash
npm install      # установить зависимости
npm run dev      # запустить dev-сервер
npm run build    # сборка для продакшна
```

---

*Finance Tracker © 2024 — Telegram Mini App*
