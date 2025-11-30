'use client';

import React from 'react';
import { useSmartMoneyDexTrades } from '@/hooks/useSmartMoney';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { formatNumber, getTimeAgo } from '@/lib/utils';
import Link from 'next/link';

export default function Alerts() {
  const { data: trades, isLoading } = useSmartMoneyDexTrades('24h', 50);

  // Filter profitable trades as opportunities
  const opportunities = trades?.filter((t) => (t.profit || 0) > 0.05) || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text flex items-center gap-3">
                <AlertCircle className="w-10 h-10" />
                Smart Money Opportunities
              </h1>
              <p className="text-gray-300 mt-2">Recent profitable trades detected</p>
            </div>
            <Link href="/dashboard" className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-all">
              ← Dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {isLoading ? (
            <div className="glass p-8 rounded-lg border border-white/10 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-400 border-t-purple-500"></div>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="glass p-8 rounded-lg border border-white/10 text-center">
              <p className="text-gray-300">No significant opportunities found in the last 24 hours</p>
            </div>
          ) : (
            opportunities.slice(0, 20).map((trade, idx) => (
              <motion.div
                key={trade.hash}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass p-4 rounded-lg border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-cyan-400">{trade.dex}</span>
                      <span className="text-xs text-gray-400">{getTimeAgo(trade.timestamp)}</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      {trade.amountIn} → {trade.amountOut}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">+{((trade.profit || 0) * 100).toFixed(1)}%</div>
                    <div className="text-xs text-gray-400 font-mono">{trade.hash.slice(0, 10)}</div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </main>
  );
}
