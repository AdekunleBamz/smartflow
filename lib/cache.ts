// Cache utilities with TTL support
export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  onEvict?: (key: string, value: unknown) => void;
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  expiresAt: number;
}

// In-memory cache with TTL
export class MemoryCache<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>();
  private ttl: number;
  private maxSize: number;
  private onEvict?: (key: string, value: unknown) => void;

  constructor(options: CacheOptions = {}) {
    this.ttl = options.ttl ?? 5 * 60 * 1000; // 5 minutes default
    this.maxSize = options.maxSize ?? 1000;
    this.onEvict = options.onEvict;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return undefined;
    }
    
    return entry.value;
  }

  set(key: string, value: T, ttl?: number): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictOldest();
    }

    const now = Date.now();
    this.cache.set(key, {
      value,
      timestamp: now,
      expiresAt: now + (ttl ?? this.ttl),
    });
  }

  has(key: string): boolean {
    const value = this.get(key); // This also handles expiration
    return value !== undefined;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.onEvict?.(key, entry.value);
    }
    return this.cache.delete(key);
  }

  clear(): void {
    if (this.onEvict) {
      this.cache.forEach((entry, key) => {
        this.onEvict?.(key, entry.value);
      });
    }
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  // Clean up expired entries
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.delete(key);
        cleaned++;
      }
    });

    return cleaned;
  }
}

// Create a memoized function with cache
export function memoize<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  options: CacheOptions & { keyGenerator?: (...args: TArgs) => string } = {}
): (...args: TArgs) => TResult {
  const cache = new MemoryCache<TResult>(options);
  const keyGenerator = options.keyGenerator ?? ((...args) => JSON.stringify(args));

  return (...args: TArgs): TResult => {
    const key = keyGenerator(...args);
    const cached = cache.get(key);
    
    if (cached !== undefined) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Async memoization
export function memoizeAsync<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: CacheOptions & { keyGenerator?: (...args: TArgs) => string } = {}
): (...args: TArgs) => Promise<TResult> {
  const cache = new MemoryCache<TResult>(options);
  const pending = new Map<string, Promise<TResult>>();
  const keyGenerator = options.keyGenerator ?? ((...args) => JSON.stringify(args));

  return async (...args: TArgs): Promise<TResult> => {
    const key = keyGenerator(...args);
    const cached = cache.get(key);
    
    if (cached !== undefined) {
      return cached;
    }

    // Check if there's a pending request
    const pendingRequest = pending.get(key);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Make the request
    const promise = fn(...args);
    pending.set(key, promise);

    try {
      const result = await promise;
      cache.set(key, result);
      return result;
    } finally {
      pending.delete(key);
    }
  };
}
