'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  TrendingUp,
  Wallet,
  Settings,
  Trash2,
} from 'lucide-react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'price' | 'wallet';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  timestamp: Date | string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount?: number;
  onRead: (id: string) => void;
  onReadAll?: () => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}

const typeConfig = {
  info: { icon: Info, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  success: { icon: Check, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  warning: { icon: AlertCircle, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  error: { icon: AlertCircle, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  price: { icon: TrendingUp, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  wallet: { icon: Wallet, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
};

function formatTimeAgo(timestamp: Date | string): string {
  const date = new Date(timestamp);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function NotificationCenter({
  notifications,
  unreadCount = 0,
  onRead,
  onReadAll,
  onDelete,
  onClearAll,
  onSettingsClick,
  className,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 rounded-xl transition-colors',
          isOpen ? 'bg-white/10' : 'hover:bg-white/5'
        )}
      >
        <Bell className="w-5 h-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={cn(
                'absolute right-0 top-full mt-2 z-20',
                'w-96 max-h-[500px] flex flex-col',
                'bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <h3 className="font-semibold text-white">Notifications</h3>
                <div className="flex items-center gap-1">
                  {onReadAll && unreadCount > 0 && (
                    <button
                      onClick={onReadAll}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title="Mark all as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {onClearAll && notifications.length > 0 && (
                    <button
                      onClick={onClearAll}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title="Clear all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {onSettingsClick && (
                    <button
                      onClick={onSettingsClick}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={() => onRead(notification.id)}
                        onDelete={onDelete ? () => onDelete(notification.id) : undefined}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({
  notification,
  onRead,
  onDelete,
}: {
  notification: Notification;
  onRead: () => void;
  onDelete?: () => void;
}) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onRead}
      className={cn(
        'group flex items-start gap-3 p-4 cursor-pointer transition-colors',
        !notification.read && 'bg-blue-500/5',
        'hover:bg-white/[0.03]'
      )}
    >
      <div className={cn('p-2 rounded-lg flex-shrink-0', config.bgColor)}>
        <Icon className={cn('w-4 h-4', config.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn('text-sm font-medium', notification.read ? 'text-gray-300' : 'text-white')}>
            {notification.title}
          </h4>
          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
        </div>
        {notification.message && (
          <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">{notification.message}</p>
        )}
        <span className="text-xs text-gray-500 mt-1 block">{formatTimeAgo(notification.timestamp)}</span>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

// Notification toast for real-time alerts
export function NotificationToast({
  notification,
  onDismiss,
  autoHideDuration = 5000,
  className,
}: {
  notification: Notification;
  onDismiss: () => void;
  autoHideDuration?: number;
  className?: string;
}) {
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, autoHideDuration);
    return () => clearTimeout(timer);
  }, [onDismiss, autoHideDuration]);

  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl',
        'bg-gray-900 border border-white/10 shadow-xl',
        'min-w-[300px] max-w-[400px]',
        className
      )}
    >
      <div className={cn('p-2 rounded-lg', config.bgColor)}>
        <Icon className={cn('w-4 h-4', config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white">{notification.title}</h4>
        {notification.message && (
          <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">{notification.message}</p>
        )}
      </div>
      <button onClick={onDismiss} className="p-1 text-gray-500 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default NotificationCenter;
