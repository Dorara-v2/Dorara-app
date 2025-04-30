import { TouchableOpacity } from 'react-native';
import { MaterialIconName, Todo } from 'utils/types';
import { MaterialIcon } from './MaterialIcon';
import { Typo } from './Typo';
import { format } from 'date-fns';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

type Props = {
  todo: Todo;
  toggleTodo: (todo: Todo) => void;
  getCategoryIcon: (categoryId: string) => string | null | undefined;
  onLongPressAction: (todo: Todo) => void;
};

export const TodoItem = ({ todo, toggleTodo, getCategoryIcon, onLongPressAction }: Props) => {
  const { colorScheme } = useColorScheme();
  return (
    <TouchableOpacity
      key={todo.id}
      onPress={() => toggleTodo(todo)}
      onLongPress={() => onLongPressAction(todo)}
      className={`mb-3 flex-row items-center rounded-xl bg-white p-4 dark:bg-[#1f1f1f]
                        ${todo.isCompleted ? 'opacity-60' : ''}`}
      style={{
        backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : 'white',
        elevation: 5,
        shadowColor: colorScheme === 'dark' ? '#fff' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}>
      <TouchableOpacity
        onPress={() => toggleTodo(todo)}
        className={`mr-4 h-6 w-6 items-center justify-center rounded-full border-2
                            ${todo.isCompleted ? 'border-[#f3a49d] bg-[#f3a49d]' : 'border-gray-300'}`}>
        {todo.isCompleted === 1 && <MaterialIcon name="check" size={16} color="white" />}
      </TouchableOpacity>

      <View className="flex-1">
        <Typo className={`text-lg ${todo.isCompleted ? 'text-gray-500 line-through' : ''}`}>
          {todo.name}
        </Typo>
        {todo.time && <Typo className="text-sm text-gray-500">{format(todo.time, 'HH:mm')}</Typo>}
      </View>

      {todo.categoryId && todo.categoryId !== 'all' && (
        <MaterialIcon
          name={getCategoryIcon(todo.categoryId) as MaterialIconName}
          size={20}
          color="#f3a49d"
        />
      )}
    </TouchableOpacity>
  );
};
