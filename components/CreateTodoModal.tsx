import { KeyboardAvoidingView, Platform, TextInput, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcon } from "./MaterialIcon";
import { Typo } from "./Typo";
import { format } from "date-fns";
import { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Category, Todo } from "utils/types";
import uuid from "react-native-uuid"
import { CategoryList } from "./CategoryList";
import { useColorScheme } from 'nativewind';
import { getTodoScreenColors } from "utils/colors";
import { useSQLiteContext } from "expo-sqlite";
import { useTodoStore } from "store/todoStore";

type Props = {
    setIsAddModalVisible: (visible: boolean) => void;
}

const categories: Category[] = [
    { id: 'all', name: 'All', icon: 'checklist' },
    { id: 'work', name: 'Work', icon: 'work' },
    { id: 'personal', name: 'Personal', icon: 'person' },
    { id: 'shopping', name: 'Shopping', icon: 'shopping-cart' },
    { id: 'other', name: 'Other', icon: 'more-horiz' },
]

export const CreateTodoModal = ({setIsAddModalVisible}: Props) => {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState<boolean>(false);
    const [newTodo, setNewTodo] = useState<Todo>({
        id: uuid.v4() as string,
        name: '',
        time: undefined,
        date: undefined,
        isCompleted: 0,
        categoryId: undefined,
        updatedAt: Date.now(),
    })
    const [category, setCategory] = useState<Category>({
        id: "none",
        name: 'none',
        icon: 'none',
    });
    const { todo, setTodo } = useTodoStore()
    const db = useSQLiteContext()
    const { colorScheme } = useColorScheme();
    const colors = getTodoScreenColors(colorScheme)
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

    const createTodoInDb = async () => {
        try {
            if(newTodo.name.trim() === '') return
            await db.runAsync(`
                INSERT INTO todos (id, name, date, time, isCompleted, categoryId, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [newTodo.id, newTodo.name, newTodo.date, newTodo.time, newTodo.isCompleted, newTodo.categoryId, newTodo.updatedAt])  
            setTodo([...todo, newTodo])
            ToastAndroid.show('Todo created successfully', ToastAndroid.SHORT);
            setIsAddModalVisible(false)

        } catch (error) {
            console.log('Error creating todo in DB:', error);
        }
    }

    console.log(newTodo)
    return (
        
                <TouchableWithoutFeedback onPress={() => setIsAddModalVisible(false)}>
                    <View className="flex-1 bg-black/50">
                        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                            <KeyboardAvoidingView 
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                                className="flex-1 justify-end"
                            >
                                <View className=" rounded-t-3xl p-4"
                                    style={{
                                        backgroundColor: colors.bg,
                                    }}
                                >
                                    {/* Title Input */}
                                    <TextInput
                                        className="text-lg border-b border-gray-200 dark:border-gray-700 p-2 mb-4"
                                        placeholder="What needs to be done?"
                                        placeholderTextColor="#666"
                                        value={newTodo.name}
                                        onChangeText={(text) => setNewTodo({ ...newTodo, name: text })}
                                        autoFocus
                                        style={{
                                            color: colors.text
                                        }}
                                    />
        
                                    <CategoryList
                                        selectedCategory={category}
                                        setSelectedCategory={(category) =>
                                            {
                                                 setNewTodo({ ...newTodo, categoryId: category.id })
                                                 setCategory(category)
                                            }}
                                        mode="create" 
                                        />
        
                                    {/* Date and Time Selectors */}
                                    <View className="flex-row space-x-2 gap-x-4">
                                        <TouchableOpacity
                                            onPress={() => setIsDatePickerVisible(true)}
                                            className="flex-1 flex-row items-center mt-4 mb-4 p-2 rounded-lg"
                                            style={{
                                                backgroundColor: newTodo.date ? '#f3a49d' : colors.categoryBg,
                                            }}
                                        >
                                            <MaterialIcon name="event" size={24} color={colors.icon} />
                                            <Typo className="ml-2  flex-1">
                                                {newTodo.date ? format(newTodo.date, 'dd MMM yyyy') : 'Add Date'}
                                            </Typo>
                                            {newTodo.date && (
                                                <TouchableOpacity
                                                    onPress={() => setNewTodo({ ...newTodo, date: undefined })}
                                                >
                                                    <MaterialIcon name="close" size={20} color={colors.icon} />
                                                </TouchableOpacity>
                                            )}
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => setIsTimePickerVisible(true)}
                                            className="flex-1 flex-row items-center mt-4 mb-4 p-2  rounded-lg"
                                            style={{
                                                backgroundColor: newTodo.time ? '#f3a49d' : colors.categoryBg,
                                            }}
                                        >
                                            <MaterialIcon name="schedule" size={24} color={colors.icon} />
                                            <Typo className="ml-2 text-gray-600 flex-1">
                                                {newTodo.time ? format(newTodo.time, 'HH:mm') : 'Add Time'}
                                            </Typo>
                                            {newTodo.time && (
                                                <TouchableOpacity
                                                    onPress={() => setNewTodo({ ...newTodo, time: undefined })}
                                                >
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
                                            className="px-4 py-2 mr-2"
                                        >
                                            <Typo className="text-gray-600">Cancel</Typo>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={createTodoInDb}
                                            className="px-4 py-2 bg-[#f3a49d] rounded-lg"
                                        >
                                            <Typo className="text-white font-bold">Add</Typo>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
    )
}