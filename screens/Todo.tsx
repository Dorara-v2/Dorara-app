import { useState } from 'react';
import { 
    View, 
    TouchableOpacity, 
    ScrollView, 
    Animated, 
    Modal, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform,
    TouchableWithoutFeedback,
    Keyboard 
} from 'react-native';
import { MaterialIcon } from 'components/MaterialIcon';
import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { format } from 'date-fns';
import { useColorScheme } from 'nativewind';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CreateTodoModal } from 'components/CreateTodoModal';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  category: 'personal' | 'work' | 'shopping' | 'health';
  date: Date;
}

interface Category {
  id: 'all' | 'personal' | 'work' | 'shopping' | 'health';
  label: string;
  icon: string;
}

const categories: Category[] = [
  { id: 'all', label: 'All', icon: 'list' },
  { id: 'personal', label: 'Personal', icon: 'person' },
  { id: 'work', label: 'Work', icon: 'work' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping-cart' },
  { id: 'health', label: 'Health', icon: 'favorite' },
];

const mockTodos: TodoItem[] = [
  {
    id: '1',
    title: 'Buy groceries',
    completed: false,
    category: 'shopping',
    date: new Date(Date.now() - 86400000),
  },
  // { id: '0', title: 'Buy groceries', completed: false, category: 'shopping', date: new Date(Date.now() - 2*86400000) },
  {
    id: '2',
    title: 'Finish project presentation',
    completed: true,
    category: 'work',
    date: new Date(),
  },
  {
    id: '3',
    title: 'Go for a run',
    completed: false,
    category: 'health',
    date: new Date(Date.now() + 86400000),
  },
  {
    id: '4',
    title: 'Call mom',
    completed: false,
    category: 'personal',
    date: new Date(Date.now() + 86400000),
  },
  {
    id: '5',
    title: 'Submit report',
    completed: false,
    category: 'work',
    date: new Date(Date.now() + 172800000),
  },
];

const getCategoryIcon = (category: TodoItem['category']) => {
  switch (category) {
    case 'personal':
      return 'person';
    case 'work':
      return 'work';
    case 'shopping':
      return 'shopping-cart';
    case 'health':
      return 'favorite';
    default:
      return 'check-circle';
  }
};

const groupTodosByDate = (todos: TodoItem[], selectedCategory: Category['id']) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const groups: { [key: string]: TodoItem[] } = {
    Previous: [],
  };

  const filteredTodos =
    selectedCategory === 'all' ? todos : todos.filter((todo) => todo.category === selectedCategory);

  filteredTodos.forEach((todo) => {
    const todoDate = new Date(todo.date);
    todoDate.setHours(0, 0, 0, 0);

    if (todoDate < now && !todo.completed) {
      groups['Previous'].push(todo);
    } else {
      const dateKey = format(todoDate, 'MMM d, yyyy');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey] = [...groups[dateKey], todo];
    }
  });

  groups['Previous'].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Sort date groups
  const sortedGroups: { [key: string]: TodoItem[] } = {};

  // Add Previous first if it has items
  if (groups['Previous'].length > 0) {
    sortedGroups['Previous'] = groups['Previous'];
  }

  // Add other dates sorted chronologically
  Object.keys(groups)
    .filter((key) => key !== 'Previous')
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .forEach((key) => {
      sortedGroups[key] = groups[key];
    });

  return sortedGroups;
};

