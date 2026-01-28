'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  enabled?: boolean;
  initialFocus?: boolean;
  returnFocus?: boolean;
  escapeDeactivates?: boolean;
  onEscape?: () => void;
}

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  options: UseFocusTrapOptions = {}
) {
  const {
    enabled = true,
    initialFocus = true,
    returnFocus = true,
    escapeDeactivates = true,
    onEscape,
  } = options;

  const containerRef = useRef<T>(null);
  const previousActiveElementRef = useRef<Element | null>(null);

  // Get all focusable elements within container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter(el => {
      // Filter out hidden elements
      return el.offsetParent !== null && !el.hasAttribute('hidden');
    });
  }, []);

  // Focus first focusable element
  const focusFirst = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }, [getFocusableElements]);

  // Focus last focusable element
  const focusLast = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [getFocusableElements]);

  // Handle tab key navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    if (event.key === 'Escape' && escapeDeactivates) {
      event.preventDefault();
      onEscape?.();
      return;
    }

    if (event.key !== 'Tab') return;

    const elements = getFocusableElements();
    if (elements.length === 0) return;

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];
    const activeElement = document.activeElement;

    // Shift+Tab on first element: go to last
    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    // Tab on last element: go to first
    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
      return;
    }

    // If focus is outside container, bring it back
    if (!containerRef.current?.contains(activeElement)) {
      event.preventDefault();
      if (event.shiftKey) {
        lastElement.focus();
      } else {
        firstElement.focus();
      }
    }
  }, [enabled, escapeDeactivates, getFocusableElements, onEscape]);

  // Handle focus leaving the container
  const handleFocusIn = useCallback((event: FocusEvent) => {
    if (!enabled || !containerRef.current) return;
    
    const target = event.target as HTMLElement;
    if (!containerRef.current.contains(target)) {
      // Focus escaped, bring it back
      focusFirst();
    }
  }, [enabled, focusFirst]);

  useEffect(() => {
    if (!enabled) return;

    // Store current active element for later restoration
    previousActiveElementRef.current = document.activeElement;

    // Focus first element on mount
    if (initialFocus) {
      // Small delay to ensure container is rendered
      requestAnimationFrame(() => {
        focusFirst();
      });
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);

      // Restore focus on cleanup
      if (returnFocus && previousActiveElementRef.current) {
        (previousActiveElementRef.current as HTMLElement).focus?.();
      }
    };
  }, [enabled, initialFocus, returnFocus, focusFirst, handleKeyDown, handleFocusIn]);

  return {
    containerRef,
    focusFirst,
    focusLast,
  };
}

export default useFocusTrap;
