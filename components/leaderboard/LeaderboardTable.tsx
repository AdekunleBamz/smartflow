// Leaderboard table component
'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Trophy } from 'lucide-react';
import { LeaderboardRow } from './LeaderboardRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import { SmartMoneyWallet } from '@/types';

type SortField = 'totalGains' | 'winRate' | 'trades30d' | 'realizedProfit';
type SortOrder = 'asc' | 'desc';

interface LeaderboardTableProps {
  wallets: SmartMoneyWallet[];
  loading?: boolean;
  onSort?: (field: SortField, order: SortOrder) => void;
}

export function LeaderboardTable({ wallets, loading = false, onSort }: LeaderboardTableProps) {
  const [sortField, setSortField] = useState<SortField>('totalGains');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    const newOrder = field === sortField && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortField(field);
    setSortOrder(newOrder);
    onSort?.(field, newOrder);
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      onClick={() => handleSort(field)}
      className={cn(
        'px-4 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors',
        sortField === field ? 'text-primary' : 'text-text-tertiary'
      )}
    >
      <div className="flex items-center justify-end gap-1">
        {children}
        <span className="flex flex-col">
          <ChevronUp
            className={cn(
              'h-3 w-3 -mb-1',
              sortField === field && sortOrder === 'asc' ? 'text-primary' : 'text-text-tertiary'
            )}
          />
          <ChevronDown
            className={cn(
              'h-3 w-3',
              sortField === field && sortOrder === 'desc' ? 'text-primary' : 'text-text-tertiary'
            )}
          />
        </span>
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton width="30%" height={20} />
            <div className="flex-1" />
            <Skeleton width={80} height={20} />
            <Skeleton width={60} height={20} />
            <Skeleton width={60} height={20} />
          </div>
        ))}
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <EmptyState
        icon={<Trophy className="h-12 w-12 text-text-tertiary" />}
        title="No wallets found"
        description="Smart money wallets will appear here"
      />
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full">
        <thead className="border-b border-white/10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
              Rank
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
              Wallet
            </th>
            <SortHeader field="totalGains">Total Gains</SortHeader>
            <SortHeader field="winRate">Win Rate</SortHeader>
            <SortHeader field="trades30d">Trades (30d)</SortHeader>
            <SortHeader field="realizedProfit">Realized P&L</SortHeader>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {wallets.map((wallet, index) => (
            <LeaderboardRow
              key={wallet.address}
              wallet={wallet}
              rank={index + 1}
              index={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
