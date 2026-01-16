// Type definitions for the app
export interface SmartMoneyWallet {
  address: string;
  name?: string;
  avatar?: string;
  rank: number;
  totalPnl: number;
  winRate: number;
  totalTrades: number;
  totalVolume: string;
  avgTradeSize: string;
  lastActive: string;
  verified?: boolean;
  tags?: string[];
}

export interface Transaction {
  hash: string;
  type: 'buy' | 'sell' | 'swap' | 'transfer' | 'mint' | 'burn' | 'stake' | 'unstake';
  from: string;
  to: string;
  amount: string;
  token: string;
  tokenAddress: string;
  value: string;
  timestamp: number;
  blockNumber: number;
  gasUsed?: string;
  gasPrice?: string;
  status: 'success' | 'failed' | 'pending';
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
}

export interface Alert {
  id: string;
  name: string;
  type: 'wallet_activity' | 'price_movement' | 'large_transfer' | 'new_token' | 'custom';
  enabled: boolean;
  conditions: AlertCondition[];
  actions: AlertAction[];
  createdAt: number;
  triggeredAt?: number;
  triggerCount: number;
}

export interface AlertCondition {
  field: string;
  operator: 'gt' | 'lt' | 'eq' | 'neq' | 'contains' | 'not_contains';
  value: string | number;
}

export interface AlertAction {
  type: 'notification' | 'webhook' | 'email';
  config: Record<string, unknown>;
}

export interface LeaderboardEntry extends SmartMoneyWallet {
  change?: number;
  previousRank?: number;
}

export interface DashboardStats {
  totalWalletsTracked: number;
  totalTransactions24h: number;
  totalVolume24h: string;
  avgPnl: number;
  topGainer: string;
  topLoser: string;
  activeAlerts: number;
  triggeredAlerts24h: number;
}

export interface ActivityItem {
  id: string;
  wallet: string;
  walletName?: string;
  action: string;
  token: string;
  amount: string;
  value: string;
  timestamp: number;
  type: Transaction['type'];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Query parameters
export interface LeaderboardParams {
  sortBy?: 'pnl' | 'winRate' | 'volume' | 'trades';
  sortOrder?: 'asc' | 'desc';
  timeRange?: '24h' | '7d' | '30d' | 'all';
  page?: number;
  pageSize?: number;
}

export interface TransactionParams {
  address?: string;
  type?: Transaction['type'][];
  token?: string;
  minValue?: number;
  maxValue?: number;
  startTime?: number;
  endTime?: number;
  page?: number;
  pageSize?: number;
}
