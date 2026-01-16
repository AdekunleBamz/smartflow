'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Transaction type badges
type TransactionType = 'buy' | 'sell' | 'swap' | 'transfer' | 'mint' | 'burn' | 'stake' | 'unstake';

interface TransactionBadgeProps {
  type: TransactionType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const typeStyles: Record<TransactionType, string> = {
  buy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  sell: 'bg-red-500/20 text-red-400 border-red-500/30',
  swap: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  transfer: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  mint: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  burn: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  stake: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  unstake: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function TransactionBadge({ type, size = 'md', className }: TransactionBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border uppercase tracking-wide',
        typeStyles[type],
        sizeStyles[size],
        className
      )}
    >
      {type}
    </span>
  );
}

// Transaction row component
interface TransactionRowProps {
  hash: string;
  type: TransactionType;
  from: string;
  to: string;
  amount: string;
  token: string;
  value?: string;
  timestamp: string;
  onClick?: () => void;
}

export function TransactionRow({
  hash,
  type,
  from,
  to,
  amount,
  token,
  value,
  timestamp,
  onClick,
}: TransactionRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl',
        'bg-white/5 border border-white/10',
        'hover:bg-white/10 transition-colors',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Transaction type */}
      <TransactionBadge type={type} />

      {/* Addresses */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">From</span>
          <span className="font-mono text-white truncate">
            {from.slice(0, 6)}...{from.slice(-4)}
          </span>
          <span className="text-gray-400">→</span>
          <span className="font-mono text-white truncate">
            {to.slice(0, 6)}...{to.slice(-4)}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1 font-mono">
          {hash.slice(0, 10)}...{hash.slice(-8)}
        </div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <div className="font-medium text-white">
          {amount} {token}
        </div>
        {value && <div className="text-sm text-gray-400">{value}</div>}
      </div>

      {/* Timestamp */}
      <div className="text-sm text-gray-400 w-20 text-right">{timestamp}</div>
    </motion.div>
  );
}

// Transaction list
interface TransactionListProps {
  transactions: Array<{
    hash: string;
    type: TransactionType;
    from: string;
    to: string;
    amount: string;
    token: string;
    value?: string;
    timestamp: string;
  }>;
  onTransactionClick?: (hash: string) => void;
  className?: string;
}

export function TransactionList({
  transactions,
  onTransactionClick,
  className,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No transactions found
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {transactions.map((tx, index) => (
        <TransactionRow
          key={tx.hash}
          {...tx}
          onClick={() => onTransactionClick?.(tx.hash)}
        />
      ))}
    </div>
  );
}
