'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-1.5">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-4 py-3',
          'bg-white/5 rounded-xl border transition-all duration-200',
          isOpen
            ? 'border-purple-500 ring-2 ring-purple-500/20'
            : 'border-white/10 hover:border-white/20',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500/50'
        )}
      >
        <span className={cn(
          'flex items-center gap-2 text-left',
          selectedOption ? 'text-white' : 'text-gray-400'
        )}>
          {selectedOption?.icon}
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 w-full mt-2 py-2',
              'bg-gray-900 border border-white/10 rounded-xl',
              'shadow-xl shadow-black/20 max-h-60 overflow-auto'
            )}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  if (!option.disabled) {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
                disabled={option.disabled}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2.5 text-left',
                  'hover:bg-white/5 transition-colors',
                  option.value === value && 'bg-purple-500/10 text-purple-400',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
