'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WalletConnect } from './WalletConnect';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Zap className="w-6 h-6 text-cyan-400" />
          <span className="text-xl font-bold gradient-text">SmartFlow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
            Dashboard
          </Link>
          <Link href="/leaderboard" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
            Leaderboard
          </Link>
          <Link href="/alerts" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
            Alerts
          </Link>
        </nav>

        <WalletConnect />
      </div>
    </motion.header>
  );
}
