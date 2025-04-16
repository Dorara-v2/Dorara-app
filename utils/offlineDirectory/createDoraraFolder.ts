import * as FileSystem from 'expo-file-system';

export const NOTES_BASE_PATH = `${FileSystem.documentDirectory}Dorara/notes/`;

export const ensureBaseNotesFolder = async () => {
// console.log("ensureBaseNotesFolder");
  const dirInfo = await FileSystem.getInfoAsync(NOTES_BASE_PATH);
  // console.log(dirInfo)
  if (!dirInfo.exists) {
    // console.log("Creating base notes folder");
    await FileSystem.makeDirectoryAsync(NOTES_BASE_PATH, { intermediates: true });
  }
};

