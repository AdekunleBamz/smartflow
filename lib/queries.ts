// React Query hooks for data fetching
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getLeaderboard, 
  getNetflows, 
  getDexTrades,
  getWalletDetails,
  getWalletHistory,
  LeaderboardParams,
  NetflowParams,
  DexTradeParams,
} from './smart-money-api';
import { API_CONFIG } from './constants';

// Query keys
export const queryKeys = {
  leaderboard: (params?: LeaderboardParams) => ['leaderboard', params] as const,
  netflows: (params?: NetflowParams) => ['netflows', params] as const,
  dexTrades: (params?: DexTradeParams) => ['dexTrades', params] as const,
  wallet: (address: string) => ['wallet', address] as const,
  walletHistory: (address: string) => ['walletHistory', address] as const,
};

// Leaderboard query
export function useLeaderboard(params?: LeaderboardParams) {
  return useQuery({
    queryKey: queryKeys.leaderboard(params),
    queryFn: () => getLeaderboard(params),
    staleTime: API_CONFIG.CACHE_TTL,
    refetchInterval: API_CONFIG.REFETCH_INTERVAL,
    refetchOnWindowFocus: false,
  });
}

// Netflows query
export function useNetflows(params?: NetflowParams) {
  return useQuery({
    queryKey: queryKeys.netflows(params),
    queryFn: () => getNetflows(params),
    staleTime: API_CONFIG.CACHE_TTL,
    refetchInterval: API_CONFIG.REFETCH_INTERVAL / 2, // More frequent for netflows
    refetchOnWindowFocus: false,
  });
}

// DEX trades query
export function useDexTrades(params?: DexTradeParams) {
  return useQuery({
    queryKey: queryKeys.dexTrades(params),
    queryFn: () => getDexTrades(params),
    staleTime: API_CONFIG.CACHE_TTL,
    refetchInterval: API_CONFIG.REFETCH_INTERVAL,
    refetchOnWindowFocus: false,
  });
}

// Single wallet query
export function useWallet(address: string | undefined) {
  return useQuery({
    queryKey: queryKeys.wallet(address!),
    queryFn: () => getWalletDetails(address!),
    enabled: !!address,
    staleTime: API_CONFIG.CACHE_TTL * 2,
  });
}

// Wallet history query
export function useWalletHistory(address: string | undefined, limit?: number) {
  return useQuery({
    queryKey: queryKeys.walletHistory(address!),
    queryFn: () => getWalletHistory(address!, limit),
    enabled: !!address,
    staleTime: API_CONFIG.CACHE_TTL,
  });
}

// Prefetch utilities
export function usePrefetchLeaderboard() {
  const queryClient = useQueryClient();
  
  return (params?: LeaderboardParams) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.leaderboard(params),
      queryFn: () => getLeaderboard(params),
    });
  };
}

export function usePrefetchWallet() {
  const queryClient = useQueryClient();
  
  return (address: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.wallet(address),
      queryFn: () => getWalletDetails(address),
    });
  };
}

// Invalidation utilities
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return {
    invalidateLeaderboard: () => 
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
    invalidateNetflows: () => 
      queryClient.invalidateQueries({ queryKey: ['netflows'] }),
    invalidateDexTrades: () => 
      queryClient.invalidateQueries({ queryKey: ['dexTrades'] }),
    invalidateWallet: (address: string) => 
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet(address) }),
    invalidateAll: () => 
      queryClient.invalidateQueries(),
  };
}
