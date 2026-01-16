// API client configuration and base utilities
import { API_CONFIG } from './constants';
import { ApiError, NetworkError, withRetry } from './errors';

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

const defaultConfig: RequestConfig = {
  timeout: API_CONFIG.TIMEOUT,
  retries: API_CONFIG.RETRY_COUNT,
  cache: 'no-store',
};

// Create abort controller with timeout
function createTimeoutController(timeout: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller;
}

// Build full URL with query params
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(endpoint, API_CONFIG.BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

// Parse response based on content type
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response.text() as unknown as T;
}

// Main fetch wrapper
async function request<T>(
  method: string,
  endpoint: string,
  options: {
    params?: Record<string, string | number | boolean>;
    body?: unknown;
    config?: RequestConfig;
  } = {}
): Promise<ApiResponse<T>> {
  const config = { ...defaultConfig, ...options.config };
  const controller = createTimeoutController(config.timeout!);
  
  const url = buildUrl(endpoint, options.params);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.headers,
  };
  
  const fetchOptions: RequestInit = {
    method,
    headers,
    signal: controller.signal,
    cache: config.cache,
  };
  
  if (options.body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(options.body);
  }
  
  const fetchWithRetry = async (): Promise<Response> => {
    try {
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new ApiError(
          `Request failed: ${response.statusText}`,
          response.status,
          await response.text()
        );
      }
      
      return response;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError('Request timeout');
      }
      throw new NetworkError('Network request failed');
    }
  };
  
  const response = await withRetry(fetchWithRetry, config.retries);
  const data = await parseResponse<T>(response);
  
  return {
    data,
    status: response.status,
    headers: response.headers,
  };
}

// HTTP method shortcuts
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>, config?: RequestConfig) =>
    request<T>('GET', endpoint, { params, config }),
    
  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>('POST', endpoint, { body, config }),
    
  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>('PUT', endpoint, { body, config }),
    
  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>('PATCH', endpoint, { body, config }),
    
  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>('DELETE', endpoint, { config }),
};

export default api;
