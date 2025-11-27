export enum Trend {
  Bullish = 'Bullish',
  Bearish = 'Bearish',
  RangeBound = 'Range Bound',
  Choppy = 'Choppy/Uncertain'
}

export enum TradeDirection {
  Long = 'Long',
  Short = 'Short'
}

export type Language = 'en' | 'zh-TW';

export type AssetType = 'BTC' | 'ETH' | 'ADA';

export interface MarketData {
  currentPrice: number;
  targetPrice: number;
  fundingRate: number; // In percentage, e.g., 0.01
  weeklyStructure: Trend;
  heatmap1DayContext: string; // Text description (optional if image provided)
  heatmap7DayContext: string; // Text description (optional if image provided)
  heatmapImage1Day?: string; // Base64 data for 1-day heatmap
  heatmapImage7Day?: string; // Base64 data for 7-day heatmap
  additionalNotes?: string;
}

export interface AnalysisResult {
  probability: number; // 0 to 100
  rationale: string;
  keyLevels: string[];
  riskFactors: string[];
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface GeminiError {
  message: string;
}