// Storage utilities with type safety
const STORAGE_PREFIX = 'smartflow:';

// Get storage key with prefix
function getKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

// Typed localStorage wrapper
export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue ?? null;
    
    try {
      const item = localStorage.getItem(getKey(key));
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue ?? null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error('Storage set failed:', error);
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(getKey(key));
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    
    // Only clear keys with our prefix
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  },

  has(key: string): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(getKey(key)) !== null;
  },

  keys(): string[] {
    if (typeof window === 'undefined') return [];
    
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .map((key) => key.slice(STORAGE_PREFIX.length));
  },
};

// Typed sessionStorage wrapper
export const sessionStorage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue ?? null;
    
    try {
      const item = window.sessionStorage.getItem(getKey(key));
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue ?? null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      window.sessionStorage.setItem(getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error('SessionStorage set failed:', error);
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(getKey(key));
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    
    Object.keys(window.sessionStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => window.sessionStorage.removeItem(key));
  },
};

// Storage quota utilities
export async function getStorageQuota(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
} | null> {
  if (typeof window === 'undefined' || !navigator.storage) return null;
  
  try {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = quota > 0 ? (usage / quota) * 100 : 0;
    
    return { usage, quota, percentage };
  } catch {
    return null;
  }
}

// Check if storage is available
export function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
