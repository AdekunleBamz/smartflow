import { create } from 'zustand';

export interface User {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  address?: string;
  pfp?: string;
}

export interface AppState {
  user: User | null;
  isSignedIn: boolean;
  setUser: (user: User | null) => void;
  setSignedIn: (signed: boolean) => void;
  currentView: 'home' | 'dashboard' | 'leaderboard' | 'alerts';
  setCurrentView: (view: AppState['currentView']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isSignedIn: false,
  setUser: (user) => set({ user }),
  setSignedIn: (signed) => set({ isSignedIn: signed }),
  currentView: 'home',
  setCurrentView: (view) => set({ currentView: view }),
}));
