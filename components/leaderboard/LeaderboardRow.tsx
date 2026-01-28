// Leaderboard table row component
'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Copy, Trophy, TrendingUp } from 'lucide-react';
import { formatAddress, formatCurrency, formatWinRate, formatNumber } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { useClipboard } from '@/hooks/useClipboard';
import { CHAIN_CONFIG } from '@/lib/constants';
import { SmartMoneyWallet } from '@/types';

interface LeaderboardRowProps {
  wallet: SmartMoneyWallet;
  rank: number;
  index: number;
}

export function LeaderboardRow({ wallet, rank, index }: LeaderboardRowProps) {
  const { copy, copied } = useClipboard();
  
  const getRankBadge = (rank: number) => {
    if (rank === 1) return { color: 'text-yellow-400 bg-yellow-400/20', label: '🥇' };
    if (rank === 2) return { color: 'text-gray-300 bg-gray-300/20', label: '🥈' };
    if (rank === 3) return { color: 'text-amber-600 bg-amber-600/20', label: '🥉' };
    return { color: 'text-text-tertiary bg-white/5', label: `#${rank}` };
  };

  const rankBadge = getRankBadge(rank);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, type: 'spring', stiffness: 100 }}
      className="group hover:bg-white/5 transition-colors"
    >
      {/* Rank */}
      <td className="px-4 py-3">
        <span className={cn(
          'inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium',
          rankBadge.color
        )}>
          {rankBadge.label}
        </span>
      </td>

      {/* Wallet */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-text-primary">
            {formatAddress(wallet.address, 6)}
          </span>
          <button
            onClick={() => copy(wallet.address)}
            className="p-1 rounded hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
            title={copied ? 'Copied!' : 'Copy address'}
          >
            <Copy className="h-3.5 w-3.5 text-text-tertiary" />
          </button>
          <a
            href={`${CHAIN_CONFIG.BASE.explorerUrl}/address/${wallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <ExternalLink className="h-3.5 w-3.5 text-text-tertiary" />
          </a>
        </div>
        {wallet.label && (
          <span className="text-xs text-text-tertiary">{wallet.label}</span>
        )}
      </td>

      {/* Total Gains */}
      <td className="px-4 py-3 text-right">
        <span className={cn(
          'font-medium',
          wallet.totalGains >= 0 ? 'text-profit' : 'text-loss'
        )}>
          {wallet.totalGains >= 0 ? '+' : ''}{formatCurrency(wallet.totalGains)}
        </span>
      </td>

      {/* Win Rate */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all',
                wallet.winRate >= 0.6 ? 'bg-profit' : wallet.winRate >= 0.4 ? 'bg-warning' : 'bg-loss'
              )}
              style={{ width: `${wallet.winRate * 100}%` }}
            />
          </div>
          <span className="text-sm text-text-secondary w-12 text-right">
            {formatWinRate(wallet.winRate)}
          </span>
        </div>
      </td>

      {/* Trades */}
      <td className="px-4 py-3 text-right">
        <span className="text-sm text-text-secondary">
          {formatNumber(wallet.trades30d, 0)}
        </span>
      </td>

      {/* Realized Profit */}
      <td className="px-4 py-3 text-right">
        <span className={cn(
          'text-sm',
          wallet.realizedProfit >= 0 ? 'text-profit' : 'text-loss'
        )}>
          {wallet.realizedProfit >= 0 ? '+' : ''}{formatCurrency(wallet.realizedProfit)}
        </span>
      </td>
    </motion.tr>
  );
}
