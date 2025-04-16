import { MaterialIcons } from '@expo/vector-icons';
import { Typo } from 'components/Typo';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { NOTES_BASE_PATH } from 'utils/offlineDirectory/createDoraraFolder';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { CreateDialog } from './CreateDialog';

type FolderItemProps = {
  file: { name: string; isDirectory: boolean };
  setCurrentDirectory: React.Dispatch<React.SetStateAction<string>>;
  setDirectoryArray: React.Dispatch<React.SetStateAction<string[]>>;
  currentPath: string;
  loadFolders: () => Promise<void>
};

export const FolderItem = ({
  file,
  setCurrentDirectory,
  setDirectoryArray,
  currentPath,
  loadFolders
}: FolderItemProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handlePress = async () => {
    if (file.isDirectory) {
      setDirectoryArray((prev) => [...prev, file.name]);
      setCurrentDirectory(file.name);
    } else {
      try {
        const filePath = `${NOTES_BASE_PATH}${currentPath}/${file.name}`;
        const content = await FileSystem.readAsStringAsync(filePath);
        navigation.navigate('NoteEditor', {
          filename: file.name,
          content,
          path: currentPath,
        });
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const handleLongPress = () => {
    setMenuVisible(true);
  };

  const handleRename = async (name: string) => {
    // TODO: Implement rename functionality
    console.log(name)

    setMenuVisible(false);
  };

  const handleDelete = async () => {
    try {
      const filePath = `${NOTES_BASE_PATH}${currentPath}/${file.name}`;
      await FileSystem.deleteAsync(filePath);
      loadFolders()
      setCurrentDirectory((curr) => curr);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
    setMenuVisible(false);
  };

  const displayName = file.isDirectory
    ? file.name
    : file.name.endsWith('.md')
    ? file.name.slice(0, -3)
    : file.name;

   


  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        className="mb-2 flex-row items-center rounded-lg p-4"
      >
        <MaterialIcons
          name={file.isDirectory ? 'folder' : 'file-copy'}
          size={30}
          color={file.isDirectory ? '#f3a49d' : '#b3afaf'}
        />
        <Typo className="ml-2 text-2xl">{displayName}</Typo>
      </TouchableOpacity>

      {menuVisible && (
        <View
          className="absolute z-10 right-4 top-16 rounded-lg w-48"
          style={{
            backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : 'white',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <TouchableOpacity
            className="flex-row items-center p-3"
            onPress={
                () => {
                    setIsDialogVisible(true)
                    setMenuVisible(false)
                }
            }
          >
            <MaterialIcons name="edit" size={24} color="#f3a49d" />
            <Typo className="ml-2">Rename</Typo>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200" />

          <TouchableOpacity
            className="flex-row items-center p-3"
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={24} color="#f3a49d" />
            <Typo className="ml-2">Delete</Typo>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200" />

          <TouchableOpacity
            className="flex-row items-center p-3"
            onPress={() => setMenuVisible(false)}
          >
            <MaterialIcons name="close" size={24} color="#f3a49d" />
            <Typo className="ml-2">Cancel</Typo>
          </TouchableOpacity>
        </View>
      )}
      <CreateDialog 
        visible={isDialogVisible}
        onClose={() => setIsDialogVisible(false)}
        onSubmit={handleRename}
        type="folder"
        label={`Rename ${file.name}`}
        placeholder={`Enter new name`}
        success="Rename"
      />
    </View>
  );
};
