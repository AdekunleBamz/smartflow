// Date and time utility functions
import { 
  format, 
  formatDistanceToNow, 
  parseISO, 
  isToday, 
  isYesterday, 
  isThisWeek,
  startOfDay,
  endOfDay,
  subDays,
  subHours,
  subWeeks,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from 'date-fns';

// Time range presets
export const TIME_RANGES = {
  '1h': { label: '1 Hour', ms: 60 * 60 * 1000 },
  '24h': { label: '24 Hours', ms: 24 * 60 * 60 * 1000 },
  '7d': { label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  '30d': { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  '90d': { label: '90 Days', ms: 90 * 24 * 60 * 60 * 1000 },
  'all': { label: 'All Time', ms: Infinity },
} as const;

export type TimeRange = keyof typeof TIME_RANGES;

// Get start timestamp for time range
export function getTimeRangeStart(range: TimeRange): number {
  const now = Date.now();
  const { ms } = TIME_RANGES[range];
  if (ms === Infinity) return 0;
  return now - ms;
}

// Format timestamp intelligently
export function formatTimestamp(timestamp: number | Date): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }
  
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }
  
  if (isThisWeek(date)) {
    return format(date, 'EEEE at h:mm a');
  }
  
  return format(date, 'MMM d, yyyy');
}

// Get relative time with smart formatting
export function getRelativeTime(timestamp: number | Date): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  const now = new Date();
  
  const minutes = differenceInMinutes(now, date);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours}h ago`;
  
  const days = differenceInDays(now, date);
  if (days < 7) return `${days}d ago`;
  
  return formatDistanceToNow(date, { addSuffix: true });
}

// Get date range for time range
export function getDateRange(range: TimeRange): { start: Date; end: Date } {
  const now = new Date();
  
  switch (range) {
    case '1h':
      return { start: subHours(now, 1), end: now };
    case '24h':
      return { start: subDays(now, 1), end: now };
    case '7d':
      return { start: subWeeks(now, 1), end: now };
    case '30d':
      return { start: subDays(now, 30), end: now };
    case '90d':
      return { start: subDays(now, 90), end: now };
    case 'all':
    default:
      return { start: new Date(0), end: now };
  }
}

// Format duration in human readable format
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
