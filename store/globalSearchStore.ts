import { create } from 'zustand';

interface SearchStore {
  searchText: string;
  setSearchText: (text: string) => void;
  clearSearchText: () => void;
}

export const useGlobalSearchStore = create<SearchStore>((set) => ({
  searchText: '',
  setSearchText: (text) => set({ searchText: text }),
  clearSearchText: () => set({ searchText: '' }),
}));
