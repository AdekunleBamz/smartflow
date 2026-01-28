'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Copy, Check } from 'lucide-react';
import { formatAddress } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

export function WalletConnect() {
  const { user } = useAppStore();
  const [copied, setCopied] = useState(false);

  if (!user || !user.address) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="glass px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-glow-sm transition-all duration-300"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </motion.button>
    );
  }

  const handleCopyAddress = () => {
    if (!user.address) return;
    navigator.clipboard.writeText(user.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass px-4 py-2 rounded-lg border border-green-400/30 bg-green-400/5 flex items-center gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
        <Wallet className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="text-xs text-gray-400">Connected</div>
        <div className="text-sm font-mono font-medium">{formatAddress(user.address)}</div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={handleCopyAddress}
        className="text-gray-400 hover:text-cyan-400 transition-colors"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </motion.button>
    </motion.div>
  );
}
