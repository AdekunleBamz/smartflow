// Environment configuration
export const env = {
  // API
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.smartflow.app',
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
  
  // Chain
  CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453'),
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.base.org',
  
  // Features
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_FARCASTER: process.env.NEXT_PUBLIC_ENABLE_FARCASTER !== 'false',
  
  // Limits
  MAX_LEADERBOARD_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_LEADERBOARD_SIZE || '5000'),
  CACHE_TTL: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '60000'),
  
  // Development
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

// Validate required env vars
export function validateEnv() {
  const required = ['NEXT_PUBLIC_API_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0 && env.IS_PRODUCTION) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
}
