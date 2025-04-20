import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
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
        id: 'all',
        name: 'All',
        icon: 'checklist',
    });
    console.log(newTodo)
    return (
        
                <TouchableWithoutFeedback onPress={() => setIsAddModalVisible(false)}>
                    <View className="flex-1 bg-black/50">
                        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                            <KeyboardAvoidingView 
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                                className="flex-1 justify-end"
                            >
                                <View className="bg-white dark:bg-[#1f1f1f] rounded-t-3xl p-4">
                                    {/* Title Input */}
                                    <TextInput
                                        className="text-lg border-b border-gray-200 dark:border-gray-700 p-2 mb-4"
                                        placeholder="What needs to be done?"
                                        placeholderTextColor="#666"
                                        value={newTodo.name}
                                        onChangeText={(text) => setNewTodo({ ...newTodo, name: text })}
                                        autoFocus
                                    />
        
                                    {/* Category Selector */}
                                    <CategoryList
                                        selectedCategory={category}
                                        setSelectedCategory={(category) =>
                                            {
                                                 setNewTodo({ ...newTodo, categoryId: category.id })
                                                 setCategory(category)
                                            }}
                                        />
        
                                    {/* Date Selector */}
                                    <TouchableOpacity
                                        onPress={() => setIsDatePickerVisible(true)}
                                        className="flex-row items-center mt-4 mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                                    >
                                        <MaterialIcon name="event" size={24} color="#666" />
                                        <Typo className="ml-2 text-gray-600">
                                            {newTodo.date ? (format(newTodo.date, 'T')) : 'Select Date'}
                                        </Typo>
                                    </TouchableOpacity>
        
                                    {isDatePickerVisible && (
                                        <DateTimePicker
                                            value={newTodo.date ? new Date(newTodo.date) : new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                setIsDatePickerVisible(false);
                                                if (selectedDate) {
                                                    setNewTodo({ ...newTodo, date: parseInt(format(selectedDate, 'T')) });
                                                }
                                            }}
                                            minimumDate={new Date()}
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
                                            onPress={() => {
                                               
                                            }}
                                            className="px-4 py-2 bg-[#f3a49d] rounded-lg"
                                        >
                                            <Typo className="text-white font-bold">Add Todo</Typo>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
    )
}