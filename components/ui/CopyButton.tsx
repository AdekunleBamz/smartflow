// Copy button component
'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

interface CopyButtonProps {
  value: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function CopyButton({ value, className, size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
      <Button
        variant="ghost"
        size={size}
        onClick={handleCopy}
        className={cn(
          'p-1.5',
          copied && 'text-profit',
          className
        )}
      >
        {copied ? (
          <Check className={cn('h-4 w-4', size === 'sm' && 'h-3.5 w-3.5')} />
        ) : (
          <Copy className={cn('h-4 w-4', size === 'sm' && 'h-3.5 w-3.5')} />
        )}
      </Button>
    </Tooltip>
  );
}

// Inline copy text
interface CopyTextProps {
  value: string;
  display?: string;
  className?: string;
}

export function CopyText({ value, display, className }: CopyTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-sm hover:text-primary transition-colors group',
        copied && 'text-profit',
        className
      )}
    >
      <span>{display || value}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}
