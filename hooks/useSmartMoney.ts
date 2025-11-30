import { useQuery } from '@tanstack/react-query';
import { getSmartMoneyLeaderboard, getSmartMoneyNetflows, getSmartMoneyDexTrades } from '@/lib/nansen-api';

export function useSmartMoneyLeaderboard(limit: number = 50) {
  return useQuery({
    queryKey: ['smartmoney-leaderboard', limit],
    queryFn: () => getSmartMoneyLeaderboard(limit),
    staleTime: 60000,
    refetchInterval: 300000,
  });
}

export function useSmartMoneyNetflows(timeRange: '24h' | '7d' | '30d' = '24h') {
  return useQuery({
    queryKey: ['smartmoney-netflows', timeRange],
    queryFn: () => getSmartMoneyNetflows(timeRange),
    staleTime: 30000,
    refetchInterval: 120000,
  });
}

export function useSmartMoneyDexTrades(timeRange: '24h' | '7d' = '24h', limit: number = 100) {
  return useQuery({
    queryKey: ['smartmoney-dex-trades', timeRange, limit],
    queryFn: () => getSmartMoneyDexTrades(timeRange, limit),
    staleTime: 30000,
    refetchInterval: 180000,
  });
}
