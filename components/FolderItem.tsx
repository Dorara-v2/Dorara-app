import { MaterialIcons } from '@expo/vector-icons';
import { Typo } from 'components/Typo';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { TouchableOpacity, View, ToastAndroid, Animated } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { NOTES_BASE_PATH } from 'utils/offlineDirectory/createDoraraFolder';
import { useColorScheme } from 'nativewind';
import { useEffect, useState, useRef } from 'react';
import { CreateDialog } from './CreateDialog';
import { DeleteDialog } from './DeleteDialog';
import { MaterialIcon } from './MaterialIcon';
import { Folder, Note } from 'utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import { deleteDriveFileFolder } from 'utils/driveDirectory/deleteFileFolder';
import { deleteFirebaseFolder } from 'firebase/folder';
import { deleteFirebaseNote } from 'firebase/note';
import { useLoadingStore } from 'store/loadingStore';

type FolderItemProps = {
  file: Folder | Note;
  setSelectedFolder: React.Dispatch<React.SetStateAction<Folder>>;
  setFolderBuffer: React.Dispatch<React.SetStateAction<Folder[]>>;
  currentPath: string;
  loadFolders: () => Promise<void>;
};

export const FolderItem = ({
  file,
  setSelectedFolder,
  setFolderBuffer,
  currentPath,
  loadFolders,
}: FolderItemProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { setLoading, setContent } = useLoadingStore();
  const db = useSQLiteContext();

  // Animation values
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (menuVisible) {
      // Reset animations to starting values
      slideAnimation.setValue(0);
      opacityAnimation.setValue(0);

      // Start animations
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [menuVisible]);

  const handlePress = async () => {
    if (file.type === 'folder') {
      setFolderBuffer((prev) => [...prev, file]);
      setSelectedFolder(file);
    } else {
      try {
        const filePath = `${currentPath}/${file.name}.md`;
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
    setMenuVisible(!menuVisible);
  };

  const handleRename = async (name: string) => {
    // TODO: Implement rename functionality
    console.log(name);

    setMenuVisible(false);
  };

  const handleDelete = async () => {
    setContent('Deleting...');
    setLoading(true);
    try {
      const filePath = `${currentPath}${file.name}`;
      await FileSystem.deleteAsync(file.type === 'folder' ? filePath : `${filePath}.md`);
      if (file.type === 'folder') {
        await db.runAsync(`
          DELETE FROM folders WHERE id = ?`, [
          file.id,
        ]);
        const driveDeletion = await deleteDriveFileFolder(file.driveId!);
        const firebaseDeletion = await deleteFirebaseFolder(file.id);
        if(!driveDeletion || !firebaseDeletion) {
          console.error('Error deleting folder from drive or Firebase');
          await db.runAsync(`
              INSERT INTO folder_sync id, operation, updatedAt, source VALUES (?, ?, ?, ?)`
              ,[file.id, 'delete', Date.now(), 'local']);
        }
      } else if (file.type === 'note') {
        await db.runAsync(`
          DELETE FROM notes WHERE id = ?`, [
          file.id,
        ]);
        const driveDeletion = await deleteDriveFileFolder(file.driveId!);
        const firebaseDeletion = await deleteFirebaseNote(file.id);
        if(!driveDeletion || !firebaseDeletion) {
          console.error('Error deleting note from drive or Firebase');
          await db.runAsync(`
              INSERT INTO note_sync id, operation, updatedAt, source VALUES (?, ?, ?, ?)`
              ,[file.id, 'delete', Date.now(), 'local']);
        }
      }
      await loadFolders();
      setSelectedFolder((curr) => curr);
      ToastAndroid.show('Item deleted successfully', ToastAndroid.SHORT);
      setLoading(false);
    } catch (error) {
      console.error('Error deleting item:', error);
      ToastAndroid.show('Error deleting item', ToastAndroid.SHORT);
    }
    setIsDeleteDialogVisible(false);
    setMenuVisible(false);
  };

  const displayName = file.type === 'folder'
    ? file.name
    : file.name.endsWith('.md')
    ? file.name.slice(0, -3)
    : file.name;

  return (
    <View className="mb-2">
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        className="flex-row items-center rounded-lg p-4 z-0"
      >
        <MaterialIcon
          name={file.type === 'folder' ? 'folder' : 'file-copy'}
          size={30}
          color={file.type === 'folder' ? '#f3a49d' : '#b3afaf'}
        />
        <Typo className="ml-2 text-2xl">{displayName}</Typo>
      </TouchableOpacity>

      {menuVisible && (
        <Animated.View
          className="relative z-10 self-start top-0 rounded-lg w-full"
          style={{
            backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : 'white',
            elevation: 5,
            shadowColor: colorScheme === 'dark' ? '#fff' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            opacity: opacityAnimation,
            transform: [
              {
                translateY: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            className="flex-row items-center p-3 z-10"
            onPress={() => {
              setIsDialogVisible(true);
              setMenuVisible(false);
            }}
          >
            <MaterialIcon name="edit" size={24} color="#f3a49d" />
            <Typo className="ml-2">Rename</Typo>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200" />

          <TouchableOpacity
            className="flex-row items-center p-3 z-10"
            onPress={() => {
              setIsDeleteDialogVisible(true);
              setMenuVisible(false);
            }}
          >
            <MaterialIcon name="delete" size={24} color="#f3a49d" />
            <Typo className="ml-2">Delete</Typo>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200" />

          <TouchableOpacity
            className="flex-row items-center p-3 z-10 "
            onPress={() => setMenuVisible(false)}
          >
            <MaterialIcon name="close" size={24} color="#f3a49d" />
            <Typo className="ml-2">Cancel</Typo>
          </TouchableOpacity>
        </Animated.View>
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
      <DeleteDialog
        visible={isDeleteDialogVisible}
        onClose={() => setIsDeleteDialogVisible(false)}
        onDelete={handleDelete}
        itemName={displayName}
      />
    </View>
  );
};
