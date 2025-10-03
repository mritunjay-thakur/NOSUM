const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

function safeParseNumber(value: any): number | null {
  if (value === null || value === undefined) return null;
  const str = String(value).replace(/,/g, '').replace('%', '').trim();
  const n = parseFloat(str);
  return Number.isFinite(n) ? n : null;
}

export class StockAPIService {
  private async fetchAlphaVantage(functionName: string, params: Record<string, string>, retries = 0): Promise<any> {
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('Alpha Vantage API key not configured. Set NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY in your environment.');
    }

    const searchParams = new URLSearchParams({
      function: functionName,
      apikey: ALPHA_VANTAGE_API_KEY,
      ...params,
    });

    console.debug(`AlphaVantage request: ${functionName} - ${JSON.stringify(params)}`);

    try {
      const res = await fetch(`${BASE_URL}?${searchParams}`);

      if (!res.ok) {
        throw new Error(`HTTP error from Alpha Vantage: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (data['Note']) {
        console.warn('Alpha Vantage rate limit / note:', data['Note']);
        throw new Error('Alpha Vantage rate limit reached or service note: ' + data['Note']);
      }

      if (data['Error Message']) {
        console.error('Alpha Vantage error message:', data['Error Message']);
        throw new Error('Alpha Vantage error: ' + data['Error Message']);
      }

      if (data['Information']) {
        console.warn('Alpha Vantage information:', data['Information']);
        throw new Error('Alpha Vantage information: ' + data['Information']);
      }

      return data;
    } catch (err) {
      if (retries < 1) {
        console.warn('Retrying Alpha Vantage request due to error:', err);
        return this.fetchAlphaVantage(functionName, params, retries + 1);
      }
      console.error('Alpha Vantage fetch error:', err);
      throw err;
    }
  }

  async searchStocks(keywords: string): Promise<Array<{ symbol: string; name: string; type?: string; region?: string; currency?: string; matchScore?: number }>> {
    try {
      const data = await this.fetchAlphaVantage('SYMBOL_SEARCH', { keywords });
      const raw = data.bestMatches || [];

      return (raw as any[]).map((m) => ({
        symbol: m['1. symbol'],
        name: m['2. name'],
        type: m['3. type'],
        region: m['4. region'],
        currency: m['8. currency'] || m['7. currency'],
        matchScore: safeParseNumber(m['9. matchScore']) || 0,
      }));
    } catch (err) {
      console.error('searchStocks error:', err);
      throw err;
    }
  }

  private async trySymbolVariants(baseSymbol: string): Promise<{ symbol: string; data: any } | null> {
    const variants = [
      baseSymbol,
      baseSymbol.toUpperCase(),
      `${baseSymbol.toUpperCase()}.NS`,
      `${baseSymbol.toUpperCase()}.BO`,
      `NSE:${baseSymbol.toUpperCase()}`,
      `BSE:${baseSymbol.toUpperCase()}`,
    ];

    for (const sym of variants) {
      try {
        const response = await this.fetchAlphaVantage('GLOBAL_QUOTE', { symbol: sym });
        const quote = response['Global Quote'];
        if (quote && Object.keys(quote).length > 0) {
          const price = safeParseNumber(quote['05. price'] ?? quote['4. close'] ?? quote['price']);
          if (price !== null) {
            return { symbol: sym, data: quote };
          }
        }
      } catch (e) {
        console.debug(`variant ${sym} failed:`, (e as any)?.message ?? e);
      }
    }

    return null;
  }

  async getStockQuote(symbol: string, options?: { trySearch?: boolean }): Promise<{ 
    symbol: string; 
    price: number; 
    change: number | null; 
    changePercent: number | null; 
    timestamp?: string 
  }> {
    const sym = symbol.trim();
    try {
      try {
        const data = await this.fetchAlphaVantage('GLOBAL_QUOTE', { symbol: sym });
        const quote = data['Global Quote'];
        if (quote && Object.keys(quote).length > 0) {
          const price = safeParseNumber(quote['05. price'] ?? quote['4. close'] ?? quote['price']);
          if (price === null) throw new Error('Invalid price in response');

          return {
            symbol: quote['01. symbol'] || sym,
            price,
            change: safeParseNumber(quote['09. change']) ?? safeParseNumber(quote['05. change']) ?? null,
            changePercent: safeParseNumber((quote['10. change percent'] ?? quote['06. change percent'] ?? '') as any) ?? null,
            timestamp: quote['07. latest trading day'] ?? undefined,
          };
        }
      } catch (err: any) {
        console.debug('Direct GLOBAL_QUOTE failed, will attempt resolution/fallbacks:', err?.message ?? err);
      }

      if (options?.trySearch !== false) {
        try {
          const matches = await this.searchStocks(sym);
          const indiaMatch = matches.find((m) => (m.region && m.region.toLowerCase().includes('india')) || (m.currency && m.currency.toLowerCase() === 'inr')) || matches[0];
          if (indiaMatch) {
            const resolved = await this.trySymbolVariants(indiaMatch.symbol);
            if (resolved) {
              const q = resolved.data;
              const price = safeParseNumber(q['05. price'] ?? q['4. close'] ?? q['price']);
              if (price !== null) {
                return {
                  symbol: q['01. symbol'] || resolved.symbol,
                  price,
                  change: safeParseNumber(q['09. change']) ?? safeParseNumber(q['05. change']) ?? null,
                  changePercent: safeParseNumber((q['10. change percent'] ?? q['06. change percent'] ?? '') as any) ?? null,
                  timestamp: q['07. latest trading day'] ?? undefined,
                };
              }
            }

            const fallback = await this.trySymbolVariants(sym);
            if (fallback) {
              const q = fallback.data;
              const price = safeParseNumber(q['05. price'] ?? q['4. close'] ?? q['price']);
              if (price !== null) {
                return {
                  symbol: q['01. symbol'] || fallback.symbol,
                  price,
                  change: safeParseNumber(q['09. change']) ?? safeParseNumber(q['05. change']) ?? null,
                  changePercent: safeParseNumber((q['10. change percent'] ?? q['06. change percent'] ?? '') as any) ?? null,
                  timestamp: q['07. latest trading day'] ?? undefined,
                };
              }
            }
          }
        } catch (err: any) {
          console.debug('Symbol search fallback failed:', err?.message ?? err);
        }
      }

      throw new Error(`Quote not available for ${symbol}. Tried direct quote, symbol search and common NSE/BSE variants.`);
    } catch (error) {
      console.error('getStockQuote error for', symbol, error);
      throw error;
    }
  }

  async getHistoricalData(symbol: string, outputsize: 'compact' | 'full' = 'compact'): Promise<Array<{ 
    date: string; 
    open: number; 
    high: number; 
    low: number; 
    close: number; 
    volume: number 
  }>> {
    const sym = symbol.trim();
    let data: any = null;

    try {
      data = await this.fetchAlphaVantage('TIME_SERIES_DAILY', { symbol: sym, outputsize });
    } catch (err) {
      console.debug('Direct TIME_SERIES_DAILY failed, attempting resolution:', (err as any)?.message ?? err);
    }

    if (!data || !data['Time Series (Daily)']) {
      try {
        const matches = await this.searchStocks(sym);
        const indiaMatch = matches.find((m) => (m.region && m.region.toLowerCase().includes('india')) || (m.currency && m.currency.toLowerCase() === 'inr')) || matches[0];
        if (indiaMatch) {
          const resolved = await this.trySymbolVariants(indiaMatch.symbol);
          if (resolved) {
            data = await this.fetchAlphaVantage('TIME_SERIES_DAILY', { symbol: resolved.symbol, outputsize });
          }
        }

        if (!data || !data['Time Series (Daily)']) {
          const trial = await this.trySymbolVariants(sym);
          if (trial) {
            data = await this.fetchAlphaVantage('TIME_SERIES_DAILY', { symbol: trial.symbol, outputsize });
          }
        }
      } catch (err) {
        console.debug('Historical fallback resolution failed:', (err as any)?.message ?? err);
      }
    }

    const timeSeries = data?.['Time Series (Daily)'];
    if (!timeSeries || Object.keys(timeSeries).length === 0) {
      throw new Error(`Historical data not available for ${symbol}`);
    }

    const historicalData: Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }> = [];
    const entries = Object.entries(timeSeries).slice(0, 30);

    for (const [date, values] of entries) {
      const v: any = values;
      historicalData.push({
        date,
        open: safeParseNumber(v['1. open']) ?? 0,
        high: safeParseNumber(v['2. high']) ?? 0,
        low: safeParseNumber(v['3. low']) ?? 0,
        close: safeParseNumber(v['4. close']) ?? 0,
        volume: parseInt(String(v['5. volume'] ?? '0').replace(/,/g, ''), 10) || 0,
      });
    }

    return historicalData.reverse();
  }

  async getCompanyOverview(symbol: string): Promise<any> {
    const sym = symbol.trim();
    try {
      let data = await this.fetchAlphaVantage('OVERVIEW', { symbol: sym });

      if (!data || Object.keys(data).length === 0) {
        const matches = await this.searchStocks(sym);
        const indiaMatch = matches.find((m) => (m.region && m.region.toLowerCase().includes('india')) || (m.currency && m.currency.toLowerCase() === 'inr')) || matches[0];
        if (indiaMatch) {
          const resolved = await this.trySymbolVariants(indiaMatch.symbol);
          if (resolved) {
            data = await this.fetchAlphaVantage('OVERVIEW', { symbol: resolved.symbol });
          }
        }
      }

      if (!data || Object.keys(data).length === 0) {
        throw new Error('Company overview not available for ' + symbol);
      }

      return data;
    } catch (err) {
      console.error('getCompanyOverview error:', err);
      throw err;
    }
  }
}

export const stockApi = new StockAPIService();
