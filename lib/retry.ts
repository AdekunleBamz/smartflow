// Retry and backoff utilities
export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryOn?: (error: Error) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

const defaultOptions: Required<Omit<RetryOptions, 'retryOn' | 'onRetry'>> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffFactor: 2,
};

// Calculate delay with exponential backoff
export function calculateBackoff(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffFactor: number
): number {
  const delay = initialDelay * Math.pow(backoffFactor, attempt);
  const jitter = delay * 0.1 * Math.random();
  return Math.min(delay + jitter, maxDelay);
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry a function with exponential backoff
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = defaultOptions.maxRetries,
    initialDelay = defaultOptions.initialDelay,
    maxDelay = defaultOptions.maxDelay,
    backoffFactor = defaultOptions.backoffFactor,
    retryOn,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      if (attempt >= maxRetries) break;
      if (retryOn && !retryOn(lastError)) break;

      // Calculate delay
      const delay = calculateBackoff(attempt, initialDelay, maxDelay, backoffFactor);

      // Notify about retry
      onRetry?.(lastError, attempt + 1);

      // Wait before next attempt
      await sleep(delay);
    }
  }

  throw lastError!;
}

// Retry with circuit breaker pattern
export interface CircuitBreakerOptions {
  failureThreshold?: number;
  recoveryTimeout?: number;
  halfOpenRequests?: number;
}

type CircuitState = 'closed' | 'open' | 'half-open';

export function createCircuitBreaker(options: CircuitBreakerOptions = {}) {
  const {
    failureThreshold = 5,
    recoveryTimeout = 30000,
    halfOpenRequests = 3,
  } = options;

  let state: CircuitState = 'closed';
  let failures = 0;
  let lastFailureTime = 0;
  let halfOpenSuccesses = 0;

  return async function <T>(fn: () => Promise<T>): Promise<T> {
    // Check circuit state
    if (state === 'open') {
      if (Date.now() - lastFailureTime > recoveryTimeout) {
        state = 'half-open';
        halfOpenSuccesses = 0;
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();

      // Success handling
      if (state === 'half-open') {
        halfOpenSuccesses++;
        if (halfOpenSuccesses >= halfOpenRequests) {
          state = 'closed';
          failures = 0;
        }
      } else {
        failures = 0;
      }

      return result;
    } catch (error) {
      failures++;
      lastFailureTime = Date.now();

      if (failures >= failureThreshold) {
        state = 'open';
      }

      throw error;
    }
  };
}
