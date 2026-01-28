'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type?: 'single' | 'multiple';
}

interface FilterBarProps {
  filters: FilterGroup[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, values: string[]) => void;
  onClearAll?: () => void;
  className?: string;
}

export function FilterBar({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  className,
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const activeCount = Object.values(activeFilters).flat().length;

  const handleOptionClick = (groupId: string, value: string, type: 'single' | 'multiple') => {
    const currentValues = activeFilters[groupId] || [];
    
    if (type === 'single') {
      if (currentValues.includes(value)) {
        onFilterChange(groupId, []);
      } else {
        onFilterChange(groupId, [value]);
      }
      setOpenDropdown(null);
    } else {
      if (currentValues.includes(value)) {
        onFilterChange(groupId, currentValues.filter(v => v !== value));
      } else {
        onFilterChange(groupId, [...currentValues, value]);
      }
    }
  };

  const handleRemoveFilter = (groupId: string, value: string) => {
    const currentValues = activeFilters[groupId] || [];
    onFilterChange(groupId, currentValues.filter(v => v !== value));
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Filter dropdowns */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Filter className="w-4 h-4" />
          <span>Filter:</span>
        </div>
        
        {filters.map((group) => {
          const activeValues = activeFilters[group.id] || [];
          const isOpen = openDropdown === group.id;
          
          return (
            <div key={group.id} className="relative">
              <button
                onClick={() => setOpenDropdown(isOpen ? null : group.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                  'text-sm font-medium transition-colors',
                  activeValues.length > 0
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                )}
              >
                {group.label}
                {activeValues.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                    {activeValues.length}
                  </span>
                )}
                <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenDropdown(null)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        'absolute top-full left-0 mt-1 z-20',
                        'min-w-[200px] py-1',
                        'bg-gray-900 border border-white/10 rounded-lg shadow-xl'
                      )}
                    >
                      {group.options.map((option) => {
                        const isSelected = activeValues.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleOptionClick(group.id, option.value, group.type || 'multiple')}
                            className={cn(
                              'w-full flex items-center gap-2 px-3 py-2 text-sm',
                              'hover:bg-white/5 transition-colors',
                              isSelected ? 'text-blue-400' : 'text-gray-300'
                            )}
                          >
                            {group.type === 'multiple' && (
                              <div className={cn(
                                'w-4 h-4 rounded border-2 flex items-center justify-center',
                                isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-600'
                              )}>
                                {isSelected && <span className="text-white text-xs">✓</span>}
                              </div>
                            )}
                            <span className="flex-1 text-left">{option.label}</span>
                            {option.count !== undefined && (
                              <span className="text-gray-500">{option.count}</span>
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {activeCount > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(activeFilters).map(([groupId, values]) => {
            const group = filters.find(f => f.id === groupId);
            return values.map((value) => {
              const option = group?.options.find(o => o.value === value);
              return (
                <motion.span
                  key={`${groupId}-${value}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2 py-1 rounded-md',
                    'bg-blue-600/20 text-blue-400 text-sm'
                  )}
                >
                  <span className="text-blue-300/70">{group?.label}:</span>
                  {option?.label || value}
                  <button
                    onClick={() => handleRemoveFilter(groupId, value)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.span>
              );
            });
          })}
        </div>
      )}
    </div>
  );
}

export default FilterBar;
