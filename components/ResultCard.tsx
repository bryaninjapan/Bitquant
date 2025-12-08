import React, { useEffect, useState } from 'react';
import { AnalysisResult } from '../types';
import { ChartPieIcon, ShieldExclamationIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

interface ResultCardProps {
  result: AnalysisResult | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { t } = useLanguage();
  const [animatedProb, setAnimatedProb] = useState(0);

  useEffect(() => {
    if (result) {
      setAnimatedProb(0);
      let start = 0;
      const end = result.probability;
      const duration = 1000;
      const incrementTime = 20;
      const step = end / (duration / incrementTime);

      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setAnimatedProb(end);
          clearInterval(timer);
        } else {
          setAnimatedProb(Math.floor(start));
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [result]);

  if (!result) {
    return (
      <div className="h-full bg-gray-900 border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center text-gray-600 border-dashed">
        <ChartPieIcon className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="text-lg font-medium">{t.waitingTitle}</h3>
        <p className="text-sm max-w-xs mt-2">{t.waitingDesc}</p>
      </div>
    );
  }

  const getProbabilityColor = (prob: number) => {
    if (prob >= 75) return 'text-emerald-500';
    if (prob >= 50) return 'text-trade-accent';
    if (prob >= 30) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full animate-fade-in">
       {/* Top Status Bar */}
       <div className="bg-gray-950 px-6 py-3 border-b border-gray-800 flex justify-between items-center">
         <div className="flex items-center gap-2">
           <span className="text-xs font-mono text-gray-500">{t.outputGenerated}</span>
           <span className="text-[10px] text-emerald-400 font-mono">✓ {t.historySaved}</span>
         </div>
         <span className={`text-xs font-bold px-2 py-1 rounded ${result.sentiment === 'Bullish' ? 'bg-emerald-500/10 text-emerald-500' : result.sentiment === 'Bearish' ? 'bg-rose-500/10 text-rose-500' : 'bg-gray-700/30 text-gray-400'}`}>
            {t.sentiment}: {result.sentiment.toUpperCase()}
         </span>
       </div>

       <div className="p-6 space-y-8">
         
         {/* Probability Meter */}
         <div className="text-center">
            <h3 className="text-sm font-mono text-gray-400 mb-2">{t.probability}</h3>
            <div className="relative inline-flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-800"
                    />
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 - (animatedProb / 100) * (2 * Math.PI * 88)}
                        className={`${getProbabilityColor(result.probability)} transition-all duration-1000 ease-out`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className={`text-5xl font-bold font-mono ${getProbabilityColor(animatedProb)}`}>
                        {animatedProb}%
                    </span>
                </div>
            </div>
         </div>

         {/* Rationale */}
         <div className="bg-gray-950 rounded-lg p-5 border border-gray-800/50">
            <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <ListBulletIcon className="w-4 h-4 text-trade-accent"/>
                {t.rationale}
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
                {result.rationale}
            </p>
         </div>

         {/* Two columns: Risks & Key Levels */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-rose-950/10 border border-rose-900/20 rounded-lg p-4">
                <h4 className="text-xs font-bold text-rose-400 mb-3 uppercase flex items-center gap-2">
                    <ShieldExclamationIcon className="w-4 h-4"/>
                    {t.risks}
                </h4>
                <ul className="space-y-2">
                    {result.riskFactors.map((risk, i) => (
                        <li key={i} className="text-xs text-gray-400 pl-3 border-l-2 border-rose-800">
                            {risk}
                        </li>
                    ))}
                </ul>
             </div>

             <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                <h4 className="text-xs font-bold text-gray-300 mb-3 uppercase">{t.keyLevels}</h4>
                <ul className="space-y-2">
                    {result.keyLevels.map((level, i) => (
                        <li key={i} className="text-xs font-mono text-trade-accent bg-gray-900 py-1 px-2 rounded">
                            {level}
                        </li>
                    ))}
                </ul>
             </div>
         </div>

       </div>
    </div>
  );
};