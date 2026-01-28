'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';

interface AddressDisplayProps {
  address: string;
  label?: string;
  truncate?: boolean;
  truncateLength?: number;
  showCopy?: boolean;
  showExplorer?: boolean;
  explorerUrl?: string;
  variant?: 'default' | 'compact' | 'full';
  className?: string;
  labelClassName?: string;
}

const BASE_EXPLORER = 'https://basescan.org';

export function truncateAddress(address: string, length: number = 4): string {
  if (!address || address.length <= length * 2 + 2) return address;
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}

export function AddressDisplay({
  address,
  label,
  truncate = true,
  truncateLength = 4,
  showCopy = true,
  showExplorer = true,
  explorerUrl,
  variant = 'default',
  className,
  labelClassName,
}: AddressDisplayProps) {
  const { copied, copy } = useClipboard({ timeout: 2000 });

  const displayAddress = truncate 
    ? truncateAddress(address, truncateLength) 
    : address;

  const explorer = explorerUrl || `${BASE_EXPLORER}/address/${address}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await copy(address);
  };

  if (variant === 'compact') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-mono text-sm',
          className
        )}
        title={address}
      >
        {displayAddress}
        {showCopy && (
          <button
            onClick={handleCopy}
            className="p-0.5 hover:text-white transition-colors"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        )}
      </span>
    );
  }

  if (variant === 'full') {
    return (
      <div className={cn('space-y-1', className)}>
        {label && (
          <p className={cn('text-xs text-gray-400', labelClassName)}>
            {label}
          </p>
        )}
        <div className="flex items-center gap-2">
          <code
            className="font-mono text-sm text-white bg-white/5 px-3 py-1.5 rounded-md break-all"
            title={address}
          >
            {address}
          </code>
          <div className="flex items-center gap-1">
            {showCopy && (
              <button
                onClick={handleCopy}
                className={cn(
                  'p-1.5 rounded-md',
                  'hover:bg-white/10 transition-colors',
                  'text-gray-400 hover:text-white'
                )}
                title="Copy address"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
            {showExplorer && (
              <a
                href={explorer}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'p-1.5 rounded-md',
                  'hover:bg-white/10 transition-colors',
                  'text-gray-400 hover:text-white'
                )}
                title="View on explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {label && (
        <span className={cn('text-gray-400', labelClassName)}>{label}</span>
      )}
      <code
        className="font-mono text-sm text-white/80 hover:text-white transition-colors"
        title={address}
      >
        {displayAddress}
      </code>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          title="Copy address"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      )}
      {showExplorer && (
        <a
          href={explorer}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          title="View on explorer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}

export default AddressDisplay;
