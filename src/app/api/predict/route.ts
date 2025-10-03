// src/app/api/predict/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stockApi } from '@/lib/stock-api';
import { predictionEngine } from '@/lib/prediction-engine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Get both current quote and historical data
    const [quote, historicalData] = await Promise.all([
      stockApi.getStockQuote(symbol),
      stockApi.getHistoricalData(symbol),
    ]);

    if (historicalData.length === 0) {
      throw new Error('Insufficient historical data for prediction');
    }

    // Generate prediction
    const prediction = await predictionEngine.predictStock(symbol, historicalData);

    const result = {
      symbol: quote.symbol,
      currentPrice: quote.price,
      predictedPrice: prediction.predictedPrice,
      confidence: prediction.confidence,
      direction: prediction.direction,
      predictionDate: new Date().toISOString(),
      method: prediction.method,
      historicalData: historicalData.slice(-10), 
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Prediction API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    );
  }
}