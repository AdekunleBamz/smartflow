'use client';

import { useState, useEffect, useMemo } from 'react';

interface RelativeTimeOptions {
  locale?: string;
  style?: 'long' | 'short' | 'narrow';
  numeric?: 'always' | 'auto';
  updateInterval?: number | false;
}

const TIME_DIVISIONS = [
  { amount: 60, name: 'seconds' as const },
  { amount: 60, name: 'minutes' as const },
  { amount: 24, name: 'hours' as const },
  { amount: 7, name: 'days' as const },
  { amount: 4.34524, name: 'weeks' as const },
  { amount: 12, name: 'months' as const },
  { amount: Number.POSITIVE_INFINITY, name: 'years' as const },
];

export function formatRelativeTime(
  date: Date | number,
  options: RelativeTimeOptions = {}
): string {
  const { locale = 'en', style = 'long', numeric = 'auto' } = options;

  const timestamp = typeof date === 'number' ? date : date.getTime();
  let duration = (timestamp - Date.now()) / 1000;

  // Use Intl.RelativeTimeFormat if available
  if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
    const formatter = new Intl.RelativeTimeFormat(locale, { style, numeric });

    for (const division of TIME_DIVISIONS) {
      if (Math.abs(duration) < division.amount) {
        return formatter.format(Math.round(duration), division.name);
      }
      duration /= division.amount;
    }
  }

  // Fallback for environments without Intl.RelativeTimeFormat
  return formatRelativeTimeFallback(timestamp);
}

function formatRelativeTimeFallback(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const absSeconds = Math.abs(seconds);
  const isFuture = seconds < 0;

  const format = (value: number, unit: string): string => {
    const plural = value !== 1 ? 's' : '';
    return isFuture
      ? `in ${value} ${unit}${plural}`
      : `${value} ${unit}${plural} ago`;
  };

  if (absSeconds < 60) return isFuture ? 'in a moment' : 'just now';
  if (absSeconds < 3600) return format(Math.floor(absSeconds / 60), 'minute');
  if (absSeconds < 86400) return format(Math.floor(absSeconds / 3600), 'hour');
  if (absSeconds < 604800) return format(Math.floor(absSeconds / 86400), 'day');
  if (absSeconds < 2629800) return format(Math.floor(absSeconds / 604800), 'week');
  if (absSeconds < 31557600) return format(Math.floor(absSeconds / 2629800), 'month');
  return format(Math.floor(absSeconds / 31557600), 'year');
}

// Hook for live-updating relative time
export function useRelativeTime(
  date: Date | number | null | undefined,
  options: RelativeTimeOptions = {}
): string {
  const { updateInterval = 60000 } = options;

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!updateInterval || !date) return;

    const timer = setInterval(() => {
      setNow(Date.now());
    }, updateInterval);

    return () => clearInterval(timer);
  }, [updateInterval, date]);

  return useMemo(() => {
    if (!date) return '';
    return formatRelativeTime(date, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, now, options.locale, options.style, options.numeric]);
}

// Helper to get update interval based on time difference
export function getOptimalUpdateInterval(date: Date | number): number {
  const timestamp = typeof date === 'number' ? date : date.getTime();
  const diff = Math.abs(Date.now() - timestamp);

  if (diff < 60000) return 10000; // Less than 1 min: update every 10s
  if (diff < 3600000) return 60000; // Less than 1 hour: update every 1 min
  if (diff < 86400000) return 300000; // Less than 1 day: update every 5 min
  return 3600000; // Otherwise: update every hour
}

export default formatRelativeTime;
