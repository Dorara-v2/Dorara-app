import auth from "@react-native-firebase/auth"
import * as FileSystem from 'expo-file-system';
import firestore from '@react-native-firebase/firestore';
import { Note } from "utils/types";
export const createFirebaseNote = async (note: Note) => {
    const user = auth().currentUser;
    if (!user) {
        console.log('User not authenticated');
        return false;
    };
    // const localPath = `${FileSystem.documentDirectory}Dorara/notes/${note.name}.md`;
    try {
        await firestore().collection('users').doc(user.uid).collection('notes').doc(note.id).set(note);
        return true;
    } catch (error) {
        console.log("Error creating folder in Firebase:", error);
        return false;
    }
}

export const deleteFirebaseNote = async (noteId: string) => {
    const user = auth().currentUser;
    if (!user) {
        console.log('User not authenticated');
        return false;
    };
    try {
        await firestore().collection('users').doc(user.uid).collection('notes').doc(noteId).delete();
        return true;
    } catch (error) {
        console.log("Error deleting note in Firebase:", error);
        return false;
    }
}