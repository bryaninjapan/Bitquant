import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { KeyIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

interface ApiKeyConfigProps {
  onApiKeySet?: (apiKey: string) => void;
}

export const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onApiKeySet }) => {
  const { t } = useLanguage();
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    // 从 localStorage 读取保存的 API Key
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
      setIsValid(true);
      onApiKeySet?.(savedKey);
    } else {
      // 如果没有保存的 API Key，自动打开配置面板
      setIsOpen(true);
    }
  }, [onApiKeySet]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      setIsValid(true);
      setIsOpen(false);
      onApiKeySet?.(apiKey.trim());
      // 刷新页面以应用新的 API Key
      window.location.reload();
    }
  };

  const handleRemove = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setIsValid(null);
    setIsOpen(true);
    onApiKeySet?.('');
  };

  const handleChange = (value: string) => {
    setApiKey(value);
    setIsValid(value.trim().length > 0 ? null : false);
  };

  if (!isOpen && isValid) {
    return (
      <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
          <span className="text-sm text-emerald-300 font-mono">
            API Key 已配置
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs text-emerald-400 hover:text-emerald-300 underline"
        >
          修改
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-950/20 border border-amber-800/50 rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <ExclamationTriangleIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-amber-200 mb-1">
            需要配置 Gemini API Key
          </h4>
          <p className="text-xs text-amber-300/80 mb-3">
            为了使用 AI 分析功能，请在此输入你的 Gemini API Key。API Key 将保存在浏览器本地，不会上传到服务器。
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <KeyIcon className="w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="输入你的 Gemini API Key"
                className="flex-1 bg-gray-950 border border-gray-700 rounded-lg py-2 px-3 text-sm text-white font-mono focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                保存并应用
              </button>
              
              {localStorage.getItem(API_KEY_STORAGE_KEY) && (
                <button
                  onClick={handleRemove}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
                >
                  清除
                </button>
              )}
              
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:text-amber-300 underline ml-auto"
              >
                获取 API Key →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 导出获取 API Key 的函数
export const getApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  
  // 优先从 localStorage 读取
  const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (storedKey) return storedKey;
  
  // 如果没有，返回空字符串
  return '';
};

