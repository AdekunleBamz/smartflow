// Avatar component with fallback
'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  className,
  fallback,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initials = fallback
    ? fallback.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'rounded-full flex items-center justify-center ring-2 ring-white/10',
          'bg-gradient-to-br from-accent to-purple-600',
          'font-semibold text-white',
          sizeClasses[size],
          className
        )}
      >
        {initials || <User className="w-1/2 h-1/2" />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn(
        'rounded-full object-cover',
        sizeClasses[size],
        className
      )}
    />
  );
}
