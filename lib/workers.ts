// Web Worker message types for background processing
export interface WorkerMessage {
  type: string;
  payload?: unknown;
  id?: string;
}

export interface WorkerResponse {
  type: string;
  payload?: unknown;
  error?: string;
  id?: string;
}

// Worker utility to run heavy computations
export function createWorker(workerScript: string): Worker | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    
    return worker;
  } catch (error) {
    console.error('Failed to create worker:', error);
    return null;
  }
}

// Sort large arrays in worker
export function sortLargeArray<T>(
  array: T[],
  compareFn: (a: T, b: T) => number
): Promise<T[]> {
  return new Promise((resolve) => {
    // For small arrays, sort synchronously
    if (array.length < 1000) {
      resolve([...array].sort(compareFn));
      return;
    }
    
    // For large arrays, use requestIdleCallback to prevent blocking
    const sorted = [...array];
    let i = 0;
    const chunkSize = 100;
    
    function sortChunk(deadline: IdleDeadline) {
      while (i < sorted.length - 1 && deadline.timeRemaining() > 0) {
        for (let j = 0; j < chunkSize && i < sorted.length - 1; j++, i++) {
          // Bubble sort chunk (simplified - real impl would use merge sort)
          if (compareFn(sorted[i], sorted[i + 1]) > 0) {
            [sorted[i], sorted[i + 1]] = [sorted[i + 1], sorted[i]];
          }
        }
      }
      
      if (i < sorted.length - 1) {
        requestIdleCallback(sortChunk);
      } else {
        // Final sort pass
        sorted.sort(compareFn);
        resolve(sorted);
      }
    }
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(sortChunk);
    } else {
      // Fallback for browsers without requestIdleCallback
      resolve(sorted.sort(compareFn));
    }
  });
}

// Debounced search filter
export function createSearchFilter<T>(
  items: T[],
  searchKeys: (keyof T)[],
  debounceMs: number = 150
) {
  let timeoutId: NodeJS.Timeout;
  
  return (query: string): Promise<T[]> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        if (!query.trim()) {
          resolve(items);
          return;
        }
        
        const lowerQuery = query.toLowerCase();
        const filtered = items.filter((item) =>
          searchKeys.some((key) => {
            const value = item[key];
            if (typeof value === 'string') {
              return value.toLowerCase().includes(lowerQuery);
            }
            return false;
          })
        );
        
        resolve(filtered);
      }, debounceMs);
    });
  };
}
