import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  role: 'SUPERADMIN' | 'ENTERPRISE' | 'USER';
}

export interface BranchLoadData {
  branchId: number;
  currentLoad: number;
  maxCapacity: number;
  loadPercentage: number;
}

export interface AppState {
  user: User | null;
  token: string | null;
  branches: Record<number, BranchLoadData>;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateBranchLoad: (data: BranchLoadData) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      branches: {}, // Keyed by branchId for fast updates
      
      setAuth: (user, token) => set({ user, token }),
      
      logout: () => set({ user: null, token: null }),
      
      updateBranchLoad: (data) => 
        set((state) => ({
          branches: {
            ...state.branches,
            [data.branchId]: data,
          },
        })),
    }),
    {
      name: 'app-storage', // name of the item in valid storage
      partialize: (state) => ({ user: state.user, token: state.token }), // Only persist auth data
    }
  )
);
