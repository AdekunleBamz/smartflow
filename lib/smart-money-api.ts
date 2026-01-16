// Smart Money API endpoints
import api from './api-client';
import { SmartMoneyWallet, SmartMoneyFlows, DexTrade } from '@/types';
import { mockLeaderboard, mockNetflows, mockDexTrades } from './mock-data';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export interface LeaderboardParams {
  limit?: number;
  offset?: number;
  sortBy?: 'totalGains' | 'winRate' | 'trades30d' | 'realizedProfit';
  order?: 'asc' | 'desc';
  minTrades?: number;
  minProfit?: number;
}

export interface NetflowParams {
  limit?: number;
  direction?: 'in' | 'out' | 'all';
  token?: string;
  minValue?: number;
  timeRange?: '1h' | '24h' | '7d' | '30d';
}

export interface DexTradeParams {
  limit?: number;
  dex?: string;
  token?: string;
  minProfit?: number;
  wallet?: string;
}

// Get smart money leaderboard
export async function getLeaderboard(params: LeaderboardParams = {}): Promise<SmartMoneyWallet[]> {
  if (USE_MOCK) {
    let data = [...mockLeaderboard];
    
    if (params.minTrades) {
      data = data.filter(w => w.trades30d >= params.minTrades!);
    }
    if (params.minProfit) {
      data = data.filter(w => w.totalGains >= params.minProfit!);
    }
    if (params.sortBy) {
      data.sort((a, b) => {
        const aVal = a[params.sortBy!] as number;
        const bVal = b[params.sortBy!] as number;
        return params.order === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }
    
    const start = params.offset || 0;
    const end = start + (params.limit || 50);
    return data.slice(start, end);
  }
  
  const queryParams: Record<string, string | number | boolean> = {
    limit: params.limit || 50,
    offset: params.offset || 0,
    sort_by: params.sortBy || 'totalGains',
    order: params.order || 'desc',
  };
  
  if (params.minTrades !== undefined) queryParams.min_trades = params.minTrades;
  if (params.minProfit !== undefined) queryParams.min_profit = params.minProfit;
  
  const response = await api.get<SmartMoneyWallet[]>('/smart-money/leaderboard', queryParams);
  
  return response.data;
}

// Get netflow data
export async function getNetflows(params: NetflowParams = {}): Promise<SmartMoneyFlows[]> {
  if (USE_MOCK) {
    let data = [...mockNetflows];
    
    if (params.direction && params.direction !== 'all') {
      data = data.filter(f => f.direction === params.direction);
    }
    if (params.token) {
      data = data.filter(f => f.tokenSymbol === params.token);
    }
    if (params.minValue) {
      data = data.filter(f => f.value >= params.minValue!);
    }
    
    return data.slice(0, params.limit || 50);
  }
  
  const netflowParams: Record<string, string | number | boolean> = {
    limit: params.limit || 50,
    direction: params.direction || 'all',
    time_range: params.timeRange || '24h',
  };
  
  if (params.token !== undefined) netflowParams.token = params.token;
  if (params.minValue !== undefined) netflowParams.min_value = params.minValue;
  
  const response = await api.get<SmartMoneyFlows[]>('/smart-money/netflows', netflowParams);
  
  return response.data;
}

// Get DEX trades
export async function getDexTrades(params: DexTradeParams = {}): Promise<DexTrade[]> {
  if (USE_MOCK) {
    let data = [...mockDexTrades];
    
    if (params.dex) {
      data = data.filter(t => t.dex === params.dex);
    }
    if (params.token) {
      data = data.filter(t => t.tokenInSymbol === params.token || t.tokenOutSymbol === params.token);
    }
    if (params.wallet) {
      data = data.filter(t => t.from.toLowerCase() === params.wallet!.toLowerCase());
    }
    if (params.minProfit !== undefined) {
      data = data.filter(t => (t.profit || 0) >= params.minProfit!);
    }
    
    return data.slice(0, params.limit || 100);
  }
  
  const dexParams: Record<string, string | number | boolean> = {
    limit: params.limit || 100,
  };
  
  if (params.dex !== undefined) dexParams.dex = params.dex;
  if (params.token !== undefined) dexParams.token = params.token;
  if (params.wallet !== undefined) dexParams.wallet = params.wallet;
  if (params.minProfit !== undefined) dexParams.min_profit = params.minProfit;
  
  const response = await api.get<DexTrade[]>('/smart-money/dex-trades', dexParams);
  
  return response.data;
}

// Get wallet details
export async function getWalletDetails(address: string): Promise<SmartMoneyWallet | null> {
  if (USE_MOCK) {
    return mockLeaderboard.find(w => w.address.toLowerCase() === address.toLowerCase()) || null;
  }
  
  const response = await api.get<SmartMoneyWallet>(`/smart-money/wallet/${address}`);
  return response.data;
}

// Get wallet transaction history
export async function getWalletHistory(address: string, limit: number = 50): Promise<DexTrade[]> {
  if (USE_MOCK) {
    return mockDexTrades
      .filter(t => t.from.toLowerCase() === address.toLowerCase())
      .slice(0, limit);
  }
  
  const response = await api.get<DexTrade[]>(`/smart-money/wallet/${address}/history`, { limit });
  return response.data;
}
