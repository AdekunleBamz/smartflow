'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Coins } from 'lucide-react';

interface TokenIconProps {
  symbol: string;
  address?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSymbol?: boolean;
  chainId?: number;
}

const SIZE_MAP = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

const TOKEN_ICON_SOURCES = [
  (address: string, chainId: number) => 
    `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/${address}/logo.png`,
  (address: string) => 
    `https://tokens.1inch.io/${address.toLowerCase()}.png`,
  (address: string) => 
    `https://assets.coingecko.com/coins/images/ethereum/${address.toLowerCase()}/small.png`,
];

// Fallback colors based on symbol
function getSymbolColor(symbol: string): string {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
    'bg-pink-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-red-500',
  ];
  const index = symbol.charCodeAt(0) % colors.length;
  return colors[index];
}

export function TokenIcon({
  symbol,
  address,
  size = 'md',
  className,
  showSymbol = false,
  chainId = 8453, // Base chain
}: TokenIconProps) {
  const [imageError, setImageError] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const pixelSize = SIZE_MAP[size];

  const handleError = () => {
    if (address && sourceIndex < TOKEN_ICON_SOURCES.length - 1) {
      setSourceIndex(prev => prev + 1);
    } else {
      setImageError(true);
    }
  };

  const imageUrl = address && !imageError
    ? TOKEN_ICON_SOURCES[sourceIndex](address, chainId)
    : null;

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      {imageUrl && !imageError ? (
        <div
          className={cn(
            'relative rounded-full overflow-hidden',
            'bg-white/10 flex-shrink-0'
          )}
          style={{ width: pixelSize, height: pixelSize }}
        >
          <Image
            src={imageUrl}
            alt={`${symbol} token`}
            width={pixelSize}
            height={pixelSize}
            className="object-cover"
            onError={handleError}
            unoptimized
          />
        </div>
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center',
            'flex-shrink-0',
            getSymbolColor(symbol)
          )}
          style={{ width: pixelSize, height: pixelSize }}
        >
          {symbol.length <= 3 ? (
            <span
              className="font-bold text-white"
              style={{ fontSize: pixelSize * 0.4 }}
            >
              {symbol.slice(0, 2)}
            </span>
          ) : (
            <Coins
              className="text-white"
              style={{ width: pixelSize * 0.6, height: pixelSize * 0.6 }}
            />
          )}
        </div>
      )}
      
      {showSymbol && (
        <span className="font-medium text-white">{symbol}</span>
      )}
    </div>
  );
}

// Stacked token icons (for pairs)
interface TokenPairIconProps {
  token0: { symbol: string; address?: string };
  token1: { symbol: string; address?: string };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TokenPairIcon({
  token0,
  token1,
  size = 'md',
  className,
}: TokenPairIconProps) {
  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      <TokenIcon {...token0} size={size} className="z-10" />
      <TokenIcon {...token1} size={size} className="z-0" />
    </div>
  );
}

export default TokenIcon;
