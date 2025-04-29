
import auth from '@react-native-firebase/auth';
import { getDoraraFolderId } from 'utils/driveDirectory/findOrCreateDoraraFolder';
import * as FileSystem from 'expo-file-system';
import firestore from '@react-native-firebase/firestore';
export const createFirebaseBaseFolder = async () => {
    const user = auth().currentUser;
    if (!user) {
        console.log('User not authenticated');
        return false;
    };
    const driveId = await getDoraraFolderId();
    const localPath = `${FileSystem.documentDirectory}Dorara/notes/`;   

    try {
       await firestore().collection('users').doc(user.uid).collection('folders').doc(driveId as string).set({
            id: driveId,
            name: 'Dorara',
            localPath,
            driveId,
            folderId: driveId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        return true;
    } catch (error) {
        
    }

}