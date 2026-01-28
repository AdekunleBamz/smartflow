'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Search, Command, ArrowRight, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  items: CommandItem[];
  placeholder?: string;
  className?: string;
}

export function CommandPalette({
  items,
  placeholder = 'Search commands...',
  className,
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open with Cmd+K or Ctrl+K
  useKeyboardShortcut('meta+k', () => setIsOpen(true));

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].action();
            setIsOpen(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items based on query
  const filteredItems = items.filter(item => {
    const searchText = query.toLowerCase();
    return (
      item.label.toLowerCase().includes(searchText) ||
      item.description?.toLowerCase().includes(searchText) ||
      item.keywords?.some(k => k.toLowerCase().includes(searchText))
    );
  });

  // Group by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || 'Actions';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-white/5 hover:bg-white/10 border border-white/10',
          'text-gray-400 text-sm transition-colors',
          className
        )}
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-white/10 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                'fixed top-[20%] left-1/2 -translate-x-1/2 z-50',
                'w-full max-w-lg',
                'bg-gray-900 border border-white/10 rounded-xl',
                'shadow-2xl overflow-hidden'
              )}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
                />
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase">
                      {category}
                    </div>
                    {items.map((item) => {
                      const globalIndex = filteredItems.indexOf(item);
                      const isSelected = globalIndex === selectedIndex;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            item.action();
                            setIsOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                            'text-left transition-colors',
                            isSelected ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/5'
                          )}
                        >
                          {item.icon || <Hash className="w-4 h-4 opacity-50" />}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{item.label}</div>
                            {item.description && (
                              <div className="text-sm opacity-60 truncate">{item.description}</div>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-50" />
                        </button>
                      );
                    })}
                  </div>
                ))}
                
                {filteredItems.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default CommandPalette;
