// Analytics utility module
'use client';

import { env } from './env';

type EventName = 
  | 'page_view'
  | 'wallet_connect'
  | 'wallet_disconnect'
  | 'leaderboard_view'
  | 'leaderboard_filter'
  | 'leaderboard_sort'
  | 'alert_create'
  | 'alert_toggle'
  | 'alert_delete'
  | 'search'
  | 'export_csv'
  | 'theme_toggle'
  | 'error';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

// Initialize analytics
export function initAnalytics() {
  if (!env.ENABLE_ANALYTICS || !env.IS_PRODUCTION) {
    console.log('[Analytics] Disabled');
    return;
  }
  
  console.log('[Analytics] Initialized');
}

// Track event
export function trackEvent(name: EventName, properties?: EventProperties) {
  if (!env.ENABLE_ANALYTICS) {
    if (env.IS_DEVELOPMENT) {
      console.log('[Analytics Event]', name, properties);
    }
    return;
  }
  
  // Add common properties
  const enrichedProperties = {
    ...properties,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.pathname : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
  };
  
  // Send to analytics service
  // Implementation would depend on analytics provider (Plausible, Fathom, etc.)
  console.log('[Analytics]', name, enrichedProperties);
}

// Track page view
export function trackPageView(path: string) {
  trackEvent('page_view', { path });
}

// Track error
export function trackError(error: Error, context?: string) {
  trackEvent('error', {
    message: error.message,
    stack: error.stack?.slice(0, 500),
    context,
  });
}

// React hook for page view tracking
export function usePageTracking() {
  if (typeof window === 'undefined') return;
  
  trackPageView(window.location.pathname);
}
