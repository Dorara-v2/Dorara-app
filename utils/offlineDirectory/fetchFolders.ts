import * as FileSystem from 'expo-file-system';
import { NOTES_BASE_PATH } from './createDoraraFolder';

export const fetchFolders = async (relativePath: string = '') => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(`${NOTES_BASE_PATH}/${relativePath}`);
    if (!dirInfo.exists) {
      return [];
    }
    // console.log("fetching folder of ", `${NOTES_BASE_PATH}/${relativePath}`)
    const items = await FileSystem.readDirectoryAsync(`${NOTES_BASE_PATH}/${relativePath}`);

    const folders = await Promise.all(
      items.map(async (item) => {
        const itemInfo = await FileSystem.getInfoAsync(
          `${NOTES_BASE_PATH}/${relativePath}/${item}`
        );
        return {
          name: item,
          isDirectory: itemInfo.isDirectory || false,
        };
      })
    );
    return folders;
  } catch (error) {
    console.error('Error in fetchFolders:', error);
    return [];
  }
};
