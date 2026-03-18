import React, { useState } from "react";
import {
  Github,
  Globe,
  Terminal,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  GitBranch,
  Upload,
  Settings,
  Zap,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const CodeBlock = ({ code, label }: { code: string; label?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
      }
    });
  };

  return (
    <div className="my-2">
      {label && (
        <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
          {label}
        </p>
      )}
      <div className="bg-gray-900 rounded-xl p-3 flex items-start gap-2 border border-gray-700">
        <code className="text-green-400 text-xs font-mono flex-1 whitespace-pre-wrap break-all leading-relaxed">
          {code}
        </code>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          {copied ? (
            <Check size={13} className="text-green-400" />
          ) : (
            <Copy size={13} className="text-gray-300" />
          )}
        </button>
      </div>
    </div>
  );
};

const Step = ({
  number,
  title,
  icon: Icon,
  color,
  children,
  defaultOpen = false,
}: {
  number: number;
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-2xl border ${open ? "border-blue-500/40 bg-blue-950/20" : "border-gray-700/50 bg-gray-800/40"} overflow-hidden transition-all`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <span className="text-white text-xs font-bold">{number}</span>
        </div>
        <Icon size={16} className={open ? "text-blue-400" : "text-gray-400"} />
        <span className={`flex-1 font-semibold text-sm ${open ? "text-white" : "text-gray-200"}`}>
          {title}
        </span>
        {open ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>
      {open && <div className="px-4 pb-4 space-y-2">{children}</div>}
    </div>
  );
};

const Tip = ({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warn" | "success" }) => {
  const styles = {
    info: "bg-blue-950/40 border-blue-500/30 text-blue-300",
    warn: "bg-yellow-950/40 border-yellow-500/30 text-yellow-300",
    success: "bg-green-950/40 border-green-500/30 text-green-300",
  };
  const icons = {
    info: <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />,
    warn: <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />,
    success: <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" />,
  };
  return (
    <div className={`flex gap-2 text-xs p-3 rounded-xl border ${styles[type]} leading-relaxed`}>
      {icons[type]}
      <span>{children}</span>
    </div>
  );
};

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-300 text-sm leading-relaxed">{children}</p>
);

export default function DeployGuide() {
  const [activeTab, setActiveTab] = useState<"github" | "botfather">("github");

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950/30 to-gray-900 px-4 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
            <Github size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Деплой в Telegram</h1>
            <p className="text-gray-400 text-xs">Пошаговая инструкция</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 bg-gray-800/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("github")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "github"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400"
            }`}
          >
            <Github size={13} />
            GitHub Pages
          </button>
          <button
            onClick={() => setActiveTab("botfather")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "botfather"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-400"
            }`}
          >
            <Zap size={13} />
            BotFather
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {activeTab === "github" && (
          <>
            {/* Overview */}
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-2xl p-4">
              <div className="flex gap-3 items-start">
                <Globe size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">Что такое GitHub Pages?</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Бесплатный хостинг от GitHub — твой Mini App будет доступен по адресу{" "}
                    <span className="text-blue-400 font-mono">username.github.io/repo-name</span>.
                    Это HTTPS-ссылка, которую можно сразу вставить в BotFather.
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <Step number={1} title="Установи Git (если не стоит)" icon={Terminal} color="bg-gray-600" defaultOpen={true}>
              <P>Скачай и установи Git с официального сайта:</P>
              <a
                href="https://git-scm.com/downloads"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 text-xs underline"
              >
                <ExternalLink size={12} />
                git-scm.com/downloads
              </a>
              <P>После установки проверь в терминале:</P>
              <CodeBlock code="git --version" label="Терминал / CMD" />
              <Tip type="info">
                На Windows используй Git Bash или PowerShell. На Mac/Linux — обычный Terminal.
              </Tip>
            </Step>

            <Step number={2} title="Создай аккаунт на GitHub" icon={Github} color="bg-gray-700">
              <P>Перейди на сайт и создай бесплатный аккаунт:</P>
              <a
                href="https://github.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 text-xs underline"
              >
                <ExternalLink size={12} />
                github.com/signup
              </a>
              <Tip type="success">
                Запомни свой username — он войдёт в URL твоего сайта!
              </Tip>
            </Step>

            <Step number={3} title="Создай новый репозиторий" icon={GitBranch} color="bg-blue-700">
              <P>На GitHub нажми кнопку <strong className="text-white">New repository</strong>:</P>
              <div className="space-y-2 my-2">
                {[
                  { label: "Repository name", value: "finance-app (любое название без пробелов)" },
                  { label: "Visibility", value: "✅ Public (обязательно!)" },
                  { label: "Initialize", value: "☐ Не ставь галочки" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-800 rounded-xl p-3 border border-gray-700">
                    <p className="text-gray-400 text-xs mb-0.5">{item.label}</p>
                    <p className="text-white text-xs font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
              <P>Нажми <strong className="text-white">Create repository</strong></P>
            </Step>

            <Step number={4} title="Загрузи код проекта" icon={Upload} color="bg-green-700">
              <P>Открой терминал в папке с проектом и выполни по очереди:</P>
              <CodeBlock
                label="Шаг 4.1 — Инициализация Git"
                code="git init"
              />
              <CodeBlock
                label="Шаг 4.2 — Добавить все файлы"
                code="git add ."
              />
              <CodeBlock
                label="Шаг 4.3 — Первый коммит"
                code='git commit -m "Initial commit"'
              />
              <CodeBlock
                label="Шаг 4.4 — Привязать к GitHub (замени YOUR_USERNAME и REPO_NAME)"
                code={`git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git`}
              />
              <CodeBlock
                label="Шаг 4.5 — Отправить код"
                code="git push -u origin main"
              />
              <Tip type="warn">
                Замени YOUR_USERNAME на свой логин GitHub, а REPO_NAME на название репозитория который создал.
              </Tip>
            </Step>

            <Step number={5} title="Собери и задеплой на GitHub Pages" icon={Zap} color="bg-purple-700">
              <P>В <strong className="text-white">package.json</strong> уже прописан скрипт деплоя. Просто запусти:</P>
              <CodeBlock
                label="Установить зависимости (если не делал)"
                code="npm install"
              />
              <CodeBlock
                label="Задеплоить на GitHub Pages"
                code="npm run deploy"
              />
              <Tip type="info">
                Команда сама соберёт проект и создаст ветку <span className="font-mono">gh-pages</span> на GitHub. Подожди 1-2 минуты.
              </Tip>
              <Tip type="warn">
                Перед деплоем убедись что в package.json прописано homepage. Смотри шаг ниже ↓
              </Tip>
            </Step>

            <Step number={6} title="Настрой homepage в package.json" icon={Settings} color="bg-orange-700">
              <P>Открой файл <strong className="text-white">package.json</strong> и добавь поле <strong className="text-white">homepage</strong>:</P>
              <CodeBlock
                label="Вставь в начало package.json (после открывающей скобки)"
                code={`"homepage": "https://YOUR_USERNAME.github.io/REPO_NAME",`}
              />
              <P>Пример готового package.json:</P>
              <CodeBlock
                code={`{
  "name": "finance-app",
  "homepage": "https://ivan123.github.io/finance-app",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
    ...
  }
}`}
              />
              <Tip type="warn">
                Замени ivan123 на свой GitHub username и finance-app на название твоего репозитория!
              </Tip>
            </Step>

            <Step number={7} title="Включи GitHub Pages в настройках" icon={Globe} color="bg-teal-700">
              <P>На странице репозитория на GitHub:</P>
              <div className="space-y-2 my-2">
                {[
                  "Нажми Settings (⚙️ вверху репо)",
                  "В левом меню выбери Pages",
                  "Source → Deploy from a branch",
                  "Branch → выбери gh-pages → / (root)",
                  "Нажми Save",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 bg-gray-800/60 rounded-xl p-2.5 border border-gray-700/50">
                    <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <span className="text-gray-200 text-xs">{step}</span>
                  </div>
                ))}
              </div>
              <Tip type="success">
                Через 1-2 минуты сайт будет доступен по адресу: YOUR_USERNAME.github.io/REPO_NAME 🎉
              </Tip>
            </Step>

            {/* Result */}
            <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 border border-green-500/30 rounded-2xl p-4">
              <div className="flex gap-2 items-center mb-2">
                <CheckCircle2 size={18} className="text-green-400" />
                <h3 className="font-bold text-white text-sm">Готово! Твой URL:</h3>
              </div>
              <CodeBlock code="https://YOUR_USERNAME.github.io/REPO_NAME" />
              <p className="text-gray-300 text-xs mt-2">
                👆 Эту ссылку вставляй в BotFather при настройке Mini App. Перейди на вкладку <strong className="text-white">BotFather</strong> для следующих шагов.
              </p>
            </div>
          </>
        )}

        {activeTab === "botfather" && (
          <>
            {/* Overview */}
            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-2xl p-4">
              <div className="flex gap-3 items-start">
                <Zap size={20} className="text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">Привязка Mini App к боту</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    После деплоя на GitHub Pages нужно создать бота и подключить к нему Mini App через{" "}
                    <span className="text-purple-400 font-bold">@BotFather</span> в Telegram.
                  </p>
                </div>
              </div>
            </div>

            <Step number={1} title="Создай бота в BotFather" icon={Zap} color="bg-purple-700" defaultOpen={true}>
              <P>Открой Telegram и найди <strong className="text-white">@BotFather</strong>:</P>
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 text-xs underline"
              >
                <ExternalLink size={12} />
                t.me/BotFather
              </a>
              <div className="space-y-2 my-2">
                {[
                  { cmd: "/newbot", desc: "Создать нового бота" },
                  { cmd: "Finance Tracker", desc: "Введи имя бота (любое)" },
                  { cmd: "financetracker_bot", desc: "Введи username (должен заканчиваться на _bot)" },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="flex items-center gap-2 px-3 pt-2">
                      <ArrowRight size={12} className="text-purple-400" />
                      <span className="text-gray-400 text-xs">Шаг {i + 1}</span>
                    </div>
                    <div className="px-3 pb-2">
                      <CodeBlock code={item.cmd} />
                      <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Tip type="success">
                BotFather пришлёт токен вида: <span className="font-mono">1234567890:ABCdef...</span> — сохрани его!
              </Tip>
            </Step>

            <Step number={2} title="Создай Web App для бота" icon={Globe} color="bg-blue-700">
              <P>В чате с BotFather выполни:</P>
              <CodeBlock label="Команда" code="/newapp" />
              <div className="space-y-2 my-2">
                {[
                  { q: "Выбери бота", a: "Выбери своего бота из списка" },
                  { q: "Title", a: "Finance Tracker (название приложения)" },
                  { q: "Description", a: "Личный учёт финансов" },
                  { q: "Photo", a: "Отправь любую картинку 640x360" },
                  { q: "Web App URL", a: "https://YOUR_USERNAME.github.io/REPO_NAME" },
                  { q: "Short name", a: "finance (латиницей, без пробелов)" },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-800 rounded-xl p-2.5 border border-gray-700/50">
                    <p className="text-gray-400 text-xs mb-0.5">📌 {item.q}</p>
                    <p className="text-white text-xs font-medium">{item.a}</p>
                  </div>
                ))}
              </div>
            </Step>

            <Step number={3} title="Добавь кнопку меню в бота" icon={Settings} color="bg-teal-700">
              <P>Чтобы кнопка "Открыть приложение" появилась в боте:</P>
              <CodeBlock label="В BotFather напиши" code="/setmenubutton" />
              <div className="space-y-2 my-2">
                {[
                  "Выбери своего бота",
                  "Введи URL: https://YOUR_USERNAME.github.io/REPO_NAME",
                  "Введи текст кнопки: 💰 Мои финансы",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 bg-gray-800/60 rounded-xl p-2.5 border border-gray-700/50">
                    <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <span className="text-gray-200 text-xs">{step}</span>
                  </div>
                ))}
              </div>
              <Tip type="info">
                Теперь у бота внизу появится кнопка меню для открытия Mini App.
              </Tip>
            </Step>

            <Step number={4} title="Запусти бота (опционально)" icon={Terminal} color="bg-green-700">
              <P>Если хочешь чтобы бот отвечал на /start — запусти локальный сервер:</P>
              <CodeBlock label="Перейди в папку бота" code="cd bot" />
              <CodeBlock label="Установи зависимости" code="npm install" />
              <CodeBlock label="Создай файл .env" code="cp .env.example .env" />
              <P>Открой <strong className="text-white">bot/.env</strong> и вставь токен:</P>
              <CodeBlock
                label="bot/.env"
                code={`BOT_TOKEN=1234567890:ABCdef...
