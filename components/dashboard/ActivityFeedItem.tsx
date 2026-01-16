// Activity feed item component
'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { formatAddress, formatTokenAmount, formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { CHAIN_CONFIG } from '@/lib/constants';

interface ActivityItem {
  id: string;
  type: 'inflow' | 'outflow' | 'swap';
  wallet: string;
  token: string;
  amount: number;
  value: number;
  txHash: string;
  timestamp: number;
}

interface ActivityFeedItemProps {
  item: ActivityItem;
  index: number;
}

export function ActivityFeedItem({ item, index }: ActivityFeedItemProps) {
  const isInflow = item.type === 'inflow';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
    >
      <div
        className={cn(
          'p-2 rounded-lg',
          isInflow ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
        )}
      >
        {isInflow ? (
          <ArrowDownLeft className="h-5 w-5" />
        ) : (
          <ArrowUpRight className="h-5 w-5" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary truncate">
            {formatAddress(item.wallet)}
          </span>
          <span className="text-xs text-text-tertiary">
            {isInflow ? 'received' : 'sent'}
          </span>
        </div>
        <p className="text-xs text-text-secondary">
          {formatRelativeTime(item.timestamp)}
        </p>
      </div>
      
      <div className="text-right">
        <p className={cn(
          'text-sm font-medium',
          isInflow ? 'text-profit' : 'text-loss'
        )}>
          {isInflow ? '+' : '-'}{formatTokenAmount(item.amount, item.token)}
        </p>
        <p className="text-xs text-text-tertiary">
          ${item.value.toLocaleString()}
        </p>
      </div>
      
      <a
        href={`${CHAIN_CONFIG.BASE.explorerUrl}/tx/${item.txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <ExternalLink className="h-4 w-4 text-text-tertiary" />
      </a>
    </motion.div>
  );
}
