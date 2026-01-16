// Event system for component communication
type EventCallback<T = unknown> = (data: T) => void;
type UnsubscribeFn = () => void;

class EventEmitter {
  private events = new Map<string, Set<EventCallback>>();

  on<T = unknown>(event: string, callback: EventCallback<T>): UnsubscribeFn {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    
    const callbacks = this.events.get(event)!;
    callbacks.add(callback as EventCallback);

    return () => {
      callbacks.delete(callback as EventCallback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    };
  }

  once<T = unknown>(event: string, callback: EventCallback<T>): UnsubscribeFn {
    const unsubscribe = this.on<T>(event, (data) => {
      unsubscribe();
      callback(data);
    });
    return unsubscribe;
  }

  emit<T = unknown>(event: string, data?: T): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  off(event: string, callback?: EventCallback): void {
    if (!callback) {
      this.events.delete(event);
      return;
    }

    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    }
  }

  clear(): void {
    this.events.clear();
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.size ?? 0;
  }
}

// Global event bus instance
export const eventBus = new EventEmitter();

// App-specific events
export const AppEvents = {
  WALLET_CONNECTED: 'wallet:connected',
  WALLET_DISCONNECTED: 'wallet:disconnected',
  WALLET_CHANGED: 'wallet:changed',
  ALERT_CREATED: 'alert:created',
  ALERT_TRIGGERED: 'alert:triggered',
  ALERT_DELETED: 'alert:deleted',
  TRANSACTION_DETECTED: 'transaction:detected',
  PRICE_UPDATE: 'price:update',
  THEME_CHANGED: 'theme:changed',
  NETWORK_STATUS: 'network:status',
  REFRESH_DATA: 'data:refresh',
} as const;

// Type-safe event emitter
export interface AppEventPayloads {
  [AppEvents.WALLET_CONNECTED]: { address: string };
  [AppEvents.WALLET_DISCONNECTED]: void;
  [AppEvents.WALLET_CHANGED]: { oldAddress: string; newAddress: string };
  [AppEvents.ALERT_CREATED]: { id: string; name: string };
  [AppEvents.ALERT_TRIGGERED]: { id: string; message: string };
  [AppEvents.ALERT_DELETED]: { id: string };
  [AppEvents.TRANSACTION_DETECTED]: { hash: string; from: string; to: string };
  [AppEvents.PRICE_UPDATE]: { symbol: string; price: number };
  [AppEvents.THEME_CHANGED]: { theme: 'light' | 'dark' };
  [AppEvents.NETWORK_STATUS]: { online: boolean };
  [AppEvents.REFRESH_DATA]: { scope: string };
}

// Typed event helpers
export function emitAppEvent<K extends keyof AppEventPayloads>(
  event: K,
  data: AppEventPayloads[K]
): void {
  eventBus.emit(event, data);
}

export function onAppEvent<K extends keyof AppEventPayloads>(
  event: K,
  callback: EventCallback<AppEventPayloads[K]>
): UnsubscribeFn {
  return eventBus.on(event, callback);
}
