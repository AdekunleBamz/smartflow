// Dashboard stat card with animation
'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { formatNumber, formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface DashboardStatProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  format?: 'number' | 'currency' | 'percent' | 'none';
  loading?: boolean;
}

export function DashboardStat({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  iconColor = 'text-primary',
  format = 'none',
  loading = false,
}: DashboardStatProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    switch (format) {
      case 'number':
        return formatNumber(val);
      case 'currency':
        return `$${formatNumber(val)}`;
      case 'percent':
        return formatPercent(val);
      default:
        return String(val);
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="h-12 w-12 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover p-6"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary">
            {formatValue(value)}
          </p>
          {change !== undefined && (
            <p className="text-xs text-text-tertiary">
              <span
                className={cn(
                  'font-medium',
                  change > 0 ? 'text-profit' : change < 0 ? 'text-loss' : ''
                )}
              >
                {change > 0 ? '+' : ''}{formatPercent(change)}
              </span>
              {' '}{changeLabel}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl bg-white/5', iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
