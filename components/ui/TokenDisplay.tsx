'use client';

import { cn } from '@/lib/utils';

// Token display with icon
interface TokenDisplayProps {
  symbol: string;
  name?: string;
  iconUrl?: string;
  amount?: string;
  value?: string;
  change?: number;
  size?: 'sm' | 'md' | 'lg';
  showChange?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: {
    container: 'gap-2',
    icon: 'w-6 h-6',
    symbol: 'text-sm',
    amount: 'text-xs',
  },
  md: {
    container: 'gap-3',
    icon: 'w-8 h-8',
    symbol: 'text-base',
    amount: 'text-sm',
  },
  lg: {
    container: 'gap-4',
    icon: 'w-10 h-10',
    symbol: 'text-lg',
    amount: 'text-base',
  },
};

export function TokenDisplay({
  symbol,
  name,
  iconUrl,
  amount,
  value,
  change,
  size = 'md',
  showChange = true,
  className,
}: TokenDisplayProps) {
  const styles = sizeStyles[size];

  return (
    <div className={cn('flex items-center', styles.container, className)}>
      {/* Token icon */}
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20',
          'flex items-center justify-center overflow-hidden',
          styles.icon
        )}
      >
        {iconUrl ? (
          <img src={iconUrl} alt={symbol} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-bold text-purple-400">
            {symbol.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Token info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('font-semibold text-white', styles.symbol)}>
            {symbol}
          </span>
          {name && (
            <span className="text-gray-400 truncate text-sm">{name}</span>
          )}
        </div>
        {(amount || value) && (
          <div className={cn('flex items-center gap-2 text-gray-400', styles.amount)}>
            {amount && <span>{amount}</span>}
            {value && <span>({value})</span>}
          </div>
        )}
      </div>

      {/* Price change */}
      {showChange && change !== undefined && (
        <div
          className={cn(
            'text-sm font-medium',
            change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-gray-400'
          )}
        >
          {change > 0 && '+'}
          {change.toFixed(2)}%
        </div>
      )}
    </div>
  );
}

// Token pair display
interface TokenPairProps {
  token0: { symbol: string; iconUrl?: string };
  token1: { symbol: string; iconUrl?: string };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const pairSizeStyles = {
  sm: { icon: 'w-5 h-5', overlap: '-ml-1.5' },
  md: { icon: 'w-7 h-7', overlap: '-ml-2' },
  lg: { icon: 'w-9 h-9', overlap: '-ml-2.5' },
};

export function TokenPair({ token0, token1, size = 'md', className }: TokenPairProps) {
  const styles = pairSizeStyles[size];

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex items-center">
        <div
          className={cn(
            'rounded-full bg-gray-800 flex items-center justify-center z-10',
            styles.icon
          )}
        >
          {token0.iconUrl ? (
            <img src={token0.iconUrl} alt={token0.symbol} className="w-full h-full rounded-full" />
          ) : (
            <span className="text-xs font-bold text-purple-400">
              {token0.symbol.slice(0, 2)}
            </span>
          )}
        </div>
        <div
          className={cn(
            'rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-900',
            styles.icon,
            styles.overlap
          )}
        >
          {token1.iconUrl ? (
            <img src={token1.iconUrl} alt={token1.symbol} className="w-full h-full rounded-full" />
          ) : (
            <span className="text-xs font-bold text-blue-400">
              {token1.symbol.slice(0, 2)}
            </span>
          )}
        </div>
      </div>
      <span className="ml-2 font-medium text-white">
        {token0.symbol}/{token1.symbol}
      </span>
    </div>
  );
}
