import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
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
              Bit<span className="text-trade-accent">Quant</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-xs font-mono bg-gray-800 text-gray-400 border border-gray-700">
              BTC-PERP MODEL
            </span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center text-xs text-gray-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                SYSTEM ONLINE
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
          <p>POWERED BY GEMINI 2.5 FLASH • 僅供教育用途 • 非投資建議 (NOT FINANCIAL ADVICE)</p>
        </div>
      </footer>
    </div>
  );
};