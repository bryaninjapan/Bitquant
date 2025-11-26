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

export interface MarketData {
  currentPrice: number;
  targetPrice: number;
  fundingRate: number; // In percentage, e.g., 0.01
  weeklyStructure: Trend;
  heatmap1DayContext: string;
  heatmap7DayContext: string;
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