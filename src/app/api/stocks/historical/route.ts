// src/app/api/stocks/historical/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stockApi } from '@/lib/stock-api';

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

    const historicalData = await stockApi.getHistoricalData(symbol);
    return NextResponse.json(historicalData);
  } catch (error) {
    console.error('Historical data API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical data' },
      { status: 500 }
    );
  }
}