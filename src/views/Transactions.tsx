import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_CONFIG, formatCurrency } from '../utils/categoryConfig';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TransactionsProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  haptic?: { impact: (s?: 'light' | 'medium' | 'heavy') => void; notification: (t: 'success' | 'error' | 'warning') => void };
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onDelete, haptic }) => {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

  // Group by date
  const groups: Record<string, Transaction[]> = {};
  filtered.forEach(txn => {
    const key = format(parseISO(txn.date), 'yyyy-MM-dd');
    if (!groups[key]) groups[key] = [];
    groups[key].push(txn);
  });
  const sortedKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  const handleDelete = (id: string) => {
    haptic?.notification('warning');
    onDelete(id);
    setDeleteId(null);
  };

  const formatGroupDate = (key: string) => {
    const d = new Date(key);
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
    if (key === today) return 'Сегодня';
    if (key === yesterday) return 'Вчера';
    return format(d, 'd MMMM yyyy', { locale: ru });
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="p-4 pt-6">
        <h2 className="text-white text-xl font-bold mb-4">История операций</h2>

        {/* Filter Tabs */}
        <div className="flex bg-slate-800 rounded-2xl p-1 gap-1">
          {[
            { val: 'all', label: 'Все' },
            { val: 'income', label: '↑ Доходы' },
            { val: 'expense', label: '↓ Расходы' },
          ].map(f => (
            <button
              key={f.val}
              onClick={() => { setFilter(f.val as 'all' | TransactionType); haptic?.impact('light'); }}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.val
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions grouped */}
      <div className="px-4 flex flex-col gap-4">
        {sortedKeys.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">🗂️</p>
            <p>Нет операций</p>
          </div>
        )}

        {sortedKeys.map(key => {
          const dayTotal = groups[key].reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{formatGroupDate(key)}</p>
                <p className={`text-xs font-semibold ${dayTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {dayTotal >= 0 ? '+' : ''}{formatCurrency(dayTotal)}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {groups[key].map(txn => {
                  const cfg = CATEGORY_CONFIG[txn.category];
                  const isIncome = txn.type === 'income';
                  const isDeleting = deleteId === txn.id;

                  return (
                    <div
                      key={txn.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                        isDeleting
                          ? 'bg-red-500/10 border-red-500/30'
                          : 'bg-slate-800/60 border-slate-700/50'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: cfg.color + '22' }}
                      >
                        {cfg.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {txn.description || cfg.label}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {cfg.label} · {format(parseISO(txn.date), 'HH:mm')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p className={`font-bold text-sm ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(txn.amount)}
                        </p>
                        {isDeleting ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDelete(txn.id)}
                              className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-lg"
                            >
                              Удалить
                            </button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-lg"
                            >
                              Отмена
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteId(txn.id)}
                            className="text-slate-600 hover:text-red-400 text-xs transition-colors"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transactions;
