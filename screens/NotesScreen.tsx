import { FolderItem } from 'components/FolderItem';
import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { createLocalFile } from 'utils/offlineDirectory/createFiles';
import { fetchFolders } from 'utils/offlineDirectory/fetchFolders';
import { CreateDialog } from 'components/CreateDialog';
import { createLocalFolder } from 'utils/offlineDirectory/createFolder';
import { useLoadingStore } from 'store/loadingStore';
import { MaterialIcon } from 'components/MaterialIcon';
import { NothingHere } from 'components/NothingHere';
import { createDriveFolder } from 'utils/driveDirectory/createFolder';
import { Folder, Note } from 'utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import { useNotesStore } from 'store/notesStore';
import uuid from 'react-native-uuid';
import { createDriveFile } from 'utils/driveDirectory/createFile';
import { createFirebaseFolder } from 'firebase/folder';
import { createFirebaseNote } from 'firebase/note';
export default function NotesScreen() {
  const { setContent, setLoading, isLoading } = useLoadingStore();
  const { colorScheme } = useColorScheme();
  const db = useSQLiteContext();
  const { folders, notes, setFolders, setNotes } = useNotesStore();
  const [selectedFolder, setSelectedFolder] = useState<Folder>(
    folders.find((folder) => folder.parentId === null) || folders[0]
  );
  const [folderBuffer, setFolderBuffer] = useState<Folder[]>([selectedFolder]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('folder');
  const menuAnimation = useState(new Animated.Value(0))[0];

  type FolderOrNote = Folder | Note;

  const folderNotesInSelectedFolder = useMemo(() => {
    const filteredFolders = folders.filter((folder) => folder.parentId === selectedFolder.id);
    const filteredNotes = notes.filter((note) => note.parentId === selectedFolder.id);
    return [...filteredFolders, ...filteredNotes] as FolderOrNote[];
  }, [folders, notes, selectedFolder]);

  const handleBack = useCallback(() => {
    if (folderBuffer.length <= 1) return;
    const _tempArray = folderBuffer.slice(0, -1);
    const previousFolder = _tempArray[_tempArray.length - 1];

    setFolderBuffer(_tempArray);
    setSelectedFolder(previousFolder);
  }, [folderBuffer]);
  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;
    Animated.spring(menuAnimation, {
      toValue,
      useNativeDriver: true,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCreate = async (name: string) => {
    setLoading(true);
    setContent(`Creating new ${createType}`);
    try {
      if (createType === 'folder') {
        const folderExists = folders.some(
          (folder) => folder.name === name && folder.parentId === selectedFolder.id
        );
        if (folderExists) {
          Alert.alert('Error', 'Folder with this name already exists');
          setLoading(false);
          return;
        }
        const id = uuid.v4() as string;
        await createLocalFolder(selectedFolder.localPath + name);
        const { success, folderId } = await createDriveFolder(
          name,
          selectedFolder.driveId as string
        );
        await db.runAsync(
          `
                    INSERT INTO folders (
                        id, 
                        name, 
                        localPath, 
                        driveId, 
                        parentId, 
                        createdAt, 
                        updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
          [
            id,
            name,
            selectedFolder.localPath + name + '/',
            success ? folderId : null,
            selectedFolder.id,
            Date.now(),
            Date.now(),
          ]
        );
        const addedToFirebase = await createFirebaseFolder({
            id,
            name,
            localPath: selectedFolder.localPath + name + '/',
            driveId: success ? folderId : null,
            parentId: selectedFolder.id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })
        if (!success || !addedToFirebase) {
          await db.runAsync(
            `
                        INSERT INTO folder_sync (
                            id, 
                            operation, 
                            updatedAt, 
                            source
                        ) VALUES (?, ?, ?, ?)
                    `,
            [id, 'create', Date.now(), 'local']
          );
        }
      } else {
        const noteExists = notes.some(
            note => note.name === name && note.parentId === selectedFolder.id
        );
        if(noteExists){
            Alert.alert('Error', 'Note with this name already exists');
            setLoading(false);
            return;
        }
        const id = uuid.v4() as string;
        await createLocalFile(selectedFolder.localPath+name+'.md');
        const {success, fileId} = await createDriveFile(name, selectedFolder.driveId as string);
        await db.runAsync(
            `
                    INSERT INTO notes (
                        id, 
                        name, 
                        localPath, 
                        driveId, 
                        parentId, 
                        createdAt, 
                        updatedAt
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
            [
                id,
                name,
                selectedFolder.localPath + name + '.md',
                success ? fileId : null,
                selectedFolder.id,
                Date.now(),
                Date.now(),
            ]
        );
        const addedToFirebase = await createFirebaseNote({
            id,
            name,
            localPath: selectedFolder.localPath + name + '.md',
            driveId: success ? fileId : null,
            parentId: selectedFolder.id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })
        if (!success || !addedToFirebase) {
            await db.runAsync(
                `
                            INSERT INTO note_sync (
                                id, 
                                operation, 
                                updatedAt, 
                                source
                            ) VALUES (?, ?, ?, ?)
                        `,
                [id, 'create', Date.now(), 'local']
            );
        }
      }
      setDialogVisible(false);
      setLoading(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      Alert.alert('Error', 'Failed to create folder');
      setLoading(false);
    }
    loadFolders();
  };

  const loadFolders = async () => {
    const folders: Folder[] = await db.getAllAsync(`
            SELECT * FROM folders
        `);
    const notes: Note[] = await db.getAllAsync(`
            SELECT * FROM notes
        `);
        notes.map((note) => note.type = 'note');
        folders.map((folder) => folder.type = 'folder');
    setNotes(notes);
    setFolders(folders);
  };

  const trimPath = (path: string) => {
    const keyword = "/Dorara/";
  const index = path.indexOf(keyword);
  if (index === -1) return path;
  return path.slice(index + keyword.length);
  };

  useEffect(() => {});
  return (
    <ScreenContent>
      <View className="flex flex-row items-center justify-start p-4">
        <TouchableOpacity onPress={handleBack} disabled={folderBuffer.length <= 1}>
          {selectedFolder.parentId !== null && (
            <Typo>
              <MaterialIcon name="arrow-back" size={30} />
            </Typo>
          )}
        </TouchableOpacity>
        <Typo className="ml-4 text-2xl font-semibold">
          {selectedFolder.parentId === null ? 'notes' : trimPath(selectedFolder.localPath)}
        </Typo>
      </View>
      <FlatList
        data={folderNotesInSelectedFolder}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            {!isLoading && (
              <FolderItem
                loadFolders={loadFolders}
                file={item}
                setSelectedFolder={setSelectedFolder}
                setFolderBuffer={setFolderBuffer}
                currentPath={selectedFolder.localPath}
              />
            )}
            
          </>
        )}
        ListEmptyComponent={
          
            <NothingHere />
        }
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          flex: folders.length === 0 ? 1 : undefined,
        }}
      />
      <View className="absolute bottom-20 right-10">
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 70,
            right: 0,
            zIndex: 1,
            width: 150,
            transform: [
              {
                translateY: menuAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
            opacity: menuAnimation,
          }}>
          {isMenuOpen && (
            <View
              className="mb-2 rounded-lg"
              style={{
                backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : 'white',
                elevation: 4,
                shadowColor: colorScheme === 'dark' ? '#000' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}>
              <TouchableOpacity
                className="flex-row items-center p-3"
                onPress={() => {
                  setCreateType('file');
                  setDialogVisible(true);
                  toggleMenu();
                }}>
                <MaterialIcon name="description" size={24} color="#f3a49d" />
                <Typo className="ml-2">New File</Typo>
              </TouchableOpacity>

              <View className="h-[1px] bg-gray-200" />
              <TouchableOpacity
                className="flex-row items-center p-3"
                onPress={() => {
                  setCreateType('folder');
                  setDialogVisible(true);
                  toggleMenu();
                }}>
                <MaterialIcon name="create-new-folder" size={24} color="#f3a49d" />
                <Typo className="ml-2">New Folder</Typo>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <TouchableOpacity
          onPress={toggleMenu}
          className="h-16 w-16 items-center justify-center rounded-full bg-[#f3a49d]"
          style={{
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            zIndex: 2,
          }}>
          <Animated.View
            style={{
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                {
                  rotate: menuAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                  }),
                },
              ],
            }}>
            <MaterialIcon name="add" size={30} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <CreateDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        onSubmit={handleCreate}
        type={createType}
        label={`Create New ${createType.charAt(0).toUpperCase() + createType.slice(1)}`}
        success="Create"
        placeholder={`Enter ${createType.charAt(0).toUpperCase() + createType.slice(1)} Name`}
      />
    </ScreenContent>
  );
}
