import { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Modal, ToastAndroid } from 'react-native';
import { MaterialIcon } from './MaterialIcon';
import { Typo } from './Typo';
import { useColorScheme } from 'nativewind';
import { getTodoScreenColors } from 'utils/colors';
import { useSQLiteContext } from 'expo-sqlite';
import { useTodoStore } from 'store/todoStore';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialIconName } from 'utils/types';

interface CreateCategoryDialogProps {
    onClose: () => void;
}

const AVAILABLE_ICONS = [
    'home', 'work', 'school', 'shopping-cart', 'favorite',
    'fitness-center', 'restaurant', 'local-movies', 'sports-esports',
    'beach-access', 'flight', 'pets', 'family-restroom', 'build',
    'brush', 'music-note', 'directions-car', 'book'
];

export const CreateCategoryDialog = ({ onClose }: CreateCategoryDialogProps) => {
    const [categoryName, setCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
    const { colorScheme } = useColorScheme();
    const colors = getTodoScreenColors(colorScheme)
    const db = useSQLiteContext();
    const { category, setCategory } = useTodoStore();

    const createCategoryInDb = async () => {
        try {
            if(categoryName.trim() === '') return
            if(category.some((cat) => cat.name?.toLowerCase() === categoryName.toLowerCase())) {
                ToastAndroid.show('Category already exists', ToastAndroid.SHORT);
                return;
            }
            await db.runAsync(`INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)`, [categoryName.toLowerCase() ,categoryName, selectedIcon]);
            setCategory([...category, { id: categoryName.toLowerCase(), name: categoryName, icon: selectedIcon }])
            ToastAndroid.show('Category created successfully', ToastAndroid.SHORT);
        } catch (error) {
            console.error('Error creating category in DB:', error);
        }
        onClose()
    }
    return (
        
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="w-[90%] max-w-md bg-white dark:bg-[#1f1f1f] rounded-2xl p-4">
                    <Typo className="text-xl font-bold mb-4">Create Category</Typo>
                    
                    {/* Name Input */}
                    <TextInput
                        className="rounded-lg px-4 py-3 mb-4"
                        style={{
                            backgroundColor: colors.bg,
                            color: colors.text
                        }}
                        placeholder="Category Name"
                        placeholderTextColor="#666"
                        value={categoryName}
                        onChangeText={setCategoryName}
                        autoFocus
                    />

                    {/* Icon Selector */}
                    <Typo className="text-sm text-gray-500 mb-2">Select an icon</Typo>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        className="mb-4"
                    >
                        <View className="flex-row flex-wrap w-full">
                            {AVAILABLE_ICONS.map((icon) => (
                                <TouchableOpacity
                                    key={icon}
                                    onPress={() => setSelectedIcon(icon)}
                                    className={`w-12 h-12 items-center justify-center rounded-lg m-1
                                        `}
                                    style={{
                                        backgroundColor: selectedIcon === icon ? '#f3a49d' : colors.bg
                                    }}    
                                >
                                    <MaterialIcon
                                        name={icon as MaterialIconName}
                                        size={24}
                                        color={selectedIcon === icon ? 'white' : '#666'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View className="flex-row justify-end mt-4">
                        <TouchableOpacity
                            onPress={onClose}
                            className="px-4 py-2 mr-2"
                        >
                            <Typo className="text-gray-600">Cancel</Typo>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={createCategoryInDb}
                            disabled={!categoryName.trim()}
                            className={`px-4 py-2 rounded-lg ${
                                categoryName.trim() ? 'bg-[#f3a49d]' : 'bg-gray-300'
                            }`}
                        >
                            <Typo className="text-white font-bold">Create</Typo>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
    );
};