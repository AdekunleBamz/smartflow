'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const icons: Record<AlertVariant, React.ReactNode> = {
  info: <Info className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
};

const styles: Record<AlertVariant, string> = {
  info: 'bg-accent/10 border-accent/30 text-accent',
  success: 'bg-green-500/10 border-green-500/30 text-green-400',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
};

export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}: AlertProps) {
  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        styles[variant],
        className
      )}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[variant]}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close alert"
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
