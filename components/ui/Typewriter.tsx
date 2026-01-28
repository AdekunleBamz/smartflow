'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface UseTypewriterOptions {
  text: string | string[];
  speed?: number;
  deleteSpeed?: number;
  delayBetweenTexts?: number;
  loop?: boolean;
  onComplete?: () => void;
}

export function useTypewriter(options: UseTypewriterOptions) {
  const {
    text,
    speed = 50,
    deleteSpeed = 30,
    delayBetweenTexts = 2000,
    loop = false,
    onComplete,
  } = options;

  const texts = Array.isArray(text) ? text : [text];
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || isComplete) return;

    const currentText = texts[textIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex(prev => (prev + 1) % texts.length);
      }
    } else {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, speed);
      } else {
        // Text complete
        if (texts.length > 1 || loop) {
          timeout = setTimeout(() => {
            if (textIndex === texts.length - 1 && !loop) {
              setIsComplete(true);
              onComplete?.();
            } else {
              setIsDeleting(true);
            }
          }, delayBetweenTexts);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, textIndex, isDeleting, texts, speed, deleteSpeed, delayBetweenTexts, loop, isPaused, isComplete, onComplete]);

  const reset = useCallback(() => {
    setDisplayText('');
    setTextIndex(0);
    setIsDeleting(false);
    setIsComplete(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  return {
    displayText,
    isComplete,
    isDeleting,
    isPaused,
    currentIndex: textIndex,
    reset,
    pause,
    resume,
  };
}

// Typewriter Component
interface TypewriterProps {
  text: string | string[];
  speed?: number;
  deleteSpeed?: number;
  delayBetweenTexts?: number;
  loop?: boolean;
  cursor?: boolean;
  cursorChar?: string;
  className?: string;
  cursorClassName?: string;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  speed = 50,
  deleteSpeed = 30,
  delayBetweenTexts = 2000,
  loop = false,
  cursor = true,
  cursorChar = '|',
  className,
  cursorClassName,
  onComplete,
}: TypewriterProps) {
  const { displayText, isComplete, isPaused } = useTypewriter({
    text,
    speed,
    deleteSpeed,
    delayBetweenTexts,
    loop,
    onComplete,
  });

  return (
    <span className={cn('inline', className)}>
      {displayText}
      {cursor && !isComplete && (
        <span
          className={cn(
            'animate-pulse ml-0.5',
            cursorClassName
          )}
          aria-hidden="true"
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
}

export default Typewriter;
