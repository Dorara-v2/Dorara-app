import * as FileSystem from 'expo-file-system';
import { NOTES_BASE_PATH } from './createDoraraFolder';


export const createLocalFile = async (relativePath: string) => {
    // console.log("Creating file:", fileName);
    try {
        const fileInfo = await FileSystem.getInfoAsync(`${relativePath}`);
        if (!fileInfo.exists) {
            await FileSystem.writeAsStringAsync(`${relativePath}`, '', { encoding: FileSystem.EncodingType.UTF8 });
            // console.log("File created successfully");
            return true
        } else {
            // console.log("File already exists");
            return false
        }
    } catch (error) {
        console.error("Error creating file:", error);
    }
}