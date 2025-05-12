import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AuthState } from 'store/userStore';
import { Note } from 'utils/types';
export const createFirebaseNote = async (note: Note) => {
  const user = auth().currentUser;
  if (!user) {
    console.log('User not authenticated');
    return false;
  }
  // const localPath = `${FileSystem.documentDirectory}Dorara/notes/${note.name}.html`;
  try {
    await firestore().collection('users').doc(user.uid).collection('notes').doc(note.id).set(note);
    return true;
  } catch (error) {
    console.log('Error creating folder in Firebase:', error);
    return false;
  }
};

export const deleteFirebaseNote = async (noteId: string) => {
  const user = auth().currentUser;
  if (!user) {
    console.log('User not authenticated');
    return false;
  }
  try {
    await firestore().collection('users').doc(user.uid).collection('notes').doc(noteId).delete();
    return true;
  } catch (error) {
    console.log('Error deleting note in Firebase:', error);
    return false;
  }
};

export const fetchAllNotes = async (): Promise<Note[]> => {
  const user = auth().currentUser;
  if (!user) {
    console.log('User not authenticated');
    return [];
  }
  try {
    const snapshot = await firestore().collection('users').doc(user.uid).collection('notes').get();
    const notes: Note[] = [];
    snapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() } as Note);
    });
    return notes;
  } catch (error) {
    console.log('Error fetching notes from Firebase:', error);
    return [];
  }
};


export const renameNote = async (noteId: string, newName: string, newLocalPath: string) => {
  const user = auth().currentUser;
  if (!user) {
    console.log('User not authenticated');
    return false;
  }
  try {
    await firestore().collection('users').doc(user.uid).collection('notes').doc(noteId).update({ name: newName, localPath: newLocalPath });
    return true;
  } catch (error) {
    console.log('Error renaming note in Firebase:', error);
    return false;
  }
}