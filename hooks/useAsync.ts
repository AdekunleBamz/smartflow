'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  status: AsyncStatus;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface UseAsyncReturn<T, A extends unknown[]> extends AsyncState<T> {
  execute: (...args: A) => Promise<T>;
  reset: () => void;
  setData: (data: T | null) => void;
}

interface UseAsyncOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialData?: T | null;
}

export function useAsync<T, A extends unknown[] = []>(
  asyncFunction: (...args: A) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T, A> {
  const { immediate = false, onSuccess, onError, initialData = null } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    error: null,
    status: 'idle',
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
  });

  // Track mounted state to prevent updates after unmount
  const mountedRef = useRef(true);
  const asyncFunctionRef = useRef(asyncFunction);

  // Keep function ref updated
  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  }, [asyncFunction]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const updateState = useCallback((newState: Partial<AsyncState<T>>) => {
    if (!mountedRef.current) return;
    
    setState(prev => {
      const status = newState.status ?? prev.status;
      return {
        ...prev,
        ...newState,
        isIdle: status === 'idle',
        isPending: status === 'pending',
        isSuccess: status === 'success',
        isError: status === 'error',
      };
    });
  }, []);

  const execute = useCallback(async (...args: A): Promise<T> => {
    updateState({ status: 'pending', error: null });

    try {
      const result = await asyncFunctionRef.current(...args);
      
      if (mountedRef.current) {
        updateState({ data: result, status: 'success' });
        onSuccess?.(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      if (mountedRef.current) {
        updateState({ error, status: 'error' });
        onError?.(error);
      }
      
      throw error;
    }
  }, [updateState, onSuccess, onError]);

  const reset = useCallback(() => {
    updateState({
      data: initialData,
      error: null,
      status: 'idle',
    });
  }, [updateState, initialData]);

  const setData = useCallback((data: T | null) => {
    updateState({ data });
  }, [updateState]);

  // Execute immediately if option is set
  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as A));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

// Simplified version for simple async operations
export function useAsyncFn<T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList = []
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedFn = useCallback(asyncFunction, deps);
  return useAsync(memoizedFn);
}

export default useAsync;
