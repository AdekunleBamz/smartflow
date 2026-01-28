'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBadgeProps {
  count?: number;
  showZero?: boolean;
  max?: number;
  dot?: boolean;
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

const colorStyles = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
};

const positionStyles = {
  'top-right': 'top-0 right-0 translate-x-1/3 -translate-y-1/3',
  'top-left': 'top-0 left-0 -translate-x-1/3 -translate-y-1/3',
  'bottom-right': 'bottom-0 right-0 translate-x-1/3 translate-y-1/3',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/3 translate-y-1/3',
};

const sizeStyles = {
  sm: { badge: 'min-w-[16px] h-4 text-[10px] px-1', dot: 'w-2 h-2' },
  md: { badge: 'min-w-[20px] h-5 text-xs px-1.5', dot: 'w-2.5 h-2.5' },
  lg: { badge: 'min-w-[24px] h-6 text-sm px-2', dot: 'w-3 h-3' },
};

export function NotificationBadge({
  count,
  showZero = false,
  max = 99,
  dot = false,
  color = 'red',
  position = 'top-right',
  size = 'md',
  pulse = false,
  children,
  className,
}: NotificationBadgeProps) {
  const showBadge = dot || (count !== undefined && (count > 0 || showZero));
  const displayCount = count !== undefined && count > max ? `${max}+` : count;

  return (
    <div className={cn('relative inline-flex', className)}>
      {children}
      
      <AnimatePresence>
        {showBadge && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(
              'absolute flex items-center justify-center',
              'font-medium text-white rounded-full',
              colorStyles[color],
              positionStyles[position],
              dot ? sizeStyles[size].dot : sizeStyles[size].badge
            )}
          >
            {!dot && displayCount}
            
            {pulse && (
              <span
                className={cn(
                  'absolute inset-0 rounded-full animate-ping',
                  colorStyles[color],
                  'opacity-75'
                )}
              />
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// Standalone badge component
interface BadgeCountProps {
  count: number;
  max?: number;
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BadgeCount({
  count,
  max = 99,
  color = 'red',
  size = 'md',
  className,
}: BadgeCountProps) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'font-medium text-white rounded-full',
        colorStyles[color],
        sizeStyles[size].badge,
        className
      )}
    >
      {displayCount}
    </span>
  );
}

export default NotificationBadge;
