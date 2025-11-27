import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { InputCard } from './components/InputCard';
import { ResultCard } from './components/ResultCard';
import { MarketData, Trend, AnalysisResult } from './types';
import { calculateProbability } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
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

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await calculateProbability(marketData);
      setResult(data);
    } catch (error) {
      alert("分析失敗，請檢查 API Key 或輸入數據。");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Dashboard */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
           <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg flex gap-3 items-start">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
             </svg>
             <div>
               <h4 className="text-blue-100 font-medium text-sm">數據指引 (Data Guidance)</h4>
               <p className="text-blue-200/70 text-xs mt-1 leading-relaxed">
                 為了獲得最佳效果，請上傳 <b>Coinglass 清算熱力圖 (Liquidation Heatmap)</b> 截圖。AI 將自動識別圖中亮黃色的高槓桿清算帶，這通常會像磁鐵一樣吸引價格。
               </p>
             </div>
           </div>

           <InputCard 
             data={marketData} 
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