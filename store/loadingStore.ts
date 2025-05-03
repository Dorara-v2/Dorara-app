import { create } from 'zustand';

interface LoadingStore {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  content: string;
  setContent: (content: string) => void;
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading: isLoading }),
  content: 'Loading...',
  setContent: (content) => set({ content: content }),
}));
