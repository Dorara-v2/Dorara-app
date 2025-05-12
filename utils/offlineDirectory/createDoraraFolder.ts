import * as FileSystem from 'expo-file-system';

export const NOTES_BASE_PATH = `${FileSystem.documentDirectory}Dorara/notes/`;

export const ensureBaseNotesFolder = async () => {
  const dirInfo = await FileSystem.getInfoAsync(NOTES_BASE_PATH);
  if (!dirInfo.exists) {
    console.log('Creating base notes folder at:', NOTES_BASE_PATH);
    await FileSystem.makeDirectoryAsync(NOTES_BASE_PATH, { intermediates: true });
  }
};
