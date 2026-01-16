// Leaderboard store for filters and sorting
import { create } from 'zustand';

type SortField = 'totalGains' | 'winRate' | 'trades30d' | 'realizedProfit';
type SortOrder = 'asc' | 'desc';
type TimeFilter = '24h' | '7d' | '30d' | 'all';

interface LeaderboardState {
  // Filters
  timeFilter: TimeFilter;
  searchQuery: string;
  minWinRate: number;
  minTrades: number;
  
  // Sorting
  sortField: SortField;
  sortOrder: SortOrder;
  
  // Pagination
  page: number;
  pageSize: number;
  
  // Actions
  setTimeFilter: (filter: TimeFilter) => void;
  setSearchQuery: (query: string) => void;
  setMinWinRate: (rate: number) => void;
  setMinTrades: (trades: number) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSort: (field: SortField) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetFilters: () => void;
}

const initialState = {
  timeFilter: '30d' as TimeFilter,
  searchQuery: '',
  minWinRate: 0,
  minTrades: 0,
  sortField: 'totalGains' as SortField,
  sortOrder: 'desc' as SortOrder,
  page: 1,
  pageSize: 20,
};

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  ...initialState,
  
  setTimeFilter: (timeFilter) => set({ timeFilter, page: 1 }),
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  setMinWinRate: (minWinRate) => set({ minWinRate, page: 1 }),
  setMinTrades: (minTrades) => set({ minTrades, page: 1 }),
  setSortField: (sortField) => set({ sortField }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  toggleSort: (field) => set((state) => ({
    sortField: field,
    sortOrder: state.sortField === field && state.sortOrder === 'desc' ? 'asc' : 'desc',
  })),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  resetFilters: () => set(initialState),
}));
