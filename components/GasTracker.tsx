'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Fuel, Zap, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface GasPrices {
  slow: number;
  standard: number;
  fast: number;
  instant?: number;
}

interface GasTrackerProps {
  prices: GasPrices;
  baseFee?: number;
  priorityFee?: number;
  selectedSpeed?: 'slow' | 'standard' | 'fast' | 'instant';
  onSpeedSelect?: (speed: 'slow' | 'standard' | 'fast' | 'instant') => void;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

const speedConfig = {
  slow: {
    label: 'Slow',
    time: '~10 min',
    icon: Clock,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
  },
  standard: {
    label: 'Standard',
    time: '~3 min',
    icon: Fuel,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  fast: {
    label: 'Fast',
    time: '~30 sec',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  instant: {
    label: 'Instant',
    time: '~15 sec',
    icon: Zap,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
};

export function GasTracker({
  prices,
  baseFee,
  priorityFee,
  selectedSpeed = 'standard',
  onSpeedSelect,
  unit = 'Gwei',
  trend,
  className,
}: GasTrackerProps) {
  const speeds = Object.entries(prices).filter(([_, v]) => v !== undefined) as [
    'slow' | 'standard' | 'fast' | 'instant',
    number
  ][];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with current gas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Fuel className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Gas Price</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-white">
                {prices[selectedSpeed]} {unit}
              </span>
              {trend && (
                <span className={cn('flex items-center gap-0.5 text-xs', trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-green-400' : 'text-gray-400')}>
                  {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                  {trend === 'up' ? 'Rising' : trend === 'down' ? 'Falling' : 'Stable'}
                </span>
              )}
            </div>
          </div>
        </div>

        {baseFee !== undefined && (
          <div className="text-right text-sm">
            <div className="text-gray-400">Base Fee</div>
            <div className="text-white">{baseFee.toFixed(2)} {unit}</div>
          </div>
        )}
      </div>

      {/* Speed selector */}
      <div className="grid grid-cols-4 gap-2">
        {speeds.map(([speed, price]) => {
          const config = speedConfig[speed];
          const Icon = config.icon;
          const isSelected = selectedSpeed === speed;

          return (
            <button
              key={speed}
              onClick={() => onSpeedSelect?.(speed)}
              className={cn(
                'relative p-3 rounded-xl text-center transition-all',
                isSelected
                  ? 'bg-blue-600/20 border-2 border-blue-500/50'
                  : 'bg-white/[0.02] border-2 border-transparent hover:bg-white/[0.05]'
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="gas-selected"
                  className="absolute inset-0 rounded-xl bg-blue-500/10"
                />
              )}
              <div className="relative">
                <Icon className={cn('w-4 h-4 mx-auto mb-1', config.color)} />
                <div className="text-xs text-gray-400">{config.label}</div>
                <div className="text-sm font-semibold text-white">{price}</div>
                <div className="text-[10px] text-gray-500">{config.time}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Compact inline gas display
export function GasIndicator({
  gasPrice,
  unit = 'Gwei',
  className,
}: {
  gasPrice: number;
  unit?: string;
  className?: string;
}) {
  const level = gasPrice < 30 ? 'low' : gasPrice < 60 ? 'medium' : 'high';
  const colors = {
    low: 'text-green-400 bg-green-500/10',
    medium: 'text-yellow-400 bg-yellow-500/10',
    high: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-lg', colors[level], className)}>
      <Fuel className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{gasPrice} {unit}</span>
    </div>
  );
}

// Gas estimation for transaction
export function GasEstimate({
  gasLimit,
  gasPrice,
  estimatedCost,
  currency = 'ETH',
  usdValue,
  className,
}: {
  gasLimit: number;
  gasPrice: number;
  estimatedCost: number;
  currency?: string;
  usdValue?: number;
  className?: string;
}) {
  return (
    <div className={cn('p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Gas Limit</span>
        <span className="text-white font-mono">{gasLimit.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Gas Price</span>
        <span className="text-white">{gasPrice} Gwei</span>
      </div>
      <hr className="border-white/5" />
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Estimated Fee</span>
        <div className="text-right">
          <div className="font-semibold text-white">
            {estimatedCost.toFixed(6)} {currency}
          </div>
          {usdValue !== undefined && (
            <div className="text-xs text-gray-500">${usdValue.toFixed(2)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GasTracker;
