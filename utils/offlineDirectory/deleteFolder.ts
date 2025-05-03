import * as FileSystem from 'expo-file-system';

export const deleteFolder = async (relativePath: string) => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(`/${relativePath}`);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(`/${relativePath}`, { idempotent: true });
    } else {
    }
  } catch (error) {
    console.error('Error deleting folder:', error);
  }
};
