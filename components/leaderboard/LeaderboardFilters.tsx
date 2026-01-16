// Leaderboard filter bar component
'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardFilters {
  search: string;
  minTrades: number | null;
  minProfit: number | null;
  timeRange: '7d' | '30d' | '90d' | 'all';
}

interface LeaderboardFiltersProps {
  filters: LeaderboardFilters;
  onChange: (filters: LeaderboardFilters) => void;
}

const timeRanges = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: 'all', label: 'All Time' },
];

const tradeThresholds = [
  { value: null, label: 'Any' },
  { value: 10, label: '10+' },
  { value: 50, label: '50+' },
  { value: 100, label: '100+' },
  { value: 500, label: '500+' },
];

export function LeaderboardFiltersBar({ filters, onChange }: LeaderboardFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = <K extends keyof LeaderboardFilters>(
    key: K,
    value: LeaderboardFilters[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onChange({
      search: '',
      minTrades: null,
      minProfit: null,
      timeRange: '30d',
    });
  };

  const hasActiveFilters = filters.minTrades || filters.minProfit || filters.timeRange !== '30d';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] max-w-md">
          <SearchInput
            value={filters.search}
            onChange={(value) => updateFilter('search', value)}
            placeholder="Search by address or label..."
          />
        </div>

        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-6 flex-wrap p-4 rounded-lg bg-white/5">
              {/* Time Range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-tertiary uppercase">
                  Time Range
                </label>
                <div className="flex gap-1">
                  {timeRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => updateFilter('timeRange', range.value as LeaderboardFilters['timeRange'])}
                      className={cn(
                        'px-3 py-1.5 text-xs rounded-md transition-colors',
                        filters.timeRange === range.value
                          ? 'bg-primary text-white'
                          : 'bg-white/5 text-text-secondary hover:bg-white/10'
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Trades */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-tertiary uppercase">
                  Min Trades
                </label>
                <div className="flex gap-1">
                  {tradeThresholds.map((threshold) => (
                    <button
                      key={threshold.value ?? 'any'}
                      onClick={() => updateFilter('minTrades', threshold.value)}
                      className={cn(
                        'px-3 py-1.5 text-xs rounded-md transition-colors',
                        filters.minTrades === threshold.value
                          ? 'bg-primary text-white'
                          : 'bg-white/5 text-text-secondary hover:bg-white/10'
                      )}
                    >
                      {threshold.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
