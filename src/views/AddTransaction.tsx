import React, { useState } from 'react';
import { TransactionType, Category } from '../types';
import { CATEGORY_CONFIG, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categoryConfig';

interface AddTransactionProps {
  onAdd: (data: { type: TransactionType; amount: number; category: Category; description: string; date: string; currency: string }) => void;
  haptic?: { impact: (s?: 'light' | 'medium' | 'heavy') => void; notification: (t: 'success' | 'error' | 'warning') => void };
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAdd, haptic }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    setCategory(t === 'income' ? 'salary' : 'food');
    haptic?.impact('light');
  };

  const handleSubmit = () => {
    const parsed = parseFloat(amount.replace(',', '.'));
    if (!parsed || parsed <= 0) return;
    haptic?.notification('success');
    onAdd({
      type,
      amount: parsed,
      category,
      description: description.trim(),
      date: new Date().toISOString(),
      currency: 'RUB',
    });
    setAmount('');
    setDescription('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const numPad = ['1','2','3','4','5','6','7','8','9','.','0','⌫'];

  const handleNumPad = (key: string) => {
    haptic?.impact('light');
    if (key === '⌫') {
      setAmount(prev => prev.slice(0, -1));
    } else if (key === '.' && amount.includes('.')) {
      return;
    } else {
      if (amount.length >= 10) return;
      setAmount(prev => prev + key);
    }
  };

  const formatDisplay = (val: string) => {
    if (!val) return '0';
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    return val.endsWith('.') ? val : new Intl.NumberFormat('ru-RU').format(num) + (val.includes('.') ? val.slice(val.indexOf('.')) : '');
  };

  return (
    <div className="flex flex-col h-full pb-24">
      {/* Header */}
      <div className="p-4 pt-6">
        <h2 className="text-white text-xl font-bold">Новая операция</h2>
      </div>

      {/* Type Toggle */}
      <div className="mx-4 mb-4 flex bg-slate-800 rounded-2xl p-1">
        {(['expense', 'income'] as TransactionType[]).map(t => (
          <button
            key={t}
            onClick={() => handleTypeChange(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              type === t
                ? t === 'expense'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-emerald-500 text-white shadow-lg'
                : 'text-slate-400'
            }`}
          >
            {t === 'expense' ? '💸 Расход' : '💰 Доход'}
          </button>
        ))}
      </div>

      {/* Amount Display */}
      <div className={`mx-4 mb-4 p-4 rounded-2xl text-center border-2 transition-all ${
        type === 'expense' ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'
      }`}>
        <p className="text-slate-400 text-xs mb-1">Сумма (₽)</p>
        <p className={`text-4xl font-bold ${type === 'expense' ? 'text-red-400' : 'text-emerald-400'}`}>
          {formatDisplay(amount)} ₽
        </p>
      </div>

      {/* Categories */}
      <div className="mx-4 mb-3">
        <p className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">Категория</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const cfg = CATEGORY_CONFIG[cat];
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => { setCategory(cat); haptic?.impact('light'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                  isSelected
                    ? 'text-white border-transparent'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                style={isSelected ? { backgroundColor: cfg.color, borderColor: cfg.color } : {}}
              >
                <span>{cfg.emoji}</span>
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div className="mx-4 mb-3">
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Описание (необязательно)"
          maxLength={60}
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      {/* Numpad */}
      <div className="mx-4 grid grid-cols-3 gap-2 mb-3">
        {numPad.map(key => (
          <button
            key={key}
            onClick={() => handleNumPad(key)}
            className={`py-3 rounded-2xl text-xl font-semibold transition-all active:scale-95 ${
              key === '⌫'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Submit */}
      <div className="mx-4">
        <button
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) <= 0}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg ${
            success
              ? 'bg-emerald-500 text-white shadow-emerald-500/40'
              : type === 'expense'
              ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/40 disabled:opacity-40'
              : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/40 disabled:opacity-40'
          }`}
        >
          {success ? '✅ Добавлено!' : type === 'expense' ? 'Добавить расход' : 'Добавить доход'}
        </button>
      </div>
    </div>
  );
};

export default AddTransaction;
