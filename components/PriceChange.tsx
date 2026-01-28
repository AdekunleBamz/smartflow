'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceChangeProps {
  value: number;
  percentage?: boolean;
  showIcon?: boolean;
  showSign?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function PriceChange({
  value,
  percentage = true,
  showIcon = true,
  showSign = true,
  size = 'md',
  animated = true,
  className,
}: PriceChangeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  const colorClass = isPositive
    ? 'text-green-400'
    : isNegative
    ? 'text-red-400'
    : 'text-gray-400';

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  const formattedValue = Math.abs(value).toFixed(2);
  const displayValue = `${showSign && !isNeutral ? (isPositive ? '+' : '-') : ''}${formattedValue}${percentage ? '%' : ''}`;

  const content = (
    <span className={cn('inline-flex items-center gap-1 font-medium', sizeClasses[size], colorClass, className)}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {displayValue}
    </span>
  );

  if (animated && !isNeutral) {
    return (
      <motion.span
        initial={{ opacity: 0, y: isPositive ? 5 : -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex"
      >
        {content}
      </motion.span>
    );
  }

  return content;
}

// Pill variant with background
export function PriceChangePill({
  value,
  size = 'md',
  className,
}: Omit<PriceChangeProps, 'showIcon' | 'showSign'>) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  const bgClass = isPositive
    ? 'bg-green-500/10 text-green-400'
    : isNegative
    ? 'bg-red-500/10 text-red-400'
    : 'bg-gray-500/10 text-gray-400';

  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const formattedValue = Math.abs(value).toFixed(2);

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full font-medium', sizeClasses[size], bgClass, className)}>
      {isPositive ? '↑' : isNegative ? '↓' : '–'}
      {formattedValue}%
    </span>
  );
}

// Sparkline with price change
export function PriceChangeWithSparkline({
  value,
  data,
  width = 60,
  height = 20,
  className,
}: PriceChangeProps & { data: number[]; width?: number; height?: number }) {
  const isPositive = value >= 0;
  const strokeColor = isPositive ? '#4ade80' : '#f87171';

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <PriceChange value={value} size="sm" showIcon={false} />
    </div>
  );
}

// Large display for hero sections
export function PriceChangeHero({
  currentPrice,
  previousPrice,
  symbol = '$',
  className,
}: {
  currentPrice: number;
  previousPrice: number;
  symbol?: string;
  className?: string;
}) {
  const change = currentPrice - previousPrice;
  const percentChange = previousPrice !== 0 ? (change / previousPrice) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <div className={cn('space-y-1', className)}>
      <div className="text-3xl font-bold text-white">
        {symbol}{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className={cn('flex items-center gap-2', isPositive ? 'text-green-400' : 'text-red-400')}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span className="font-medium">
          {isPositive ? '+' : ''}{symbol}{change.toFixed(2)}
        </span>
        <span className="text-sm opacity-80">
          ({isPositive ? '+' : ''}{percentChange.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}

export default PriceChange;
