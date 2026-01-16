// Wallet detail page
'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  TrendingUp,
  Activity,
  BarChart3,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useWallet, useWalletHistory } from '@/lib/queries';
import { useClipboard } from '@/hooks/useClipboard';
import { 
  formatAddress, 
  formatCurrency, 
  formatWinRate, 
  formatNumber,
  formatRelativeTime,
} from '@/lib/formatters';
import { CHAIN_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function WalletPage() {
  const params = useParams();
  const address = params.address as string;
  const { data: wallet, isLoading } = useWallet(address);
  const { data: history, isLoading: historyLoading } = useWalletHistory(address, 20);
  const { copy, copied } = useClipboard();

  if (isLoading) {
    return (
      <div className="container-main py-8 space-y-6">
        <Skeleton width={200} height={32} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton width="100%" height={80} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="container-main py-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Wallet Not Found</h2>
          <p className="text-text-secondary mb-4">
            The wallet address could not be found or is not tracked.
          </p>
          <Link href="/leaderboard">
            <Button>Back to Leaderboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-main py-8 space-y-6">
      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link 
          href="/leaderboard" 
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leaderboard
        </Link>
      </motion.div>

      {/* Wallet Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold font-mono">
              {formatAddress(address, 8)}
            </h1>
            <button
              onClick={() => copy(address)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title={copied ? 'Copied!' : 'Copy address'}
            >
              <Copy className="h-4 w-4 text-text-tertiary" />
            </button>
            <a
              href={`${CHAIN_CONFIG.EXPLORER_URL}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-text-tertiary" />
            </a>
          </div>
          {wallet.label && (
            <p className="text-text-secondary">{wallet.label}</p>
          )}
          {wallet.lastActive && (
            <p className="text-sm text-text-tertiary">
              Last active {formatRelativeTime(wallet.lastActive)}
            </p>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-profit" />
            <span className="text-sm text-text-tertiary">Total Gains</span>
          </div>
          <p className={cn(
            'text-2xl font-bold',
            wallet.totalGains >= 0 ? 'text-profit' : 'text-loss'
          )}>
            {wallet.totalGains >= 0 ? '+' : ''}{formatCurrency(wallet.totalGains)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="text-sm text-text-tertiary">Win Rate</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {formatWinRate(wallet.winRate)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-warning" />
            <span className="text-sm text-text-tertiary">Trades (30d)</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {formatNumber(wallet.trades30d, 0)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-accent" />
            <span className="text-sm text-text-tertiary">Realized P&L</span>
          </div>
          <p className={cn(
            'text-2xl font-bold',
            wallet.realizedProfit >= 0 ? 'text-profit' : 'text-loss'
          )}>
            {wallet.realizedProfit >= 0 ? '+' : ''}{formatCurrency(wallet.realizedProfit)}
          </p>
        </Card>
      </motion.div>

      {/* Recent Trades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
          
          {historyLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} width="100%" height={48} />
              ))}
            </div>
          ) : history && history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr className="text-left text-sm text-text-tertiary">
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Token In</th>
                    <th className="pb-3">Token Out</th>
                    <th className="pb-3">DEX</th>
                    <th className="pb-3 text-right">Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((trade) => (
                    <tr key={trade.hash} className="hover:bg-white/5">
                      <td className="py-3 text-sm text-text-secondary">
                        {formatRelativeTime(trade.timestamp)}
                      </td>
                      <td className="py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          Swap
                        </span>
                      </td>
                      <td className="py-3 text-sm">
                        {formatNumber(trade.amountIn, 4)} {trade.tokenInSymbol}
                      </td>
                      <td className="py-3 text-sm">
                        {formatNumber(trade.amountOut, 4)} {trade.tokenOutSymbol}
                      </td>
                      <td className="py-3 text-sm text-text-secondary">
                        {trade.dex}
                      </td>
                      <td className={cn(
                        'py-3 text-sm text-right font-medium',
                        (trade.profit || 0) >= 0 ? 'text-profit' : 'text-loss'
                      )}>
                        {(trade.profit || 0) >= 0 ? '+' : ''}{((trade.profit || 0) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">
              No recent trades found
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
