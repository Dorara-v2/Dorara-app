import { Typo } from 'components/Typo';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { TouchableOpacity, View, ToastAndroid, Animated } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useColorScheme } from 'nativewind';
import { useEffect, useState, useRef } from 'react';
import { CreateDialog } from './CreateDialog';
import { DeleteDialog } from './DeleteDialog';
import { MaterialIcon } from './MaterialIcon';
import { Folder, Note } from 'utils/types';
import { deleteDriveFileFolder } from 'utils/driveDirectory/deleteFileFolder';
import { deleteAllChildren, deleteFirebaseFolder } from 'firebase/folder';
import { deleteFirebaseNote, renameNote } from 'firebase/note';
import { useLoadingStore } from 'store/loadingStore';
import { deleteFolderInDb, insertIntoFolderSync } from 'sqlite/folder';
import { deleteNoteInDb, insertIntoNoteSync, renameNoteInDb } from 'sqlite/note';
import { renameLocalFile } from 'utils/offlineDirectory/renameFiles';
import { useNotesStore } from 'store/notesStore';
import { useUserStore } from 'store/userStore';

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
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { setLoading, setContent } = useLoadingStore();
  const { updateNote,notes } = useNotesStore();
  const { authState } = useUserStore();

  const slideAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (menuVisible) {
      slideAnimation.setValue(0);
      opacityAnimation.setValue(0);

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
        const filePath = `${currentPath}/${file.name}.html`;
        const content = await FileSystem.readAsStringAsync(filePath);
        navigation.navigate('NoteEditor', {
          filename: file.name,
          content,
          path: currentPath,
          file: file,
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
    const ifAlreadyExists = notes.find((note) => note.name === name);
    if (ifAlreadyExists) {
      ToastAndroid.show('File with this name already exists', ToastAndroid.SHORT);
      return;
    }
    setContent('Renaming...');
    setLoading(true);
    await renameNoteInDb(file.id, name);
    updateNote(file.id, { name });
    const {message, success} = await renameLocalFile(`${currentPath}${file.name}.html`, `${currentPath}${name}.html`)
    const renamedInFirebase = await renameNote(file.id, name, `${currentPath}${name}.html`);
    if (!renamedInFirebase) {
      console.error('Error renaming note in Firebase');
      await insertIntoNoteSync(file.id, 'update', 'local');
    }
    ToastAndroid.show(message, ToastAndroid.SHORT);
    setLoading(false);
    setMenuVisible(false);
  };

  const handleDelete = async () => {
    setContent('Deleting...');
    setLoading(true);
    try {
      const filePath = `${currentPath}${file.name}`;
      await FileSystem.deleteAsync(file.type === 'folder' ? filePath : `${filePath}.html`);
      if (file.type === 'folder') {
        await deleteFolderInDb(file.id);
        const driveDeletion = await deleteDriveFileFolder(file.driveId!, authState);
        const firebaseDeletion = await deleteFirebaseFolder(file.id, );
        await deleteAllChildren(file.id);
        if (!driveDeletion || !firebaseDeletion) {
          console.log('Error deleting folder from drive or Firebase');
          await insertIntoFolderSync(file.id, 'delete', 'local');
        }
      } else if (file.type === 'note') {
        await deleteNoteInDb(file.id)
        const driveDeletion = await deleteDriveFileFolder(file.driveId!, authState);
        const firebaseDeletion = await deleteFirebaseNote(file.id);
        if (!driveDeletion || !firebaseDeletion) {
          console.log('Error deleting note from drive or Firebase');
          await insertIntoNoteSync(file.id, 'delete', 'local');
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

  const displayName =
    file.type === 'folder'
      ? file.name
      : file.name.endsWith('.html')
        ? file.name.slice(0, -5)
        : file.name;

  return (
    <View className="mb-2">
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        className="z-0 flex-row items-center rounded-lg p-4">
        <MaterialIcon
          name={file.type === 'folder' ? 'folder' : 'file-copy'}
          size={30}
          color={file.type === 'folder' ? '#f3a49d' : '#b3afaf'}
        />
        <Typo className="ml-2 text-2xl">{displayName}</Typo>
      </TouchableOpacity>

      {menuVisible && (
        <Animated.View
          className="relative top-0 z-10 w-full self-start rounded-lg"
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
          }}>
          {file.type === 'note' && (
            <TouchableOpacity
            className="z-10 flex-row items-center p-3"
            onPress={() => {
              setIsDialogVisible(true);
              setMenuVisible(false);
            }}>
            <MaterialIcon name="edit" size={24} color="#f3a49d" />
            <Typo className="ml-2">Rename</Typo>
          </TouchableOpacity>
          )}

          <View className="h-[1px] bg-gray-200" />

          <TouchableOpacity
            className="z-10 flex-row items-center p-3"
            onPress={() => {
              setIsDeleteDialogVisible(true);
              setMenuVisible(false);
            }}>
            <MaterialIcon name="delete" size={24} color="#f3a49d" />
            <Typo className="ml-2">Delete</Typo>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200" />

          <TouchableOpacity
            className="z-10 flex-row items-center p-3 "
            onPress={() => setMenuVisible(false)}>
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
