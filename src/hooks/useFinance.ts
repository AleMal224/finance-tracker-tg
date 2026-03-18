import { useState, useCallback, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const STORAGE_KEY = 'tg_finance_transactions';

const generateId = () => `txn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: generateId(), type: 'income', amount: 85000, category: 'salary', description: 'Зарплата за ноябрь', date: new Date(Date.now() - 86400000 * 2).toISOString(), currency: 'RUB' },
  { id: generateId(), type: 'expense', amount: 3200, category: 'food', description: 'Продукты в Пятёрочке', date: new Date(Date.now() - 86400000 * 1).toISOString(), currency: 'RUB' },
  { id: generateId(), type: 'expense', amount: 1800, category: 'transport', description: 'Такси + метро', date: new Date(Date.now() - 86400000 * 1).toISOString(), currency: 'RUB' },
  { id: generateId(), type: 'expense', amount: 15000, category: 'housing', description: 'Коммунальные платежи', date: new Date(Date.now() - 86400000 * 3).toISOString(), currency: 'RUB' },
  { id: generateId(), type: 'income', amount: 12000, category: 'freelance', description: 'Фриланс проект', date: new Date(Date.now() - 86400000 * 4).toISOString(), currency: 'RUB' },
  { id: generateId(), type: 'expense', amount: 4500, category: 'entertainment', description: 'Кино + ресторан', date: new Date(Date.now() - 86400000 * 5).toISOString(), currency: 'RUB' },
  { id: generateId(), type: 'expense', amount: 2100, category: 'health', description: 'Аптека', date: new Date(Date.now() - 86400000 * 6).toISOString(), currency: 'RUB' },
  { id: generateId(), type: 'expense', amount: 8900, category: 'shopping', description: 'Одежда', date: new Date(Date.now() - 86400000 * 7).toISOString(), currency: 'RUB' },
  { id: generateId(), type: 'income', amount: 5000, category: 'gift', description: 'Подарок от родителей', date: new Date(Date.now() - 86400000 * 8).toISOString(), currency: 'RUB' },
  { id: generateId(), type: 'expense', amount: 3600, category: 'education', description: 'Курс по Python', date: new Date(Date.now() - 86400000 * 9).toISOString(), currency: 'RUB' },
  { id: generateId(), type: 'expense', amount: 1200, category: 'food', description: 'Обед на работе', date: new Date(Date.now() - 86400000 * 10).toISOString(), currency: 'RUB' },
  { id: generateId(), type: 'income', amount: 25000, category: 'investment', description: 'Дивиденды', date: new Date(Date.now() - 86400000 * 12).toISOString(), currency: 'RUB' },
];

export const useFinance = (userId?: number) => {
  const storageKey = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch {}
    return SAMPLE_TRANSACTIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(transactions));
    } catch {}
  }, [transactions, storageKey]);

  const addTransaction = useCallback((data: Omit<Transaction, 'id'>) => {
    const txn: Transaction = { ...data, id: generateId() };
    setTransactions(prev => [txn, ...prev]);
    return txn;
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const getStats = useCallback(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const thisMonth = transactions.filter(t =>
      isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd })
    );

    const totalIncome = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance, thisMonth };
  }, [transactions]);

  const getCategoryBreakdown = useCallback((type: TransactionType, days = 30) => {
    const cutoff = subDays(new Date(), days);
    const filtered = transactions.filter(
      t => t.type === type && parseISO(t.date) >= cutoff
    );

    const map: Record<string, number> = {};
    filtered.forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

    return Object.entries(map)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const getDailyChart = useCallback((days = 14) => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const dayStr = format(day, 'dd.MM');
      const dayTxns = transactions.filter(
        t => format(parseISO(t.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      const income = dayTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = dayTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      result.push({ date: dayStr, income, expense });
    }
    return result;
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    getStats,
    getCategoryBreakdown,
    getDailyChart,
  };
};
