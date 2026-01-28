'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, Clock, TrendingUp, Loader2 } from 'lucide-react';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
  price?: number;
  priceChange24h?: number;
}

interface TokenSearchProps {
  onSelect: (token: Token) => void;
  tokens?: Token[];
  recentTokens?: Token[];
  favoriteTokens?: Token[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function TokenSearch({
  onSelect,
  tokens = [],
  recentTokens = [],
  favoriteTokens = [],
  isLoading = false,
  placeholder = 'Search by name or paste address',
  className,
}: TokenSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(query.toLowerCase()) ||
      token.name.toLowerCase().includes(query.toLowerCase()) ||
      token.address.toLowerCase() === query.toLowerCase()
  );

  const showDropdown = isFocused && (query.length > 0 || recentTokens.length > 0 || favoriteTokens.length > 0);

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
          'bg-white/5 border',
          isFocused ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-white/10'
        )}
      >
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
        {isLoading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'absolute left-0 right-0 top-full mt-2 z-50',
              'bg-gray-900 border border-white/10 rounded-xl shadow-xl',
              'max-h-[400px] overflow-y-auto'
            )}
          >
            {/* Recent Tokens */}
            {!query && recentTokens.length > 0 && (
              <div className="p-2 border-b border-white/5">
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500 uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  Recent
                </div>
                {recentTokens.slice(0, 4).map((token) => (
                  <TokenRow key={token.address} token={token} onClick={() => onSelect(token)} />
                ))}
              </div>
            )}

            {/* Favorite Tokens */}
            {!query && favoriteTokens.length > 0 && (
              <div className="p-2 border-b border-white/5">
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500 uppercase">
                  <Star className="w-3.5 h-3.5" />
                  Favorites
                </div>
                {favoriteTokens.map((token) => (
                  <TokenRow key={token.address} token={token} onClick={() => onSelect(token)} />
                ))}
              </div>
            )}

            {/* Search Results */}
            {query && (
              <div className="p-2">
                {filteredTokens.length > 0 ? (
                  filteredTokens.slice(0, 10).map((token) => (
                    <TokenRow key={token.address} token={token} onClick={() => onSelect(token)} />
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-400">
                    {isLoading ? 'Searching...' : 'No tokens found'}
                  </div>
                )}
              </div>
            )}

            {/* Trending Tokens (when no query) */}
            {!query && tokens.length > 0 && (
              <div className="p-2">
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500 uppercase">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Popular
                </div>
                {tokens.slice(0, 5).map((token) => (
                  <TokenRow key={token.address} token={token} onClick={() => onSelect(token)} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Individual token row
function TokenRow({ token, onClick }: { token: Token; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
    >
      {token.logoURI ? (
        <img src={token.logoURI} alt={token.symbol} className="w-8 h-8 rounded-full" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
          {token.symbol[0]}
        </div>
      )}
      <div className="flex-1 text-left">
        <div className="font-medium text-white">{token.symbol}</div>
        <div className="text-sm text-gray-400">{token.name}</div>
      </div>
      {token.price !== undefined && (
        <div className="text-right">
          <div className="text-sm text-white">${token.price.toFixed(4)}</div>
          {token.priceChange24h !== undefined && (
            <div className={cn('text-xs', token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400')}>
              {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
            </div>
          )}
        </div>
      )}
    </button>
  );
}

// Compact token input for swap interfaces
export function TokenInput({
  token,
  amount,
  onAmountChange,
  onTokenClick,
  label,
  balance,
  usdValue,
  disabled,
  className,
}: {
  token?: Token;
  amount: string;
  onAmountChange: (value: string) => void;
  onTokenClick: () => void;
  label: string;
  balance?: string;
  usdValue?: number;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('p-4 rounded-xl bg-white/[0.02] border border-white/5', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        {balance && (
          <button
            onClick={() => onAmountChange(balance)}
            className="text-sm text-gray-400 hover:text-white"
          >
            Balance: {balance}
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.0"
          disabled={disabled}
          className="flex-1 bg-transparent text-2xl font-medium text-white placeholder-gray-600 focus:outline-none"
        />
        <button
          onClick={onTokenClick}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          {token ? (
            <>
              {token.logoURI && <img src={token.logoURI} alt="" className="w-5 h-5 rounded-full" />}
              <span className="font-medium text-white">{token.symbol}</span>
            </>
          ) : (
            <span className="text-blue-400">Select token</span>
          )}
        </button>
      </div>
      {usdValue !== undefined && (
        <div className="mt-1 text-sm text-gray-500">${usdValue.toFixed(2)}</div>
      )}
    </div>
  );
}

export default TokenSearch;
