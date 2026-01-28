'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface PortfolioValueProps {
  totalValue: number;
  change24h: number;
  changePercent24h: number;
  currency?: string;
  showHideToggle?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PortfolioValue({
  totalValue,
  change24h,
  changePercent24h,
  currency = '$',
  showHideToggle = true,
  animated = true,
  size = 'lg',
  className,
}: PortfolioValueProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [displayValue, setDisplayValue] = useState(totalValue);
  const isPositive = change24h >= 0;

  // Animate number counting
  useEffect(() => {
    if (!animated) {
      setDisplayValue(totalValue);
      return;
    }

    const duration = 500;
    const startValue = displayValue;
    const endValue = totalValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      setDisplayValue(startValue + (endValue - startValue) * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [totalValue, animated]);

  const sizeClasses = {
    sm: {
      value: 'text-2xl',
      change: 'text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      value: 'text-3xl',
      change: 'text-base',
      icon: 'w-5 h-5',
    },
    lg: {
      value: 'text-4xl md:text-5xl',
      change: 'text-lg',
      icon: 'w-6 h-6',
    },
  };

  const formatValue = (value: number): string => {
    if (isHidden) return '••••••';
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Total Value */}
      <div className="flex items-center gap-3">
        <h2 className={cn('font-bold text-white tracking-tight', sizeClasses[size].value)}>
          {currency}{formatValue(displayValue)}
        </h2>
        {showHideToggle && (
          <button
            onClick={() => setIsHidden(!isHidden)}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isHidden ? (
              <EyeOff className={sizeClasses[size].icon} />
            ) : (
              <Eye className={sizeClasses[size].icon} />
            )}
          </button>
        )}
      </div>

      {/* 24h Change */}
      <div className={cn('flex items-center gap-2', sizeClasses[size].change)}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn('flex items-center gap-1 font-medium', isPositive ? 'text-green-400' : 'text-red-400')}
        >
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {isHidden ? '••••' : `${currency}${Math.abs(change24h).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </motion.div>
        <span
          className={cn(
            'px-2 py-0.5 rounded-md font-medium',
            isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          )}
        >
          {isHidden ? '••' : `${isPositive ? '+' : ''}${changePercent24h.toFixed(2)}%`}
        </span>
        <span className="text-gray-500">24h</span>
      </div>
    </div>
  );
}

// Mini portfolio widget for headers/sidebars
export function PortfolioMini({
  totalValue,
  changePercent24h,
  currency = '$',
  className,
}: {
  totalValue: number;
  changePercent24h: number;
  currency?: string;
  className?: string;
}) {
  const isPositive = changePercent24h >= 0;

  return (
    <div className={cn('flex items-center gap-3 p-3 rounded-xl bg-white/5', className)}>
      <div className="p-2 rounded-lg bg-blue-500/10">
        <Wallet className="w-5 h-5 text-blue-400" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-400">Portfolio</div>
        <div className="font-semibold text-white">{currency}{totalValue.toLocaleString()}</div>
      </div>
      <div className={cn('text-sm font-medium', isPositive ? 'text-green-400' : 'text-red-400')}>
        {isPositive ? '+' : ''}{changePercent24h.toFixed(2)}%
      </div>
    </div>
  );
}

// Portfolio breakdown by asset type
export function PortfolioBreakdown({
  items,
  className,
}: {
  items: { label: string; value: number; color: string }[];
  className?: string;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Progress bar */}
      <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ width: 0 }}
            animate={{ width: `${(item.value / total) * 100}%` }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="h-full"
            style={{ backgroundColor: item.color }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-400">{item.label}</span>
            <span className="text-sm font-medium text-white">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioValue;
