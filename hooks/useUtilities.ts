'use client';

import { useEffect, useState, useCallback } from 'react';

// Throttle hook
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const [lastRan, setLastRan] = useState(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now - lastRan >= limit) {
      setThrottledValue(value);
      setLastRan(now);
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        setLastRan(Date.now());
      }, limit - (now - lastRan));

      return () => clearTimeout(timer);
    }
  }, [value, limit, lastRan]);

  return throttledValue;
}

// Toggle hook
export function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue((v) => !v), []);
  const set = useCallback((newValue: boolean) => setValue(newValue), []);

  return [value, toggle, set];
}

// Counter hook
export function useCounter(initialValue: number = 0, options?: { min?: number; max?: number }) {
  const [count, setCount] = useState(initialValue);
  const { min = -Infinity, max = Infinity } = options || {};

  const increment = useCallback(() => {
    setCount((c) => Math.min(c + 1, max));
  }, [max]);

  const decrement = useCallback(() => {
    setCount((c) => Math.max(c - 1, min));
  }, [min]);

  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  const set = useCallback(
    (value: number) => {
      setCount(Math.min(Math.max(value, min), max));
    },
    [min, max]
  );

  return { count, increment, decrement, reset, set };
}

// Async hook with loading/error states
interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: unknown[] = []
): UseAsyncState<T> & { execute: () => Promise<void> } {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, execute };
}

// Update effect (runs on updates only, not mount)
export function useUpdateEffect(effect: () => void | (() => void), deps: unknown[]): void {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted) {
      return effect();
    }
    setIsMounted(true);
  }, deps);
}

// Mounted state hook
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
}
