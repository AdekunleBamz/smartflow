'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export function Shimmer({
  className,
  width,
  height,
  borderRadius,
}: ShimmerProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  if (borderRadius) style.borderRadius = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white/5 rounded-md',
        className
      )}
      style={style}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        }}
      />
    </div>
  );
}

// Pre-built shimmer patterns
export function TextShimmer({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          height={16}
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

export function CardShimmer({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 rounded-xl bg-white/5 border border-white/10 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Shimmer width={40} height={40} borderRadius="50%" />
        <div className="flex-1 space-y-2">
          <Shimmer height={14} width="60%" />
          <Shimmer height={12} width="40%" />
        </div>
      </div>
      <TextShimmer lines={2} />
      <div className="flex gap-2">
        <Shimmer height={32} width={80} borderRadius={8} />
        <Shimmer height={32} width={80} borderRadius={8} />
      </div>
    </div>
  );
}

export function TableRowShimmer({ columns = 5, className }: { columns?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 p-4 border-b border-white/5', className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Shimmer
          key={i}
          height={16}
          className="flex-1"
          width={i === 0 ? undefined : `${Math.random() * 40 + 40}%`}
        />
      ))}
    </div>
  );
}

export function ChartShimmer({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 space-y-4', className)}>
      <div className="flex justify-between">
        <Shimmer height={20} width={120} />
        <Shimmer height={20} width={80} />
      </div>
      <div className="h-48 flex items-end gap-1">
        {Array.from({ length: 24 }).map((_, i) => (
          <Shimmer
            key={i}
            className="flex-1"
            height={`${Math.random() * 60 + 20}%`}
          />
        ))}
      </div>
    </div>
  );
}

export function AvatarShimmer({ size = 40 }: { size?: number }) {
  return <Shimmer width={size} height={size} borderRadius="50%" />;
}

export default Shimmer;
