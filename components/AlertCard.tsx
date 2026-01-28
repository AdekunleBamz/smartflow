'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  X,
  Bell,
  ArrowRight
} from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertCardProps {
  type: AlertType;
  title: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: React.ReactNode;
}

const alertConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-300',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    iconColor: 'text-green-400',
    titleColor: 'text-green-300',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    iconColor: 'text-yellow-400',
    titleColor: 'text-yellow-300',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    iconColor: 'text-red-400',
    titleColor: 'text-red-300',
  },
};

export function AlertCard({
  type,
  title,
  message,
  dismissible = false,
  onDismiss,
  action,
  className,
  children,
}: AlertCardProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl border',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
      
      <div className="flex-1 min-w-0">
        <h4 className={cn('font-medium', config.titleColor)}>{title}</h4>
        {message && <p className="mt-1 text-sm text-gray-400">{message}</p>}
        {children}
        
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              'mt-3 inline-flex items-center gap-1 text-sm font-medium',
              config.iconColor,
              'hover:underline'
            )}
          >
            {action.label}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

// Banner variant for full-width alerts
export function AlertBanner({
  type,
  message,
  dismissible,
  onDismiss,
  action,
  className,
}: Omit<AlertCardProps, 'title' | 'children'> & { message: string }) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-3 px-4 py-2', config.bgColor, className)}>
      <Icon className={cn('w-4 h-4 flex-shrink-0', config.iconColor)} />
      <span className="flex-1 text-sm text-gray-300">{message}</span>
      
      {action && (
        <button
          onClick={action.onClick}
          className={cn('text-sm font-medium', config.iconColor, 'hover:underline')}
        >
          {action.label}
        </button>
      )}
      
      {dismissible && onDismiss && (
        <button onClick={onDismiss} className="p-1 text-gray-500 hover:text-gray-300">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Notification toast style
export function AlertToast({
  type,
  title,
  message,
  onDismiss,
  className,
}: Omit<AlertCardProps, 'dismissible' | 'action' | 'children'>) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl',
        'bg-gray-900 border border-white/10 shadow-xl',
        'min-w-[300px] max-w-[400px]',
        className
      )}
    >
      <div className={cn('p-1.5 rounded-lg', config.bgColor)}>
        <Icon className={cn('w-4 h-4', config.iconColor)} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white">{title}</h4>
        {message && <p className="mt-0.5 text-sm text-gray-400 line-clamp-2">{message}</p>}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 text-gray-500 hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

// Price alert notification
export function PriceAlertCard({
  symbol,
  targetPrice,
  currentPrice,
  type,
  triggered,
  onRemove,
  className,
}: {
  symbol: string;
  targetPrice: number;
  currentPrice: number;
  type: 'above' | 'below';
  triggered?: boolean;
  onRemove?: () => void;
  className?: string;
}) {
  const isAbove = type === 'above';
  const progress = isAbove
    ? Math.min((currentPrice / targetPrice) * 100, 100)
    : Math.min((targetPrice / currentPrice) * 100, 100);

  return (
    <div className={cn(
      'p-4 rounded-xl border',
      triggered
        ? 'bg-green-500/10 border-green-500/20'
        : 'bg-white/[0.02] border-white/10',
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Bell className={cn('w-4 h-4', triggered ? 'text-green-400' : 'text-gray-400')} />
          <span className="font-medium text-white">{symbol}</span>
        </div>
        {onRemove && (
          <button onClick={onRemove} className="p-1 text-gray-500 hover:text-gray-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="text-sm text-gray-400 mb-2">
        Alert when price {isAbove ? 'above' : 'below'} ${targetPrice.toFixed(2)}
      </div>
      
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', triggered ? 'bg-green-500' : 'bg-blue-500')}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default AlertCard;
