import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { useSQLiteContext } from 'expo-sqlite';
import { fetchAllCategories } from 'firebase/category';
import { fetchAllTodos } from 'firebase/todo';
import React, { useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { Category, Folder, Note, Todo } from 'utils/types';
import auth from '@react-native-firebase/auth';
import { fetchAllFolders } from 'firebase/folder';
import { createLocalFolder } from 'utils/offlineDirectory/createFolder';
import { fetchAllNotes } from 'firebase/note';
import { createLocalFile } from 'utils/offlineDirectory/createFiles';
import { getDriveFile } from 'utils/driveDirectory/getFile';
import * as FileSystem from 'expo-file-system';

type props = {
  onBackupComplete: () => void;
};

export default function BackupScreen({ onBackupComplete }: props) {
  const db = useSQLiteContext();
  const user = auth().currentUser;
  const backup = async () => {
    const categories: Category[] = await fetchAllCategories();
    if (categories.length > 0) {
      for (const category of categories) {
        await db.runAsync(`INSERT OR REPLACE INTO categories (id, name, icon) VALUES (?, ?, ?)`, [
          category.id ?? null,
          category.name,
          category.icon ?? null,
        ]);
      }
    }
    const todos: Todo[] = await fetchAllTodos();
    if (todos.length > 0) {
      for (const todo of todos) {
        await db.runAsync(
          `INSERT OR REPLACE INTO todos (id, name, date, time, notificationId, isCompleted, categoryId, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            todo.id,
            todo.name,
            todo.date ?? null,
            todo.time ?? null,
            todo.notificationId ?? null,
            todo.isCompleted,
            todo.categoryId ?? null,
            todo.updatedAt,
          ]
        );
      }
    }
    const folders: Folder[] = await fetchAllFolders();
    if (folders.length > 0) {
      for (const folder of folders) {
        await db.runAsync(
          `INSERT OR REPLACE INTO folders (id, name, localPath, driveId, parentId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            folder.id,
            folder.name,
            folder.localPath,
            folder.driveId ?? null,
            folder.parentId ?? null,
            folder.createdAt,
            folder.updatedAt,
          ]
        );
        await createLocalFolder(folder.localPath)
      }
    }
    const notes: Note[] = await fetchAllNotes()
    if (notes.length > 0) {
      for (const note of notes) {
        await db.runAsync(
          `INSERT OR REPLACE INTO notes (id, name, localPath, driveId, parentId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            note.id,
            note.name,
            note.localPath,
            note.driveId ?? null,
            note.parentId ?? null,
            note.createdAt,
            note.updatedAt,
          ]
        );
        await createLocalFile(note.localPath)
        const { success, file } = await getDriveFile(note.driveId!)
        if (success && file){
          await FileSystem.writeAsStringAsync(note.localPath, file)
        }
      }
    }
    setTimeout(() => {
      onBackupComplete();
    }, 2000);

    await AsyncStorage.setItem(`${user?.uid}-backupDone`, 'true');
  };
  useEffect(() => {
    backup();
  });
  return (
    <ScreenContent className="flex-1 items-center justify-center">
      <Image
        source={require('../assets/catFalling.gif')}
        className="h-64 w-64"
        resizeMode="contain"
      />
      <Typo className="mt-4 text-center text-2xl">
        Setting up your workspace...
      </Typo>
      <Typo className='mt-4 text-center text-xl'>
      Hang tight! This may take a few moments.
      </Typo>
    </ScreenContent>
  );
}
