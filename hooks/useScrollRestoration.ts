'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

interface UseScrollRestorationOptions {
  enabled?: boolean;
  storageKey?: string;
  maxEntries?: number;
  expirationMs?: number;
}

const DEFAULT_OPTIONS: Required<UseScrollRestorationOptions> = {
  enabled: true,
  storageKey: 'smartflow-scroll-positions',
  maxEntries: 50,
  expirationMs: 30 * 60 * 1000, // 30 minutes
};

export function useScrollRestoration(options: UseScrollRestorationOptions = {}) {
  const { enabled, storageKey, maxEntries, expirationMs } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  
  const pathname = usePathname();
  const isRestoringRef = useRef(false);
  const hasRestoredRef = useRef(false);

  // Get stored positions
  const getPositions = useCallback((): Record<string, ScrollPosition> => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = sessionStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, [storageKey]);

  // Save positions
  const savePositions = useCallback((positions: Record<string, ScrollPosition>) => {
    if (typeof window === 'undefined') return;
    try {
      // Remove expired entries
      const now = Date.now();
      const filtered: Record<string, ScrollPosition> = {};
      const entries = Object.entries(positions);
      
      // Keep only non-expired entries, limit to maxEntries
      entries
        .filter(([, pos]) => now - pos.timestamp < expirationMs)
        .slice(-maxEntries)
        .forEach(([key, pos]) => {
          filtered[key] = pos;
        });
      
      sessionStorage.setItem(storageKey, JSON.stringify(filtered));
    } catch {
      // Storage full or unavailable
    }
  }, [storageKey, maxEntries, expirationMs]);

  // Save current scroll position
  const saveScrollPosition = useCallback(() => {
    if (!enabled || isRestoringRef.current) return;
    
    const positions = getPositions();
    positions[pathname] = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
    };
    savePositions(positions);
  }, [enabled, pathname, getPositions, savePositions]);

  // Restore scroll position
  const restoreScrollPosition = useCallback(() => {
    if (!enabled || hasRestoredRef.current) return;
    
    const positions = getPositions();
    const position = positions[pathname];
    
    if (position) {
      isRestoringRef.current = true;
      
      // Use requestAnimationFrame for smooth restoration
      requestAnimationFrame(() => {
        window.scrollTo({
          left: position.x,
          top: position.y,
          behavior: 'instant',
        });
        
        // Double-check after content might have loaded
        setTimeout(() => {
          if (window.scrollY !== position.y) {
            window.scrollTo({
              left: position.x,
              top: position.y,
              behavior: 'instant',
            });
          }
          isRestoringRef.current = false;
        }, 100);
      });
      
      hasRestoredRef.current = true;
    }
  }, [enabled, pathname, getPositions]);

  // Clear position for current path
  const clearScrollPosition = useCallback(() => {
    const positions = getPositions();
    delete positions[pathname];
    savePositions(positions);
  }, [pathname, getPositions, savePositions]);

  // Clear all positions
  const clearAllPositions = useCallback(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(storageKey);
  }, [storageKey]);

  // Reset restoration flag when pathname changes
  useEffect(() => {
    hasRestoredRef.current = false;
  }, [pathname]);

  // Restore on mount and save on unmount/navigation
  useEffect(() => {
    if (!enabled) return;

    // Restore position after initial render
    restoreScrollPosition();

    // Save position on scroll (debounced via passive event)
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveScrollPosition, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Save before unload
    window.addEventListener('beforeunload', saveScrollPosition);

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', saveScrollPosition);
      saveScrollPosition();
    };
  }, [enabled, saveScrollPosition, restoreScrollPosition]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    clearAllPositions,
  };
}

export default useScrollRestoration;
