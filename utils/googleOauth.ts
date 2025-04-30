import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { createUserDocument } from 'firebase/createUserDocument';

export const signInWithGoogle = async () => {
  GoogleSignin.configure({
        webClientId: '535655252637-o2n053di91s2rco5h23cdubo9qvndcga.apps.googleusercontent.com',
        scopes: ["https://www.googleapis.com/auth/drive.file"],
        offlineAccess: true,
      });
  // console.log('signInWithGoogle');
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    // console.log('response', response);
    if (isSuccessResponse(response)) {
      // console.log('response', response.data);
      const idToken = response.data.idToken;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      await createUserDocument(userCredential.user);
      return auth().signInWithCredential(googleCredential);
    }
  } catch (error) {
    console.log('error', error);
  }
};

export const googleSignOut = async () => {
    GoogleSignin.configure({
        webClientId: '535655252637-o2n053di91s2rco5h23cdubo9qvndcga.apps.googleusercontent.com',
      });
    try {
        await GoogleSignin.signOut();
        await auth().signOut();
    } catch (error) {
        console.log('error', error);
    }
}


