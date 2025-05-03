import { Category, Todo } from 'utils/types';
import { create } from 'zustand';

interface TodoStore {
  todo: Todo[];
  category: Category[];
  setTodo: (todo: Todo[]) => void;
  setCategory: (category: Category[]) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todo: [],
  category: [],
  setTodo: (todo) => set({ todo }),
  setCategory: (category) => set({ category }),
}));
