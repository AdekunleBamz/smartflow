'use client';

import { useSmartMoneyLeaderboard } from '@/hooks/useSmartMoney';
import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { Medal } from 'lucide-react';
import { formatNumber, formatAddress } from '@/lib/utils';
import Link from 'next/link';

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useSmartMoneyLeaderboard(100);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e]">
      <Header />
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text flex items-center gap-3 mb-2">
                <Medal className="w-10 h-10" />
                Smart Money Leaderboard
              </h1>
              <p className="text-gray-300">Top 100 performing traders by realized profit</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-lg border border-white/10"
          >
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-400 border-t-purple-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr className="text-left text-sm text-gray-400">
                      <th className="pb-4 font-semibold px-4">Rank</th>
                      <th className="pb-4 font-semibold px-4">Address</th>
                      <th className="pb-4 font-semibold px-4">Label</th>
                      <th className="pb-4 font-semibold px-4">Total Gains</th>
                      <th className="pb-4 font-semibold px-4">Win Rate</th>
                      <th className="pb-4 font-semibold px-4">30d Trades</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard?.map((wallet, idx) => (
                      <motion.tr
                        key={wallet.address}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span
                            className={`font-bold ${
                              idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-cyan-400'
                            }`}
                          >
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-sm text-gray-300">{formatAddress(wallet.address)}</td>
                        <td className="py-4 px-4 text-sm">{wallet.label || 'Unknown'}</td>
                        <td className="py-4 px-4 font-semibold text-green-400">${formatNumber(wallet.totalGains)}</td>
                        <td className="py-4 px-4 text-yellow-400">{(wallet.winRate * 100).toFixed(1)}%</td>
                        <td className="py-4 px-4 text-gray-300">{wallet.trades30d}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
