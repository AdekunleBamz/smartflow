'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Globe } from 'lucide-react';

export interface Chain {
  id: number;
  name: string;
  shortName: string;
  icon?: string;
  color: string;
  nativeCurrency: string;
  rpcUrl?: string;
  explorerUrl?: string;
  testnet?: boolean;
}

const defaultChains: Chain[] = [
  { id: 1, name: 'Ethereum', shortName: 'ETH', color: '#627EEA', nativeCurrency: 'ETH' },
  { id: 137, name: 'Polygon', shortName: 'MATIC', color: '#8247E5', nativeCurrency: 'MATIC' },
  { id: 42161, name: 'Arbitrum', shortName: 'ARB', color: '#28A0F0', nativeCurrency: 'ETH' },
  { id: 10, name: 'Optimism', shortName: 'OP', color: '#FF0420', nativeCurrency: 'ETH' },
  { id: 56, name: 'BNB Chain', shortName: 'BNB', color: '#F3BA2F', nativeCurrency: 'BNB' },
  { id: 43114, name: 'Avalanche', shortName: 'AVAX', color: '#E84142', nativeCurrency: 'AVAX' },
  { id: 8453, name: 'Base', shortName: 'BASE', color: '#0052FF', nativeCurrency: 'ETH' },
];

interface ChainSelectorProps {
  value: number;
  onChange: (chainId: number) => void;
  chains?: Chain[];
  showTestnets?: boolean;
  variant?: 'dropdown' | 'pills' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ChainSelector({
  value,
  onChange,
  chains = defaultChains,
  showTestnets = false,
  variant = 'dropdown',
  size = 'md',
  className,
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filteredChains = showTestnets ? chains : chains.filter(c => !c.testnet);
  const selectedChain = filteredChains.find(c => c.id === value) || filteredChains[0];

  const sizeClasses = {
    sm: 'text-sm px-2 py-1.5',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2.5',
  };

  if (variant === 'pills') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {filteredChains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => onChange(chain.id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full font-medium transition-all',
              sizeClasses[size],
              value === chain.id
                ? 'text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
            )}
            style={{
              backgroundColor: value === chain.id ? chain.color : undefined,
              boxShadow: value === chain.id ? `0 4px 14px ${chain.color}40` : undefined,
            }}
          >
            <ChainIcon chain={chain} size={size === 'lg' ? 20 : 16} />
            {chain.shortName}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-3 gap-2', className)}>
        {filteredChains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => onChange(chain.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-xl transition-all',
              value === chain.id
                ? 'bg-white/10 border-2'
                : 'bg-white/[0.02] border-2 border-transparent hover:bg-white/[0.05]'
            )}
            style={{
              borderColor: value === chain.id ? chain.color : undefined,
            }}
          >
            <ChainIcon chain={chain} size={28} />
            <span className="text-sm text-gray-300">{chain.shortName}</span>
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-xl font-medium transition-colors',
          'bg-white/5 hover:bg-white/10 text-white',
          sizeClasses[size]
        )}
      >
        <ChainIcon chain={selectedChain} size={size === 'lg' ? 20 : 16} />
        <span>{selectedChain.shortName}</span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={cn(
                'absolute top-full left-0 mt-2 z-20',
                'min-w-[200px] py-2',
                'bg-gray-900 border border-white/10 rounded-xl shadow-xl'
              )}
            >
              {filteredChains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => {
                    onChange(chain.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5',
                    'hover:bg-white/5 transition-colors',
                    value === chain.id && 'bg-white/[0.03]'
                  )}
                >
                  <ChainIcon chain={chain} size={20} />
                  <span className="flex-1 text-left text-white">{chain.name}</span>
                  {value === chain.id && <Check className="w-4 h-4 text-blue-400" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Chain icon with color circle fallback
function ChainIcon({ chain, size = 16 }: { chain: Chain; size?: number }) {
  if (chain.icon) {
    return <img src={chain.icon} alt={chain.name} width={size} height={size} className="rounded-full" />;
  }
  
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: chain.color,
        fontSize: size * 0.4,
      }}
    >
      {chain.shortName[0]}
    </div>
  );
}

// Compact chain badge
export function ChainBadge({ chain, className }: { chain: Chain; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
        className
      )}
      style={{ backgroundColor: `${chain.color}20`, color: chain.color }}
    >
      <ChainIcon chain={chain} size={12} />
      {chain.shortName}
    </span>
  );
}

export { defaultChains };
export default ChainSelector;
