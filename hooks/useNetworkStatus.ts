'use client';

import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  downlink: number | null;
  rtt: number | null;
  saveData: boolean;
}

interface NetworkConnection extends EventTarget {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

declare global {
  interface Navigator {
    connection?: NetworkConnection;
    mozConnection?: NetworkConnection;
    webkitConnection?: NetworkConnection;
  }
}

const getConnection = (): NetworkConnection | null => {
  if (typeof navigator === 'undefined') return null;
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
};

const getNetworkStatus = (): NetworkStatus => {
  if (typeof window === 'undefined') {
    return {
      isOnline: true,
      isSlowConnection: false,
      effectiveType: 'unknown',
      downlink: null,
      rtt: null,
      saveData: false,
    };
  }

  const connection = getConnection();
  const effectiveType = connection?.effectiveType || 'unknown';
  const isSlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g';

  return {
    isOnline: navigator.onLine,
    isSlowConnection,
    effectiveType,
    downlink: connection?.downlink ?? null,
    rtt: connection?.rtt ?? null,
    saveData: connection?.saveData ?? false,
  };
};

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>(getNetworkStatus);

  const updateStatus = useCallback(() => {
    setStatus(getNetworkStatus());
  }, []);

  useEffect(() => {
    // Listen for online/offline events
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Listen for connection changes
    const connection = getConnection();
    if (connection) {
      connection.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (connection) {
        connection.removeEventListener('change', updateStatus);
      }
    };
  }, [updateStatus]);

  return status;
}

// Simple hook for just online status
export function useIsOnline(): boolean {
  const { isOnline } = useNetworkStatus();
  return isOnline;
}

// Hook with callback for connection changes
export function useOnNetworkChange(callback: (status: NetworkStatus) => void) {
  const status = useNetworkStatus();
  const callbackRef = useCallback(callback, [callback]);

  useEffect(() => {
    callbackRef(status);
  }, [status, callbackRef]);

  return status;
}

export default useNetworkStatus;
