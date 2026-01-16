// Format utilities for display
import { formatDistanceToNow, format } from 'date-fns';

// Format large numbers with abbreviations
export function formatNumber(value: number, decimals: number = 2): string {
  if (value === 0) return '0';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(decimals)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(decimals)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(decimals)}K`;
  }
  if (absValue < 1) {
    return `${sign}${absValue.toFixed(4)}`;
  }
  
  return `${sign}${absValue.toFixed(decimals)}`;
}

// Format currency values
export function formatCurrency(value: number, currency: string = 'USD'): string {
  const formatted = formatNumber(value);
  
  switch (currency) {
    case 'USD':
      return `$${formatted}`;
    case 'ETH':
      return `${formatted} ETH`;
    default:
      return `${formatted} ${currency}`;
  }
}

// Format percentage
export function formatPercent(value: number, decimals: number = 2): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(decimals)}%`;
}

// Format wallet address
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Format transaction hash
export function formatTxHash(hash: string, chars: number = 6): string {
  if (!hash) return '';
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

// Format timestamp to relative time
export function formatRelativeTime(timestamp: number | Date): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return formatDistanceToNow(date, { addSuffix: true });
}

// Format timestamp to absolute date
export function formatDate(timestamp: number | Date, pattern: string = 'MMM d, yyyy'): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return format(date, pattern);
}

// Format timestamp with time
export function formatDateTime(timestamp: number | Date): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return format(date, 'MMM d, yyyy h:mm a');
}

// Format token amount with symbol
export function formatTokenAmount(amount: number, symbol: string, decimals: number = 4): string {
  if (amount === 0) return `0 ${symbol}`;
  
  if (amount < 0.0001) {
    return `<0.0001 ${symbol}`;
  }
  
  return `${formatNumber(amount, decimals)} ${symbol}`;
}

// Format win rate as percentage
export function formatWinRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

// Format profit/loss with color class
export function formatPnL(value: number): { text: string; className: string } {
  const formatted = formatCurrency(Math.abs(value));
  
  if (value > 0) {
    return { text: `+${formatted}`, className: 'text-profit' };
  }
  if (value < 0) {
    return { text: `-${formatted}`, className: 'text-loss' };
  }
  return { text: formatted, className: 'text-neutral' };
}