export const TodoScreen = () => {
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [selectedCategory, setSelectedCategory] = useState<Category['id']>('all');
  const [isPreviousExpanded, setIsPreviousExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newTodo, setNewTodo] = useState<TodoItem>({
    id: '',
    title: '',
    completed: false,
    category: 'personal',
    date: new Date(),
  });
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const menuAnimation = useState(new Animated.Value(0))[0];
  const groupedTodos = groupTodosByDate(todos, selectedCategory);
  const { colorScheme } = useColorScheme();

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;
    Animated.spring(menuAnimation, {
        toValue,
        useNativeDriver: true,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const renderTodoGroup = (date: string, dateTodos: TodoItem[]) => (
    <View key={date} className="mb-6">
      {date === 'Previous' ? (
        <TouchableOpacity
          onPress={() => setIsPreviousExpanded(!isPreviousExpanded)}
          className="mt-3 flex flex-row justify-between text-gray-600">
          {/* <MaterialIcon name="history" size={20} color="#666" /> */}
          <Typo className="mb-3 text-lg font-bold text-gray-600">
            Previous ({dateTodos.length})
          </Typo>
          <MaterialIcon
            name={isPreviousExpanded ? 'expand-less' : 'expand-more'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      ) : (
        <Typo className="mb-3 text-lg font-bold text-gray-600">{date}</Typo>
      )}

      {(date !== 'Previous' || isPreviousExpanded) &&
        dateTodos.map((todo) => (
          <TouchableOpacity
            key={todo.id}
            onPress={() => toggleTodo(todo.id)}
            className={`mb-3 flex-row items-center rounded-xl bg-white p-4 dark:bg-[#1f1f1f]
                            ${todo.completed ? 'opacity-60' : ''}`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}>
            <TouchableOpacity
              onPress={() => toggleTodo(todo.id)}
              className={`mr-4 h-6 w-6 items-center justify-center rounded-full border-2
                                ${todo.completed ? 'border-[#f3a49d] bg-[#f3a49d]' : 'border-gray-300'}`}>
              {todo.completed && <MaterialIcon name="check" size={16} color="white" />}
            </TouchableOpacity>

            <View className="flex-1">
              <Typo className={`text-lg ${todo.completed ? 'text-gray-500 line-through' : ''}`}>
                {todo.title}
              </Typo>
            </View>

            <MaterialIcon name={getCategoryIcon(todo.category)} size={20} color="#f3a49d" />
          </TouchableOpacity>
        ))}
    </View>
  );

  return (
    <ScreenContent>
      {/* Category Filter with fixed height */}
      <View className="h-14">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-grow"
          contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`mr-2 h-10 flex-row items-center rounded-full px-4
                                ${
                                  selectedCategory === category.id
                                    ? 'bg-[#f3a49d]'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }`}>
              <MaterialIcon
                name={category.icon}
                size={20}
                color={selectedCategory === category.id ? 'white' : '#666'}
              />
              <Typo
                className={`ml-2 ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-600'
                }`}>
                {category.label}
              </Typo>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4">
        {Object.entries(groupedTodos).map(([date, dateTodos]) => renderTodoGroup(date, dateTodos))}
      </ScrollView>

      <View className="absolute bottom-20 right-10">
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 70,
            right: 0,
            zIndex: 1,
            width: 150,
            transform: [
              {
                translateY: menuAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
            opacity: menuAnimation,
          }}>
          {isMenuOpen && (
            <View
              className="mb-2 rounded-lg"
              style={{
                backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : 'white',
                elevation: 4,
                shadowColor: colorScheme === 'dark' ? '#000' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}>
              <TouchableOpacity
                className="flex-row items-center p-3"
                onPress={() => {
                  setIsAddModalVisible(true);
                  toggleMenu();
                }}>
                <MaterialIcon name="description" size={24} color="#f3a49d" />
                <Typo className="ml-2">New Todo</Typo>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <TouchableOpacity
          onPress={() => setIsAddModalVisible(true)}
          className="h-16 w-16 items-center justify-center rounded-full bg-[#f3a49d]"
          style={{
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            zIndex: 2,
          }}>
          <Animated.View
            style={{
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                {
                  rotate: menuAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                  }),
                },
              ],
            }}>
            <MaterialIcon name="add" size={30} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <Modal
                visible={isAddModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsAddModalVisible(false)}
            >
                <CreateTodoModal 
                    setIsAddModalVisible={setIsAddModalVisible}
                />
                </Modal>
    </ScreenContent>
  );
};
