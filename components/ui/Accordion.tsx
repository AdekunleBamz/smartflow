'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionContextValue {
  activeItems: string[];
  toggle: (id: string) => void;
  isActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

interface AccordionProps {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  className?: string;
}

export function Accordion({
  children,
  type = 'single',
  defaultValue,
  className,
}: AccordionProps) {
  const [activeItems, setActiveItems] = useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggle = useCallback((id: string) => {
    setActiveItems(prev => {
      const isActive = prev.includes(id);
      
      if (type === 'single') {
        return isActive ? [] : [id];
      }
      
      return isActive
        ? prev.filter(item => item !== id)
        : [...prev, id];
    });
  }, [type]);

  const isActive = useCallback((id: string) => {
    return activeItems.includes(id);
  }, [activeItems]);

  return (
    <AccordionContext.Provider value={{ activeItems, toggle, isActive }}>
      <div className={cn('divide-y divide-white/10', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({ id, children, className }: AccordionItemProps) {
  return (
    <div className={cn('', className)} data-accordion-item={id}>
      {children}
    </div>
  );
}

interface AccordionTriggerProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  iconPosition?: 'left' | 'right';
}

export function AccordionTrigger({
  id,
  children,
  className,
  iconPosition = 'right',
}: AccordionTriggerProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');

  const { toggle, isActive } = context;
  const active = isActive(id);

  return (
    <button
      onClick={() => toggle(id)}
      className={cn(
        'flex items-center justify-between w-full py-4 px-1',
        'text-left font-medium text-white',
        'hover:text-white/80 transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        className
      )}
      aria-expanded={active}
    >
      {iconPosition === 'left' && (
        <motion.span
          animate={{ rotate: active ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="mr-3"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      )}
      
      <span className="flex-1">{children}</span>
      
      {iconPosition === 'right' && (
        <motion.span
          animate={{ rotate: active ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      )}
    </button>
  );
}

interface AccordionContentProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({ id, children, className }: AccordionContentProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used within Accordion');

  const active = context.isActive(id);

  return (
    <AnimatePresence initial={false}>
      {active && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className={cn('pb-4 px-1 text-gray-400', className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Accordion;
