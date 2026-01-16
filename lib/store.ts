import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface User {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  address?: string;
  pfp?: string;
}

export interface AppState {
  // User state
  user: User | null;
  isSignedIn: boolean;
  setUser: (user: User | null) => void;
  setSignedIn: (signed: boolean) => void;
  
  // Navigation
  currentView: 'home' | 'dashboard' | 'leaderboard' | 'alerts';
  setCurrentView: (view: AppState['currentView']) => void;
  
  // UI State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // User state
        user: null,
        isSignedIn: false,
        setUser: (user) => set({ user }),
        setSignedIn: (signed) => set({ isSignedIn: signed }),
        
        // Navigation
        currentView: 'home',
        setCurrentView: (view) => set({ currentView: view }),
        
        // UI State
        isSidebarOpen: false,
        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        setSidebarOpen: (open) => set({ isSidebarOpen: open }),
        
        // Theme
        theme: 'dark',
        toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      }),
      {
        name: 'smartflow-storage',
        partialize: (state) => ({ theme: state.theme }),
      }
    ),
    { name: 'SmartFlow Store' }
  )
);
