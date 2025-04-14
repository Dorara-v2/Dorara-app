import { MaterialIcons } from "@expo/vector-icons";
import { Typo } from "components/Typo";
import { useColorScheme } from "nativewind"
import { TouchableOpacity } from "react-native";
import { BlocklistConfig } from "tailwindcss/types/config";


type FolderItemProps ={
    file: {name: string, isDirectory: boolean};
    setCurrentDirectory: React.Dispatch<React.SetStateAction<string>>;
    setDirectoryArray: React.Dispatch<React.SetStateAction<string[]>>;
}

export const FolderItem = ({ 
    file, 
    setCurrentDirectory, 
    setDirectoryArray 
}: FolderItemProps) => {
    
    const handlePress = () => {
        setDirectoryArray((prev: any) => [...prev, file.name]);
        setCurrentDirectory(file.name);
    };

    return (
        <TouchableOpacity 
            onPress={handlePress}
            className="flex-row items-center p-4 rounded-lg mb-2"
        >
            <MaterialIcons name={file.isDirectory ? "folder" : "file-copy"} size={30} color={file.isDirectory? "#f3a49d": "#b3afaf"} />
            <Typo className="ml-2 text-2xl">{file.name}</Typo>
        </TouchableOpacity>
    );
};