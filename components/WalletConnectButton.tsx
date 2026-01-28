'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  LogOut, 
  Copy, 
  ExternalLink, 
  ChevronDown,
  Check,
  Loader2
} from 'lucide-react';

interface WalletConnectButtonProps {
  address?: string;
  isConnected?: boolean;
  isConnecting?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  balance?: string;
  ensName?: string;
  explorerUrl?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
};

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletConnectButton({
  address,
  isConnected = false,
  isConnecting = false,
  onConnect,
  onDisconnect,
  balance,
  ensName,
  explorerUrl,
  variant = 'default',
  size = 'md',
  className,
}: WalletConnectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const variantClasses = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border border-blue-500 text-blue-400 hover:bg-blue-500/10',
    ghost: 'text-blue-400 hover:bg-blue-500/10',
  };

  // Not connected state
  if (!isConnected) {
    return (
      <button
        onClick={onConnect}
        disabled={isConnecting}
        className={cn(
          'inline-flex items-center font-medium rounded-xl transition-all',
          sizeClasses[size],
          variantClasses[variant],
          isConnecting && 'opacity-70 cursor-not-allowed',
          className
        )}
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </>
        )}
      </button>
    );
  }

  // Connected state
  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center font-medium rounded-xl transition-all',
          'bg-white/5 hover:bg-white/10 border border-white/10',
          sizeClasses[size]
        )}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
        <span className="text-white">
          {ensName || formatAddress(address!)}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={cn(
                'absolute right-0 top-full mt-2 z-20',
                'w-64 p-4 space-y-4',
                'bg-gray-900 border border-white/10 rounded-xl shadow-xl'
              )}
            >
              {/* Balance */}
              {balance && (
                <div className="text-center pb-3 border-b border-white/5">
                  <div className="text-sm text-gray-400 mb-1">Balance</div>
                  <div className="text-xl font-bold text-white">{balance}</div>
                </div>
              )}

              {/* Address */}
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-sm text-gray-300 font-mono">
                  {formatAddress(address!)}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Actions */}
              <div className="space-y-1">
                {explorerUrl && (
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Explorer
                  </a>
                )}
                <button
                  onClick={() => {
                    onDisconnect?.();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Wallet connector modal content
export function WalletConnectorList({
  onSelect,
  className,
}: {
  onSelect: (wallet: string) => void;
  className?: string;
}) {
  const wallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊', popular: true },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', popular: true },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '💰', popular: true },
    { id: 'rainbow', name: 'Rainbow', icon: '🌈', popular: false },
    { id: 'trust', name: 'Trust Wallet', icon: '🛡️', popular: false },
    { id: 'phantom', name: 'Phantom', icon: '👻', popular: false },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-lg font-semibold text-white">Connect a Wallet</h3>
      <p className="text-sm text-gray-400">
        Choose how you want to connect. If you don't have a wallet, you can select a provider and create one.
      </p>
      
      <div className="space-y-2 pt-2">
        {wallets.map((wallet) => (
          <button
            key={wallet.id}
            onClick={() => onSelect(wallet.id)}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-xl',
              'bg-white/[0.02] border border-white/5',
              'hover:bg-white/[0.05] hover:border-white/10 transition-colors'
            )}
          >
            <span className="text-2xl">{wallet.icon}</span>
            <span className="flex-1 text-left font-medium text-white">{wallet.name}</span>
            {wallet.popular && (
              <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded-full">
                Popular
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default WalletConnectButton;
