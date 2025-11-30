'use client';

import { useSmartMoneyLeaderboard, useSmartMoneyNetflows } from '@/hooks/useSmartMoney';
import { StatCard } from '@/components/StatCard';
import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Activity } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import Link from 'next/link';

export default function Dashboard() {
  const { data: leaderboard, isLoading: leaderboardLoading } = useSmartMoneyLeaderboard(10);
  const { data: netflows, isLoading: netflowsLoading } = useSmartMoneyNetflows('24h');

  const totalValue = leaderboard?.reduce((sum, w) => sum + (w.totalGains || 0), 0) || 0;
  const avgWinRate = leaderboard ? leaderboard.reduce((sum, w) => sum + w.winRate, 0) / leaderboard.length : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e]">
      <Header />
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Dashboard</h1>
            <p className="text-gray-300 mb-8">Real-time smart money intelligence</p>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <StatCard
                label="Total Smart Money Value"
                value={`$${formatNumber(totalValue)}`}
                icon={<TrendingUp className="w-5 h-5" />}
                change={0.15}
              />
              <StatCard
                label="Average Win Rate"
                value={`${(avgWinRate * 100).toFixed(1)}%`}
                icon={<Zap className="w-5 h-5" />}
                change={0.08}
              />
              <StatCard
                label="24h Netflows"
                value={`${netflows?.length || 0} Flows`}
                icon={<Activity className="w-5 h-5" />}
                change={0.22}
              />
            </div>
          </motion.div>

          {/* Leaderboard Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-lg border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">Top Smart Money Traders</h2>

            {leaderboardLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-400 border-t-purple-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr className="text-left text-sm text-gray-400">
                      <th className="pb-4 font-semibold">Rank</th>
                      <th className="pb-4 font-semibold">Address</th>
                      <th className="pb-4 font-semibold">Total Gains</th>
                      <th className="pb-4 font-semibold">Win Rate</th>
                      <th className="pb-4 font-semibold">30d Trades</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard?.slice(0, 10).map((wallet, idx) => (
                      <motion.tr
                        key={wallet.address}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 text-cyan-400 font-bold">#{idx + 1}</td>
                        <td className="py-4 font-mono text-sm text-gray-300">{wallet.address.slice(0, 10)}...</td>
                        <td className="py-4 font-semibold text-green-400">${formatNumber(wallet.totalGains)}</td>
                        <td className="py-4 text-yellow-400">{(wallet.winRate * 100).toFixed(1)}%</td>
                        <td className="py-4 text-gray-300">{wallet.trades30d}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6">
              <Link
                href="/leaderboard"
                className="inline-block glass px-6 py-2 rounded-lg hover:bg-white/10 transition-all"
              >
                View Full Leaderboard →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
