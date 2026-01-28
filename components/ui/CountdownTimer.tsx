'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isComplete: boolean;
}

interface UseCountdownOptions {
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useCountdown(targetDate: Date | number, options: UseCountdownOptions = {}) {
  const { onComplete, autoStart = true } = options;
  const [isRunning, setIsRunning] = useState(autoStart);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const target = typeof targetDate === 'number' ? targetDate : targetDate.getTime();
    const now = Date.now();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isComplete: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
      isComplete: false,
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.isComplete) {
        setIsRunning(false);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, calculateTimeLeft, onComplete]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setTimeLeft(calculateTimeLeft());
    setIsRunning(autoStart);
  }, [calculateTimeLeft, autoStart]);

  return { ...timeLeft, isRunning, start, pause, reset };
}

// Countdown Timer Component
interface CountdownTimerProps {
  targetDate: Date | number;
  onComplete?: () => void;
  showDays?: boolean;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CountdownTimer({
  targetDate,
  onComplete,
  showDays = true,
  showLabels = true,
  size = 'md',
  className,
}: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isComplete } = useCountdown(targetDate, { onComplete });

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const labelSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const padNumber = (num: number) => num.toString().padStart(2, '0');

  if (isComplete) {
    return (
      <div className={cn('text-center', className)}>
        <span className={cn('font-bold text-green-500', sizeClasses[size])}>
          Complete!
        </span>
      </div>
    );
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className={cn('font-mono font-bold tabular-nums', sizeClasses[size])}>
        {padNumber(value)}
      </span>
      {showLabels && (
        <span className={cn('text-gray-400 uppercase', labelSizeClasses[size])}>
          {label}
        </span>
      )}
    </div>
  );

  const Separator = () => (
    <span className={cn('font-bold text-gray-500 mx-1', sizeClasses[size])}>:</span>
  );

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {showDays && days > 0 && (
        <>
          <TimeUnit value={days} label="days" />
          <Separator />
        </>
      )}
      <TimeUnit value={hours} label="hrs" />
      <Separator />
      <TimeUnit value={minutes} label="min" />
      <Separator />
      <TimeUnit value={seconds} label="sec" />
    </div>
  );
}

export default CountdownTimer;
