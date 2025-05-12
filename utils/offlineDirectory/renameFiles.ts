import * as FileSystem from 'expo-file-system';


export const renameLocalFile = async (oldPath: string, newPath: string): Promise<{message: string, success: boolean}> => {
    console.log("Renaming file from", oldPath, "to", newPath);
    try {
       const fileInfo = await FileSystem.getInfoAsync(oldPath);
        if (fileInfo.exists) {
            const newFileInfo = await FileSystem.getInfoAsync(newPath);
            if (!newFileInfo.exists) {
                await FileSystem.moveAsync({
                    from: oldPath,
                    to: newPath,
                });
                return {message: "File renamed successfully", success: true};
            } else {
                console.log("File already exists at the new path");
                return {message: "File with new name already exists", success: false};
            }
        } else {
            console.log("File does not exist at the old path");
            return {message: "File does not exist", success: false};
        }
    } catch (error) {
        console.log("error in renameLocalFile", error);
        return {message: "Error renaming file", success: false};
    }
}