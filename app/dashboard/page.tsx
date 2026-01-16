// Dashboard page - rebuilt with new components
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, Activity, Clock } from 'lucide-react';
import { DashboardStatsGrid, ActivityFeed } from '@/components/dashboard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { useLeaderboard, useNetflows, useInvalidateQueries } from '@/lib/queries';
import { formatRelativeTime } from '@/lib/formatters';
import Link from 'next/link';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  const { data: leaderboard, isLoading: leaderboardLoading, dataUpdatedAt } = useLeaderboard({ limit: 10 });
  const { data: netflows, isLoading: netflowsLoading } = useNetflows({ timeRange, limit: 20 });
  const { invalidateAll } = useInvalidateQueries();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await invalidateAll();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Calculate stats from leaderboard data
  const stats = {
    totalVolume: leaderboard?.reduce((sum, w) => sum + (w.totalGains || 0), 0) || 0,
    totalWallets: leaderboard?.length || 0,
    activeFlows: netflows?.length || 0,
    avgWinRate: leaderboard?.length
      ? leaderboard.reduce((sum, w) => sum + w.winRate, 0) / leaderboard.length
      : 0,
    totalTrades: leaderboard?.reduce((sum, w) => sum + w.trades30d, 0) || 0,
    profitableWallets: leaderboard?.filter(w => w.totalGains > 0).length || 0,
  };

  // Transform netflows to activity items
  const activityItems = (netflows || []).map((flow, i) => ({
    id: flow.txHash || `flow-${i}`,
    type: flow.direction === 'in' ? 'inflow' as const : 'outflow' as const,
    wallet: flow.wallet,
    token: flow.tokenSymbol || flow.token,
    amount: flow.amount,
    value: flow.value || flow.amount,
    txHash: flow.txHash || '',
    timestamp: flow.timestamp,
  }));

  return (
    <div className="container-main py-8 space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Dashboard
          </h1>
          <p className="text-text-secondary">
            Real-time smart money intelligence on Base
          </p>
        </div>

        <div className="flex items-center gap-3">
          {dataUpdatedAt && (
            <span className="text-xs text-text-tertiary flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated {formatRelativeTime(dataUpdatedAt)}
            </span>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DashboardStatsGrid
          data={stats}
          loading={leaderboardLoading}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Recent Activity</h2>
              </div>
              <Tabs
                tabs={[
                  { id: '1h', label: '1H' },
                  { id: '24h', label: '24H' },
                  { id: '7d', label: '7D' },
                ]}
                activeTab={timeRange}
                onChange={(id) => setTimeRange(id as typeof timeRange)}
              />
            </div>
            <ActivityFeed
              items={activityItems}
              loading={netflowsLoading}
              maxItems={10}
            />
          </Card>
        </motion.div>

        {/* Quick Stats Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-profit" />
              <h3 className="font-semibold">Top Performers</h3>
            </div>
            <div className="space-y-3">
              {leaderboardLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-6 h-6 rounded bg-white/10" />
                    <div className="flex-1 h-4 rounded bg-white/10" />
                    <div className="w-16 h-4 rounded bg-white/10" />
                  </div>
                ))
              ) : (
                leaderboard?.slice(0, 5).map((wallet, i) => (
                  <div key={wallet.address} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-text-tertiary w-6">
                      #{i + 1}
                    </span>
                    <span className="flex-1 text-sm font-mono truncate">
                      {wallet.address.slice(0, 8)}...
                    </span>
                    <span className="text-sm font-medium text-profit">
                      +${(wallet.totalGains / 1000).toFixed(1)}K
                    </span>
                  </div>
                ))
              )}
            </div>
            <Link
              href="/leaderboard"
              className="block mt-4 text-center text-sm text-primary hover:text-primary-light transition-colors"
            >
              View Full Leaderboard →
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/leaderboard" className="block">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  🏆 View Leaderboard
                </Button>
              </Link>
              <Link href="/alerts" className="block">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  🔔 Manage Alerts
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
