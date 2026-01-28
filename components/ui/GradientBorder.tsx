'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GradientBorderProps {
  children: React.ReactNode;
  gradient?: string;
  borderWidth?: number;
  borderRadius?: string;
  animate?: boolean;
  className?: string;
  innerClassName?: string;
}

const PRESET_GRADIENTS = {
  rainbow: 'linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #ff0080)',
  blue: 'linear-gradient(135deg, #667eea, #764ba2)',
  green: 'linear-gradient(135deg, #11998e, #38ef7d)',
  purple: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
  sunset: 'linear-gradient(135deg, #fa709a, #fee140)',
  ocean: 'linear-gradient(135deg, #2193b0, #6dd5ed)',
  fire: 'linear-gradient(135deg, #f12711, #f5af19)',
  neon: 'linear-gradient(90deg, #00f5ff, #ff00ff, #00f5ff)',
};

export function GradientBorder({
  children,
  gradient = PRESET_GRADIENTS.purple,
  borderWidth = 2,
  borderRadius = '12px',
  animate = false,
  className,
  innerClassName,
}: GradientBorderProps) {
  return (
    <div
      className={cn(
        'relative p-[var(--border-width)]',
        animate && 'animate-gradient-x',
        className
      )}
      style={{
        '--border-width': `${borderWidth}px`,
        background: gradient,
        backgroundSize: animate ? '200% 200%' : '100% 100%',
        borderRadius,
      } as React.CSSProperties}
    >
      <div
        className={cn(
          'relative bg-gray-900 h-full w-full',
          innerClassName
        )}
        style={{ borderRadius: `calc(${borderRadius} - ${borderWidth}px)` }}
      >
        {children}
      </div>
    </div>
  );
}

// Card with gradient border
interface GradientCardProps extends Omit<GradientBorderProps, 'children'> {
  children: React.ReactNode;
  padding?: string;
  hover?: boolean;
}

export function GradientCard({
  children,
  padding = 'p-6',
  hover = true,
  ...borderProps
}: GradientCardProps) {
  return (
    <GradientBorder
      {...borderProps}
      className={cn(
        borderProps.className,
        hover && 'transition-transform duration-300 hover:scale-[1.02]'
      )}
      innerClassName={cn(padding, borderProps.innerClassName)}
    >
      {children}
    </GradientBorder>
  );
}

// Button with gradient border
interface GradientButtonProps {
  children: React.ReactNode;
  gradient?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GradientButton({
  children,
  gradient = PRESET_GRADIENTS.purple,
  onClick,
  disabled = false,
  size = 'md',
  className,
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative group overflow-hidden rounded-lg',
        'font-medium text-white',
        'transition-all duration-300',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{ background: gradient }}
    >
      <span
        className={cn(
          'relative z-10 flex items-center justify-center gap-2',
          sizeClasses[size]
        )}
      >
        {children}
      </span>
      <div
        className={cn(
          'absolute inset-0 bg-black/0 group-hover:bg-black/20',
          'transition-colors duration-300'
        )}
      />
    </button>
  );
}

// Export preset gradients for reuse
export const gradients = PRESET_GRADIENTS;

export default GradientBorder;
