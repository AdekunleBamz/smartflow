'use client';

import { useEffect, useState } from 'react';
import { eventBus, AppEvents, emitAppEvent } from './events';

// Network status hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      emitAppEvent(AppEvents.NETWORK_STATUS, { online: true });
    };

    const handleOffline = () => {
      setIsOnline(false);
      emitAppEvent(AppEvents.NETWORK_STATUS, { online: false });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Connection quality estimation
export interface ConnectionQuality {
  type: 'unknown' | 'slow' | 'fast' | 'very-fast';
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
}

export function useConnectionQuality(): ConnectionQuality {
  const [quality, setQuality] = useState<ConnectionQuality>({
    type: 'unknown',
    effectiveType: null,
    downlink: null,
    rtt: null,
  });

  useEffect(() => {
    const connection = (navigator as unknown as { connection?: NetworkInformation })?.connection;

    if (!connection) return;

    const updateQuality = () => {
      const effectiveType = connection.effectiveType || null;
      const downlink = connection.downlink || null;
      const rtt = connection.rtt || null;

      let type: ConnectionQuality['type'] = 'unknown';
      if (effectiveType === '4g' && (downlink || 10) > 5) {
        type = 'very-fast';
      } else if (effectiveType === '4g' || effectiveType === '3g') {
        type = 'fast';
      } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
        type = 'slow';
      }

      setQuality({ type, effectiveType, downlink, rtt });
    };

    updateQuality();
    connection.addEventListener('change', updateQuality);

    return () => {
      connection.removeEventListener('change', updateQuality);
    };
  }, []);

  return quality;
}

// Network Information API types
interface NetworkInformation extends EventTarget {
  effectiveType: string;
  downlink: number;
  rtt: number;
  addEventListener(type: 'change', listener: () => void): void;
  removeEventListener(type: 'change', listener: () => void): void;
}

// Page visibility hook
export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

// Idle detection hook
export function useIdleDetection(timeout: number = 60000) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsIdle(true), timeout);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => document.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => document.removeEventListener(event, resetTimer));
    };
  }, [timeout]);

  return isIdle;
}
