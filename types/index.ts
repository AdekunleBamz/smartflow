// Type definitions for SmartFlow

export interface SmartMoneyWallet {
  address: string;
  label: string;
  realizedProfit: number;
  winRate: number;
  trades30d: number;
  totalGains: number;
  tags: string[];
  firstSeen?: number;
  lastActive?: number;
}

export interface SmartMoneyFlows {
  wallet: string;
  token: string;
  tokenSymbol?: string;
  amount: number;
  direction: 'in' | 'out';
  timestamp: number;
  value: number;
  txHash?: string;
}

export interface DexTrade {
  hash: string;
  from: string;
  tokenIn: string;
  tokenOut: string;
  tokenInSymbol?: string;
  tokenOutSymbol?: string;
  amountIn: number;
  amountOut: number;
  dex: string;
  timestamp: number;
  profit?: number;
  blockNumber?: number;
}

export interface User {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  address?: string;
  pfp?: string;
}

export type TimeRange = '1h' | '24h' | '7d' | '30d';

export type SortDirection = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
