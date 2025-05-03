import * as FileSystem from 'expo-file-system';

export const createLocalFile = async (relativePath: string) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(`${relativePath}`);
    if (!fileInfo.exists) {
      await FileSystem.writeAsStringAsync(`${relativePath}`, '', {
        encoding: FileSystem.EncodingType.UTF8,
      });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error creating file:', error);
  }
};
