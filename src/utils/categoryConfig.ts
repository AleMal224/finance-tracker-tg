import { Category, TransactionType } from '../types';

export interface CategoryConfig {
  label: string;
  emoji: string;
  color: string;
  type: TransactionType | 'both';
}

export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  salary: { label: 'Зарплата', emoji: '💼', color: '#22c55e', type: 'income' },
  freelance: { label: 'Фриланс', emoji: '💻', color: '#10b981', type: 'income' },
  investment: { label: 'Инвестиции', emoji: '📈', color: '#06b6d4', type: 'income' },
  gift: { label: 'Подарок', emoji: '🎁', color: '#a78bfa', type: 'income' },
  food: { label: 'Еда', emoji: '🍕', color: '#f97316', type: 'expense' },
  transport: { label: 'Транспорт', emoji: '🚗', color: '#3b82f6', type: 'expense' },
  housing: { label: 'Жильё', emoji: '🏠', color: '#8b5cf6', type: 'expense' },
  entertainment: { label: 'Развлечения', emoji: '🎮', color: '#ec4899', type: 'expense' },
  health: { label: 'Здоровье', emoji: '💊', color: '#ef4444', type: 'expense' },
  shopping: { label: 'Покупки', emoji: '🛍️', color: '#f59e0b', type: 'expense' },
  education: { label: 'Образование', emoji: '📚', color: '#14b8a6', type: 'expense' },
  other: { label: 'Другое', emoji: '📦', color: '#6b7280', type: 'both' },
};

export const INCOME_CATEGORIES: Category[] = ['salary', 'freelance', 'investment', 'gift', 'other'];
export const EXPENSE_CATEGORIES: Category[] = ['food', 'transport', 'housing', 'entertainment', 'health', 'shopping', 'education', 'other'];

export const formatCurrency = (amount: number, currency = 'RUB') => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const CHART_COLORS = [
  '#6366f1', '#22c55e', '#f97316', '#3b82f6', '#ec4899',
  '#a78bfa', '#10b981', '#f59e0b', '#ef4444', '#06b6d4',
  '#8b5cf6', '#6b7280',
];
