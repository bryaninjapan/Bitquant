import React, { useRef } from 'react';
import { MarketData, Trend } from '../types';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../contexts/LanguageContext';

interface InputCardProps {
  data: MarketData;
  onChange: (data: MarketData) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export const InputCard: React.FC<InputCardProps> = ({ data, onChange, onAnalyze, loading }) => {
  const { t } = useLanguage();
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef7 = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof MarketData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'heatmapImage1Day' | 'heatmapImage7Day') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (field: 'heatmapImage1Day' | 'heatmapImage7Day') => {
    handleChange(field, undefined);
    if (field === 'heatmapImage1Day' && fileInputRef1.current) fileInputRef1.current.value = '';
    if (field === 'heatmapImage7Day' && fileInputRef7.current) fileInputRef7.current.value = '';
  };

  const isFormValid = data.currentPrice > 0 && data.targetPrice > 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-trade-accent to-purple-600"></div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-gray-400" />
          {t.inputTitle}
        </h2>
        <span className="text-xs font-mono text-gray-500">{t.inputSubtitle}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Price Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">{t.currentPrice}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={data.currentPrice || ''}
                onChange={(e) => handleChange('currentPrice', parseFloat(e.target.value))}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 pl-8 pr-4 text-white font-mono focus:ring-2 focus:ring-trade-accent focus:border-transparent outline-none transition-all"
                placeholder="例如: 94000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">{t.targetPrice}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={data.targetPrice || ''}
                onChange={(e) => handleChange('targetPrice', parseFloat(e.target.value))}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 pl-8 pr-4 text-white font-mono focus:ring-2 focus:ring-trade-accent focus:border-transparent outline-none transition-all"
                placeholder="例如: 96500"
              />
            </div>
            {data.currentPrice > 0 && data.targetPrice > 0 && (
               <div className={`mt-2 text-xs font-mono flex items-center gap-1 ${data.targetPrice > data.currentPrice ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {data.targetPrice > data.currentPrice ? <ArrowTrendingUpIcon className="w-3 h-3"/> : <ArrowTrendingDownIcon className="w-3 h-3"/>}
                 {t.distance} {(Math.abs((data.targetPrice - data.currentPrice) / data.currentPrice * 100)).toFixed(2)}%
               </div>
            )}
          </div>
        </div>

        {/* Structure Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">{t.weeklyStructure}</label>
            <select
              value={data.weeklyStructure}
              onChange={(e) => handleChange('weeklyStructure', e.target.value as Trend)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2.5 px-4 text-white font-sans focus:ring-2 focus:ring-trade-accent outline-none"
            >
              <option value={Trend.Bullish}>{t.trends.Bullish}</option>
              <option value={Trend.Bearish}>{t.trends.Bearish}</option>
              <option value={Trend.RangeBound}>{t.trends.RangeBound}</option>
              <option value={Trend.Choppy}>{t.trends.Choppy}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">{t.fundingRate}</label>
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
            <p className="text-[10px] text-gray-500 mt-1">{t.fundingRateHint}</p>
          </div>
        </div>

        {/* Coinglass / Heatmap Section */}
        <div className="md:col-span-2 space-y-4 border-t border-gray-800 pt-4 mt-2">
            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <PhotoIcon className="w-4 h-4 text-trade-accent"/>
                {t.coinglassTitle}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1 Day Heatmap */}
                <div className="space-y-2">
                    <label className="block text-xs font-mono text-gray-400">{t.heatmap1Day}</label>
                    
                    {!data.heatmapImage1Day ? (
                        <div 
                            onClick={() => fileInputRef1.current?.click()}
                            className="w-full h-32 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-trade-accent hover:bg-gray-800/50 transition-colors group"
                        >
                            <PhotoIcon className="w-8 h-8 text-gray-600 group-hover:text-trade-accent mb-2"/>
                            <span className="text-xs text-gray-500 group-hover:text-gray-300">{t.uploadPlaceholder}</span>
                            <input 
                                ref={fileInputRef1}
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleImageUpload(e, 'heatmapImage1Day')}
                            />
                        </div>
                    ) : (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-700 group">
                            <img src={data.heatmapImage1Day} alt="1 Day Heatmap" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    onClick={() => clearImage('heatmapImage1Day')}
                                    className="p-1 bg-red-500/80 rounded-full text-white hover:bg-red-600"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <textarea
                        value={data.heatmap1DayContext}
                        onChange={(e) => handleChange('heatmap1DayContext', e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-300 h-16 focus:ring-2 focus:ring-trade-accent outline-none resize-none"
                        placeholder={t.contextPlaceholder}
                    />
                </div>

                {/* 7 Day Heatmap */}
                <div className="space-y-2">
                    <label className="block text-xs font-mono text-gray-400">{t.heatmap7Day}</label>
                    
                    {!data.heatmapImage7Day ? (
                        <div 
                            onClick={() => fileInputRef7.current?.click()}
                            className="w-full h-32 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-trade-accent hover:bg-gray-800/50 transition-colors group"
                        >
                            <PhotoIcon className="w-8 h-8 text-gray-600 group-hover:text-trade-accent mb-2"/>
                            <span className="text-xs text-gray-500 group-hover:text-gray-300">{t.uploadPlaceholder}</span>
                            <input 
                                ref={fileInputRef7}
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleImageUpload(e, 'heatmapImage7Day')}
                            />
                        </div>
                    ) : (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-700 group">
                            <img src={data.heatmapImage7Day} alt="7 Day Heatmap" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    onClick={() => clearImage('heatmapImage7Day')}
                                    className="p-1 bg-red-500/80 rounded-full text-white hover:bg-red-600"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <textarea
                        value={data.heatmap7DayContext}
                        onChange={(e) => handleChange('heatmap7DayContext', e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-300 h-16 focus:ring-2 focus:ring-trade-accent outline-none resize-none"
                        placeholder={t.contextPlaceholder}
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
              {t.calculatingBtn}
            </>
          ) : (
            <>
              {t.calculateBtn}
            </>
          )}
        </button>
      </div>

    </div>
  );
};