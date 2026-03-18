import React from 'react';

const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
          <span className="text-4xl">💰</span>
        </div>
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 animate-ping opacity-20" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Finance Tracker</h1>
        <p className="text-slate-400 text-sm mt-1">Загрузка...</p>
      </div>
      <div className="flex gap-1 mt-4">
        {[0,1,2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default SplashScreen;
