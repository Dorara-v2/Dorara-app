import { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Animated, Modal } from 'react-native';
import { MaterialIcon } from 'components/MaterialIcon';
import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { format, isToday, isTomorrow, parse } from 'date-fns';
import { CreateTodoModal } from 'components/CreateTodoModal';
import { CategoryList } from 'components/CategoryList';
import { Category, Todo } from 'utils/types';
import { useTodoStore } from 'store/todoStore';
import { useSQLiteContext } from 'expo-sqlite';
import { TodoItem } from 'components/TodoItem';

const groupTodosByDate = (todos: Todo[], selectedCategory: Category['id']) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const filteredTodos =
    selectedCategory === 'all'
      ? todos.filter((todo) => todo.date) // Only include todos with dates
      : todos.filter((todo) => todo.categoryId === selectedCategory && todo.date);

  const orderedGroups: { [key: string]: Todo[] } = {
    Today: [],
    Tomorrow: [],
  };

  filteredTodos.forEach((todo) => {
    const todoDate = new Date(todo.date!);
    todoDate.setHours(0, 0, 0, 0);

    let dateKey;
    if (isToday(todoDate)) {
      dateKey = 'Today';
    } else if (isTomorrow(todoDate)) {
      dateKey = 'Tomorrow';
    } else {
      dateKey = format(todoDate, 'MMM d, yyyy');
    }

    if (!orderedGroups[dateKey]) {
      orderedGroups[dateKey] = [];
    }
    orderedGroups[dateKey].push(todo);
  });

  const futureGroups = Object.entries(orderedGroups)
    .filter(([key]) => key !== 'Today' && key !== 'Tomorrow')
    .sort(([dateA], [dateB]) => {
      const a = parse(dateA, 'MMM d, yyyy', new Date());
      const b = parse(dateB, 'MMM d, yyyy', new Date());
      return a.getTime() - b.getTime();
    });

  const finalGroups: { [key: string]: Todo[] } = {};
  if (orderedGroups['Today'].length) finalGroups['Today'] = orderedGroups['Today'];
  if (orderedGroups['Tomorrow'].length) finalGroups['Tomorrow'] = orderedGroups['Tomorrow'];
  futureGroups.forEach(([key, todos]) => {
    if (todos.length) finalGroups[key] = todos;
  });

  Object.keys(finalGroups).forEach((key) => {
    finalGroups[key].sort((a, b) => {
      if (a.time && b.time) return a.time - b.time;
      if (a.time) return -1;
      if (b.time) return 1;
      return 0;
    });
  });

  return finalGroups;
};

export const TodoScreen = () => {
  const { todo, category, setTodo } = useTodoStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: 'all',
    name: 'All',
    icon: 'checklist',
    color: '#f3a49d',
  });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const groupedTodos = groupTodosByDate(todo, selectedCategory.id);
  const db = useSQLiteContext();
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);

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

  const onLongPress = (todo: Todo) => {
    setSelectedTodo(todo);
    setMode('edit');
    setIsAddModalVisible(true);
  };

  const renderTodoGroup = (date: string, dateTodos: Todo[]) => (
    <View key={date} className="mb-6">
      <Typo className="mb-3 text-lg font-bold text-gray-600">{date}</Typo>
      {dateTodos.map((Todo) => TodoItem({ todo: Todo, toggleTodo, getCategoryIcon, onLongPressAction: onLongPress }))}
    </View>
  );

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
        {Object.entries(groupedTodos).map(([date, dateTodos]) => renderTodoGroup(date, dateTodos))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setIsAddModalVisible(true)}
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
        <CreateTodoModal mode={mode} todo={selectedTodo} setIsAddModalVisible={setIsAddModalVisible} />
      </Modal>
    </ScreenContent>
  );
};
