// Alert notification toast component
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, ExternalLink } from 'lucide-react';
import { AlertNotification } from '@/lib/alerts-store';
import { formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface AlertNotificationToastProps {
  notification: AlertNotification;
  onDismiss: (id: string) => void;
  onMarkRead: (id: string) => void;
}

export function AlertNotificationToast({ 
  notification, 
  onDismiss, 
  onMarkRead 
}: AlertNotificationToastProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={cn(
        'w-80 p-4 rounded-xl bg-surface border shadow-lg',
        notification.read ? 'border-white/10' : 'border-primary/50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2 rounded-lg',
          notification.read ? 'bg-white/5' : 'bg-primary/20'
        )}>
          <Bell className={cn(
            'h-4 w-4',
            notification.read ? 'text-text-tertiary' : 'text-primary'
          )} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-text-tertiary mt-1">
            {formatRelativeTime(notification.timestamp)}
          </p>
        </div>

        <button
          onClick={() => onDismiss(notification.id)}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4 text-text-tertiary" />
        </button>
      </div>

      {!notification.read && (
        <div className="flex justify-end mt-3 pt-3 border-t border-white/10">
          <button
            onClick={() => onMarkRead(notification.id)}
            className="text-xs text-primary hover:text-primary-light transition-colors"
          >
            Mark as read
          </button>
        </div>
      )}
    </motion.div>
  );
}

interface AlertNotificationListProps {
  notifications: AlertNotification[];
  onDismiss: (id: string) => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClear: () => void;
}

export function AlertNotificationList({
  notifications,
  onDismiss,
  onMarkRead,
  onMarkAllRead,
  onClear,
}: AlertNotificationListProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3">
      {notifications.length > 0 && (
        <div className="flex items-center justify-between text-xs text-text-tertiary mb-2">
          <span>{unreadCount} unread</span>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="hover:text-text-primary transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClear}
              className="hover:text-loss transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {notifications.slice(0, 5).map((notification) => (
          <AlertNotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
            onMarkRead={onMarkRead}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
