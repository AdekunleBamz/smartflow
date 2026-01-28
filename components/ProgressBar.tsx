'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'striped';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

const gradientClasses = {
  blue: 'bg-gradient-to-r from-blue-600 to-cyan-400',
  green: 'bg-gradient-to-r from-green-600 to-emerald-400',
  yellow: 'bg-gradient-to-r from-yellow-600 to-amber-400',
  red: 'bg-gradient-to-r from-red-600 to-rose-400',
  purple: 'bg-gradient-to-r from-purple-600 to-pink-400',
};

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  color = 'blue',
  showLabel = false,
  label,
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full space-y-1', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{label || 'Progress'}</span>
          <span className="font-medium text-white">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-white/10 rounded-full overflow-hidden', sizeClasses[size])}>
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            variant === 'gradient' ? gradientClasses[color] : colorClasses[color],
            variant === 'striped' && 'bg-stripes'
          )}
          style={variant === 'striped' ? {
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )`,
          } : undefined}
        />
      </div>
    </div>
  );
}

// Circular progress
export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = 'blue',
  showValue = true,
  className,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  showValue?: boolean;
  className?: string;
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const strokeColors = {
    blue: '#3B82F6',
    green: '#22C55E',
    yellow: '#EAB308',
    red: '#EF4444',
    purple: '#A855F7',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColors[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute text-white font-semibold" style={{ fontSize: size * 0.2 }}>
          {percentage.toFixed(0)}%
        </div>
      )}
    </div>
  );
}

// Step progress
interface Step {
  label: string;
  description?: string;
  status: 'pending' | 'current' | 'completed' | 'error';
}

export function StepProgress({
  steps,
  orientation = 'horizontal',
  className,
}: {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  return (
    <div
      className={cn(
        orientation === 'horizontal' ? 'flex items-start' : 'flex flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            className={cn(
              orientation === 'horizontal'
                ? 'flex-1 flex items-start'
                : 'flex items-start'
            )}
          >
            <div className="flex flex-col items-center">
              {/* Step indicator */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  'border-2 transition-colors',
                  step.status === 'completed' && 'bg-green-500 border-green-500',
                  step.status === 'current' && 'bg-blue-500 border-blue-500',
                  step.status === 'error' && 'bg-red-500 border-red-500',
                  step.status === 'pending' && 'border-white/20 bg-white/5'
                )}
              >
                {step.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : step.status === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-white" />
                ) : step.status === 'current' ? (
                  <Clock className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-gray-400 font-medium">{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    'text-sm font-medium',
                    step.status === 'pending' ? 'text-gray-400' : 'text-white'
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-500 mt-0.5">{step.description}</div>
                )}
              </div>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  orientation === 'horizontal'
                    ? 'flex-1 h-0.5 mt-5 mx-2'
                    : 'w-0.5 h-8 ml-5 my-2',
                  step.status === 'completed' ? 'bg-green-500' : 'bg-white/10'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressBar;
