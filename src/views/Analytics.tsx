import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_CONFIG, formatCurrency, CHART_COLORS } from '../utils/categoryConfig';

interface AnalyticsProps {
  transactions: Transaction[];
  getDailyChart: (days?: number) => { date: string; income: number; expense: number }[];
  getCategoryBreakdown: (type: TransactionType, days?: number) => { category: string; amount: number }[];
  stats: { totalIncome: number; totalExpense: number; balance: number };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name === 'income' ? 'Доход: ' : 'Расход: '}{formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

const Analytics: React.FC<AnalyticsProps> = ({ transactions, getDailyChart, getCategoryBreakdown, stats }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'expense'>('overview');
  const [period, setPeriod] = useState<7 | 14 | 30>(14);

  const dailyData = getDailyChart(period);
  const incomeBreakdown = getCategoryBreakdown('income', 30);
  const expenseBreakdown = getCategoryBreakdown('expense', 30);

  const savingsRate = stats.totalIncome > 0
    ? Math.round((stats.balance / stats.totalIncome) * 100)
    : 0;

  const totalTxns = transactions.length;
  const avgExpense = expenseBreakdown.reduce((s, c) => s + c.amount, 0) / (expenseBreakdown.length || 1);

  return (
    <div className="flex flex-col pb-28 p-4">
      <h2 className="text-white text-xl font-bold mb-4 pt-2">Аналитика</h2>

      {/* Period Selector */}
      <div className="flex bg-slate-800 rounded-2xl p-1 gap-1 mb-4">
        {([7, 14, 30] as const).map(d => (
          <button
            key={d}
            onClick={() => setPeriod(d)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              period === d ? 'bg-violet-600 text-white' : 'text-slate-400'
            }`}
          >
            {d} дней
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Норма сбережений', value: `${savingsRate}%`, color: savingsRate >= 0 ? 'emerald' : 'red', emoji: '📊' },
          { label: 'Транзакций', value: totalTxns.toString(), color: 'violet', emoji: '🔄' },
          { label: 'Ср. расход/кат.', value: formatCurrency(avgExpense), color: 'orange', emoji: '📉' },
          { label: 'Категорий трат', value: expenseBreakdown.length.toString(), color: 'blue', emoji: '🗂️' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3">
            <p className="text-xl mb-1">{kpi.emoji}</p>
            <p className={`text-lg font-bold text-${kpi.color}-400`}>{kpi.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Selector */}
      <div className="flex bg-slate-800 rounded-2xl p-1 gap-1 mb-4">
        {[
          { val: 'overview', label: '📈 Обзор' },
          { val: 'expense', label: '💸 Расходы' },
          { val: 'income', label: '💰 Доходы' },
        ].map(tab => (
          <button
            key={tab.val}
            onClick={() => setActiveTab(tab.val as 'overview' | 'income' | 'expense')}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === tab.val ? 'bg-slate-600 text-white' : 'text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-4">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
            <p className="text-slate-400 text-sm font-medium mb-3">Доходы vs Расходы</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={dailyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.floor(period / 7)} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" stroke="#22c55e" fill="url(#incomeGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
            <p className="text-slate-400 text-sm font-medium mb-3">Дневные операции</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={dailyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }} barCategoryGap="30%">
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.floor(period / 7)} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Expense Tab */}
      {activeTab === 'expense' && (
        <div className="flex flex-col gap-4">
          {expenseBreakdown.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-3xl mb-2">📊</p>
              <p>Нет данных о расходах</p>
            </div>
          ) : (
            <>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
                <p className="text-slate-400 text-sm font-medium mb-3">Структура расходов</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={entry.category} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <CategoryList data={expenseBreakdown} total={stats.totalExpense} />
            </>
          )}
        </div>
      )}

      {/* Income Tab */}
      {activeTab === 'income' && (
        <div className="flex flex-col gap-4">
          {incomeBreakdown.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-3xl mb-2">📊</p>
              <p>Нет данных о доходах</p>
            </div>
          ) : (
            <>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
                <p className="text-slate-400 text-sm font-medium mb-3">Источники доходов</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={incomeBreakdown}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {incomeBreakdown.map((entry, index) => (
                        <Cell key={entry.category} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <CategoryList data={incomeBreakdown} total={stats.totalIncome} isIncome />
            </>
          )}
        </div>
      )}
    </div>
  );
};

const CategoryList: React.FC<{
  data: { category: string; amount: number }[];
  total: number;
  isIncome?: boolean;
}> = ({ data, total, isIncome }) => (
  <div className="flex flex-col gap-2">
    {data.map((item, index) => {
      const cfg = CATEGORY_CONFIG[item.category as keyof typeof CATEGORY_CONFIG];
      const pct = total > 0 ? Math.round((item.amount / total) * 100) : 0;
      const color = CHART_COLORS[index % CHART_COLORS.length];
      return (
        <div key={item.category} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{cfg?.emoji || '📦'}</span>
              <span className="text-white text-sm font-medium">{cfg?.label || item.category}</span>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(item.amount)}
              </p>
              <p className="text-slate-500 text-xs">{pct}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: color }}
            />
          </div>
        </div>
      );
    })}
  </div>
);

export default Analytics;
