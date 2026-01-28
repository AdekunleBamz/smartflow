'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownUp, 
  Settings, 
  Info, 
  ChevronDown,
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface Token {
  symbol: string;
  name: string;
  balance?: string;
  logoURI?: string;
}

interface SwapWidgetProps {
  fromToken?: Token;
  toToken?: Token;
  fromAmount: string;
  toAmount: string;
  onFromAmountChange: (value: string) => void;
  onSwapTokens: () => void;
  onFromTokenClick: () => void;
  onToTokenClick: () => void;
  onSwap: () => void;
  exchangeRate?: string;
  priceImpact?: number;
  slippage?: number;
  onSlippageChange?: (value: number) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export function SwapWidget({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  onFromAmountChange,
  onSwapTokens,
  onFromTokenClick,
  onToTokenClick,
  onSwap,
  exchangeRate,
  priceImpact,
  slippage = 0.5,
  onSlippageChange,
  isLoading = false,
  error,
  className,
}: SwapWidgetProps) {
  const [showSettings, setShowSettings] = useState(false);

  const canSwap = fromToken && toToken && parseFloat(fromAmount) > 0 && !error;

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Swap</h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              showSettings ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-white/5 rounded-xl space-y-3">
                <div className="text-sm text-gray-400">Slippage Tolerance</div>
                <div className="flex gap-2">
                  {[0.1, 0.5, 1.0].map((value) => (
                    <button
                      key={value}
                      onClick={() => onSlippageChange?.(value)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        slippage === value
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      )}
                    >
                      {value}%
                    </button>
                  ))}
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={slippage}
                      onChange={(e) => onSlippageChange?.(parseFloat(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white text-right pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* From Token */}
        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You pay</span>
            {fromToken?.balance && (
              <button
                onClick={() => onFromAmountChange(fromToken.balance!)}
                className="text-sm text-gray-400 hover:text-white"
              >
                Balance: {fromToken.balance}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              value={fromAmount}
              onChange={(e) => onFromAmountChange(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-medium text-white placeholder-gray-600 focus:outline-none"
            />
            <TokenButton token={fromToken} onClick={onFromTokenClick} />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSwapTokens}
            className="p-2 bg-gray-800 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
          >
            <ArrowDownUp className="w-5 h-5" />
          </motion.button>
        </div>

        {/* To Token */}
        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You receive</span>
            {toToken?.balance && (
              <span className="text-sm text-gray-500">Balance: {toToken.balance}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-medium text-white placeholder-gray-600 focus:outline-none"
            />
            <TokenButton token={toToken} onClick={onToTokenClick} />
          </div>
        </div>

        {/* Exchange Rate & Price Impact */}
        {exchangeRate && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-400">
              <Info className="w-4 h-4" />
              <span>1 {fromToken?.symbol} = {exchangeRate} {toToken?.symbol}</span>
            </div>
            {priceImpact !== undefined && (
              <span className={cn(
                'px-2 py-0.5 rounded',
                priceImpact > 5 ? 'bg-red-500/10 text-red-400' :
                priceImpact > 1 ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-green-500/10 text-green-400'
              )}>
                {priceImpact.toFixed(2)}% impact
              </span>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={onSwap}
          disabled={!canSwap || isLoading}
          className={cn(
            'w-full py-4 rounded-xl font-semibold text-lg transition-all',
            canSwap && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
              : 'bg-white/5 text-gray-500 cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Swapping...
            </span>
          ) : !fromToken || !toToken ? (
            'Select tokens'
          ) : !fromAmount || parseFloat(fromAmount) === 0 ? (
            'Enter amount'
          ) : error ? (
            'Cannot swap'
          ) : (
            'Swap'
          )}
        </button>
      </div>
    </div>
  );
}

function TokenButton({ token, onClick }: { token?: Token; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
    >
      {token ? (
        <>
          {token.logoURI ? (
            <img src={token.logoURI} alt="" className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
          )}
          <span className="font-medium text-white">{token.symbol}</span>
        </>
      ) : (
        <span className="text-blue-400 font-medium">Select</span>
      )}
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </button>
  );
}

export default SwapWidget;
