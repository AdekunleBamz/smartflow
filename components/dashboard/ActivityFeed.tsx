// Activity feed container
'use client';

import { ActivityFeedItem } from './ActivityFeedItem';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Activity } from 'lucide-react';

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

interface ActivityFeedProps {
  items: ActivityItem[];
  loading?: boolean;
  maxItems?: number;
}

export function ActivityFeed({ items, loading = false, maxItems = 10 }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
            <Skeleton variant="rectangular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton width="60%" height={16} />
              <Skeleton width="30%" height={12} />
            </div>
            <div className="text-right space-y-2">
              <Skeleton width={80} height={16} />
              <Skeleton width={60} height={12} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Activity className="h-12 w-12 text-text-tertiary" />}
        title="No activity yet"
        description="Smart money flows will appear here when detected"
      />
    );
  }

  const displayItems = items.slice(0, maxItems);

  return (
    <div className="space-y-2 divide-y divide-white/5">
      {displayItems.map((item, index) => (
        <ActivityFeedItem
          key={item.id}
          item={item}
          index={index}
        />
      ))}
    </div>
  );
}
