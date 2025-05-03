import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteDatabase } from 'expo-sqlite';
import { Image } from 'react-native';
import { deleteDoraraFolderId } from 'utils/driveDirectory/findOrCreateDoraraFolder';
import { deleteAcessToken } from 'utils/driveTokenManager';
import { deleteUserUsagePref } from 'utils/extra';
import { googleSignOut } from 'utils/googleOauth';
import { create } from 'zustand';
import * as FileSystem from 'expo-file-system';
import { getDb } from 'sqlite/init';

export const GUEST_USER = {
  uid: 'guest',
  displayName: 'Guest',
  email: null,
  photoURL: Image.resolveAssetSource(require('../assets/adaptive-icon.png')).uri,
  isGuest: true,
};

export type AuthState = 'unauthenticated' | 'authenticated' | 'guest';

interface UserStore {
  authState: AuthState;
  setAuthState: (authState: AuthState) => void;
  user: any;
  setUser: (user: any) => void;
  signOut: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  authState: 'unauthenticated',
  setAuthState: (authState) => set({ authState }),
  user: null,
  setUser: (user) => set({ user }),
  signOut: async () => {
    const { user } = get();
    const db = await getDb()
    await googleSignOut();
    await deleteUserUsagePref();
    await deleteDoraraFolderId();
    await deleteAcessToken();
    await db.execAsync(`
            DELETE FROM todos;
            DELETE FROM categories;
            DELETE FROM todo_sync;
            DELETE FROM category_sync;  
            DELETE FROM folders;
            DELETE FROM notes;
            DELETE FROM folder_sync;
            DELETE FROM note_sync;
            `);
    await FileSystem.deleteAsync(FileSystem.documentDirectory + 'Dorara', { idempotent: true });
    await AsyncStorage.removeItem(`${user?.uid}-backupDone`);
    set({ authState: 'unauthenticated' });
    set({ user: null });
    db.closeAsync();
  },
}));
