import { AnalysisResult, MarketData, AssetType, SavedResult } from '../types';

const STORAGE_KEY = 'bitquant_history';
const MAX_RESULTS = 20;

/**
 * 获取所有保存的历史记录
 */
export const getSavedResults = (): SavedResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const results: SavedResult[] = JSON.parse(stored);
    // 按时间戳降序排列（最新的在前）
    return results.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to load saved results:', error);
    return [];
  }
};

/**
 * 保存新的预测结果
 */
export const saveResult = (
  asset: AssetType,
  marketData: MarketData,
  result: AnalysisResult
): void => {
  try {
    const results = getSavedResults();
    
    // 创建新的保存记录
    const newResult: SavedResult = {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      asset,
      marketData,
      result
    };
    
    // 添加到数组开头
    results.unshift(newResult);
    
    // 只保留最新的 MAX_RESULTS 条
    const trimmedResults = results.slice(0, MAX_RESULTS);
    
    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedResults));
  } catch (error) {
    console.error('Failed to save result:', error);
    // 如果存储空间不足，尝试删除最旧的记录
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      const results = getSavedResults();
      if (results.length > 0) {
        // 删除最旧的记录
        results.pop();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
        // 重试保存
        saveResult(asset, marketData, result);
      }
    }
  }
};

/**
 * 删除指定的历史记录
 */
export const deleteResult = (id: string): void => {
  try {
    const results = getSavedResults();
    const filtered = results.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete result:', error);
  }
};

/**
 * 清空所有历史记录
 */
export const clearAllResults = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear results:', error);
  }
};

/**
 * 导出所有历史记录为 JSON 文件
 */
export const exportResults = (): void => {
  try {
    const results = getSavedResults();
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bitquant_history_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export results:', error);
    throw error;
  }
};

/**
 * 获取历史记录数量
 */
export const getResultCount = (): number => {
  return getSavedResults().length;
};

