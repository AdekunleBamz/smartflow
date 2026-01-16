'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

// Dropdown context
interface DropdownContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown');
  }
  return context;
}

// Main Dropdown component
interface DropdownProps {
  children: React.ReactNode;
  className?: string;
}

export function Dropdown({ children, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div className={cn('relative inline-block', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// Dropdown trigger
interface DropdownTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export function DropdownTrigger({ children, asChild, className }: DropdownTriggerProps) {
  const { toggle } = useDropdown();

  if (asChild) {
    return (
      <div onClick={toggle} className={className}>
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'px-4 py-2 bg-white/10 rounded-lg hover:bg-white/15 transition-colors',
        className
      )}
    >
      {children}
    </button>
  );
}

// Dropdown menu
interface DropdownMenuProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

const alignStyles = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
};

export function DropdownMenu({ children, align = 'start', className }: DropdownMenuProps) {
  const { isOpen, close } = useDropdown();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={close} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 mt-2 min-w-[180px] py-2',
              'bg-gray-900 border border-white/10 rounded-xl',
              'shadow-xl shadow-black/20',
              alignStyles[align],
              className
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Dropdown item
interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function DropdownItem({
  children,
  onClick,
  disabled,
  destructive,
  icon,
  className,
}: DropdownItemProps) {
  const { close } = useDropdown();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    close();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-2 px-4 py-2 text-sm text-left',
        'hover:bg-white/5 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed',
        destructive && 'text-red-400 hover:text-red-300',
        !destructive && 'text-gray-200',
        className
      )}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
}

// Dropdown separator
export function DropdownSeparator() {
  return <div className="my-1 border-t border-white/10" />;
}

// Dropdown label
interface DropdownLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownLabel({ children, className }: DropdownLabelProps) {
  return (
    <div className={cn('px-4 py-1.5 text-xs font-medium text-gray-400', className)}>
      {children}
    </div>
  );
}
