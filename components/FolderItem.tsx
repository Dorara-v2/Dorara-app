import { MaterialIcons } from "@expo/vector-icons";
import { Typo } from "components/Typo";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import * as FileSystem from 'expo-file-system';
import { NOTES_BASE_PATH } from "utils/offlineDirectory/createDoraraFolder";

type FolderItemProps = {
    file: {name: string, isDirectory: boolean};
    setCurrentDirectory: React.Dispatch<React.SetStateAction<string>>;
    setDirectoryArray: React.Dispatch<React.SetStateAction<string[]>>;
    currentPath: string;
}

export const FolderItem = ({ 
    file, 
    setCurrentDirectory, 
    setDirectoryArray,
    currentPath 
}: FolderItemProps) => {
    const navigation = useNavigation();
    
    const handlePress = async () => {
        if (file.isDirectory) {
            setDirectoryArray(prev => [...prev, file.name]);
            setCurrentDirectory(file.name);
        } else {
            try {
                const filePath = `${NOTES_BASE_PATH}${currentPath}/${file.name}`;
                const content = await FileSystem.readAsStringAsync(filePath);
                navigation.navigate('NoteEditor', {
                    fileName: file.name,
                    content,
                    path: currentPath
                });
            } catch (error) {
                console.error('Error reading file:', error);
            }
        }
    };

    const displayName = file.isDirectory 
        ? file.name 
        : file.name.endsWith('.md') 
            ? file.name.slice(0, -3) 
            : file.name;

    return (
        <TouchableOpacity 
            onPress={handlePress}
            className="flex-row items-center p-4 rounded-lg mb-2"
        >
            <MaterialIcons 
                name={file.isDirectory ? "folder" : "file-copy"} 
                size={30} 
                color={file.isDirectory ? "#f3a49d" : "#b3afaf"} 
            />
            <Typo className="ml-2 text-2xl">{displayName}</Typo>
        </TouchableOpacity>
    );
};