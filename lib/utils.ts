export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatNumber(num: number, decimals = 2): string {
  if (num === undefined || num === null) return '0';
  if (Math.abs(num) >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(decimals) + 'B';
  } else if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + 'M';
  } else if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(decimals) + 'K';
  }
  return num.toFixed(decimals);
}

export function formatPercent(value: number, decimals = 2): string {
  if (!value) return '0%';
  return `${value > 0 ? '+' : ''}${(value * 100).toFixed(decimals)}%`;
}

export function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
