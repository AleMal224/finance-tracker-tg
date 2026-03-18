/**
 * 🤖 Finance Tracker Bot — Telegram Bot Server
 *
 * Запуск:
 *   1. npm install (в папке bot/)
 *   2. Скопируй .env.example -> .env и вставь свои значения
 *   3. node index.js
 */

import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import express from 'express';

const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.APP_URL;       // HTTPS URL твоего мини-аппа
const PORT = process.env.PORT || 3000;
const USE_WEBHOOK = process.env.USE_WEBHOOK === 'true';

if (!BOT_TOKEN) {
  console.error('❌  BOT_TOKEN не задан в .env');
  process.exit(1);
}
if (!APP_URL) {
  console.error('❌  APP_URL не задан в .env  (нужен HTTPS-адрес твоего мини-аппа)');
  process.exit(1);
}

// ─── Инициализация бота ────────────────────────────────────────────────────
let bot;

if (USE_WEBHOOK) {
  // Webhook-режим (для продакшна на сервере)
  bot = new TelegramBot(BOT_TOKEN, { webHook: { port: PORT } });
  const WEBHOOK_URL = `${APP_URL}/bot${BOT_TOKEN}`;
  bot.setWebHook(WEBHOOK_URL).then(() => {
    console.log(`✅  Webhook установлен: ${WEBHOOK_URL}`);
  });
} else {
  // Polling-режим (для локальной разработки)
  bot = new TelegramBot(BOT_TOKEN, { polling: true });
  console.log('✅  Бот запущен в режиме polling (локально)');
}

// ─── Express (нужен для webhook-режима) ───────────────────────────────────
if (USE_WEBHOOK) {
  const app = express();
  app.use(express.json());
  app.post(`/bot${BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
  app.listen(PORT, () => console.log(`🚀  Express слушает порт ${PORT}`));
}

// ─── Команды ──────────────────────────────────────────────────────────────

// /start — приветствие + кнопка «Открыть приложение»
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || 'друг';

  bot.sendMessage(chatId,
    `👋 Привет, ${firstName}!\n\n` +
    `💰 *Finance Tracker* — твой личный учёт финансов прямо в Telegram.\n\n` +
    `📊 Что умеет приложение:\n` +
    `• Записывать доходы и расходы\n` +
    `• Показывать аналитику по категориям\n` +
    `• Строить графики за любой период\n` +
    `• Хранить историю всех операций\n\n` +
    `Нажми кнопку ниже, чтобы открыть приложение 👇`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          {
            text: '💰 Открыть Finance Tracker',
            web_app: { url: APP_URL }
          }
        ]]
      }
    }
  );
});

// /app — быстрая кнопка открытия
bot.onText(/\/app/, (msg) => {
  bot.sendMessage(msg.chat.id, '📲 Открой приложение:', {
    reply_markup: {
      inline_keyboard: [[
        { text: '💰 Finance Tracker', web_app: { url: APP_URL } }
      ]]
    }
  });
});

// /help — справка
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `ℹ️ *Справка Finance Tracker*\n\n` +
    `/start — запустить бота\n` +
    `/app — открыть приложение\n` +
    `/help — показать эту справку\n\n` +
    `💡 *Совет:* Нажми на кнопку меню (🌐) слева от поля ввода, чтобы открыть приложение в один клик!`,
    { parse_mode: 'Markdown' }
  );
});

// Обработка данных из Mini App (если приложение отправляет данные боту)
bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  try {
    const data = JSON.parse(msg.web_app_data?.data || '{}');
    console.log('📦 Данные из Mini App:', data);
    bot.sendMessage(chatId, `✅ Данные получены из приложения:\n\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\``, {
      parse_mode: 'Markdown'
    });
  } catch {
    bot.sendMessage(chatId, '✅ Данные из приложения получены!');
  }
});

// Неизвестные команды
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/') && !msg.web_app_data) {
    bot.sendMessage(msg.chat.id,
      `💬 Напиши /start чтобы начать, или /help для справки.\n\nИли сразу открой приложение 👇`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: '💰 Открыть Finance Tracker', web_app: { url: APP_URL } }
          ]]
        }
      }
    );
  }
});

console.log(`\n🤖 Finance Tracker Bot запущен!`);
console.log(`🌐 Mini App URL: ${APP_URL}\n`);
