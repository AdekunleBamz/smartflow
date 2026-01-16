// Status indicator component
'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type StatusType = 'online' | 'offline' | 'loading' | 'warning' | 'error';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  showPulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusColors = {
  online: 'bg-profit',
  offline: 'bg-text-tertiary',
  loading: 'bg-primary',
  warning: 'bg-warning',
  error: 'bg-loss',
};

const statusLabels = {
  online: 'Online',
  offline: 'Offline',
  loading: 'Loading',
  warning: 'Warning',
  error: 'Error',
};

const sizes = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
};

export function StatusIndicator({
  status,
  label,
  showPulse = true,
  size = 'md',
  className,
}: StatusIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="relative flex">
        <span
          className={cn(
            'rounded-full',
            statusColors[status],
            sizes[size]
          )}
        />
        {showPulse && (status === 'online' || status === 'loading') && (
          <motion.span
            className={cn(
              'absolute inset-0 rounded-full',
              statusColors[status]
            )}
            animate={{
              scale: [1, 2],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </span>
      {label !== undefined && (
        <span className="text-sm text-text-secondary">
          {label || statusLabels[status]}
        </span>
      )}
    </div>
  );
}

// Connection status for wallet/API
interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting?: boolean;
  className?: string;
}

export function ConnectionStatus({
  isConnected,
  isConnecting,
  className,
}: ConnectionStatusProps) {
  const status: StatusType = isConnecting
    ? 'loading'
    : isConnected
    ? 'online'
    : 'offline';

  const label = isConnecting
    ? 'Connecting...'
    : isConnected
    ? 'Connected'
    : 'Disconnected';

  return (
    <StatusIndicator
      status={status}
      label={label}
      className={className}
    />
  );
}
