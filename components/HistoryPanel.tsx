import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getSavedResults, deleteResult, clearAllResults, exportResults, getResultCount } from '../utils/storage';
import { SavedResult } from '../types';
import { TrashIcon, ArrowDownTrayIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult?: (result: SavedResult) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onSelectResult }) => {
  const { t } = useLanguage();
  const [results, setResults] = useState<SavedResult[]>([]);
  const [count, setCount] = useState(0);

  const loadResults = () => {
    const saved = getSavedResults();
    setResults(saved);
    setCount(getResultCount());
  };

  useEffect(() => {
    if (isOpen) {
      loadResults();
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    if (window.confirm(t.historyDelete + '?')) {
      deleteResult(id);
      loadResults();
    }
  };

  const handleClearAll = () => {
    if (window.confirm(t.historyClear + '?')) {
      clearAllResults();
      loadResults();
    }
  };

  const handleExport = () => {
    try {
      exportResults();
      alert(t.historyExport + ' ' + t.historySaved);
    } catch (error) {
      alert('Export failed: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 75) return 'text-emerald-500';
    if (prob >= 50) return 'text-trade-accent';
    if (prob >= 30) return 'text-amber-500';
    return 'text-rose-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-6 h-6 text-trade-accent" />
            <h2 className="text-xl font-bold text-white">{t.historyTitle}</h2>
            <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">
              {count} / 20
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              disabled={count === 0}
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              {t.historyExport}
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-rose-400 bg-rose-950/20 hover:bg-rose-950/40 rounded-lg transition-colors"
              disabled={count === 0}
            >
              {t.historyClear}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ClockIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">{t.historyEmpty}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-gray-950 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 text-xs font-bold font-mono bg-gray-800 text-gray-300 rounded">
                          {result.asset}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {formatDate(result.timestamp)}
                        </span>
                        <span className={`text-lg font-bold font-mono ${getProbabilityColor(result.result.probability)}`}>
                          {result.result.probability}%
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          result.result.sentiment === 'Bullish' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : result.result.sentiment === 'Bearish'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-gray-700/30 text-gray-400'
                        }`}>
                          {result.result.sentiment}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">
                        <span className="font-mono">${result.marketData.currentPrice}</span>
                        {' → '}
                        <span className="font-mono">${result.marketData.targetPrice}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {result.result.rationale}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {onSelectResult && (
                        <button
                          onClick={() => {
                            onSelectResult(result);
                            onClose();
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-trade-accent bg-trade-accent/10 hover:bg-trade-accent/20 rounded transition-colors"
                        >
                          {t.historyView}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(result.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 rounded transition-colors"
                        title={t.historyDelete}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