APP_URL=https://YOUR_USERNAME.github.io/REPO_NAME`}
              />
              <CodeBlock label="Запустить бота" code="node index.js" />
              <Tip type="success">
                Для постоянной работы задеплой бот на Railway.app или Render.com — оба бесплатны!
              </Tip>
            </Step>

            <Step number={5} title="Протестируй Mini App" icon={CheckCircle2} color="bg-green-600">
              <P>Проверь что всё работает:</P>
              <div className="space-y-2 my-2">
                {[
                  { icon: "1️⃣", text: "Открой своего бота в Telegram" },
                  { icon: "2️⃣", text: "Нажми кнопку меню внизу (💰 Мои финансы)" },
                  { icon: "3️⃣", text: "Или напиши /start — бот пришлёт кнопку" },
                  { icon: "4️⃣", text: "Mini App откроется с твоими данными Telegram!" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-800/60 rounded-xl p-2.5 border border-gray-700/50">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-gray-200 text-xs">{item.text}</span>
                  </div>
                ))}
              </div>
              <Tip type="success">
                Приложение автоматически получит имя, username и фото из Telegram! 🎉
              </Tip>
            </Step>

            {/* Quick links */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
              <h3 className="font-bold text-white text-sm mb-3">🔗 Полезные ссылки</h3>
              <div className="space-y-2">
                {[
                  { label: "BotFather", url: "https://t.me/BotFather", desc: "Создать бота" },
                  { label: "GitHub", url: "https://github.com", desc: "Хостинг кода" },
                  { label: "Railway.app", url: "https://railway.app", desc: "Хостинг бота (бесплатно)" },
                  { label: "TG Mini Apps Docs", url: "https://core.telegram.org/bots/webapps", desc: "Документация" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-white text-xs font-semibold">{link.label}</p>
                      <p className="text-gray-400 text-xs">{link.desc}</p>
                    </div>
                    <ExternalLink size={12} className="text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
