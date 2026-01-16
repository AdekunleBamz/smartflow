// Alerts store with Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Alert {
  id: string;
  type: 'whale' | 'dex' | 'netflow' | 'custom';
  title: string;
  description: string;
  wallet?: string;
  token?: string;
  threshold?: number;
  condition?: 'above' | 'below' | 'equals';
  enabled: boolean;
  createdAt: number;
  triggeredAt?: number;
  triggerCount: number;
}

export interface AlertNotification {
  id: string;
  alertId: string;
  message: string;
  timestamp: number;
  read: boolean;
  data?: Record<string, unknown>;
}

interface AlertsState {
  alerts: Alert[];
  notifications: AlertNotification[];
  isLoading: boolean;
  
  // Alert actions
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  
  // Notification actions
  addNotification: (notification: Omit<AlertNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  
  // Getters
  getUnreadCount: () => number;
  getAlertsByType: (type: Alert['type']) => Alert[];
}

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set, get) => ({
      alerts: [],
      notifications: [],
      isLoading: false,
      
      addAlert: (alertData) => {
        const alert: Alert = {
          ...alertData,
          id: `alert-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: Date.now(),
          triggerCount: 0,
        };
        set((state) => ({
          alerts: [...state.alerts, alert],
        }));
      },
      
      updateAlert: (id, updates) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          ),
        }));
      },
      
      removeAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        }));
      },
      
      toggleAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
          ),
        }));
      },
      
      addNotification: (notificationData) => {
        const notification: AlertNotification = {
          ...notificationData,
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: Date.now(),
          read: false,
        };
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 100), // Keep last 100
        }));
      },
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      },
      
      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
      
      getAlertsByType: (type) => {
        return get().alerts.filter((a) => a.type === type);
      },
    }),
    {
      name: 'smartflow-alerts',
      partialize: (state) => ({
        alerts: state.alerts,
        notifications: state.notifications.slice(0, 50), // Persist last 50
      }),
    }
  )
);
