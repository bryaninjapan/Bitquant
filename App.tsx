import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputCard } from './components/InputCard';
import { ResultCard } from './components/ResultCard';
import { ApiKeyConfig } from './components/ApiKeyConfig';
import { MarketData, Trend, AnalysisResult, AssetType } from './types';
import { calculateProbability } from './services/geminiService';
import { useLanguage } from './contexts/LanguageContext';
import { saveResult } from './utils/storage';

const App: React.FC = () => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [asset, setAsset] = useState<AssetType>('BTC');
  
  // Default State
  const [marketData, setMarketData] = useState<MarketData>({
    currentPrice: 0,
    targetPrice: 0,
    fundingRate: 0.01,
    weeklyStructure: Trend.RangeBound,
    heatmap1DayContext: '',
    heatmap7DayContext: '',
    heatmapImage1Day: undefined,
    heatmapImage7Day: undefined,
    additionalNotes: ''
  });

  // Clear results and data when language or asset changes to avoid confusion
  useEffect(() => {
    setResult(null);
  }, [language, asset]);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await calculateProbability(marketData, language, asset);
      setResult(data);
      // 自动保存结果到本地存储
      saveResult(asset, marketData, data);
    } catch (error) {
      alert(t.errorAPI);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout subtitle={`${asset}-PERP ${t.appSubtitle}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Dashboard */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
           {/* API Key Configuration */}
           <ApiKeyConfig />
           
           <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg flex gap-3 items-start">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
             </svg>
             <div>
               <h4 className="text-blue-100 font-medium text-sm">{t.dataGuidanceTitle}</h4>
               <p className="text-blue-200/70 text-xs mt-1 leading-relaxed">
                 {t.dataGuidanceText}
               </p>
             </div>
           </div>

           <InputCard 
             data={marketData} 
             asset={asset}
             onAssetChange={setAsset}
             onChange={setMarketData} 
             onAnalyze={handleAnalyze}
             loading={loading}
           />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-5 xl:col-span-4 h-full">
           <ResultCard result={result} />
        </div>

      </div>
    </Layout>
  );
};

export default App;