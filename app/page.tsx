'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1e] to-[#1a1a2e]">
        <div className="glass p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-400 border-t-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/logo.svg" alt="SmartFlow" className="w-12 h-12" />
            <h1 className="text-5xl md:text-7xl font-bold gradient-text">SmartFlow</h1>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Real-time smart money intelligence on Base chain. Track top traders, identify opportunities,
            and make informed decisions before the crowd catches up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="glass px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all group"
            >
              <span className="flex items-center gap-2 justify-center">
                <Zap className="w-5 h-5 text-cyan-400" />
                Enter Dashboard
              </span>
            </Link>
            <Link
              href="/leaderboard"
              className="glass px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              <span className="flex items-center gap-2 justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                View Leaderboard
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >
          {[
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: 'Smart Money Leaderboard',
              desc: 'Track the top 5,000 performing traders ranked by profit and win rate',
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: 'Real-Time Flows',
              desc: 'Monitor wallet movements and identify smart money entries/exits instantly',
            },
            {
              icon: <AlertCircle className="w-8 h-8" />,
              title: 'Opportunity Alerts',
              desc: 'Get notified when smart wallets make significant moves on Base',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="glass p-6 rounded-lg border border-white/10"
            >
              <div className="text-cyan-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center glass p-8 rounded-lg border border-purple-500/30 bg-purple-500/10"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to follow smart money?</h2>
          <p className="text-gray-300 mb-6">
            SmartFlow brings the power of institutional intelligence to Base chain traders.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 transition-opacity"
          >
            Start Trading Smarter
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
