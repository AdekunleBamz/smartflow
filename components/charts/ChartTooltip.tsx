'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TooltipProps } from 'recharts';

interface ChartTooltipProps extends TooltipProps<number, string> {
  formatValue?: (value: number) => string;
  formatLabel?: (label: string) => string;
  title?: string;
  className?: string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatValue = (v) => v.toLocaleString(),
  formatLabel = (l) => l,
  title,
  className,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-gray-900/95 backdrop-blur-sm',
        'border border-white/10 rounded-lg shadow-xl',
        'px-3 py-2 min-w-[120px]',
        className
      )}
    >
      {title && (
        <div className="text-xs text-gray-500 mb-1">{title}</div>
      )}
      {label && (
        <div className="text-sm font-medium text-white mb-2">
          {formatLabel(String(label))}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div
            key={`item-${index}`}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-400">
                {entry.name || entry.dataKey}
              </span>
            </div>
            <span className="text-sm font-medium text-white tabular-nums">
              {formatValue(Number(entry.value))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Specialized tooltips for common use cases
interface PriceTooltipProps extends Omit<ChartTooltipProps, 'formatValue'> {
  currency?: string;
  decimals?: number;
}

export function PriceChartTooltip({
  currency = '$',
  decimals = 2,
  ...props
}: PriceTooltipProps) {
  return (
    <ChartTooltip
      {...props}
      formatValue={(value) =>
        `${currency}${value.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`
      }
    />
  );
}

interface PercentageTooltipProps extends Omit<ChartTooltipProps, 'formatValue'> {
  decimals?: number;
}

export function PercentageChartTooltip({
  decimals = 1,
  ...props
}: PercentageTooltipProps) {
  return (
    <ChartTooltip
      {...props}
      formatValue={(value) =>
        `${value.toFixed(decimals)}%`
      }
    />
  );
}

interface VolumeTooltipProps extends Omit<ChartTooltipProps, 'formatValue'> {
  currency?: string;
}

export function VolumeChartTooltip({
  currency = '$',
  ...props
}: VolumeTooltipProps) {
  const formatVolume = (value: number): string => {
    if (value >= 1e9) return `${currency}${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${currency}${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${currency}${(value / 1e3).toFixed(2)}K`;
    return `${currency}${value.toFixed(2)}`;
  };

  return <ChartTooltip {...props} formatValue={formatVolume} />;
}

export default ChartTooltip;
