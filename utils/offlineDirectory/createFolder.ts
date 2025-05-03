import * as FileSystem from 'expo-file-system';

export const createLocalFolder = async (relativePath: string) => {
  const dirInfo = await FileSystem.getInfoAsync(`${relativePath}`);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(`${relativePath}`, { intermediates: true });
    return true;
  } else {
    return false;
  }
};
