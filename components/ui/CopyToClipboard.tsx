'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClipboard } from '@/hooks/useClipboard';

interface CopyToClipboardProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  iconSize?: number;
  showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  onCopy?: () => void;
}

export function CopyToClipboard({
  text,
  children,
  className,
  iconSize = 16,
  showTooltip = true,
  tooltipPosition = 'top',
  onCopy,
}: CopyToClipboardProps) {
  const { copied, copy } = useClipboard({ timeout: 2000 });

  const handleCopy = async () => {
    await copy(text);
    onCopy?.();
  };

  const tooltipPositionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'relative inline-flex items-center justify-center',
        'p-1.5 rounded-md',
        'text-gray-400 hover:text-white',
        'bg-transparent hover:bg-white/10',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        'group',
        className
      )}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {children || (
        <>
          {copied ? (
            <Check
              size={iconSize}
              className="text-green-500 animate-in zoom-in duration-200"
            />
          ) : (
            <Copy
              size={iconSize}
              className="transition-transform group-hover:scale-110"
            />
          )}
        </>
      )}

      {showTooltip && (
        <span
          className={cn(
            'absolute px-2 py-1 text-xs font-medium',
            'bg-gray-900 text-white rounded shadow-lg',
            'opacity-0 group-hover:opacity-100',
            'transition-opacity duration-200',
            'pointer-events-none whitespace-nowrap',
            'z-50',
            tooltipPositionClasses[tooltipPosition]
          )}
        >
          {copied ? 'Copied!' : 'Copy'}
        </span>
      )}
    </button>
  );
}

// Inline version for text with copy button
interface CopyableTextProps {
  text: string;
  displayText?: string;
  className?: string;
  textClassName?: string;
  truncate?: boolean;
  maxLength?: number;
}

export function CopyableText({
  text,
  displayText,
  className,
  textClassName,
  truncate = false,
  maxLength = 20,
}: CopyableTextProps) {
  const display = displayText || text;
  const truncatedDisplay = truncate && display.length > maxLength
    ? `${display.slice(0, maxLength / 2)}...${display.slice(-maxLength / 2)}`
    : display;

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'font-mono text-sm',
          truncate && 'truncate',
          textClassName
        )}
        title={text}
      >
        {truncatedDisplay}
      </span>
      <CopyToClipboard text={text} iconSize={14} />
    </span>
  );
}

export default CopyToClipboard;
