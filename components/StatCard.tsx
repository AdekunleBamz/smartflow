'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, change, icon }: StatCardProps) {
  const isPositive = change && change > 0;

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="glass p-4 rounded-lg border border-white/10 hover:shadow-lg hover:shadow-cyan-500/20 transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        {icon && <div className="text-cyan-400">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-white mb-1">{value}</div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {(change * 100).toFixed(2)}%
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
