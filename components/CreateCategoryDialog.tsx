import { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import { MaterialIcon } from './MaterialIcon';
import { Typo } from './Typo';
import { useColorScheme } from 'nativewind';
import { getTodoScreenColors } from 'utils/colors';
import { useSQLiteContext } from 'expo-sqlite';
import { useTodoStore } from 'store/todoStore';
import { Category, MaterialIconName } from 'utils/types';
import {
  createFirebaseCategory,
  deleteFirebaseCategory,
  updateFirebaseCategory,
} from 'firebase/category';

interface CreateCategoryDialogProps {
  onClose: () => void;
  mode: 'create' | 'edit';
  selectedCategory?: Category;
}

const AVAILABLE_ICONS = [
  'home',
  'work',
  'school',
  'shopping-cart',
  'favorite',
  'fitness-center',
  'restaurant',
  'local-movies',
  'sports-esports',
  'beach-access',
  'flight',
  'pets',
  'family-restroom',
  'build',
  'brush',
  'music-note',
  'directions-car',
  'book',
];

export const CreateCategoryDialog = ({
  onClose,
  mode,
  selectedCategory,
}: CreateCategoryDialogProps) => {
  const [categoryName, setCategoryName] = useState(mode === 'edit' ? selectedCategory?.name : '');
  const [selectedIcon, setSelectedIcon] = useState(
    mode === 'edit' ? selectedCategory?.icon : ('home' as MaterialIconName)
  );
  const { colorScheme } = useColorScheme();
  const colors = getTodoScreenColors(colorScheme);
  const db = useSQLiteContext();
  const { category, setCategory } = useTodoStore();

  const createCategoryInDb = async () => {
    try {
      if (mode === 'create') {
        if (categoryName?.trim() === '') return;
        if (category.some((cat) => cat.name?.toLowerCase() === categoryName?.toLowerCase())) {
          ToastAndroid.show('Category already exists', ToastAndroid.SHORT);
          return;
        }
        if (!categoryName) return;
        await db.runAsync(`INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)`, [
          categoryName!.toLowerCase(),
          categoryName,
          selectedIcon!,
        ]);
        setCategory([
          ...category,
          { id: categoryName?.toLowerCase(), name: categoryName, icon: selectedIcon },
        ]);
        onClose();
        const firebaseCreate = await createFirebaseCategory({
          id: categoryName?.toLowerCase(),
          name: categoryName,
          icon: selectedIcon,
        });
        if (!firebaseCreate) {
          console.log('inserting in category_sync');
          await db.runAsync(
            `INSERT INTO category_sync (id, operation, updatedAt, source) VALUES (?, ?, ?, ?)`,
            [categoryName!.toLowerCase(), 'create', Date.now(), 'local']
          );
        }
        ToastAndroid.show('Category created successfully', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error creating category in DB:', error);
    }
  };

  const updateCategory = async () => {
    try {
      if (mode === 'edit' && selectedCategory?.id != undefined) {
        if (categoryName?.trim() === '') return;
        if (!categoryName) return;
        await db.runAsync(`UPDATE categories SET name = ?, icon = ? WHERE id = ?`, [
          categoryName,
          selectedIcon!,
          selectedCategory?.id,
        ]);
        setCategory([
          ...category.filter((cat) => cat.id !== selectedCategory?.id),
          { id: selectedCategory?.id, name: categoryName, icon: selectedIcon },
        ]);
        const firebaseUpdate = await updateFirebaseCategory({
          id: selectedCategory?.id,
          name: categoryName,
          icon: selectedIcon,
        });
        if (!firebaseUpdate) {
          console.log('inserting in category_sync');
          await db.runAsync(
            `INSERT INTO category_sync (id, operation, updatedAt, source) VALUES (?, ?, ?, ?)`,
            [selectedCategory!.id, 'update', Date.now(), 'local']
          );
        }
        ToastAndroid.show('Category updated successfully', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error updating category in DB:', error);
    }
    onClose();
  };
  const deleteCategory = async () => {
    try {
      if (mode === 'edit' && selectedCategory?.id != undefined) {
        await db.runAsync(`DELETE FROM categories WHERE id = ?`, [selectedCategory?.id]);
        const firebaseDelete = await deleteFirebaseCategory(selectedCategory.id);
        if (!firebaseDelete) {
          console.log('inserting in category_sync');
          await db.runAsync(
            `INSERT INTO category_sync (id, operation, updatedAt, source) VALUES (?, ?, ?, ?)`,
            [selectedCategory!.id, 'delete', Date.now(), 'local']
          );
        }
        setCategory([...category.filter((cat) => cat.id !== selectedCategory?.id)]);
        ToastAndroid.show('Category deleted successfully', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error deleting category in DB:', error);
    }
    onClose();
  };
  return (
    <View className="flex-1 items-center justify-center bg-black/50">
      <View className="w-[90%] max-w-md rounded-2xl bg-white p-4 dark:bg-[#1f1f1f]">
        <Typo className="mb-4 text-xl font-bold">
          {mode === 'create' ? 'Create' : 'Edit'} Category
        </Typo>

        <TextInput
          className="mb-4 rounded-lg px-4 py-3"
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
          }}
          placeholder="Category Name"
          placeholderTextColor="#666"
          value={categoryName}
          onChangeText={setCategoryName}
          autoFocus
        />

        <Typo className="mb-2 text-sm text-gray-500">Select an icon</Typo>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="w-full flex-row flex-wrap">
            {AVAILABLE_ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                onPress={() => setSelectedIcon(icon as MaterialIconName)}
                className={`m-1 h-12 w-12 items-center justify-center rounded-lg
                                        `}
                style={{
                  backgroundColor: selectedIcon === icon ? '#f3a49d' : colors.bg,
                }}>
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
        <View className="mt-4 flex-row justify-end">
          <TouchableOpacity onPress={onClose} className="px-4 py-2">
            <Typo className="text-gray-600">Cancel</Typo>
          </TouchableOpacity>
          {mode === 'edit' && (
            <TouchableOpacity
              onPress={deleteCategory}
              className="mr-2 rounded-lg bg-red-600 px-4 py-2">
              <Typo>Delete</Typo>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={mode === 'create' ? createCategoryInDb : updateCategory}
            disabled={!categoryName?.trim()}
            className={`rounded-lg px-4 py-2 ${
              categoryName?.trim() ? 'bg-[#f3a49d]' : 'bg-gray-300'
            }`}>
            <Typo className="font-bold text-white">{mode === 'create' ? 'Create' : 'Save'}</Typo>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
