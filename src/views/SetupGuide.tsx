import React, { useState } from 'react';
import {
  Copy, Check, ChevronRight, ChevronDown, ExternalLink,
  Bot, Globe, Terminal, Zap, Shield, ArrowRight
} from 'lucide-react';

interface Step {
  id: number;
  emoji: string;
  title: string;
  desc: string;
  content: React.ReactNode;
}

const CodeBlock: React.FC<{ code: string; lang?: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative mt-2 mb-1">
      <pre className="bg-gray-950 border border-gray-700 rounded-xl p-3 pr-10 text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
        {code}
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        {copied
          ? <Check size={12} className="text-green-400" />
          : <Copy size={12} className="text-gray-400" />
        }
      </button>
    </div>
  );
};

const Badge: React.FC<{ text: string; color?: string }> = ({ text, color = 'violet' }) => {
  const colors: Record<string, string> = {
    violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors[color]}`}>
      {text}
    </span>
  );
};

const SetupGuide: React.FC = () => {
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [tab, setTab] = useState<'local' | 'deploy'>('local');

  const toggle = (id: number) => setOpenStep(openStep === id ? null : id);

  const steps: Step[] = [
    {
      id: 0,
      emoji: '🤖',
      title: 'Шаг 1 — Создай бота в BotFather',
      desc: 'Получи токен для своего бота',
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p>Открой Telegram и найди бота <span className="text-violet-400 font-semibold">@BotFather</span></p>
          <ol className="space-y-2 list-none">
            {[
              { cmd: '/newbot', desc: 'Создать нового бота' },
              { cmd: 'Finance Tracker', desc: 'Введи имя бота (любое)' },
              { cmd: 'myfinancebot', desc: 'Введи username (должен заканчиваться на bot)' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">{item.desc}</p>
                  <CodeBlock code={item.cmd} />
                </div>
              </li>
            ))}
          </ol>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <p className="text-amber-300 text-xs font-semibold mb-1">⚠️ BotFather даст тебе токен вида:</p>
            <CodeBlock code="1234567890:AABBccDDeeffGGhhIIjjKKllMMnnOOppQQ" />
            <p className="text-amber-300/70 text-xs mt-1">Сохрани его — он нужен на следующих шагах!</p>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      emoji: '🌐',
      title: 'Шаг 2 — Задеплой Mini App',
      desc: 'Выбери способ публикации',
      content: (
        <div className="space-y-3">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setTab('local')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === 'local'
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🔧 Локально (ngrok)
            </button>
            <button
              onClick={() => setTab('deploy')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === 'deploy'
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              ☁️ Vercel / Railway
            </button>
          </div>

          {tab === 'local' ? (
            <div className="space-y-3 text-sm text-gray-300">
              <p className="text-xs text-gray-400">Для теста без деплоя используй <span className="text-violet-400">ngrok</span> — он создаёт HTTPS-туннель к твоему компьютеру.</p>

              <div>
                <p className="text-xs text-gray-400 mb-1">1. Установи и запусти мини-апп:</p>
                <CodeBlock code={`# В папке проекта\nnpm install\nnpm run dev\n# Приложение запустится на http://localhost:5173`} />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">2. Установи ngrok (<a className="text-violet-400 underline" href="https://ngrok.com/download" target="_blank" rel="noreferrer">ngrok.com</a>):</p>
                <CodeBlock code={`# macOS\nbrew install ngrok\n\n# Windows — скачай exe с ngrok.com\n\n# Linux\nsnap install ngrok`} />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">3. Создай HTTPS-туннель:</p>
                <CodeBlock code="ngrok http 5173" />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                <p className="text-blue-300 text-xs font-semibold">💡 Ngrok даст тебе URL вида:</p>
                <CodeBlock code="https://xxxx-xx-xx.ngrok-free.app" />
                <p className="text-blue-300/70 text-xs">Это и есть твой <strong>APP_URL</strong> для следующего шага!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-gray-300">
              <p className="text-xs text-gray-400">Бесплатный деплой на Vercel — постоянный HTTPS-адрес без туннелей.</p>

              <div>
                <p className="text-xs text-gray-400 mb-1">1. Загрузи код на GitHub</p>
                <CodeBlock code={`git init\ngit add .\ngit commit -m "Finance Tracker"\ngit remote add origin https://github.com/ВАШ_НИК/finance-tracker.git\ngit push -u origin main`} />
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">2. Зайди на <span className="text-violet-400">vercel.com</span> → New Project → импортируй репозиторий</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">3. Настройки деплоя:</p>
                <CodeBlock code={`Framework Preset: Vite\nBuild Command: npm run build\nOutput Directory: dist`} />
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                <p className="text-green-300 text-xs font-semibold">✅ После деплоя получишь URL вида:</p>
                <CodeBlock code="https://finance-tracker-xxx.vercel.app" />
                <p className="text-green-300/70 text-xs">Это твой постоянный <strong>APP_URL</strong>!</p>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 2,
      emoji: '⚙️',
      title: 'Шаг 3 — Настрой бота',
      desc: 'Запусти бота и привяжи Mini App',
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <p className="text-xs text-gray-400 mb-1">1. Перейди в папку <code className="text-violet-400">bot/</code> и создай .env файл:</p>
            <CodeBlock code={`cd bot\nnpm install\ncp .env.example .env`} />
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">2. Открой <code className="text-violet-400">bot/.env</code> и заполни:</p>
            <CodeBlock code={`BOT_TOKEN=1234567890:AABBccDDeeff...  ← токен от BotFather\nAPP_URL=https://xxxx.ngrok-free.app   ← URL мини-аппа\nUSE_WEBHOOK=false                      ← false для локального теста`} />
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">3. Запусти бота:</p>
            <CodeBlock code="node index.js" />
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
            <p className="text-green-300 text-xs font-semibold">✅ Если всё ОК, увидишь в терминале:</p>
            <CodeBlock code={`✅  Бот запущен в режиме polling\n🤖 Finance Tracker Bot запущен!\n🌐 Mini App URL: https://...`} />
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">4. Проверь бота — напиши ему в Telegram:</p>
            <CodeBlock code="/start" />
          </div>
        </div>
      ),
    },
    {
      id: 3,
      emoji: '🔘',
      title: 'Шаг 4 — Кнопка меню в BotFather',
      desc: 'Добавь кнопку запуска прямо в чат с ботом',
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p className="text-xs text-gray-400">Настрой кнопку меню (🌐) — она появится слева от поля ввода в чате с ботом.</p>

          <ol className="space-y-3 list-none">
            {[
              { step: 'Открой @BotFather и отправь:', cmd: '/setmenubutton', note: '' },
              { step: 'Выбери своего бота:', cmd: '@myfinancebot', note: '' },
              { step: 'Введи URL мини-аппа:', cmd: 'https://твой-app-url.vercel.app', note: '' },
              { step: 'Введи название кнопки:', cmd: '💰 Finance Tracker', note: '' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs mb-0.5">{item.step}</p>
                  <CodeBlock code={item.cmd} />
                </div>
              </li>
            ))}
          </ol>

          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3">
            <p className="text-violet-300 text-xs">
              🎉 Теперь в чате с ботом появится кнопка <strong>💰 Finance Tracker</strong> — нажми её, чтобы открыть приложение прямо в Telegram!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      emoji: '🚀',
      title: 'Шаг 5 — Прямая ссылка (необязательно)',
      desc: 'Создай ссылку t.me/бот/приложение',
      content: (
        <div className="space-y-3 text-sm text-gray-300">
          <p className="text-xs text-gray-400">Создай прямую ссылку на мини-апп через BotFather:</p>

          <ol className="space-y-3 list-none">
            {[
              { step: 'Отправь BotFather:', cmd: '/newapp' },
              { step: 'Выбери бота:', cmd: '@myfinancebot' },
              { step: 'Введи название:', cmd: 'Finance Tracker' },
              { step: 'Введи описание:', cmd: 'Личный учёт финансов' },
              { step: 'Загрузи иконку (640×640 PNG) или пропусти', cmd: '' },
              { step: 'Введи short name:', cmd: 'finance' },
              { step: 'Введи URL приложения:', cmd: 'https://твой-app-url.vercel.app' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs mb-0.5">{item.step}</p>
                  {item.cmd && <CodeBlock code={item.cmd} />}
                </div>
              </li>
            ))}
          </ol>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
            <p className="text-green-300 text-xs font-semibold">✅ Получишь прямую ссылку:</p>
            <CodeBlock code="https://t.me/myfinancebot/finance" />
            <p className="text-green-300/70 text-xs">Поделись этой ссылкой с друзьями!</p>
          </div>
        </div>
      ),
    },
  ];

  const tools = [
    { name: 'ngrok', desc: 'HTTPS-туннель для локальной разработки', url: 'https://ngrok.com', color: 'blue' as const },
    { name: 'Vercel', desc: 'Бесплатный хостинг фронтенда', url: 'https://vercel.com', color: 'violet' as const },
    { name: 'Railway', desc: 'Хостинг с поддержкой Node.js серверов', url: 'https://railway.app', color: 'green' as const },
    { name: 'BotFather', desc: 'Управление Telegram-ботами', url: 'https://t.me/BotFather', color: 'orange' as const },
  ];

  return (
    <div className="flex flex-col pb-28 p-4 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-white text-xl font-bold pt-2">🚀 Запуск в Telegram</h2>
        <p className="text-gray-400 text-sm mt-1">Пошаговая инструкция по настройке Mini App</p>
      </div>

      {/* Status bar */}
      <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-2xl p-4 mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-600/30 flex items-center justify-center flex-shrink-0">
          <Bot size={20} className="text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">Finance Tracker Mini App</p>
          <p className="text-gray-400 text-xs">Готов к запуску в Telegram • React + Vite</p>
        </div>
        <Badge text="v1.0" color="violet" />
      </div>

      {/* Steps */}
      <div className="space-y-2 mb-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => toggle(step.id)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <span className="text-xl flex-shrink-0">{step.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{step.title}</p>
                <p className="text-gray-400 text-xs truncate">{step.desc}</p>
              </div>
              {openStep === step.id
                ? <ChevronDown size={16} className="text-violet-400 flex-shrink-0" />
                : <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
              }
            </button>
            {openStep === step.id && (
              <div className="px-4 pb-4 border-t border-gray-800 pt-3">
                {step.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick commands */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={16} className="text-violet-400" />
          <h3 className="text-white text-sm font-semibold">Быстрый старт</h3>
        </div>
        <p className="text-gray-400 text-xs mb-2">Скопируй и выполни все команды разом:</p>
        <CodeBlock code={`# 1. Клонируй/скачай проект и установи зависимости
npm install && npm run build

# 2. Запусти ngrok-туннель
ngrok http 5173

# 3. В другом терминале — настрой и запусти бота
cd bot
npm install
cp .env.example .env
# Открой bot/.env и заполни BOT_TOKEN и APP_URL
node index.js`} />
      </div>

      {/* Tools */}
      <div className="mb-5">
        <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
          <Zap size={16} className="text-violet-400" />
          Полезные ресурсы
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="bg-gray-900 border border-gray-800 hover:border-violet-500/40 rounded-xl p-3 flex flex-col gap-1 transition-all active:scale-95"
            >
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-semibold">{tool.name}</span>
                <ExternalLink size={10} className="text-gray-500" />
              </div>
              <p className="text-gray-400 text-[10px] leading-tight">{tool.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Security note */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <Shield size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-xs font-semibold mb-1">Безопасность</p>
            <ul className="text-gray-400 text-xs space-y-0.5">
              <li>• Никогда не публикуй токен бота в открытый код</li>
              <li>• Используй переменные окружения (.env)</li>
              <li>• Файл .env добавлен в .gitignore автоматически</li>
              <li>• В Vercel токен задаётся через Environment Variables</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={16} className="text-violet-400" />
          <h3 className="text-white text-sm font-semibold">Архитектура</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-center flex-wrap justify-center">
          {[
            { label: 'Пользователь', icon: '👤' },
            { label: 'Telegram', icon: '✈️' },
            { label: 'Mini App\n(React)', icon: '⚛️' },
            { label: 'Bot Server\n(Node.js)', icon: '🤖' },
          ].map((item, i, arr) => (
            <React.Fragment key={i}>
              <div className="bg-gray-800 rounded-xl px-3 py-2">
                <div className="text-base mb-0.5">{item.icon}</div>
                <div className="text-gray-300 text-[10px] whitespace-pre-line leading-tight">{item.label}</div>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight size={12} className="text-gray-600" />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-gray-500 text-[10px] text-center mt-3">
          Mini App = статичный сайт (dist/) • Bot = Node.js сервер (bot/)
        </p>
      </div>
    </div>
  );
};

export default SetupGuide;
