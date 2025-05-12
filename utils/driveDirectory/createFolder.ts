import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { findDoraraFolderId } from './findOrCreateDoraraFolder';
import { AuthState } from 'store/userStore';

export const createDriveFolder = async (
  folderName: string,
  parentFolderId: string,
  authState: AuthState
): Promise<{ success: boolean; folderId: string | null }> => {
  if(authState !== 'authenticated'){
    return { success: false, folderId: null };
  }
  const token = (await GoogleSignin.getTokens()).accessToken;
  if (!token) {
    console.log('No token found');
    return { success: false, folderId: null };
  }
  if (!parentFolderId) {
    parentFolderId = (await findDoraraFolderId()) as string;
  }
  try {
    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId],
      }),
    });
    const json = await response.json();
    if (json.error) {
      console.log('Error creating folder:', json.error);
      return { success: false, folderId: null };
    }
    console.log('Folder created:', json);
    return { success: true, folderId: json.id };
  } catch (error) {
    console.log('Error creating folder:', error);
    return { success: false, folderId: null };
  }
};
