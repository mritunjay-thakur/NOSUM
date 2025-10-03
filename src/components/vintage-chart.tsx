// src/components/vintage-chart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { useTheme } from './theme-provider';

interface ChartData {
  date: string;
  price: number;
}

interface VintageChartProps {
  data: ChartData[];
  height?: number;
}

export function VintageChart({ data, height = 300 }: VintageChartProps) {
  const { theme } = useTheme();

  const chartColors = {
    light: {
      gradient: 'url(#lightGradient)',
      line: '#6366F1', // Modern indigo
      area: 'rgba(99, 102, 241, 0.1)',
      grid: '#E5E7EB',
      text: '#374151',
      background: 'transparent',
      tooltipBg: 'rgba(255, 255, 255, 0.95)',
      tooltipBorder: 'rgba(229, 231, 235, 0.8)',
    },
    dark: {
      gradient: 'url(#darkGradient)',
      line: '#8B5CF6', // Modern purple
      area: 'rgba(139, 92, 246, 0.15)',
      grid: 'rgba(75, 85, 99, 0.4)',
      text: '#F3F4F6',
      background: 'transparent',
      tooltipBg: 'rgba(17, 24, 39, 0.95)',
      tooltipBorder: 'rgba(55, 65, 81, 0.8)',
    }
  };

  const colors = chartColors[theme];
  const isDark = theme === 'dark';

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="backdrop-blur-xl rounded-2xl border shadow-2xl p-4"
          style={{
            backgroundColor: colors.tooltipBg,
            borderColor: colors.tooltipBorder,
          }}
        >
          <p className="font-semibold text-sm mb-1" style={{ color: colors.text }}>
            {label}
          </p>
          <p className="text-lg font-bold" style={{ color: colors.line }}>
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full">
      {/* Modern chart container with glass effect */}
      <div 
        className="rounded-3xl backdrop-blur-sm border p-6"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.7), rgba(31, 41, 55, 0.5))'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(249, 250, 251, 0.6))',
          borderColor: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.6)',
          height: height + 80, // Account for padding
        }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <defs>
              {/* Light theme gradient */}
              <linearGradient id="lightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
              
              {/* Dark theme gradient */}
              <linearGradient id="darkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={colors.grid}
              opacity={0.5}
              horizontal={true}
              vertical={false}
            />
            
            {/* Area under line for modern look */}
            <Area
              type="monotone"
              dataKey="price"
              stroke="none"
              fill={colors.gradient}
              fillOpacity={0.3}
            />

            <XAxis 
              dataKey="date" 
              stroke={colors.text}
              fontSize={11}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fill: colors.text, opacity: 0.7 }}
            />
            
            <YAxis 
              stroke={colors.text}
              fontSize={11}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fill: colors.text, opacity: 0.7 }}
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={(value) => `$${value}`}
            />
            
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: colors.line,
                strokeWidth: 1,
                strokeDasharray: '5 5',
                opacity: 0.5,
              }}
            />
            
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={colors.line}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: colors.line,
                stroke: isDark ? '#1F2937' : '#FFFFFF',
                strokeWidth: 2,
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
              }}
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
              }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Modern chart footer */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t" 
             style={{ borderColor: colors.grid }}>
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: colors.line }}
            />
            <span 
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Live Price
            </span>
          </div>
          
          <div 
            className="text-xs opacity-70"
            style={{ color: colors.text }}
          >
            Updated in real-time
          </div>
        </div>
      </div>

      {/* Floating stats for modern feel */}
      {data.length > 0 && (
        <div className="absolute top-6 right-6 flex space-x-3">
          <div 
            className="backdrop-blur-md rounded-2xl px-3 py-2 border text-sm font-semibold"
            style={{
              backgroundColor: isDark ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.7)',
              borderColor: isDark ? 'rgba(75, 85, 99, 0.4)' : 'rgba(229, 231, 235, 0.6)',
              color: colors.text,
            }}
          >
            ${data[data.length - 1].price.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}