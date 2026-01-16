'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Price change indicator
interface PriceChangeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showPercentage?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'text-xs gap-0.5',
  md: 'text-sm gap-1',
  lg: 'text-base gap-1.5',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function PriceChange({
  value,
  size = 'md',
  showIcon = true,
  showPercentage = true,
  className,
}: PriceChangeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  return (
    <div
      className={cn(
        'inline-flex items-center font-medium',
        sizeStyles[size],
        isPositive && 'text-emerald-400',
        isNegative && 'text-red-400',
        isNeutral && 'text-gray-400',
        className
      )}
    >
      {showIcon && (
        <>
          {isPositive && <TrendingUp className={iconSizes[size]} />}
          {isNegative && <TrendingDown className={iconSizes[size]} />}
          {isNeutral && <Minus className={iconSizes[size]} />}
        </>
      )}
      <span>
        {isPositive && '+'}
        {value.toFixed(2)}
        {showPercentage && '%'}
      </span>
    </div>
  );
}

// Animated price with change indicator
interface AnimatedPriceProps {
  price: number;
  previousPrice?: number;
  currency?: string;
  precision?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const priceSizeStyles = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export function AnimatedPrice({
  price,
  previousPrice,
  currency = '$',
  precision = 2,
  size = 'md',
  className,
}: AnimatedPriceProps) {
  const change = previousPrice ? ((price - previousPrice) / previousPrice) * 100 : 0;
  const flashColor = change > 0 ? 'bg-emerald-500/30' : change < 0 ? 'bg-red-500/30' : '';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <motion.span
        key={price}
        initial={{ backgroundColor: flashColor }}
        animate={{ backgroundColor: 'transparent' }}
        transition={{ duration: 0.5 }}
        className={cn(
          'font-bold text-white rounded px-1 -mx-1',
          priceSizeStyles[size]
        )}
      >
        {currency}
        {price.toLocaleString(undefined, {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        })}
      </motion.span>
      
      {previousPrice && <PriceChange value={change} size={size === 'lg' ? 'md' : 'sm'} />}
    </div>
  );
}

// Sparkline mini chart
interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillOpacity?: number;
  className?: string;
}

export function Sparkline({
  data,
  width = 100,
  height = 32,
  color = '#8b5cf6',
  fillOpacity = 0.2,
  className,
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;
  const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;

  // Determine if trending up or down
  const isUp = data[data.length - 1] > data[0];
  const lineColor = isUp ? '#10b981' : '#ef4444';

  return (
    <svg width={width} height={height} className={className}>
      {/* Fill area */}
      <path d={areaData} fill={lineColor} fillOpacity={fillOpacity} />
      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={lineColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
