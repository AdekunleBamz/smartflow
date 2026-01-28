'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Home, Bell, Wallet, TrendingUp, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const defaultNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: <Home className="w-5 h-5" /> },
  { label: 'Smart Money', href: '/smart-money', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Alerts', href: '/alerts', icon: <Bell className="w-5 h-5" /> },
  { label: 'Wallet', href: '/wallet', icon: <Wallet className="w-5 h-5" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
];

interface MobileNavProps {
  items?: NavItem[];
  logo?: React.ReactNode;
  className?: string;
}

export function MobileNav({
  items = defaultNavItems,
  logo,
  className,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'flex items-center justify-between',
          'px-4 h-14',
          'bg-gray-900/95 backdrop-blur-md border-b border-white/10',
          'md:hidden',
          className
        )}
      >
        {logo || <span className="font-bold text-white text-lg">SmartFlow</span>}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slide-out menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className={cn(
              'fixed top-14 left-0 bottom-0 w-64 z-50',
              'bg-gray-900 border-r border-white/10',
              'overflow-y-auto',
              'md:hidden'
            )}
          >
            <ul className="py-4">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-6 py-3',
                        'text-base font-medium transition-colors',
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

// Bottom tab bar for mobile
interface BottomTabBarProps {
  items?: NavItem[];
  className?: string;
}

export function BottomTabBar({
  items = defaultNavItems.slice(0, 5),
  className,
}: BottomTabBarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-gray-900/95 backdrop-blur-md border-t border-white/10',
        'md:hidden',
        className
      )}
    >
      <ul className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2',
                  'transition-colors',
                  isActive ? 'text-blue-500' : 'text-gray-400'
                )}
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MobileNav;
