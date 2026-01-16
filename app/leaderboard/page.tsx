// Leaderboard page - rebuilt with new components
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Download, RefreshCw } from 'lucide-react';
import { LeaderboardTable, LeaderboardFiltersBar } from '@/components/leaderboard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { useLeaderboard, useInvalidateQueries } from '@/lib/queries';
import { useLeaderboardStore } from '@/lib/leaderboard-store';

const ITEMS_PER_PAGE = 20;

export default function LeaderboardPage() {
  const { 
    filters, 
    sortField, 
    sortOrder, 
    currentPage, 
    setFilters, 
    setSorting, 
    setPage 
  } = useLeaderboardStore();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: wallets, isLoading } = useLeaderboard({
    limit: 100,
    sortBy: sortField,
    order: sortOrder,
    minTrades: filters.minTrades || undefined,
    minProfit: filters.minProfit || undefined,
  });
  
  const { invalidateLeaderboard } = useInvalidateQueries();

  // Client-side filtering for search
  const filteredWallets = useMemo(() => {
    if (!wallets) return [];
    
    let result = [...wallets];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(w => 
        w.address.toLowerCase().includes(search) ||
        w.label?.toLowerCase().includes(search)
      );
    }
    
    return result;
  }, [wallets, filters.search]);

  // Pagination
  const totalPages = Math.ceil(filteredWallets.length / ITEMS_PER_PAGE);
  const paginatedWallets = filteredWallets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await invalidateLeaderboard();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    if (!filteredWallets.length) return;
    
    const csv = [
      ['Rank', 'Address', 'Label', 'Total Gains', 'Win Rate', 'Trades 30d', 'Realized Profit'],
      ...filteredWallets.map((w, i) => [
        i + 1,
        w.address,
        w.label || '',
        w.totalGains,
        (w.winRate * 100).toFixed(2) + '%',
        w.trades30d,
        w.realizedProfit,
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartflow-leaderboard-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-main py-8 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              Leaderboard
            </h1>
          </div>
          <p className="text-text-secondary">
            Top smart money wallets ranked by performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            disabled={!filteredWallets.length}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <LeaderboardFiltersBar
          filters={filters}
          onChange={setFilters}
        />
      </motion.div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-text-tertiary">
        <span>
          Showing {paginatedWallets.length} of {filteredWallets.length} wallets
        </span>
        {filters.search && (
          <span>
            Filtered by: &quot;{filters.search}&quot;
          </span>
        )}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <LeaderboardTable
            wallets={paginatedWallets}
            loading={isLoading}
            onSort={(field, order) => setSorting(field, order)}
          />
        </Card>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </motion.div>
      )}
    </div>
  );
}
