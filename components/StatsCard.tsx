'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  description?: string;
  loading?: boolean;
  className?: string;
  valueClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  description,
  loading = false,
  className,
  valueClassName,
  size = 'md',
}: StatsCardProps) {
  const sizeClasses = {
    sm: {
      padding: 'p-4',
      title: 'text-xs',
      value: 'text-xl',
      icon: 'w-8 h-8',
    },
    md: {
      padding: 'p-5',
      title: 'text-sm',
      value: 'text-2xl',
      icon: 'w-10 h-10',
    },
    lg: {
      padding: 'p-6',
      title: 'text-base',
      value: 'text-3xl',
      icon: 'w-12 h-12',
    },
  };

  const classes = sizeClasses[size];

  const changeColors = {
    increase: 'text-green-500',
    decrease: 'text-red-500',
    neutral: 'text-gray-400',
  };

  const ChangeIcon = change?.type === 'increase' 
    ? TrendingUp 
    : change?.type === 'decrease' 
      ? TrendingDown 
      : Minus;

  if (loading) {
    return (
      <div
        className={cn(
          'rounded-xl bg-white/5 border border-white/10',
          classes.padding,
          className
        )}
      >
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="h-8 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl bg-white/5 border border-white/10',
        'hover:bg-white/[0.07] hover:border-white/20',
        'transition-all duration-200',
        classes.padding,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn('text-gray-400 font-medium', classes.title)}>
            {title}
          </p>
          
          <p className={cn(
            'font-bold text-white tabular-nums',
            classes.value,
            valueClassName
          )}>
            {value}
          </p>

          {change && (
            <div className="flex items-center gap-1.5">
              <ChangeIcon className={cn('w-4 h-4', changeColors[change.type])} />
              <span className={cn('text-sm font-medium', changeColors[change.type])}>
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
              {change.label && (
                <span className="text-sm text-gray-500">{change.label}</span>
              )}
            </div>
          )}

          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>

        {icon && (
          <div className={cn(
            'flex items-center justify-center rounded-lg',
            'bg-white/5',
            classes.icon
          )}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Grid layout for multiple stats
interface StatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ children, columns = 4, className }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  );
}

export default StatsCard;
