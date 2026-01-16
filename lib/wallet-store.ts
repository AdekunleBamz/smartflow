// Wallet store for Web3 state
import { create } from 'zustand';

interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  
  setAddress: (address: string | null) => void;
  setChainId: (chainId: number | null) => void;
  setConnecting: (connecting: boolean) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  chainId: null,
  isConnecting: false,
  isConnected: false,
  error: null,
  
  setAddress: (address) => set({ address }),
  setChainId: (chainId) => set({ chainId }),
  setConnecting: (isConnecting) => set({ isConnecting }),
  setConnected: (isConnected) => set({ isConnected }),
  setError: (error) => set({ error }),
  disconnect: () => set({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  }),
}));
