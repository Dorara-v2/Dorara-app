
import * as FileSystem from "expo-file-system";
import { NOTES_BASE_PATH } from "./createDoraraFolder";


export const createLocalFolder = async (relativePath: string) => {
    const dirInfo = await FileSystem.getInfoAsync(`${relativePath}`);
    if (!dirInfo.exists) {
        // console.log("Creating folder:", NOTES_BASE_PATH+relativePath);
        await FileSystem.makeDirectoryAsync(`${relativePath}`, { intermediates: true });
        return true
    } else {
        // console.log("Folder already exists:", relativePath);
        
        return false
    }
}

