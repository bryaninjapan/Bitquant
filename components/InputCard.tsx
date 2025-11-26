import React from 'react';
import { MarketData, Trend } from '../types';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface InputCardProps {
  data: MarketData;
  onChange: (data: MarketData) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export const InputCard: React.FC<InputCardProps> = ({ data, onChange, onAnalyze, loading }) => {
  
  const handleChange = (field: keyof MarketData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  const isFormValid = data.currentPrice > 0 && data.targetPrice > 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-trade-accent to-purple-600"></div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-gray-400" />
          Market Parameters
        </h2>
        <span className="text-xs font-mono text-gray-500">INPUT DATA SOURCE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Price Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">CURRENT PRICE (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={data.currentPrice || ''}
                onChange={(e) => handleChange('currentPrice', parseFloat(e.target.value))}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 pl-8 pr-4 text-white font-mono focus:ring-2 focus:ring-trade-accent focus:border-transparent outline-none transition-all"
                placeholder="e.g. 64200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">TARGET PRICE (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={data.targetPrice || ''}
                onChange={(e) => handleChange('targetPrice', parseFloat(e.target.value))}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 pl-8 pr-4 text-white font-mono focus:ring-2 focus:ring-trade-accent focus:border-transparent outline-none transition-all"
                placeholder="e.g. 65500"
              />
            </div>
            {data.currentPrice > 0 && data.targetPrice > 0 && (
               <div className={`mt-2 text-xs font-mono flex items-center gap-1 ${data.targetPrice > data.currentPrice ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {data.targetPrice > data.currentPrice ? <ArrowTrendingUpIcon className="w-3 h-3"/> : <ArrowTrendingDownIcon className="w-3 h-3"/>}
                 {(Math.abs((data.targetPrice - data.currentPrice) / data.currentPrice * 100)).toFixed(2)}% Distance
               </div>
            )}
          </div>
        </div>

        {/* Structure Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">WEEKLY STRUCTURE</label>
            <select
              value={data.weeklyStructure}
              onChange={(e) => handleChange('weeklyStructure', e.target.value as Trend)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 px-4 text-white font-sans focus:ring-2 focus:ring-trade-accent outline-none"
            >
              {Object.values(Trend).map((trend) => (
                <option key={trend} value={trend}>{trend}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">FUNDING RATE (%)</label>
            <div className="relative">
              <input
                type="number"
                step="0.0001"
                value={data.fundingRate}
                onChange={(e) => handleChange('fundingRate', parseFloat(e.target.value))}
                className={`w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 px-4 font-mono focus:ring-2 focus:ring-trade-accent outline-none ${data.fundingRate > 0.01 ? 'text-amber-400' : data.fundingRate < -0.01 ? 'text-emerald-400' : 'text-gray-300'}`}
                placeholder="0.0100"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Positive: Longs pay Shorts. Negative: Shorts pay Longs.</p>
          </div>
        </div>

        {/* Coinglass / Heatmap Section */}
        <div className="md:col-span-2 space-y-4 border-t border-gray-800 pt-4 mt-2">
            <h3 className="text-sm font-medium text-gray-300">Coinglass / Heatmap Context</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">1-DAY LIQUIDATION CLUSTERS</label>
                    <textarea
                        value={data.heatmap1DayContext}
                        onChange={(e) => handleChange('heatmap1DayContext', e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-300 h-24 focus:ring-2 focus:ring-trade-accent outline-none resize-none"
                        placeholder="Describe bright yellow zones (e.g. 'Heavy short liqs at 68.2k, nothing below until 62k')"
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">7-DAY LIQUIDATION CLUSTERS</label>
                    <textarea
                        value={data.heatmap7DayContext}
                        onChange={(e) => handleChange('heatmap7DayContext', e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-300 h-24 focus:ring-2 focus:ring-trade-accent outline-none resize-none"
                        placeholder="Describe weekly levels (e.g. 'Massive long liquidation wall at 59k')"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onAnalyze}
          disabled={loading || !isFormValid}
          className={`w-full py-4 rounded-lg font-bold tracking-wide transition-all duration-200 flex justify-center items-center gap-3
            ${loading 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : isFormValid 
                ? 'bg-trade-accent hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              RUNNING SIMULATION...
            </>
          ) : (
            <>
              CALCULATE PROBABILITY
            </>
          )}
        </button>
      </div>

    </div>
  );
};