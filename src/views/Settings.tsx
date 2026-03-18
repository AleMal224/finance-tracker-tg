import React, { useState } from 'react';
import { TelegramUser, Transaction } from '../types';
import { formatCurrency } from '../utils/categoryConfig';

interface SettingsProps {
  user: TelegramUser | null;
  transactions: Transaction[];
  onClearAll: () => void;
  onSetup?: () => void;
  onDeploy?: () => void;
  haptic?: { impact: (s?: 'light' | 'medium' | 'heavy') => void; notification: (t: 'success' | 'error' | 'warning') => void };
}

const Settings: React.FC<SettingsProps> = ({ user, transactions, onClearAll, onSetup, onDeploy, haptic }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const displayName = user
    ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
    : 'Пользователь';

  const initials = user?.first_name?.[0]?.toUpperCase() || '?';

  const handleClear = () => {
    haptic?.notification('warning');
    onClearAll();
    setShowConfirm(false);
  };

  const stats = [
    { label: 'Транзакций', value: transactions.length.toString(), emoji: '🔄' },
    { label: 'Всего доходов', value: formatCurrency(totalIncome), emoji: '💰' },
    { label: 'Всего расходов', value: formatCurrency(totalExpense), emoji: '💸' },
    { label: 'Общий баланс', value: formatCurrency(totalIncome - totalExpense), emoji: '📊' },
  ];

  const menuLinks = [
    {
      label: 'Запустить в Telegram',
      emoji: '🚀',
      desc: 'Инструкция по настройке бота',
      onClick: () => { haptic?.impact('light'); onSetup?.(); },
      highlight: true,
    },
    {
      label: 'О приложении',
      emoji: 'ℹ️',
      desc: 'Finance Tracker v1.0',
      onClick: () => haptic?.impact('light'),
      highlight: false,
    },
    {
      label: 'Конфиденциальность',
      emoji: '🔒',
      desc: 'Данные хранятся локально',
      onClick: () => haptic?.impact('light'),
      highlight: false,
    },
    {
      label: 'Поддержка',
      emoji: '💬',
      desc: 'Написать в Telegram',
      onClick: () => haptic?.impact('light'),
      highlight: false,
    },
  ];

  return (
    <div className="flex flex-col pb-28 p-4">
      <h2 className="text-white text-xl font-bold pt-2 mb-5">Профиль</h2>

      {/* User Card */}
      <div className="bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/20 rounded-3xl p-5 mb-5 flex items-center gap-4">
        {user?.photo_url ? (
          <img src={user.photo_url} alt="avatar" className="w-16 h-16 rounded-2xl object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
            {initials}
          </div>
        )}
        <div>
          <h3 className="text-white text-lg font-bold">{displayName}</h3>
          {user?.username && (
            <p className="text-violet-300 text-sm">@{user.username}</p>
          )}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="text-emerald-400 text-xs">Telegram авторизован</span>
          </div>
          {user?.id && (
            <p className="text-slate-500 text-xs mt-0.5">ID: {user.id}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Статистика</p>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3">
              <p className="text-xl mb-1">{s.emoji}</p>
              <p className="text-white font-bold text-sm">{s.value}</p>
              <p className="text-slate-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banners */}
      <div className="flex flex-col gap-3 mb-5">
        <button
          onClick={() => { haptic?.impact('medium'); onSetup?.(); }}
          className="w-full bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/40 rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-600/40 flex items-center justify-center flex-shrink-0 text-xl">
            🚀
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">Запустить в Telegram</p>
            <p className="text-violet-300 text-xs">Инструкция по настройке бота</p>
          </div>
          <span className="text-violet-400 text-lg">›</span>
        </button>

        <button
          onClick={() => { haptic?.impact('medium'); onDeploy?.(); }}
          className="w-full bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-blue-500/40 rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600/40 flex items-center justify-center flex-shrink-0 text-xl">
            🌐
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">Деплой на GitHub Pages</p>
            <p className="text-blue-300 text-xs">Пошаговый гайд + настройка BotFather</p>
          </div>
          <span className="text-blue-400 text-lg">›</span>
        </button>
      </div>

      {/* Menu */}
      <div className="mb-5">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Информация</p>
        <div className="flex flex-col gap-2">
          {menuLinks.map(link => (
            <button
              key={link.label}
              onClick={link.onClick}
              className={`flex items-center gap-3 p-4 rounded-2xl text-left w-full transition-all active:scale-95 ${
                link.highlight
                  ? 'bg-violet-600/20 border border-violet-500/40'
                  : 'bg-slate-800/60 border border-slate-700/50 active:bg-slate-700/60'
              }`}
            >
              <span className="text-xl">{link.emoji}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${link.highlight ? 'text-violet-300' : 'text-white'}`}>{link.label}</p>
                <p className="text-slate-500 text-xs">{link.desc}</p>
              </div>
              <span className={link.highlight ? 'text-violet-400' : 'text-slate-600'}>›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Опасная зона</p>
        {showConfirm ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <p className="text-red-300 text-sm font-medium mb-1">Удалить все данные?</p>
            <p className="text-slate-400 text-xs mb-3">Все транзакции будут удалены без возможности восстановления.</p>
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold"
              >
                Да, удалить всё
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setShowConfirm(true); haptic?.impact('medium'); }}
            className="w-full py-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-sm font-semibold transition-all active:bg-red-500/20"
          >
            🗑️ Очистить все данные
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-slate-600 text-xs">Finance Tracker © 2024</p>
        <p className="text-slate-700 text-xs">Telegram Mini App</p>
      </div>
    </div>
  );
};

export default Settings;
