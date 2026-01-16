// Mock data for development and testing
import { SmartMoneyWallet, SmartMoneyFlows, DexTrade } from '@/types';

// Generate random address
const randomAddress = () => {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
};

// Generate random hash
const randomHash = () => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

const labels = [
  'Smart Money Whale',
  'DeFi Expert',
  'NFT Collector',
  'Yield Farmer',
  'MEV Bot',
  'DAO Treasury',
  'Exchange Wallet',
  'Unknown',
];

const dexes = ['Uniswap V3', 'Aerodrome', 'BaseSwap', 'SushiSwap', 'Balancer'];

const tokens = ['ETH', 'USDC', 'DAI', 'WETH', 'cbETH', 'USDbC', 'BRETT', 'DEGEN'];

export function generateMockLeaderboard(count: number = 100): SmartMoneyWallet[] {
  return Array.from({ length: count }, (_, i) => ({
    address: randomAddress(),
    label: labels[Math.floor(Math.random() * labels.length)],
    realizedProfit: Math.random() * 10000000,
    winRate: 0.4 + Math.random() * 0.5,
    trades30d: Math.floor(Math.random() * 500) + 10,
    totalGains: Math.random() * 5000000,
    tags: ['smart-money', Math.random() > 0.5 ? 'whale' : 'trader'],
    firstSeen: Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
    lastActive: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
  })).sort((a, b) => b.totalGains - a.totalGains);
}

export function generateMockNetflows(count: number = 50): SmartMoneyFlows[] {
  return Array.from({ length: count }, () => ({
    wallet: randomAddress(),
    token: tokens[Math.floor(Math.random() * tokens.length)],
    tokenSymbol: tokens[Math.floor(Math.random() * tokens.length)],
    amount: Math.random() * 100000,
    direction: Math.random() > 0.5 ? 'in' : 'out',
    timestamp: Date.now() - Math.random() * 24 * 60 * 60 * 1000,
    value: Math.random() * 500000,
    txHash: randomHash(),
  }));
}

export function generateMockDexTrades(count: number = 100): DexTrade[] {
  return Array.from({ length: count }, () => {
    const tokenIn = tokens[Math.floor(Math.random() * tokens.length)];
    let tokenOut = tokens[Math.floor(Math.random() * tokens.length)];
    while (tokenOut === tokenIn) {
      tokenOut = tokens[Math.floor(Math.random() * tokens.length)];
    }
    
    return {
      hash: randomHash(),
      from: randomAddress(),
      tokenIn,
      tokenOut,
      tokenInSymbol: tokenIn,
      tokenOutSymbol: tokenOut,
      amountIn: Math.random() * 1000,
      amountOut: Math.random() * 1000,
      dex: dexes[Math.floor(Math.random() * dexes.length)],
      timestamp: Date.now() - Math.random() * 24 * 60 * 60 * 1000,
      profit: Math.random() * 0.2 - 0.05,
      blockNumber: 10000000 + Math.floor(Math.random() * 1000000),
    };
  });
}

export const mockLeaderboard = generateMockLeaderboard(100);
export const mockNetflows = generateMockNetflows(50);
export const mockDexTrades = generateMockDexTrades(100);
