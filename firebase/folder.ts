import auth from '@react-native-firebase/auth';
import { getDoraraFolderId } from 'utils/driveDirectory/findOrCreateDoraraFolder';
import * as FileSystem from 'expo-file-system';
import firestore from '@react-native-firebase/firestore';
import { Folder } from 'utils/types';
import { deleteFirebaseNote } from './note';
import { AuthState } from 'store/userStore';
export const createFirebaseBaseFolder = async () => {
  const user = auth().currentUser;
  if (!user) {
    console.log('User not authenticated');
    return false;
  }
  const driveId = await getDoraraFolderId();
  const localPath = `${FileSystem.documentDirectory}Dorara/notes/`;

  try {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('folders')
      .doc('baseNotesFolder')
      .set({
        id: 'baseNotesFolder',
        name: 'Dorara',
        localPath,
        driveId,
        parentId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    return true;
  } catch (error) {}
};

export const createFirebaseFolder = async (folder: Folder) => {
  const user = auth().currentUser;
  if (!user) {
    console.log('User not authenticated');
    return false;
  }
  // const localPath = `${FileSystem.documentDirectory}Dorara/notes/${folder.name}/`;
  try {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('folders')
      .doc(folder.id)
      .set(folder);
    return true;
  } catch (error) {
    console.log('Error creating folder in Firebase:', error);
    return false;
  }
};

export const deleteFirebaseFolder = async (folderId: string) => {
  const user = auth().currentUser;
  if (!user) {
    console.log('User not authenticated');
    return false;
  }
  try {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('folders')
      .doc(folderId)
      .delete();
    return true;
  } catch (error) {
    console.log('Error deleting folder in Firebase:', error);
    return false;
  }
};

export const fetchAllFolders = async (): Promise<Folder[]> => {
  const user = auth().currentUser;
  if (!user) {
    console.log('User not authenticated');
    return [];
  }
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('folders')
      .get();
    const folders = snapshot.docs.map((doc) => doc.data());
    return folders as Folder[];
  } catch (error) {
    console.log('Error fetching folders in Firebase:', error);
    return [];
  }
};

export const deleteAllChildren = async (folderId: string) => {
  const user = auth().currentUser;
  if (!user) {
    console.log('User not authenticated');
    return false;
  }
  try {
    const folderSnapshot = await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('folders')
      .where('parentId', '==', folderId)
      .get();
    const folders = folderSnapshot.docs.map((doc) => doc.data());
    for (const folder of folders) {
      await deleteAllChildren(folder.id);
      await deleteFirebaseFolder(folder.id);
    }
    const fileSnapshot = await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('notes')
      .where('parentId', '==', folderId)
      .get();
    const files = fileSnapshot.docs.map((doc) => doc.data());
    for (const file of files) {
      await deleteFirebaseNote(file.id);
    }
    return true;
  } catch (error) {
    console.log('Error deleting all children in Firebase:', error);
    return false;
  }
};
