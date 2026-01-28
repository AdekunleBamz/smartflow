'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Repeat, ExternalLink, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export type TransactionType = 'send' | 'receive' | 'swap' | 'approve' | 'contract';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

interface TransactionRowProps {
  type: TransactionType;
  status: TransactionStatus;
  hash: string;
  from: string;
  to: string;
  value: string;
  symbol: string;
  timestamp: Date | string;
  gasUsed?: string;
  blockNumber?: number;
  explorerUrl?: string;
  onClick?: () => void;
  className?: string;
}

const typeConfig = {
  send: {
    icon: ArrowUpRight,
    label: 'Sent',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  receive: {
    icon: ArrowDownLeft,
    label: 'Received',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  swap: {
    icon: Repeat,
    label: 'Swapped',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  approve: {
    icon: CheckCircle,
    label: 'Approved',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  contract: {
    icon: ExternalLink,
    label: 'Contract',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
};

const statusConfig = {
  pending: {
    icon: Loader2,
    label: 'Pending',
    color: 'text-yellow-400',
    animate: true,
  },
  confirmed: {
    icon: CheckCircle,
    label: 'Confirmed',
    color: 'text-green-400',
    animate: false,
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    color: 'text-red-400',
    animate: false,
  },
};

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimeAgo(timestamp: Date | string): string {
  const date = new Date(timestamp);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function TransactionRow({
  type,
  status,
  hash,
  from,
  to,
  value,
  symbol,
  timestamp,
  gasUsed,
  blockNumber,
  explorerUrl,
  onClick,
  className,
}: TransactionRowProps) {
  const typeInfo = typeConfig[type];
  const statusInfo = statusConfig[status];
  const TypeIcon = typeInfo.icon;
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group flex items-center gap-4 p-4',
        'bg-white/[0.02] hover:bg-white/[0.05]',
        'border-b border-white/5 last:border-0',
        'transition-colors cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Type Icon */}
      <div className={cn('p-2 rounded-xl', typeInfo.bgColor)}>
        <TypeIcon className={cn('w-5 h-5', typeInfo.color)} />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{typeInfo.label}</span>
          <span className={cn('flex items-center gap-1 text-xs', statusInfo.color)}>
            <StatusIcon className={cn('w-3 h-3', statusInfo.animate && 'animate-spin')} />
            {statusInfo.label}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-0.5">
          <span>{formatAddress(from)}</span>
          <span>→</span>
          <span>{formatAddress(to)}</span>
        </div>
      </div>

      {/* Value */}
      <div className="text-right">
        <div className={cn('font-medium', type === 'receive' ? 'text-green-400' : 'text-white')}>
          {type === 'receive' ? '+' : type === 'send' ? '-' : ''}
          {value} {symbol}
        </div>
        <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {formatTimeAgo(timestamp)}
        </div>
      </div>

      {/* Explorer Link */}
      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
        >
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </a>
      )}
    </motion.div>
  );
}

// Compact variant for lists
export function TransactionRowCompact({
  type,
  status,
  value,
  symbol,
  timestamp,
  className,
}: Pick<TransactionRowProps, 'type' | 'status' | 'value' | 'symbol' | 'timestamp' | 'className'>) {
  const typeInfo = typeConfig[type];
  const TypeIcon = typeInfo.icon;

  return (
    <div className={cn('flex items-center gap-3 py-2', className)}>
      <TypeIcon className={cn('w-4 h-4', typeInfo.color)} />
      <span className="flex-1 text-sm text-gray-300">{typeInfo.label}</span>
      <span className={cn('text-sm font-medium', type === 'receive' ? 'text-green-400' : 'text-white')}>
        {value} {symbol}
      </span>
      <span className="text-xs text-gray-500">{formatTimeAgo(timestamp)}</span>
    </div>
  );
}

export default TransactionRow;
