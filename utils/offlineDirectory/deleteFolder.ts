import * as FileSystem from 'expo-file-system';
import { NOTES_BASE_PATH } from './createDoraraFolder';


export const deleteFolder = async (relativePath: string) => {
    // console.log("Deleting folder:", relativePath);
    try {
        const dirInfo = await FileSystem.getInfoAsync(`/${relativePath}`);
        if (dirInfo.exists) {
            await FileSystem.deleteAsync(`/${relativePath}`, { idempotent: true });
            // console.log("Folder deleted successfully");
        } else {
            // console.log("Folder does not exist");
        }
    } catch (error) {
        console.error("Error deleting folder:", error);
    }
}