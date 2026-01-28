// Dashboard stats grid
'use client';

import { DashboardStat } from './DashboardStat';
import { 
  TrendingUp, 
  Wallet, 
  Activity, 
  BarChart3,
  Users,
  Zap,
} from 'lucide-react';

interface StatsData {
  totalVolume: number;
  totalWallets: number;
  activeFlows: number;
  avgWinRate: number;
  totalTrades: number;
  profitableWallets: number;
}

interface DashboardStatsGridProps {
  data?: StatsData;
  loading?: boolean;
}

export function DashboardStatsGrid({ data, loading = false }: DashboardStatsGridProps) {
  const stats = [
    {
      title: 'Total Volume (24h)',
      value: data?.totalVolume ?? 0,
      change: 0.12,
      icon: TrendingUp,
      iconColor: 'text-profit',
      format: 'currency' as const,
    },
    {
      title: 'Smart Wallets Tracked',
      value: data?.totalWallets ?? 0,
      change: 0.05,
      icon: Wallet,
      iconColor: 'text-primary',
      format: 'number' as const,
    },
    {
      title: 'Active Flows',
      value: data?.activeFlows ?? 0,
      change: -0.03,
      icon: Activity,
      iconColor: 'text-warning',
      format: 'number' as const,
    },
    {
      title: 'Avg Win Rate',
      value: data?.avgWinRate ?? 0,
      icon: BarChart3,
      iconColor: 'text-success',
      format: 'percent' as const,
    },
    {
      title: 'Total Trades (24h)',
      value: data?.totalTrades ?? 0,
      change: 0.08,
      icon: Zap,
      iconColor: 'text-accent',
      format: 'number' as const,
    },
    {
      title: 'Profitable Wallets',
      value: data?.profitableWallets ?? 0,
      change: 0.02,
      icon: Users,
      iconColor: 'text-profit',
      format: 'number' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
      {stats.map((stat) => (
        <DashboardStat
          key={stat.title}
          loading={loading}
          {...stat}
        />
      ))}
    </div>
  );
}
