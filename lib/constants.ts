// Constants for SmartFlow application

export const APP_NAME = 'SmartFlow';
export const APP_DESCRIPTION = 'Real-time smart money intelligence on Base chain';
export const APP_VERSION = '2.0.0';

// API Configuration
export const API_CONFIG = {
  NANSEN_BASE_URL: 'https://api.nansen.ai/v1',
  BASE_URL: 'https://api.nansen.ai/v1',
  CACHE_TTL: 60000, // 1 minute
  REFETCH_INTERVAL: 300000, // 5 minutes
  STALE_TIME: 30000, // 30 seconds
  RETRY_COUNT: 3,
  TIMEOUT: 30000, // 30 seconds
} as const;

// Chain Configuration
export const CHAIN_CONFIG = {
  BASE: {
    id: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
} as const;

// UI Configuration
export const UI_CONFIG = {
  LEADERBOARD_LIMIT: 100,
  DASHBOARD_LIMIT: 10,
  ALERTS_LIMIT: 50,
  ANIMATION_DURATION: 0.3,
  DEBOUNCE_DELAY: 300,
} as const;

// Theme Colors
export const COLORS = {
  primary: '#00d4ff',
  secondary: '#7c3aed',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  dark: '#0f0f1e',
  darkLight: '#1a1a2e',
} as const;

// Navigation Links
export const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/alerts', label: 'Alerts' },
] as const;
