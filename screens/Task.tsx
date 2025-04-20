import { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MaterialIcon } from 'components/MaterialIcon';
import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { useColorScheme } from 'nativewind';
import { CreateTodoModal } from 'components/CreateTodoModal';
import { CategoryList } from 'components/CategoryList';
import { Category, Todo } from 'utils/types';
import { useTodoStore } from 'store/todoStore';

export const TaskScreen = () => {
    const { todo: todos, category } = useTodoStore();
    const [selectedCategory, setSelectedCategory] = useState<Category>({
        id: 'all',
        name: 'All',
        icon: 'checklist',
        color: '#f3a49d',
    });
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    
    // Filter unscheduled todos
    const unscheduledTodos = todos
        .filter(todo => !todo.date && (selectedCategory.id === 'all' || todo.categoryId === selectedCategory.id))
        .sort((a, b) => b.updatedAt - a.updatedAt);

    const renderTaskItem = (todo: Todo) => (
        <TouchableOpacity
            key={todo.id}
            className={`mb-3 flex-row items-center rounded-xl bg-white p-4 dark:bg-[#1f1f1f]
                ${todo.isCompleted ? 'opacity-60' : ''}`}
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 3,
            }}>
            <TouchableOpacity
                className={`mr-4 h-6 w-6 items-center justify-center rounded-full border-2
                    ${todo.isCompleted ? 'border-[#f3a49d] bg-[#f3a49d]' : 'border-gray-300'}`}>
                {todo.isCompleted === 1 && <MaterialIcon name="check" size={16} color="white" />}
            </TouchableOpacity>

            <View className="flex-1">
                <Typo className={`text-lg ${todo.isCompleted ? 'text-gray-500 line-through' : ''}`}>
                    {todo.name}
                </Typo>
            </View>

            {todo.categoryId && todo.categoryId !== 'all' && (
                <MaterialIcon 
                    name={getCategoryIcon(todo.categoryId)} 
                    size={20} 
                    color="#f3a49d" 
                />
            )}
        </TouchableOpacity>
    );

    const getCategoryIcon = (categoryId: string) => {
        const categoryItem = category.find(cat => cat.id === categoryId);
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
                {unscheduledTodos.map(renderTaskItem)}
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
                <CreateTodoModal setIsAddModalVisible={setIsAddModalVisible} />
            </Modal>
        </ScreenContent>
    );
};