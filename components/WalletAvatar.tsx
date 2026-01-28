'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface WalletAvatarProps {
  address: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
  showBorder?: boolean;
  className?: string;
}

// Generate deterministic colors from address
function generateColors(address: string): string[] {
  const hash = address.toLowerCase().slice(2, 10);
  const colors: string[] = [];
  
  for (let i = 0; i < 4; i++) {
    const segment = hash.slice(i * 2, i * 2 + 2);
    const hue = parseInt(segment, 16) * 1.4; // 0-360
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  
  return colors;
}

// Generate unique pattern based on address
function generatePattern(address: string): number[] {
  const patternHash = address.slice(-8);
  return patternHash.split('').map(c => parseInt(c, 16) / 15);
}

const sizeMap = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

const borderRadiusMap = {
  circle: '50%',
  rounded: '25%',
  square: '10%',
};

export function WalletAvatar({
  address,
  size = 'md',
  variant = 'circle',
  showBorder = false,
  className,
}: WalletAvatarProps) {
  const pixelSize = sizeMap[size];
  const colors = useMemo(() => generateColors(address), [address]);
  const pattern = useMemo(() => generatePattern(address), [address]);
  
  // Create a unique gradient based on address
  const gradientId = `wallet-gradient-${address.slice(2, 10)}`;
  
  return (
    <div
      className={cn(
        'relative overflow-hidden flex-shrink-0',
        showBorder && 'ring-2 ring-white/20',
        className
      )}
      style={{
        width: pixelSize,
        height: pixelSize,
        borderRadius: borderRadiusMap[variant],
      }}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 100 100"
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="33%" stopColor={colors[1]} />
            <stop offset="66%" stopColor={colors[2]} />
            <stop offset="100%" stopColor={colors[3]} />
          </linearGradient>
        </defs>
        
        {/* Background */}
        <rect width="100" height="100" fill={`url(#${gradientId})`} />
        
        {/* Pattern overlay */}
        {pattern.map((value, i) => {
          const x = (i % 3) * 33;
          const y = Math.floor(i / 3) * 33;
          const size = 20 + value * 30;
          const opacity = 0.3 + value * 0.4;
          
          return (
            <circle
              key={i}
              cx={x + 16 + value * 20}
              cy={y + 16 + value * 20}
              r={size / 2}
              fill="rgba(255,255,255,0.1)"
              opacity={opacity}
            />
          );
        })}
      </svg>
    </div>
  );
}

// Jazzicon-style blocky avatar
export function BlockyAvatar({
  address,
  size = 'md',
  className,
}: Omit<WalletAvatarProps, 'variant' | 'showBorder'>) {
  const pixelSize = sizeMap[size];
  const colors = useMemo(() => generateColors(address), [address]);
  
  // Generate 4x4 grid pattern
  const grid = useMemo(() => {
    const hash = address.toLowerCase().slice(2);
    const cells: boolean[] = [];
    for (let i = 0; i < 16; i++) {
      cells.push(parseInt(hash[i], 16) > 7);
    }
    return cells;
  }, [address]);
  
  return (
    <div
      className={cn('relative overflow-hidden rounded-lg flex-shrink-0', className)}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg width={pixelSize} height={pixelSize} viewBox="0 0 4 4">
        <rect width="4" height="4" fill={colors[0]} />
        {grid.map((filled, i) => {
          if (!filled) return null;
          const x = i % 4;
          const y = Math.floor(i / 4);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={colors[(i % 3) + 1]}
            />
          );
        })}
      </svg>
    </div>
  );
}

// Avatar with ENS/label fallback
export function WalletAvatarWithLabel({
  address,
  label,
  size = 'md',
  className,
}: WalletAvatarProps & { label?: string }) {
  const pixelSize = sizeMap[size];
  
  if (label) {
    const initials = label.slice(0, 2).toUpperCase();
    const colors = generateColors(address);
    
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-bold text-white flex-shrink-0',
          className
        )}
        style={{
          width: pixelSize,
          height: pixelSize,
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[2]})`,
          fontSize: pixelSize * 0.35,
        }}
      >
        {initials}
      </div>
    );
  }
  
  return <WalletAvatar address={address} size={size} className={className} />;
}

export default WalletAvatar;
