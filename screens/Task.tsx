import { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MaterialIcon } from 'components/MaterialIcon';
import ScreenContent from 'components/ScreenContent';
import { CreateTodoModal } from 'components/CreateTodoModal';
import { CategoryList } from 'components/CategoryList';
import { Category, Todo } from 'utils/types';
import { useTodoStore } from 'store/todoStore';
import { useSQLiteContext } from 'expo-sqlite';
import { TodoItem } from 'components/TodoItem';

export const TaskScreen = () => {
  const { todo: todos, category } = useTodoStore();
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: 'all',
    name: 'All',
    icon: 'checklist',
    color: '#f3a49d',
  });
  const db = useSQLiteContext();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { todo, setTodo } = useTodoStore();
  const unscheduledTodos = todos
    .filter(
      (todo) =>
        !todo.date && (selectedCategory.id === 'all' || todo.categoryId === selectedCategory.id)
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const toggleTodo = async (selectedTodo: Todo) => {
    const updatedTodo = { ...selectedTodo, isCompleted: selectedTodo.isCompleted === 1 ? 0 : 1 };
    try {
      await db.runAsync(`UPDATE todos SET isCompleted = ?, updatedAt = ? WHERE id = ?`, [
        updatedTodo.isCompleted,
        Date.now(),
        updatedTodo.id,
      ]);
      setTodo([...todo.filter((t) => t.id !== selectedTodo.id), updatedTodo]);
    } catch (error) {
      console.log('Error updating todo in DB:', error);
    }
  };

  const onLongPressAction = (todo: Todo) => {
    setMode('edit');
    setSelectedTodo(todo);
    setIsAddModalVisible(true);
  };

  const getCategoryIcon = (categoryId: string) => {
    const categoryItem = category.find((cat) => cat.id === categoryId);
    return categoryItem ? categoryItem.icon : 'checklist';
  };

  return (
    <ScreenContent>
      <View className="h-14">
        <CategoryList
          mode="display"
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </View>

      <ScrollView className="flex-1 px-4">
        {unscheduledTodos.map((todo) =>
          TodoItem({ todo, toggleTodo, getCategoryIcon, onLongPressAction })
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          setMode('create');
          setSelectedTodo(undefined);
          setIsAddModalVisible(true);
        }}
        className="absolute bottom-20 right-10 h-16 w-16 items-center justify-center rounded-full bg-[#f3a49d]"
        style={{
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
        }}>
        <MaterialIcon name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}>
        <CreateTodoModal
          mode={mode}
          todo={selectedTodo}
          setIsAddModalVisible={setIsAddModalVisible}
        />
      </Modal>
    </ScreenContent>
  );
};
