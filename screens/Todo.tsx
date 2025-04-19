import { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcon } from "components/MaterialIcon";
import ScreenContent from "components/ScreenContent";
import { Typo } from "components/Typo";
import { format } from "date-fns";

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
    { id: '1', title: 'Buy groceries', completed: false, category: 'shopping', date: new Date(Date.now() - 86400000) },
    // { id: '0', title: 'Buy groceries', completed: false, category: 'shopping', date: new Date(Date.now() - 2*86400000) },
    { id: '2', title: 'Finish project presentation', completed: true, category: 'work', date: new Date() },
    { id: '3', title: 'Go for a run', completed: false, category: 'health', date: new Date(Date.now() + 86400000) },
    { id: '4', title: 'Call mom', completed: false, category: 'personal', date: new Date(Date.now() + 86400000) },
    { id: '5', title: 'Submit report', completed: false, category: 'work', date: new Date(Date.now() + 172800000) },
];

const getCategoryIcon = (category: TodoItem['category']) => {
    switch (category) {
        case 'personal': return 'person';
        case 'work': return 'work';
        case 'shopping': return 'shopping-cart';
        case 'health': return 'favorite';
        default: return 'check-circle';
    }
};

const groupTodosByDate = (todos: TodoItem[], selectedCategory: Category['id']) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const groups: { [key: string]: TodoItem[] } = {
        'Previous': []
    };
    
    const filteredTodos = selectedCategory === 'all' 
        ? todos 
        : todos.filter(todo => todo.category === selectedCategory);

    filteredTodos.forEach(todo => {
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

    // Sort Previous todos by date (most recent first)
    groups['Previous'].sort((a, b) => b.date.getTime() - a.date.getTime());

    // Sort date groups
    const sortedGroups: { [key: string]: TodoItem[] } = {};
    
    // Add Previous first if it has items
    if (groups['Previous'].length > 0) {
        sortedGroups['Previous'] = groups['Previous'];
    }

    // Add other dates sorted chronologically
    Object.keys(groups)
        .filter(key => key !== 'Previous')
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .forEach(key => {
            sortedGroups[key] = groups[key];
        });

    return sortedGroups;
};

export const TodoScreen = () => {
    const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
    const [selectedCategory, setSelectedCategory] = useState<Category['id']>('all');
    const [isPreviousExpanded, setIsPreviousExpanded] = useState(false);
    const groupedTodos = groupTodosByDate(todos, selectedCategory);

    const toggleTodo = (id: string) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const renderTodoGroup = (date: string, dateTodos: TodoItem[]) => (
        <View key={date} className="mb-6">
            {date === 'Previous' ? (
                <TouchableOpacity 
                    onPress={() => setIsPreviousExpanded(!isPreviousExpanded)}
                    className="flex flex-row justify-between mt-3 text-gray-600"
                >
                        {/* <MaterialIcon name="history" size={20} color="#666" /> */}
                        <Typo className="text-lg font-bold mb-3 text-gray-600">
                            Previous ({dateTodos.length})
                        </Typo>
                    <MaterialIcon 
                        name={isPreviousExpanded ? 'expand-less' : 'expand-more'} 
                        size={24} 
                        color="#666" 
                    />
                </TouchableOpacity>
            ) : (
                <Typo className="text-lg font-bold mb-3 text-gray-600">
                    {date}
                </Typo>
            )}

            {(date !== 'Previous' || isPreviousExpanded) && (
                dateTodos.map((todo) => (
                    <TouchableOpacity
                        key={todo.id}
                        onPress={() => toggleTodo(todo.id)}
                        className={`flex-row items-center p-4 mb-3 rounded-xl bg-white dark:bg-[#1f1f1f]
                            ${todo.completed ? 'opacity-60' : ''}`}
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 3,
                        }}
                    >
                        <TouchableOpacity 
                            onPress={() => toggleTodo(todo.id)}
                            className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center
                                ${todo.completed ? 'bg-[#f3a49d] border-[#f3a49d]' : 'border-gray-300'}`}
                        >
                            {todo.completed && (
                                <MaterialIcon name="check" size={16} color="white" />
                            )}
                        </TouchableOpacity>
                        
                        <View className="flex-1">
                            <Typo className={`text-lg ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                                {todo.title}
                            </Typo>
                        </View>
                        
                        <MaterialIcon 
                            name={getCategoryIcon(todo.category)} 
                            size={20} 
                            color="#f3a49d" 
                        />
                    </TouchableOpacity>
                ))
            )}
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
                    contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => setSelectedCategory(category.id)}
                            className={`flex-row items-center h-10 px-4 mr-2 rounded-full
                                ${selectedCategory === category.id 
                                    ? 'bg-[#f3a49d]' 
                                    : 'bg-gray-100 dark:bg-gray-800'}`}
                        >
                            <MaterialIcon 
                                name={category.icon} 
                                size={20} 
                                color={selectedCategory === category.id ? 'white' : '#666'} 
                            />
                            <Typo className={`ml-2 ${
                                selectedCategory === category.id ? 'text-white' : 'text-gray-600'
                            }`}>
                                {category.label}
                            </Typo>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView className="flex-1 px-4">
                {Object.entries(groupedTodos).map(([date, dateTodos]) => 
                    renderTodoGroup(date, dateTodos)
                )}
            </ScrollView>

            {/* FAB for creating new todo */}
            <TouchableOpacity 
                className="absolute bottom-24 right-6 w-14 h-14 bg-[#f3a49d] rounded-full items-center justify-center"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    elevation: 8,
                }}
            >
                <MaterialIcon name="add" size={30} color="white" />
            </TouchableOpacity>
        </ScreenContent>
    );
};