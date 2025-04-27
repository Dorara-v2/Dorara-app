import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { useSQLiteContext } from 'expo-sqlite';
import { fetchAllCategories } from 'firebase/category';
import { fetchAllTodos } from 'firebase/todo';
import React, { useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { Category, Todo } from 'utils/types';
import auth from '@react-native-firebase/auth';

type props = {
  onBackupComplete: () => void;
};

export default function BackupScreen({ onBackupComplete }: props) {
  const db = useSQLiteContext();
  const user = auth().currentUser
  const backup = async () => {
    const categories: Category[] = await fetchAllCategories();
    if (categories.length > 0) {
      for (const category of categories) {
        await db.runAsync(`INSERT OR REPLACE INTO categories (id, name, icon) VALUES (?, ?, ?)`, [
          category.id ?? null,
          category.name,
          category.icon,
        ]);
      }
    }
    const todos: Todo[] = await fetchAllTodos();
    if (todos.length > 0) {
      for (const todo of todos) {
        await db.runAsync(
          `INSERT OR REPLACE INTO todos (id, name, date, time, notificationId, isCompleted, categoryId, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [todo.id, todo.name, todo.date ?? null, todo.time ?? null, todo.notificationId ?? null, todo.isCompleted, todo.categoryId ?? null, todo.updatedAt]
        );
      }
    }
    setTimeout(() => {
        onBackupComplete();
    },2000);
    await AsyncStorage.setItem(`${user?.uid}-backupDone`, 'true');
  };
  useEffect(() => {
    backup();
  })
  return (
    <ScreenContent className="flex-1 items-center justify-center">
      <Image
        source={require('../assets/catFalling.gif')}
        className="h-64 w-64"
        resizeMode="contain"
      />
      <Typo className="mt-4 text-center text-lg text-gray-700">Syncing your data...</Typo>
    </ScreenContent>
  );
}
