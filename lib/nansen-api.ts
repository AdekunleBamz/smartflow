import axios from 'axios';

const NANSEN_BASE_URL = 'https://api.nansen.ai/v1';
const API_KEY = process.env.NEXT_PUBLIC_NANSEN_API_KEY;

const client = axios.create({
  baseURL: NANSEN_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

export interface SmartMoneyWallet {
  address: string;
  label: string;
  realizedProfit: number;
  winRate: number;
  trades30d: number;
  totalGains: number;
  tags: string[];
}

export interface SmartMoneyFlows {
  wallet: string;
  token: string;
  amount: number;
  direction: 'in' | 'out';
  timestamp: number;
  value: number;
}

export interface DexTrade {
  hash: string;
  from: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  amountOut: number;
  dex: string;
  timestamp: number;
  profit?: number;
}

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000;

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function getSmartMoneyLeaderboard(limit: number = 50): Promise<SmartMoneyWallet[]> {
  const cacheKey = `smartmoney-leaderboard-${limit}`;
  const cached = getCached<SmartMoneyWallet[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await client.get('/smart-money/holdings', {
      params: { limit, order_by: 'realized_profit', order_direction: 'desc' },
    });
    const data = response.data.data || [];
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export async function getSmartMoneyNetflows(timeRange: '24h' | '7d' | '30d' = '24h'): Promise<SmartMoneyFlows[]> {
  const cacheKey = `smartmoney-netflows-${timeRange}`;
  const cached = getCached<SmartMoneyFlows[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await client.get('/smart-money/netflows', { params: { time_range: timeRange } });
    const data = response.data.data || [];
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching netflows:', error);
    return [];
  }
}

export async function getSmartMoneyDexTrades(
  timeRange: '24h' | '7d' = '24h',
  limit: number = 100
): Promise<DexTrade[]> {
  const cacheKey = `smartmoney-dex-trades-${timeRange}-${limit}`;
  const cached = getCached<DexTrade[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await client.get('/smart-money/dex-trades', { params: { time_range: timeRange, limit } });
    const data = response.data.data || [];
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching DEX trades:', error);
    return [];
  }
}

export function clearCache(): void {
  cache.clear();
}
