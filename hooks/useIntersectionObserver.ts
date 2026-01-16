// useIntersectionObserver - viewport intersection hook
'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean, IntersectionObserverEntry | undefined] {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (frozen.current && freezeOnceVisible) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry);
        setIsVisible(observerEntry.isIntersecting);
        
        if (observerEntry.isIntersecting && freezeOnceVisible) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [root, rootMargin, threshold, freezeOnceVisible]);

  return [elementRef, isVisible, entry];
}

// Convenience hook for lazy loading
export function useLazyLoad<T extends Element>() {
  return useIntersectionObserver<T>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });
}

// Hook for infinite scroll
export function useInfiniteScroll<T extends Element>(
  onIntersect: () => void,
  options: { enabled?: boolean } = {}
) {
  const { enabled = true } = options;
  const [ref, isVisible] = useIntersectionObserver<T>({
    rootMargin: '100px',
    threshold: 0,
  });

  useEffect(() => {
    if (isVisible && enabled) {
      onIntersect();
    }
  }, [isVisible, enabled, onIntersect]);

  return ref;
}
