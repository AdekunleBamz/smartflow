'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
  variant?: 'switch' | 'buttons' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: { button: 'p-1.5', icon: 'w-4 h-4' },
  md: { button: 'p-2', icon: 'w-5 h-5' },
  lg: { button: 'p-2.5', icon: 'w-6 h-6' },
};

export function ThemeToggle({
  theme,
  onChange,
  variant = 'switch',
  size = 'md',
  className,
}: ThemeToggleProps) {
  const sizes = sizeClasses[size];

  if (variant === 'switch') {
    const isDark = theme === 'dark';

    return (
      <button
        onClick={() => onChange(isDark ? 'light' : 'dark')}
        className={cn(
          'relative flex items-center gap-1 p-1 rounded-full',
          'bg-white/5 border border-white/10',
          className
        )}
      >
        <span
          className={cn(
            sizes.button,
            'rounded-full transition-colors',
            !isDark && 'text-yellow-500'
          )}
        >
          <Sun className={sizes.icon} />
        </span>
        <span
          className={cn(
            sizes.button,
            'rounded-full transition-colors',
            isDark && 'text-blue-400'
          )}
        >
          <Moon className={sizes.icon} />
        </span>
        <motion.div
          layoutId="theme-toggle-indicator"
          className={cn(
            'absolute top-1 w-8 h-8 bg-white/10 rounded-full',
            size === 'sm' && 'w-6 h-6',
            size === 'lg' && 'w-10 h-10'
          )}
          animate={{ x: isDark ? '100%' : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    );
  }

  if (variant === 'buttons') {
    const themes: { value: Theme; icon: React.ComponentType<any>; label: string }[] = [
      { value: 'light', icon: Sun, label: 'Light' },
      { value: 'dark', icon: Moon, label: 'Dark' },
      { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
      <div className={cn('inline-flex p-1 bg-white/5 rounded-xl', className)}>
        {themes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={cn(
              'relative flex items-center gap-2 px-3 py-1.5 rounded-lg',
              'text-sm font-medium transition-colors',
              theme === value ? 'text-white' : 'text-gray-400 hover:text-gray-200'
            )}
          >
            {theme === value && (
              <motion.div
                layoutId="theme-buttons-bg"
                className="absolute inset-0 bg-white/10 rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className={cn('relative z-10', sizes.icon)} />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={cn('relative group', className)}>
      <button
        className={cn(
          sizes.button,
          'rounded-xl bg-white/5 hover:bg-white/10 transition-colors'
        )}
      >
        {theme === 'light' && <Sun className={cn(sizes.icon, 'text-yellow-500')} />}
        {theme === 'dark' && <Moon className={cn(sizes.icon, 'text-blue-400')} />}
        {theme === 'system' && <Monitor className={cn(sizes.icon, 'text-gray-400')} />}
      </button>
      
      <div className={cn(
        'absolute right-0 top-full mt-2 py-2',
        'bg-gray-900 border border-white/10 rounded-xl shadow-xl',
        'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
        'transition-all min-w-[140px]'
      )}>
        <button
          onClick={() => onChange('light')}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-2 text-sm',
            'hover:bg-white/5 transition-colors',
            theme === 'light' ? 'text-yellow-500' : 'text-gray-400'
          )}
        >
          <Sun className="w-4 h-4" />
          Light
        </button>
        <button
          onClick={() => onChange('dark')}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-2 text-sm',
            'hover:bg-white/5 transition-colors',
            theme === 'dark' ? 'text-blue-400' : 'text-gray-400'
          )}
        >
          <Moon className="w-4 h-4" />
          Dark
        </button>
        <button
          onClick={() => onChange('system')}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-2 text-sm',
            'hover:bg-white/5 transition-colors',
            theme === 'system' ? 'text-white' : 'text-gray-400'
          )}
        >
          <Monitor className="w-4 h-4" />
          System
        </button>
      </div>
    </div>
  );
}

// Accent color picker
export function AccentColorPicker({
  color,
  onChange,
  className,
}: {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}) {
  const colors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Green', value: '#22C55E' },
    { name: 'Cyan', value: '#06B6D4' },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Accent Color</span>
      </div>
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            className={cn(
              'w-8 h-8 rounded-full transition-transform hover:scale-110',
              color === c.value && 'ring-2 ring-white ring-offset-2 ring-offset-gray-900'
            )}
            style={{ backgroundColor: c.value }}
            title={c.name}
          />
        ))}
      </div>
    </div>
  );
}

export default ThemeToggle;
