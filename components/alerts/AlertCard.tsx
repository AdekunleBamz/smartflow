// Alert card component
'use client';

import { motion } from 'framer-motion';
import { Bell, BellOff, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { Alert } from '@/lib/alerts-store';
import { formatAddress, formatRelativeTime, formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';

interface AlertCardProps {
  alert: Alert;
  onToggle: (id: string) => void;
  onEdit: (alert: Alert) => void;
  onDelete: (id: string) => void;
}

const alertTypeIcons = {
  whale: '🐋',
  dex: '📊',
  netflow: '💸',
  custom: '⚙️',
};

const alertTypeColors = {
  whale: 'bg-blue-500/20 text-blue-400',
  dex: 'bg-purple-500/20 text-purple-400',
  netflow: 'bg-green-500/20 text-green-400',
  custom: 'bg-orange-500/20 text-orange-400',
};

export function AlertCard({ alert, onToggle, onEdit, onDelete }: AlertCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'card p-4 transition-all',
        !alert.enabled && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div className={cn(
          'p-3 rounded-xl text-2xl',
          alertTypeColors[alert.type]
        )}>
          {alertTypeIcons[alert.type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-text-primary truncate">
              {alert.title}
            </h3>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full capitalize',
              alertTypeColors[alert.type]
            )}>
              {alert.type}
            </span>
          </div>

          <p className="text-sm text-text-secondary line-clamp-2 mb-2">
            {alert.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            {alert.wallet && (
              <span className="flex items-center gap-1">
                📍 {formatAddress(alert.wallet)}
              </span>
            )}
            {alert.threshold && (
              <span className="flex items-center gap-1">
                🎯 {alert.condition} {formatCurrency(alert.threshold)}
              </span>
            )}
            <span>
              Triggered {alert.triggerCount}x
            </span>
            {alert.triggeredAt && (
              <span>
                Last: {formatRelativeTime(alert.triggeredAt)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Toggle
            checked={alert.enabled}
            onChange={() => onToggle(alert.id)}
            size="sm"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(alert)}
            className="p-2"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(alert.id)}
            className="p-2 text-loss hover:text-loss"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
