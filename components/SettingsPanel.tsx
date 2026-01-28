'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

interface SettingsItemProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SettingsItem({
  label,
  description,
  icon,
  action,
  onClick,
  className,
}: SettingsItemProps) {
  const isClickable = !!onClick;

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl',
        'bg-white/[0.02] border border-white/5',
        isClickable && 'cursor-pointer hover:bg-white/[0.04] transition-colors',
        className
      )}
      onClick={onClick}
    >
      {icon && <div className="text-gray-400">{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white">{label}</div>
        {description && <div className="text-sm text-gray-400 mt-0.5">{description}</div>}
      </div>
      {action || (isClickable && <ChevronRight className="w-5 h-5 text-gray-500" />)}
    </div>
  );
}

interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function SettingsToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className,
}: SettingsToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl',
        'bg-white/[0.02] border border-white/5',
        disabled && 'opacity-50',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white">{label}</div>
        {description && <div className="text-sm text-gray-400 mt-0.5">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors',
          checked ? 'bg-blue-600' : 'bg-white/10'
        )}
      >
        <motion.span
          animate={{ x: checked ? 20 : 2 }}
          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}

interface SettingsSelectProps {
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}

export function SettingsSelect({
  label,
  description,
  value,
  options,
  onChange,
  className,
}: SettingsSelectProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl',
        'bg-white/[0.02] border border-white/5',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white">{label}</div>
        {description && <div className="text-sm text-gray-400 mt-0.5">{description}</div>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'bg-white/5 border border-white/10 rounded-lg',
          'px-3 py-1.5 text-sm text-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
          'cursor-pointer'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-900">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface SettingsRadioGroupProps {
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string; description?: string }[];
  onChange: (value: string) => void;
  className?: string;
}

export function SettingsRadioGroup({
  label,
  description,
  value,
  options,
  onChange,
  className,
}: SettingsRadioGroupProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div>
        <div className="font-medium text-white">{label}</div>
        {description && <div className="text-sm text-gray-400 mt-0.5">{description}</div>}
      </div>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
              value === option.value
                ? 'bg-blue-600/20 border border-blue-500/30'
                : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                value === option.value ? 'border-blue-500' : 'border-gray-600'
              )}
            >
              {value === option.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{option.label}</div>
              {option.description && (
                <div className="text-xs text-gray-400 mt-0.5">{option.description}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Divider for settings sections
export function SettingsDivider({ className }: { className?: string }) {
  return <hr className={cn('border-white/5 my-6', className)} />;
}

export default SettingsSection;
