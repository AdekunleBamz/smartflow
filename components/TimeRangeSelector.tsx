'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

export type TimeRange = '1H' | '24H' | '7D' | '30D' | '90D' | '1Y' | 'ALL';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  options?: TimeRange[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'button' | 'underline';
  showIcon?: boolean;
  className?: string;
}

const defaultOptions: TimeRange[] = ['1H', '24H', '7D', '30D', '90D', '1Y', 'ALL'];

const rangeLabels: Record<TimeRange, string> = {
  '1H': '1 Hour',
  '24H': '24 Hours',
  '7D': '7 Days',
  '30D': '30 Days',
  '90D': '90 Days',
  '1Y': '1 Year',
  'ALL': 'All Time',
};

export function TimeRangeSelector({
  value,
  onChange,
  options = defaultOptions,
  size = 'md',
  variant = 'pill',
  showIcon = false,
  className,
}: TimeRangeSelectorProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  if (variant === 'pill') {
    return (
      <div
        className={cn(
          'inline-flex items-center p-1 bg-white/5 rounded-full',
          className
        )}
      >
        {showIcon && (
          <Clock className={cn('ml-2 text-gray-400', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
        )}
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              'relative rounded-full font-medium transition-colors',
              sizeClasses[size],
              value === option ? 'text-white' : 'text-gray-400 hover:text-gray-200'
            )}
          >
            {value === option && (
              <motion.div
                layoutId="timerange-pill"
                className="absolute inset-0 bg-blue-600 rounded-full"
                transition={{ type: 'spring', duration: 0.3 }}
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div className={cn('inline-flex items-center gap-1', className)}>
        {showIcon && <Calendar className="w-4 h-4 text-gray-400 mr-2" />}
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              'relative font-medium transition-colors pb-2',
              sizeClasses[size],
              value === option ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
            )}
          >
            {option}
            {value === option && (
              <motion.div
                layoutId="timerange-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                transition={{ type: 'spring', duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>
    );
  }

  // Button variant
  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {showIcon && <Clock className="w-4 h-4 text-gray-400 mr-2" />}
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            'font-medium rounded-lg transition-all',
            sizeClasses[size],
            value === option
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
          )}
          title={rangeLabels[option]}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

// Compact inline selector for tight spaces
export function TimeRangePicker({
  value,
  onChange,
  className,
}: {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TimeRange)}
      className={cn(
        'bg-white/5 border border-white/10 rounded-lg',
        'px-3 py-1.5 text-sm text-gray-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        'cursor-pointer',
        className
      )}
    >
      {defaultOptions.map((option) => (
        <option key={option} value={option} className="bg-gray-900">
          {rangeLabels[option]}
        </option>
      ))}
    </select>
  );
}

export default TimeRangeSelector;
