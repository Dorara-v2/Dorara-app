import { AuthState, GUEST_USER } from 'store/userStore';
import { setUserUsagePref } from './extra';
import { ensureBaseNotesFolder } from './offlineDirectory/createDoraraFolder';
import { getDb } from 'sqlite/init';
import * as FileSystem from 'expo-file-system';
import { useNotesStore } from 'store/notesStore';
import { Folder } from './types';
export const offlineFlow = async (
  setAuthState: (autState: AuthState) => void,
  setUser: (user: any) => void,
  addFolder: (folder: Folder) => void,
) => {
  const db = await getDb();
  setUserUsagePref('offline');
  await ensureBaseNotesFolder();
  setUser(GUEST_USER);
  setAuthState('guest');
  try {
      await db.runAsync(
        `
        INSERT INTO folders (
            id, 
            name, 
            localPath, 
            driveId, 
            parentId, 
            createdAt, 
            updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [
          'baseNotesFolder',
          'Dorara',
          `${FileSystem.documentDirectory}Dorara/notes/`,
          null,
          null,
          Date.now(),
          Date.now(),
        ]
      );
      addFolder({
        id: 'baseNotesFolder',
        name: 'Dorara',
        localPath: `${FileSystem.documentDirectory}Dorara/notes/`,
        driveId: undefined,
        parentId: undefined,
        type: 'folder',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }
    catch (error) {
      console.log('Error inserting base folder in db:', error);
    }
};
