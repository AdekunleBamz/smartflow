// Validation utilities for SmartFlow

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate transaction hash format
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate API key format (basic check)
 */
export function isValidApiKey(key: string): boolean {
  return typeof key === 'string' && key.length >= 20;
}

/**
 * Validate time range parameter
 */
export function isValidTimeRange(range: string): range is '1h' | '24h' | '7d' | '30d' {
  return ['1h', '24h', '7d', '30d'].includes(range);
}

/**
 * Validate pagination parameters
 */
export function isValidPagination(page: number, limit: number): boolean {
  return (
    Number.isInteger(page) &&
    Number.isInteger(limit) &&
    page >= 1 &&
    limit >= 1 &&
    limit <= 100
  );
}

/**
 * Sanitize user input string
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '');
}
