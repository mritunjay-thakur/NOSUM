
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PredictionResult {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  direction: 'bullish' | 'bearish' | 'neutral';
  predictionDate: string;
  historicalData: HistoricalData[];
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
}