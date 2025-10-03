// src/app/dashboard/page.tsx - FIXED VERSION WITH FOOTER
'use client';

import { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { useTheme } from '@/components/theme-provider';
import { VintageChart } from '@/components/vintage-chart';
import { 
  Moon, 
  Sun, 
  Search, 
  TrendingUp, 
  PieChart, 
  BookOpen,
  Bell,
  Option,
  Settings,
  Loader2,
  Sparkles,
  Target,
  Zap,
  Globe,
  ArrowRight,
  Play,
  X,
  BarChart3,
  Shield,
  Award,
  Clock,
  RefreshCw,
  Newspaper,
  Activity,
  TrendingDown,
  Eye,
  Linkedin,
  Github,
  Instagram,
  Mail,
  ExternalLink
} from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

interface Prediction {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  direction: 'bullish' | 'bearish' | 'neutral';
  predictionDate: string;
  method: string;
  historicalData: any[];
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
}

// Generate realistic stock data for the past year
const generateYearlyData = (basePrice: number, volatility: number = 0.2) => {
  const data = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1); // Go back 1 year
  
  let currentPrice = basePrice;
  
  for (let i = 0; i < 12; i++) { // 12 months of data
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    
    // Simulate price movement with some randomness
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = currentPrice * (1 + change);
    
    // Ensure price doesn't go too low
    currentPrice = Math.max(currentPrice, basePrice * 0.5);
    
    data.push({
      date: date.toISOString(),
      close: Number(currentPrice.toFixed(2))
    });
  }
  
  return data;
};

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  
  const [activeStock, setActiveStock] = useState<Stock | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');

  const isDark = theme === 'dark';

  // Mock watchlist
  const mockWatchlist = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  ];

  // Search stocks
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResults = [
        { symbol: searchQuery.toUpperCase(), name: `${searchQuery.toUpperCase()} Company`, region: 'US' }
      ];
      setSearchResults(mockResults);
    } catch (err) {
      setError('Failed to search stocks');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    if (activeStock) {
      await fetchStockData(activeStock.symbol);
    }
  };

  // Fetch stock data and prediction - FIXED DATA GENERATION
  const fetchStockData = async (symbol: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const basePrice = 150 + Math.random() * 100;
      const mockStock: Stock = {
        symbol,
        name: `${symbol} Company`,
        price: basePrice,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        timestamp: new Date().toISOString()
      };

      // Generate realistic yearly data
      const yearlyHistoricalData = generateYearlyData(basePrice);

      const mockPrediction: Prediction = { 
        symbol,
        currentPrice: mockStock.price,
        predictedPrice: mockStock.price * (1 + (Math.random() - 0.3) * 0.1),
        confidence: 75 + Math.random() * 20,
        direction: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'bearish' : 'neutral',
        predictionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        method: 'AI Neural Network Analysis',
        historicalData: yearlyHistoricalData // This should be properly generated
      };

      // Generate mock news
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: `${symbol} Announces Breakthrough in Technology Sector`,
          source: 'Financial Times',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          sentiment: 'positive',
          impact: 'high'
        },
        {
          id: '2',
          title: `Analysts Upgrade ${symbol} Price Target`,
          source: 'Bloomberg',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          sentiment: 'positive',
          impact: 'medium'
        },
        {
          id: '3',
          title: `${symbol} Faces Regulatory Challenges in EU Market`,
          source: 'Reuters',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          sentiment: 'negative',
          impact: 'medium'
        }
      ];

      // Generate technical indicators
      const mockIndicators: TechnicalIndicator[] = [
        {
          name: 'RSI (14)',
          value: 45 + Math.random() * 30,
          signal: Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'sell' : 'neutral',
          description: 'Momentum indicator'
        },
        {
          name: 'MACD',
          value: (Math.random() - 0.5) * 2,
          signal: Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'sell' : 'neutral',
          description: 'Trend following'
        },
        {
          name: 'Moving Avg (50)',
          value: mockStock.price * (0.95 + Math.random() * 0.1),
          signal: mockStock.price > mockStock.price * 0.98 ? 'buy' : 'sell',
          description: 'Support/Resistance'
        }
      ];

      // Set market sentiment based on prediction
      setMarketSentiment(mockPrediction.direction);

      setActiveStock(mockStock);
      setPrediction(mockPrediction);
      setNews(mockNews);
      setTechnicalIndicators(mockIndicators);
      setSearchResults([]);
      setSearchQuery('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  // Load default stock and initialize animations
  useEffect(() => {
    fetchStockData('AAPL');
    setIsVisible(true);
  }, []);

  const chartData = prediction?.historicalData?.map(item => ({
    date: item.date,
    price: item.close 
  })) || [];
  const hasChartData = chartData && chartData.length > 0;

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-zinc-950 to-black text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900'
    }`}>
  
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        isDark 
          ? 'bg-gray-900/95 border-gray-800 shadow-2xl' 
          : 'bg-white/95 border-gray-200 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 group-hover:scale-110 ${
                isDark 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white '
              }`}>
                <Option className="w-6 h-6" />
              </div>
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NOSUM
                </h1>
                <p className={`text-xs tracking-widest font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  AI DASHBOARD
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 shadow-lg' 
                    : 'bg-white hover:bg-gray-100 shadow-lg border border-gray-200'
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 shadow-lg' 
                  : 'bg-white hover:bg-gray-100 shadow-lg border border-gray-200'
              }`}>
                <Bell size={20} />
              </button>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 shadow-lg disabled:opacity-50' 
                    : 'bg-white hover:bg-gray-100 shadow-lg border border-gray-200 disabled:opacity-50'
                }`}
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} size={20} />
              </button>
              
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

     
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
          
            <div className="lg:col-span-1 space-y-6">
           
              <div className={`p-6 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 hover:scale-105 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20' 
                  : 'bg-white/50 border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <Sparkles className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Welcome back</h3>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {user?.firstName || 'Trader'}
                    </p>
                  </div>
                </div>
                <div className={`text-xs px-3 py-2 rounded-xl ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                  Ready for smart investing
                </div>
              </div>

            
              <div className={`p-6 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 hover:scale-105 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700 hover:border-purple-500' 
                  : 'bg-white/50 border-gray-200 hover:border-purple-400'
              }`}>
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className={isDark ? 'text-purple-400' : 'text-purple-600'} size={20} />
                  <h3 className="font-bold text-lg">Market Pulse</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'S&P 500', value: '+0.8%', trend: 'up' },
                    { name: 'NASDAQ', value: '+1.2%', trend: 'up' },
                    { name: 'DOW JONES', value: '-0.3%', trend: 'down' },
                    { name: 'CRYPTO', value: '+2.1%', trend: 'up' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {item.name}
                      </span>
                      <span className={`text-sm font-bold ${
                        item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

             
              <div className={`p-6 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Most searched</h3>
                </div>
                <div className="space-y-3">
                  {mockWatchlist.map((stock, index) => (
                    <div 
                      key={index}
                      className={`group p-4 rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 ${
                        isDark 
                          ? 'bg-gray-700/30 border border-gray-600 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20' 
                          : 'bg-gray-100/50 border border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20'
                      } ${activeStock?.symbol === stock.symbol ? (
                        isDark ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-blue-400 shadow-lg shadow-blue-500/20'
                      ) : ''}`}
                      onClick={() => fetchStockData(stock.symbol)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-lg">{stock.symbol}</div>
                          <div className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {stock.name}
                          </div>
                        </div>
                        {loading && activeStock?.symbol === stock.symbol ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <div className="text-right">
                            <div className="font-bold">
                              {activeStock?.symbol === stock.symbol ? `$${activeStock.price.toFixed(2)}` : '--'}
                            </div>
                            <div className={`text-xs font-semibold ${
                              (activeStock?.change ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {activeStock?.symbol === stock.symbol ? 
                                `${activeStock.change >= 0 ? '+' : ''}${activeStock.changePercent.toFixed(2)}%` : 
                                '--'
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

           
              <div className={`p-6 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className={isDark ? 'text-cyan-400' : 'text-cyan-600'} size={20} />
                  <h3 className="font-bold text-lg">Connect With Me</h3>
                </div>
                <p className={`text-sm mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Let&apos;s build something amazing together
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { 
                      icon: <Linkedin size={18} />, 
                      name:"",
                      link: 'https://www.linkedin.com/in/mritunjay-thakur-jay',
                      description: 'Professional Network'
                    },
                    { 
                      icon: <Github size={18} />, 
                     name:"",
                      link: 'https://github.com/mritunjay-thakur/',
                      description: 'Daily Code & Projects'
                    },
                    { 
                      icon: <Instagram size={18} />, 
                      name:"",
                      link: 'https://www.instagram.com/___jaythakur___/',
                      description: 'Daily Updates'
                    },
                    { 
                      icon: <Mail size={18} />, 
                      name:"",
                      link: 'mailto:mritunjaythakur903@gmail.com',
                      description: 'please leave a text'
                    },
                  ].map((social, index) => (
                    <a
                      key={social.name}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                        isDark 
                          ? 'bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600 hover:border-cyan-500' 
                          : 'bg-gray-100/50 hover:bg-gray-200/50 border border-gray-200 hover:border-cyan-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                          isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'
                        }`}>
                          {social.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 group-hover:bg-clip-text">
                            {social.name}
                          </div>
                          <div className={`text-xs truncate ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {social.description}
                          </div>
                        </div>
                        <ExternalLink size={14} className={`transition-transform duration-300 group-hover:translate-x-0.5 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                      </div>
                    </a>
                  ))}
                </div>

                <div className={`mt-4 p-3 rounded-xl text-center ${
                  isDark ? 'bg-gray-700/30' : 'bg-gray-100/50'
                }`}>
                  <p className={`text-xs font-medium ${
                    isDark ? 'text-cyan-300' : 'text-cyan-600'
                  }`}>
                    Full Stack Developer & AI Enthusiast
                  </p>
                  <div className="flex justify-center space-x-2 mt-2">
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'
                    }`}>
                      React
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'
                    }`}>
                      Next.js
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-600'
                    }`}>
                      Node.js
                    </div>
                  </div>
                </div>
              </div>
            </div>

           
            <div className="lg:col-span-3 space-y-6">
             
              {error && (
                <div className={`p-4 rounded-2xl backdrop-blur-lg border-2 transition-all duration-500 ${
                  isDark 
                    ? 'bg-red-900/50 border-red-700 text-red-200' 
                    : 'bg-red-50 border-red-300 text-red-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      isDark ? 'bg-red-700/50' : 'bg-red-200'
                    }`}>
                      <X size={16} />
                    </div>
                    <span>{error}</span>
                  </div>
                </div>
              )}

            
              <div className={`p-6 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className={`absolute left-4 top-4 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} size={20} />
                    <input
                      type="text"
                      placeholder="Search stocks (AAPL, TSLA, GOOGL)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 text-lg transition-all duration-300 ${
                        isDark
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                          : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/20'
                      }`}
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 hover:scale-105 flex items-center gap-3 ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50'
                    }`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
                  </button>
                </div>

           
                {searchResults.length > 0 && (
                  <div className={`mt-4 rounded-2xl border-2 backdrop-blur-lg transition-all duration-500 ${
                    isDark
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-white/50 border-gray-200'
                  }`}>
                    {searchResults.slice(0, 5).map((result, index) => (
                      <div
                        key={index}
                        className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 group ${
                          isDark
                            ? 'hover:bg-gray-700/50 border-b border-gray-600 last:border-b-0'
                            : 'hover:bg-gray-100/50 border-b border-gray-200 last:border-b-0'
                        }`}
                        onClick={() => fetchStockData(result.symbol)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                              isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                            }`}>
                              <TrendingUp size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                            </div>
                            <div>
                              <div className="font-bold text-lg">{result.symbol}</div>
                              <div className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {result.name}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className={`transition-transform duration-300 group-hover:translate-x-1 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`} size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {loading && !activeStock ? (
                <div className={`p-12 rounded-3xl backdrop-blur-lg border-2 text-center transition-all duration-500 ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-white/50 border-gray-200'
                }`}>
                  <Loader2 className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
                  <p className="text-xl font-semibold">Analyzing market data...</p>
                  <p className={`mt-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Our AI is processing real-time information
                  </p>
                </div>
              ) : activeStock ? (
                <>
           
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 
                    <div className={`p-6 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 hover:scale-105 group ${
                      isDark 
                        ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20' 
                        : 'bg-white/50 border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20'
                    }`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                            isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                          }`}>
                            <Target className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                          </div>
                          <div>
                            <h3 className="font-bold text-2xl">{activeStock.symbol}</h3>
                            <p className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {activeStock.name}
                            </p>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                          activeStock.change >= 0 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {activeStock.change >= 0 ? '' : ''} Live
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-4xl font-bold mb-2">
                            ${activeStock.price.toFixed(2)}
                          </div>
                          <div className={`text-xl font-semibold ${
                            activeStock.change >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {activeStock.change >= 0 ? '+' : ''}{activeStock.change.toFixed(2)} ({activeStock.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                        <div className={`text-right ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <div className="text-sm">Last updated</div>
                          <div className="text-sm font-semibold">
                            {new Date(activeStock.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    
                    {prediction && (
                      <div className={`p-6 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 hover:scale-105 group ${
                        isDark 
                          ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20' 
                          : 'bg-gradient-to-br from-purple-100 to-blue-100 border-purple-400/30 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20'
                      }`}>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                            isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                          }`}>
                            <Option className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                          </div>
                          <div>
                            <h3 className="font-bold text-2xl">AI Prediction</h3>
                            <p className={`text-sm ${
                              isDark ? 'text-purple-300' : 'text-purple-600'
                            }`}>
                              {prediction.method}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-3xl font-bold mb-2">
                              ${prediction.predictedPrice.toFixed(2)}
                            </div>
                            <div className={`text-lg font-semibold capitalize px-6 py-2 rounded-xl ${
                              prediction.direction === 'bullish' ? 'bg-green-500/20 text-green-400' :
                              prediction.direction === 'bearish' ? 'bg-red-500/20 text-red-400' : 
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {prediction.direction}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${
                              isDark ? 'text-purple-400' : 'text-purple-600'
                            }`}>
                              {prediction.confidence}%
                            </div>
                            <div className={`text-sm ${
                              isDark ? 'text-purple-300' : 'text-purple-600'
                            }`}>
                              Confidence
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

               
                  {hasChartData && (
                    <div className={`p-6 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 ${
                      isDark 
                        ? 'bg-gray-800/50 border-gray-700' 
                        : 'bg-white/50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-2xl">1-Year Price Analysis</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Historical</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>Prediction</span>
                          </div>
                        </div>
                      </div>
                      
                      <VintageChart 
                        data={chartData} 
                        height={400}
                      />
                    </div>
                  )}

          
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <div className={`group p-6 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 hover:scale-105 cursor-pointer ${
                      isDark 
                        ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20' 
                        : 'bg-white/50 border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20'
                    }`}>
                      <div className={`inline-block p-4 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110 ${
                        isDark 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Newspaper className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-xl mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text">
                        Real-time News
                      </h4>
                      <p className={`mb-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Latest market news and sentiment analysis
                      </p>
                      <div className="space-y-3 max-h-32 overflow-y-auto">
                        {news.slice(0, 2).map((item) => (
                          <div key={item.id} className={`p-3 rounded-xl text-sm ${
                            isDark ? 'bg-gray-700/30' : 'bg-gray-100'
                          }`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold truncate">{item.title}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                item.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                                item.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {item.sentiment}
                              </span>
                            </div>
                            <div className="text-xs opacity-70">{item.source}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                   
                    <div className={`group p-6 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 hover:scale-105 cursor-pointer ${
                      isDark 
                        ? 'bg-gray-800/50 border-gray-700 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20' 
                        : 'bg-white/50 border-gray-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20'
                    }`}>
                      <div className={`inline-block p-4 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110 ${
                        isDark 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        <Activity className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-xl mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text">
                        Technical Indicators
                      </h4>
                      <p className={`mb-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Key technical signals and metrics
                      </p>
                      <div className="space-y-3">
                        {technicalIndicators.map((indicator, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-sm">{indicator.name}</div>
                              <div className="text-xs opacity-70">{indicator.description}</div>
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              indicator.signal === 'buy' ? 'bg-green-500/20 text-green-400' :
                              indicator.signal === 'sell' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {indicator.signal.toUpperCase()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    
                    <div className={`group p-6 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 hover:scale-105 cursor-pointer ${
                      isDark 
                        ? 'bg-gray-800/50 border-gray-700 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/20' 
                        : 'bg-white/50 border-gray-200 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20'
                    }`}>
                      <div className={`inline-block p-4 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110 ${
                        isDark 
                          ? 'bg-cyan-500/20 text-cyan-400' 
                          : 'bg-cyan-100 text-cyan-600'
                      }`}>
                        <Eye className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-xl mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text">
                        Market Sentiment
                      </h4>
                      <p className={`mb-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Overall market outlook and trends
                      </p>
                      <div className="text-center">
                        <div className={`text-6xl mb-4 ${
                          marketSentiment === 'bullish' ? 'text-green-500' :
                          marketSentiment === 'bearish' ? 'text-red-500' :
                          'text-yellow-500'
                        }`}>
                          {marketSentiment === 'bullish' ? '📈' :
                           marketSentiment === 'bearish' ? '📉' : '➡️'}
                        </div>
                        <div className={`text-xl font-bold capitalize px-6 py-3 rounded-xl ${
                          marketSentiment === 'bullish' ? 'bg-green-500/20 text-green-400' :
                          marketSentiment === 'bearish' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {marketSentiment}
                        </div>
                        <p className={`mt-3 text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Based on AI analysis of multiple factors
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className={`p-12 rounded-3xl backdrop-blur-lg border-2 text-center transition-all duration-500 ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-white/50 border-gray-200'
                }`}>
                  <div className={`inline-block p-6 rounded-3xl mb-6 ${
                    isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <TrendingUp className={`w-16 h-16 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <h3 className="font-bold text-3xl mb-4">Ready to Analyze</h3>
                  <p className={`text-xl mb-8 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Search for a stock or select from your watchlist to begin AI-powered analysis
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN', 'NVDA'].map(symbol => (
                      <button
                        key={symbol}
                        onClick={() => fetchStockData(symbol)}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                          isDark
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:shadow-lg hover:shadow-blue-500/20'
                        }`}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}