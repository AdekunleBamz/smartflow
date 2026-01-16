// Toggle/Switch component
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 16 },
  md: { track: 'w-10 h-5', thumb: 'w-4 h-4', translate: 20 },
  lg: { track: 'w-12 h-6', thumb: 'w-5 h-5', translate: 24 },
};

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className,
}: ToggleProps) {
  const config = sizeConfig[size];

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative rounded-full transition-colors',
          config.track,
          checked ? 'bg-accent' : 'bg-white/20'
        )}
      >
        <motion.div
          initial={false}
          animate={{ x: checked ? config.translate : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md',
            config.thumb
          )}
        />
      </button>
      {label && (
        <span className="text-sm text-gray-300">{label}</span>
      )}
    </label>
  );
}
