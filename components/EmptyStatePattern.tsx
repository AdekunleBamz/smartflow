'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Inbox, 
  Search, 
  AlertCircle, 
  WifiOff, 
  FileQuestion,
  Wallet,
  TrendingUp,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

type EmptyStateVariant = 
  | 'no-data' 
  | 'no-results' 
  | 'error' 
  | 'offline'
  | 'no-wallet'
  | 'no-alerts'
  | 'no-transactions';

interface EmptyStatePatternProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantConfig: Record<EmptyStateVariant, { icon: React.ReactNode; title: string; description: string }> = {
  'no-data': {
    icon: <Inbox className="w-12 h-12" />,
    title: 'No data yet',
    description: 'Start by adding some data to see it here.',
  },
  'no-results': {
    icon: <Search className="w-12 h-12" />,
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
  },
  'error': {
    icon: <AlertCircle className="w-12 h-12" />,
    title: 'Something went wrong',
    description: 'We encountered an error loading this content. Please try again.',
  },
  'offline': {
    icon: <WifiOff className="w-12 h-12" />,
    title: 'You\'re offline',
    description: 'Check your internet connection and try again.',
  },
  'no-wallet': {
    icon: <Wallet className="w-12 h-12" />,
    title: 'Connect your wallet',
    description: 'Connect a wallet to start tracking smart money movements.',
  },
  'no-alerts': {
    icon: <Bell className="w-12 h-12" />,
    title: 'No alerts configured',
    description: 'Set up alerts to get notified about smart money activity.',
  },
  'no-transactions': {
    icon: <TrendingUp className="w-12 h-12" />,
    title: 'No transactions yet',
    description: 'Transactions from tracked wallets will appear here.',
  },
};

const sizeConfig = {
  sm: {
    container: 'py-8',
    icon: 'w-10 h-10',
    title: 'text-base',
    description: 'text-sm',
    button: 'text-sm px-3 py-1.5',
  },
  md: {
    container: 'py-12',
    icon: 'w-12 h-12',
    title: 'text-lg',
    description: 'text-sm',
    button: 'text-sm px-4 py-2',
  },
  lg: {
    container: 'py-16',
    icon: 'w-16 h-16',
    title: 'text-xl',
    description: 'text-base',
    button: 'text-base px-5 py-2.5',
  },
};

export function EmptyStatePattern({
  variant = 'no-data',
  title,
  description,
  action,
  secondaryAction,
  icon,
  className,
  size = 'md',
}: EmptyStatePatternProps) {
  const config = variantConfig[variant];
  const sizeClasses = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses.container,
        className
      )}
    >
      <div className="p-4 rounded-full bg-white/5 text-gray-400 mb-4">
        {icon || React.cloneElement(config.icon as React.ReactElement, {
          className: sizeClasses.icon,
        })}
      </div>
      
      <h3 className={cn('font-semibold text-white mb-2', sizeClasses.title)}>
        {title || config.title}
      </h3>
      
      <p className={cn('text-gray-400 max-w-sm mb-6', sizeClasses.description)}>
        {description || config.description}
      </p>
      
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'rounded-lg bg-blue-600 hover:bg-blue-700',
                'text-white font-medium transition-colors',
                sizeClasses.button
              )}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={cn(
                'rounded-lg bg-white/10 hover:bg-white/20',
                'text-white font-medium transition-colors',
                sizeClasses.button
              )}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default EmptyStatePattern;
