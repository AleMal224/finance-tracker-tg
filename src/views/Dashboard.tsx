import React from 'react';
import { Transaction, TelegramUser } from '../types';
import { CATEGORY_CONFIG, formatCurrency } from '../utils/categoryConfig';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DashboardProps {
  user: TelegramUser | null;
  transactions: Transaction[];
  stats: { totalIncome: number; totalExpense: number; balance: number };
  onNavigate: (view: 'add' | 'transactions' | 'analytics') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions, stats, onNavigate }) => {
  const recent = transactions.slice(0, 5);
  const balancePositive = stats.balance >= 0;

  const displayName = user
    ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
    : 'Пользователь';

  const avatar = user?.photo_url ? (
    <img src={user.photo_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
      {user?.first_name?.[0] || '?'}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-slate-400 text-sm">Добро пожаловать 👋</p>
          <h2 className="text-white font-bold text-lg leading-tight">{displayName}</h2>
          {user?.username && <p className="text-slate-500 text-xs">@{user.username}</p>}
        </div>
        {avatar}
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-5 shadow-2xl shadow-violet-500/30">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-4 w-40 h-40 rounded-full bg-white/5" />
        <p className="text-violet-200 text-sm font-medium mb-1">Баланс за месяц</p>
        <p className={`text-4xl font-bold text-white mb-4`}>
          {formatCurrency(stats.balance)}
        </p>
        <div className="flex gap-6">
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              <span className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center text-xs">↑</span>
              <span className="text-violet-200 text-xs">Доходы</span>
            </div>
            <p className="text-white font-semibold">{formatCurrency(stats.totalIncome)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              <span className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center text-xs">↓</span>
              <span className="text-violet-200 text-xs">Расходы</span>
            </div>
            <p className="text-white font-semibold">{formatCurrency(stats.totalExpense)}</p>
          </div>
        </div>
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-bold ${balancePositive ? 'bg-emerald-500/30 text-emerald-300' : 'bg-red-500/30 text-red-300'}`}>
          {balancePositive ? '▲' : '▼'} {balancePositive ? 'Профицит' : 'Дефицит'}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Расход', emoji: '💸', color: 'from-red-500/20 to-rose-600/20 border-red-500/20', action: () => onNavigate('add') },
          { label: 'Доход', emoji: '💰', color: 'from-emerald-500/20 to-green-600/20 border-emerald-500/20', action: () => onNavigate('add') },
          { label: 'Аналитика', emoji: '📊', color: 'from-blue-500/20 to-indigo-600/20 border-blue-500/20', action: () => onNavigate('analytics') },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl bg-gradient-to-br ${item.color} border transition-all active:scale-95`}
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-slate-300 text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Последние операции</h3>
          <button onClick={() => onNavigate('transactions')} className="text-violet-400 text-sm font-medium">
            Все →
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm">Нет операций. Добавьте первую!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map(txn => {
              const cfg = CATEGORY_CONFIG[txn.category];
              const isIncome = txn.type === 'income';
              return (
                <div key={txn.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: cfg.color + '22' }}
                  >
                    {cfg.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{txn.description || cfg.label}</p>
                    <p className="text-slate-500 text-xs">
                      {format(parseISO(txn.date), 'd MMM, HH:mm', { locale: ru })}
                    </p>
                  </div>
                  <p className={`font-bold text-sm ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(txn.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
