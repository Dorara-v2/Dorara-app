import { SQLiteDatabase } from 'expo-sqlite';
import { getDoraraFolderId, setupOnlineDrive } from './driveDirectory/findOrCreateDoraraFolder';
import { setUserUsagePref } from './extra';
import { signInWithGoogle } from './googleOauth';
import { ensureBaseNotesFolder } from './offlineDirectory/createDoraraFolder';
import * as FileSystem from 'expo-file-system';
import { createFirebaseBaseFolder } from 'firebase/folder';

export const onlineFlow = async (db: SQLiteDatabase) => {
  await signInWithGoogle();
  await setUserUsagePref('online');
  await ensureBaseNotesFolder();
  await setupOnlineDrive();
  const doraraFolderId = await getDoraraFolderId();
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
        doraraFolderId,
        null,
        Date.now(),
        Date.now(),
      ]
    );
    await createFirebaseBaseFolder();
  } catch (error) {
    console.log('Error inserting base folder in db:', error);
  }
};
