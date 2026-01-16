'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Wallet rank display
interface WalletRankBadgeProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const rankStyles: Record<number, string> = {
  1: 'from-amber-400 to-yellow-600',
  2: 'from-gray-300 to-gray-500',
  3: 'from-amber-600 to-amber-800',
};

const sizeStyles = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export function WalletRankBadge({ rank, size = 'md', className }: WalletRankBadgeProps) {
  const isTopThree = rank <= 3;

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-bold',
        isTopThree
          ? `bg-gradient-to-br ${rankStyles[rank]} text-black`
          : 'bg-white/10 text-gray-400',
        sizeStyles[size],
        className
      )}
    >
      {rank}
    </div>
  );
}

// Wallet display card
interface WalletCardProps {
  address: string;
  name?: string;
  rank?: number;
  balance?: string;
  pnl?: number;
  winRate?: number;
  avatar?: string;
  verified?: boolean;
  onClick?: () => void;
  className?: string;
}

export function WalletCard({
  address,
  name,
  rank,
  balance,
  pnl,
  winRate,
  avatar,
  verified,
  onClick,
  className,
}: WalletCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl border transition-all',
        'bg-white/5 border-white/10 hover:border-purple-500/30',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        {rank && <WalletRankBadge rank={rank} />}

        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-white">
                {address.slice(2, 4).toUpperCase()}
              </span>
            )}
          </div>
          {verified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {name ? (
              <span className="font-semibold text-white truncate">{name}</span>
            ) : (
              <span className="font-mono text-white truncate">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            )}
          </div>
          {name && (
            <div className="text-xs text-gray-500 font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="text-right">
          {balance && (
            <div className="font-semibold text-white">{balance}</div>
          )}
          {pnl !== undefined && (
            <div className={cn(
              'text-sm font-medium',
              pnl > 0 ? 'text-emerald-400' : pnl < 0 ? 'text-red-400' : 'text-gray-400'
            )}>
              {pnl > 0 && '+'}
              {pnl.toFixed(2)}%
            </div>
          )}
        </div>
      </div>

      {/* Bottom stats */}
      {winRate !== undefined && (
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-sm">
          <span className="text-gray-400">Win Rate</span>
          <span className="font-medium text-white">{winRate.toFixed(1)}%</span>
        </div>
      )}
    </motion.div>
  );
}

// Mini wallet display
interface MiniWalletProps {
  address: string;
  name?: string;
  className?: string;
}

export function MiniWallet({ address, name, className }: MiniWalletProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">
          {address.slice(2, 4).toUpperCase()}
        </span>
      </div>
      <span className="text-sm text-white font-mono">
        {name || `${address.slice(0, 6)}...${address.slice(-4)}`}
      </span>
    </div>
  );
}
