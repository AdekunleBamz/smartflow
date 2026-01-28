'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, AlertCircle, Info, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type BannerVariant = 'info' | 'warning' | 'success' | 'promo';

interface AnnouncementBannerProps {
  id: string;
  message: string;
  variant?: BannerVariant;
  link?: {
    text: string;
    href: string;
  };
  dismissible?: boolean;
  persistDismissal?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BannerVariant, { bg: string; text: string; border: string }> = {
  info: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20',
  },
  success: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/20',
  },
  promo: {
    bg: 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10',
    text: 'text-purple-300',
    border: 'border-purple-500/20',
  },
};

const variantIcons: Record<BannerVariant, React.ReactNode> = {
  info: <Info className="w-4 h-4" />,
  warning: <AlertCircle className="w-4 h-4" />,
  success: <Zap className="w-4 h-4" />,
  promo: <Zap className="w-4 h-4" />,
};

export function AnnouncementBanner({
  id,
  message,
  variant = 'info',
  link,
  dismissible = true,
  persistDismissal = true,
  icon,
  className,
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const storageKey = `announcement-dismissed-${id}`;

  useEffect(() => {
    if (persistDismissal) {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed === 'true') {
        setIsVisible(false);
      }
    }
  }, [persistDismissal, storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (persistDismissal) {
      localStorage.setItem(storageKey, 'true');
    }
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              'flex items-center justify-center gap-3 px-4 py-2.5',
              'border-b',
              styles.bg,
              styles.border,
              className
            )}
          >
            <span className={styles.text}>
              {icon || variantIcons[variant]}
            </span>
            
            <p className={cn('text-sm font-medium', styles.text)}>
              {message}
            </p>
            
            {link && (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-1 text-sm font-medium',
                  'hover:underline',
                  styles.text
                )}
              >
                {link.text}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            
            {dismissible && (
              <button
                onClick={handleDismiss}
                className={cn(
                  'ml-auto p-1 rounded-md',
                  'hover:bg-white/10 transition-colors',
                  styles.text
                )}
                aria-label="Dismiss announcement"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AnnouncementBanner;
