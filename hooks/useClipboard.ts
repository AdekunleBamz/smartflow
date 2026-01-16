// useClipboard hook
'use client';

import { useState, useCallback } from 'react';

interface UseClipboardResult {
  copied: boolean;
  copy: (text: string) => Promise<void>;
  error: Error | null;
}

export function useClipboard(timeout: number = 2000): UseClipboardResult {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        if (!navigator?.clipboard) {
          throw new Error('Clipboard not supported');
        }

        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);

        setTimeout(() => {
          setCopied(false);
        }, timeout);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to copy'));
        setCopied(false);
      }
    },
    [timeout]
  );

  return { copied, copy, error };
}
