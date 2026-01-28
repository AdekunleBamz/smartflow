'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Wallet,
  Image,
  FileText,
  Shield,
  Zap,
  MoreHorizontal,
} from 'lucide-react';

export type ActivityType =
  | 'send'
  | 'receive'
  | 'swap'
  | 'mint'
  | 'burn'
  | 'approve'
  | 'connect'
  | 'disconnect'
  | 'nft_transfer'
  | 'contract';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date | string;
  value?: string;
  status?: 'pending' | 'success' | 'failed';
  icon?: React.ReactNode;
  metadata?: Record<string, string>;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  maxItems?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  onItemClick?: (item: ActivityItem) => void;
  emptyMessage?: string;
  className?: string;
}

const activityConfig: Record<ActivityType, { icon: React.ComponentType<any>; color: string; bgColor: string }> = {
  send: { icon: ArrowUpRight, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  receive: { icon: ArrowDownLeft, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  swap: { icon: Repeat, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  mint: { icon: Zap, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  burn: { icon: Zap, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  approve: { icon: Shield, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  connect: { icon: Wallet, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  disconnect: { icon: Wallet, color: 'text-gray-400', bgColor: 'bg-gray-500/10' },
  nft_transfer: { icon: Image, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
  contract: { icon: FileText, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
};

function formatTimeAgo(timestamp: Date | string): string {
  const date = new Date(timestamp);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

function groupByDate(items: ActivityItem[]): Map<string, ActivityItem[]> {
  const groups = new Map<string, ActivityItem[]>();

  items.forEach((item) => {
    const date = new Date(item.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let key: string;
    if (date.toDateString() === today.toDateString()) {
      key = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = 'Yesterday';
    } else {
      key = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    const existing = groups.get(key) || [];
    groups.set(key, [...existing, item]);
  });

  return groups;
}

export function ActivityFeed({
  items,
  maxItems = 20,
  showLoadMore = false,
  onLoadMore,
  onItemClick,
  emptyMessage = 'No recent activity',
  className,
}: ActivityFeedProps) {
  const displayItems = items.slice(0, maxItems);
  const grouped = groupByDate(displayItems);

  if (items.length === 0) {
    return (
      <div className={cn('py-12 text-center text-gray-400', className)}>
        <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <AnimatePresence>
        {Array.from(grouped.entries()).map(([date, groupItems]) => (
          <motion.div
            key={date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-gray-400 px-1">{date}</h4>
            <div className="space-y-1">
              {groupItems.map((item, index) => (
                <ActivityRow
                  key={item.id}
                  item={item}
                  onClick={() => onItemClick?.(item)}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {showLoadMore && items.length > maxItems && (
        <button
          onClick={onLoadMore}
          className="w-full py-3 text-center text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          Load more
        </button>
      )}
    </div>
  );
}

function ActivityRow({
  item,
  onClick,
  delay = 0,
}: {
  item: ActivityItem;
  onClick?: () => void;
  delay?: number;
}) {
  const config = activityConfig[item.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 p-3 rounded-xl',
        'hover:bg-white/[0.03] transition-colors cursor-pointer'
      )}
    >
      <div className={cn('p-2 rounded-xl', config.bgColor)}>
        {item.icon || <Icon className={cn('w-4 h-4', config.color)} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white truncate">{item.title}</span>
          {item.status === 'pending' && (
            <span className="px-1.5 py-0.5 text-[10px] bg-yellow-500/10 text-yellow-400 rounded">
              Pending
            </span>
          )}
          {item.status === 'failed' && (
            <span className="px-1.5 py-0.5 text-[10px] bg-red-500/10 text-red-400 rounded">
              Failed
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-gray-400 truncate">{item.description}</p>
        )}
      </div>

      <div className="text-right">
        {item.value && (
          <div className={cn('text-sm font-medium', item.type === 'receive' ? 'text-green-400' : 'text-white')}>
            {item.value}
          </div>
        )}
        <div className="text-xs text-gray-500">{formatTimeAgo(item.timestamp)}</div>
      </div>

      <button className="p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Live activity indicator
export function LiveActivityDot({ className }: { className?: string }) {
  return (
    <span className={cn('relative flex h-2 w-2', className)}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

export default ActivityFeed;
