import { Category, Todo } from 'utils/types';
import { create } from 'zustand';

interface TodoStore {
  todo: Todo[];
  category: Category[];
  setTodo: (todo: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  setCategory: (category: Category[]) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todo: [],
  category: [],
  setTodo: (todo) => set({ todo }),
  addTodo: (todo) => set((state) => ({ todo: [...state.todo, todo] })),
  deleteTodo: (id) => set((state) => ({ todo: state.todo.filter((todo) => todo.id !== id) })),
  setCategory: (category) => set({ category }),
  addCategory: (category) => set((state) => ({ category: [...state.category, category] })),
  deleteCategory: (id) => set((state) => ({ category: state.category.filter((cat) => cat.id !== id)
  })),
}));
