
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

    const quote = await stockApi.getStockQuote(symbol);
    return NextResponse.json(quote);
  } catch (error) {
    console.error('Stock quote API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}