import firestore from '@react-native-firebase/firestore';

interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export const createUserDocument = async (user: FirebaseUser) => {
  try {
    if (!user?.uid) {
      throw new Error('User ID is required');
    }

    const userRef = firestore().collection('users').doc(user.uid);

    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const userData = {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous',
        email: user.email,
        photoURL: user.photoURL,
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastLoggedIn: firestore.FieldValue.serverTimestamp(),
      };

      await userRef.set(userData);
      console.log('User document created:', user.uid);
    } else {
      await userRef.update({
        lastLoggedIn: firestore.FieldValue.serverTimestamp(),
      });
      console.log('User document updated:', user.uid);
    }

    return true;
  } catch (error) {
    console.error('Error creating/updating user document:', error);
    throw error;
  }
};
