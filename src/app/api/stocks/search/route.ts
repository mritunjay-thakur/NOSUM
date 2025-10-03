
import { NextRequest, NextResponse } from 'next/server';
import { stockApi } from '@/lib/stock-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const results = await stockApi.searchStocks(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Stock search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search stocks' },
      { status: 500 }
    );
  }
}