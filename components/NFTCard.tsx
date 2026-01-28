'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ExternalLink, 
  MoreHorizontal,
  Eye,
  Share,
  ShoppingCart
} from 'lucide-react';

interface NFTCardProps {
  name: string;
  collection: string;
  imageUrl: string;
  price?: number;
  currency?: string;
  lastSale?: number;
  likes?: number;
  isLiked?: boolean;
  onLike?: () => void;
  onClick?: () => void;
  onBuy?: () => void;
  tokenId?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  className?: string;
}

const rarityConfig = {
  common: { label: 'Common', color: 'text-gray-400', bgColor: 'bg-gray-500/10' },
  uncommon: { label: 'Uncommon', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  rare: { label: 'Rare', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  epic: { label: 'Epic', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  legendary: { label: 'Legendary', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
};

export function NFTCard({
  name,
  collection,
  imageUrl,
  price,
  currency = 'ETH',
  lastSale,
  likes = 0,
  isLiked = false,
  onLike,
  onClick,
  onBuy,
  tokenId,
  rarity,
  className,
}: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-gray-900/50 border border-white/10',
        'transition-all duration-300',
        'hover:border-white/20 hover:shadow-xl hover:shadow-black/20',
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        )}
        
        <img
          src={imageUrl}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-transform duration-500',
            'group-hover:scale-110',
            !imageLoaded && 'opacity-0'
          )}
        />

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        >
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-sm text-white hover:bg-white/20 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBuy?.();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Buy
            </button>
          </div>
        </motion.div>

        {/* Rarity badge */}
        {rarity && (
          <div className={cn(
            'absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium',
            rarityConfig[rarity].bgColor,
            rarityConfig[rarity].color
          )}>
            {rarityConfig[rarity].label}
          </div>
        )}

        {/* Like button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike?.();
          }}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-lg transition-all',
            'bg-black/30 backdrop-blur-md',
            isLiked ? 'text-red-500' : 'text-white hover:text-red-400'
          )}
        >
          <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <div className="text-sm text-gray-400">{collection}</div>
          <h3 className="font-semibold text-white truncate">{name}</h3>
          {tokenId && (
            <div className="text-xs text-gray-500">#{tokenId}</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {price !== undefined ? (
            <div>
              <div className="text-xs text-gray-400">Price</div>
              <div className="font-semibold text-white">
                {price} {currency}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Not for sale</div>
          )}

          <div className="flex items-center gap-1 text-gray-400">
            <Heart className="w-3.5 h-3.5" />
            <span className="text-sm">{likes}</span>
          </div>
        </div>

        {lastSale !== undefined && (
          <div className="text-xs text-gray-500">
            Last sale: {lastSale} {currency}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Grid layout for NFT cards
export function NFTGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
      className
    )}>
      {children}
    </div>
  );
}

// Compact NFT item for lists
export function NFTListItem({
  name,
  collection,
  imageUrl,
  price,
  currency = 'ETH',
  onClick,
  className,
}: Omit<NFTCardProps, 'likes' | 'isLiked' | 'onLike' | 'rarity'>) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 p-3 rounded-xl',
        'bg-white/[0.02] border border-white/5',
        'hover:bg-white/[0.04] cursor-pointer transition-colors',
        className
      )}
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-400">{collection}</div>
        <h4 className="font-medium text-white truncate">{name}</h4>
      </div>
      {price !== undefined && (
        <div className="text-right">
          <div className="font-semibold text-white">{price} {currency}</div>
        </div>
      )}
    </div>
  );
}

export default NFTCard;
