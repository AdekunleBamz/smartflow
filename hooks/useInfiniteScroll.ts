'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void | Promise<void>;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true,
    hasMore,
    isLoading,
    onLoadMore,
  } = options;

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsIntersecting(entry.isIntersecting);

      if (entry.isIntersecting && hasMore && !isLoading && enabled) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, enabled, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
      observer.disconnect();
    };
  }, [enabled, threshold, rootMargin, handleIntersect]);

  // Sentinel component to place at the end of the list
  const Sentinel = useCallback(
    () => (
      <div
        ref={sentinelRef}
        className="h-1 w-full"
        aria-hidden="true"
      />
    ),
    []
  );

  return {
    sentinelRef,
    Sentinel,
    isIntersecting,
  };
}

// Hook for window-based infinite scroll
export function useWindowInfiniteScroll(options: Omit<UseInfiniteScrollOptions, 'threshold' | 'rootMargin'> & { offset?: number }) {
  const {
    offset = 200,
    enabled = true,
    hasMore,
    isLoading,
    onLoadMore,
  } = options;

  const handleScroll = useCallback(() => {
    if (!enabled || isLoading || !hasMore) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - offset) {
      onLoadMore();
    }
  }, [enabled, isLoading, hasMore, offset, onLoadMore]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled, handleScroll]);

  return { handleScroll };
}

export default useInfiniteScroll;
