import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { MaterialIcon } from './MaterialIcon';
import { Typo } from './Typo';
import { format } from 'date-fns';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Category, Todo } from 'utils/types';
import uuid from 'react-native-uuid';
import { CategoryList } from './CategoryList';
import { useColorScheme } from 'nativewind';
import { getTodoScreenColors } from 'utils/colors';
import { useSQLiteContext } from 'expo-sqlite';
import { useTodoStore } from 'store/todoStore';

type Props = {
  setIsAddModalVisible: (visible: boolean) => void;
  mode: 'create' | 'edit';
  todo?: Todo;
};

export const CreateTodoModal = ({ setIsAddModalVisible, mode, todo: selectedTodo }: Props) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState<boolean>(false);
  const [newTodo, setNewTodo] = useState<Todo>(
    mode === 'create'
      ? {
          id: uuid.v4() as string,
          name: '',
          time: undefined,
          date: undefined,
          isCompleted: 0,
          categoryId: undefined,
          updatedAt: Date.now(),
        }
      : (selectedTodo as Todo)
  );
  const { todo, setTodo, category: categories } = useTodoStore();
  const [category, setCategory] = useState<Category>(
    mode === 'create'
      ? {
          id: 'none',
          name: 'none',
          icon: 'none',
        }
      : selectedTodo?.categoryId
        ? categories.find((cat) => cat.id === selectedTodo.categoryId) || {
            id: 'none',
            name: 'none',
            icon: 'none',
          }
        : {
            id: 'none',
            name: 'none',
            icon: 'none',
          }
  );
  const db = useSQLiteContext();
  const { colorScheme } = useColorScheme();
  const colors = getTodoScreenColors(colorScheme);
  const handleDateSelect = (event: any, selectedDate?: Date) => {
    setIsDatePickerVisible(false);
    if (selectedDate) {
      setNewTodo({ ...newTodo, date: parseInt(format(selectedDate, 'T')) });
    }
  };

  const handleTimeSelect = (event: any, selectedTime?: Date) => {
    setIsTimePickerVisible(false);
    if (selectedTime) {
      setNewTodo({ ...newTodo, time: parseInt(format(selectedTime, 'T')) });
    }
  };

  const createOrUpdateTodoInDb = async () => {
    try {
      if (newTodo.name.trim() === '') return;
      if (mode === 'create') {
        await db.runAsync(
          `INSERT INTO todos (id, name, date, time, isCompleted, categoryId, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            newTodo.id,
            newTodo.name,
            newTodo.date ?? null,
            newTodo.time ?? null,
            newTodo.isCompleted,
            newTodo.categoryId ?? null,
            newTodo.updatedAt,
          ]
        );
        setTodo([...todo, newTodo]);
        ToastAndroid.show('Todo created successfully', ToastAndroid.SHORT);
        setIsAddModalVisible(false);
      } else {
        await db.runAsync(
          `
                    UPDATE todos SET name = ?, date = ?, time = ?, isCompleted = ?, categoryId = ?, updatedAt = ? WHERE id = ?
                    `,
          [
            newTodo.name,
            newTodo.date ?? null,
            newTodo.time ?? null,
            newTodo.isCompleted,
            newTodo.categoryId ?? null,
            Date.now(),
            selectedTodo?.id ?? '',
          ]
        );
        const updatedTodos = todo.map((t) => (t.id === selectedTodo?.id ? newTodo : t));
        setTodo(updatedTodos);
        ToastAndroid.show('Todo updated successfully', ToastAndroid.SHORT);
        setIsAddModalVisible(false);
      }
    } catch (error) {
      console.log('Error creating todo in DB:', error);
    }
  };

  const handleDeleteTodo = async () => {
    try {
      if(mode === 'edit' && selectedTodo) {
      await db.runAsync(`DELETE FROM todos WHERE id = ?`, [selectedTodo?.id]);
      const updatedTodos = todo.filter((t) => t.id !== selectedTodo?.id);
      setTodo(updatedTodos);
      ToastAndroid.show('Todo deleted successfully', ToastAndroid.SHORT);
      setIsAddModalVisible(false);
      }
    } catch (error) {
      console.log('Error deleting todo in DB:', error);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => setIsAddModalVisible(false)}>
      <View className="flex-1 bg-black/50">
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 justify-end">
            <View
              className=" rounded-t-3xl p-4"
              style={{
                backgroundColor: colors.bg,
              }}>
              {/* Title Input */}
              <TextInput
                className="mb-4 border-b border-gray-200 p-2 text-lg dark:border-gray-700"
                placeholder="What needs to be done?"
                placeholderTextColor="#666"
                value={newTodo.name}
                onChangeText={(text) => setNewTodo({ ...newTodo, name: text })}
                autoFocus
                style={{
                  color: colors.text,
                }}
              />

              <CategoryList
                selectedCategory={category}
                setSelectedCategory={(category) => {
                  setNewTodo({ ...newTodo, categoryId: category.id });
                  setCategory(category);
                }}
                mode="create"
              />

              {/* Date and Time Selectors */}
              <View className="flex-row gap-x-4 space-x-2">
                <TouchableOpacity
                  onPress={() => setIsDatePickerVisible(true)}
                  className="mb-4 mt-4 flex-1 flex-row items-center rounded-lg p-2"
                  style={{
                    backgroundColor: newTodo.date ? '#f3a49d' : colors.categoryBg,
                  }}>
                  <MaterialIcon name="event" size={24} color={colors.icon} />
                  <Typo className="ml-2  flex-1">
                    {newTodo.date ? format(newTodo.date, 'dd MMM yyyy') : 'Add Date'}
                  </Typo>
                  {newTodo.date && (
                    <TouchableOpacity onPress={() => setNewTodo({ ...newTodo, date: undefined })}>
                      <MaterialIcon name="close" size={20} color={colors.icon} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsTimePickerVisible(true)}
                  className="mb-4 mt-4 flex-1 flex-row items-center rounded-lg  p-2"
                  style={{
                    backgroundColor: newTodo.time ? '#f3a49d' : colors.categoryBg,
                  }}>
                  <MaterialIcon name="schedule" size={24} color={colors.icon} />
                  <Typo className="ml-2 flex-1 text-gray-600">
                    {newTodo.time ? format(newTodo.time, 'HH:mm') : 'Add Time'}
                  </Typo>
                  {newTodo.time && (
                    <TouchableOpacity onPress={() => setNewTodo({ ...newTodo, time: undefined })}>
                      <MaterialIcon name="close" size={20} color={colors.icon} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>

              {/* Date Picker */}
              {isDatePickerVisible && (
                <DateTimePicker
                  value={newTodo.date ? new Date(newTodo.date) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={handleDateSelect}
                  minimumDate={new Date()}
                  textColor={colorScheme === 'dark' ? '#fff' : '#000'}
                  accentColor="#f3a49d"
                  themeVariant={colorScheme}
                />
              )}

              {/* Time Picker */}
              {isTimePickerVisible && (
                <DateTimePicker
                  value={newTodo.time ? new Date(newTodo.time) : new Date()}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeSelect}
                  textColor={colorScheme === 'dark' ? '#fff' : '#000'}
                  accentColor="#f3a49d"
                  themeVariant={colorScheme}
                />
              )}

              {/* Action Buttons */}
              <View className="flex-row justify-end pt-2">
                
                <TouchableOpacity
                  onPress={() => setIsAddModalVisible(false)}
                  className="px-4 py-2">
                  <Typo className="text-gray-600">Cancel</Typo>
                </TouchableOpacity>
                {mode === 'edit' && selectedTodo && (
                <TouchableOpacity
                  onPress={handleDeleteTodo}
                  className="mr-2 px-4 py-2 bg-red-600 rounded-lg"
                  >
                  <Typo >Delete</Typo>
                  </TouchableOpacity>
  )}
                <TouchableOpacity
                  onPress={createOrUpdateTodoInDb}
                  className="rounded-lg bg-[#f3a49d] px-4 py-2">
                  <Typo className="font-bold text-white">{mode === 'create' ? 'Add' : 'Edit'}</Typo>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};
