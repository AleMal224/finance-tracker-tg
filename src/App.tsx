import { useState, useCallback } from 'react';
import { View, Transaction } from './types';
import { useTelegram } from './hooks/useTelegram';
import { useFinance } from './hooks/useFinance';
import SplashScreen from './components/SplashScreen';
import NavBar from './components/NavBar';
import Dashboard from './views/Dashboard';
import AddTransaction from './views/AddTransaction';
import Transactions from './views/Transactions';
import Analytics from './views/Analytics';
import Settings from './views/Settings';
import SetupGuide from './views/SetupGuide';
import DeployGuide from './views/DeployGuide';

export default function App() {
  const { user, isReady, haptic } = useTelegram();
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    getStats,
    getCategoryBreakdown,
    getDailyChart,
  } = useFinance(user?.id);

  const [view, setView] = useState<View>('dashboard');
  const [prevView, setPrevView] = useState<View>('settings');

  const stats = getStats();

  const handleAddTransaction = useCallback(
    (data: Omit<Transaction, 'id'>) => {
      addTransaction(data);
      setView('dashboard');
    },
    [addTransaction]
  );

  const handleClearAll = useCallback(() => {
    transactions.forEach(t => deleteTransaction(t.id));
  }, [transactions, deleteTransaction]);

  const handleNavigate = (v: View) => {
    haptic.impact('light');
    setPrevView(view);
    setView(v);
  };

  const handleOpenSetup = () => {
    haptic.impact('medium');
    setPrevView(view);
    setView('setup');
  };

  const handleOpenDeploy = () => {
    haptic.impact('medium');
    setPrevView(view);
    setView('deploy');
  };

  const handleBackFromOverlay = () => {
    haptic.impact('light');
    const back = (prevView && !['setup', 'deploy'].includes(prevView)) ? prevView : 'settings';
    setView(back as View);
  };

  if (!isReady) return <SplashScreen />;

  const isOverlay = view === 'setup' || view === 'deploy';

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            transactions={transactions}
            stats={stats}
            onNavigate={(v) => handleNavigate(v as View)}
          />
        );
      case 'add':
        return (
          <AddTransaction
            onAdd={handleAddTransaction}
            haptic={haptic}
          />
        );
      case 'transactions':
        return (
          <Transactions
            transactions={transactions}
            onDelete={deleteTransaction}
            haptic={haptic}
          />
        );
      case 'analytics':
        return (
          <Analytics
            transactions={transactions}
            getDailyChart={getDailyChart}
            getCategoryBreakdown={getCategoryBreakdown}
            stats={stats}
          />
        );
      case 'settings':
        return (
          <Settings
            user={user}
            transactions={transactions}
            onClearAll={handleClearAll}
            onSetup={handleOpenSetup}
            onDeploy={handleOpenDeploy}
            haptic={haptic}
          />
        );
      case 'setup':
        return <SetupGuide />;
      case 'deploy':
        return <DeployGuide />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      <div className="max-w-md mx-auto relative min-h-screen">
        {/* Back button for overlay screens */}
        {isOverlay && (
          <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center gap-3">
            <button
              onClick={handleBackFromOverlay}
              className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-all active:scale-90"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div>
              <p className="text-white text-sm font-semibold">
                {view === 'deploy' ? 'Деплой на GitHub Pages' : 'Инструкция по запуску'}
              </p>
              <p className="text-slate-400 text-xs">
                {view === 'deploy' ? 'Пошаговый гайд' : 'Telegram Mini App'}
              </p>
            </div>
            <div className="ml-auto">
              <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
                view === 'deploy'
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500/30'
                  : 'bg-violet-600/30 text-violet-300 border-violet-500/30'
              }`}>
                {view === 'deploy' ? '7 шагов' : '5 шагов'}
              </span>
            </div>
          </div>
        )}

        <main className="relative overflow-y-auto" style={{ minHeight: '100dvh' }}>
          {renderView()}
        </main>

        {/* Hide NavBar on overlay screens */}
        {!isOverlay && <NavBar active={view} onChange={handleNavigate} />}
      </div>
    </div>
  );
}
