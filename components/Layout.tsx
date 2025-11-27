import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, subtitle }) => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 selection:bg-trade-accent selection:text-white font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-trade-accent to-purple-600 flex items-center justify-center font-bold text-white font-mono">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              {t.appTitle}<span className="text-trade-accent">Quant</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-xs font-mono bg-gray-800 text-gray-400 border border-gray-700">
              {subtitle || t.appSubtitle}
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center bg-gray-900 rounded-lg p-1 border border-gray-700">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${language === 'en' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('zh-TW')}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${language === 'zh-TW' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  繁中
                </button>
             </div>
             <div className="hidden md:flex items-center text-xs text-gray-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                {t.systemOnline}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-600 font-mono">
          <p>{t.footerText}</p>
        </div>
      </footer>
    </div>
  );
};