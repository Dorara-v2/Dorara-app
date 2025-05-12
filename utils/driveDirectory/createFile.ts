import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { findDoraraFolderId } from './findOrCreateDoraraFolder';
import { AuthState } from 'store/userStore';

export const createDriveFile = async (
  fileName: string,
  parentFolderId: string,
  authState: AuthState
): Promise<{ success: boolean; fileId: string | null }> => {
  if(authState !== 'authenticated') {
    return { success: false, fileId: null };
  }
  try {
    const { accessToken } = await GoogleSignin.getTokens();
    if (!accessToken) {
      console.log('No token found');
      return { success: false, fileId: null };
    }
    if (!parentFolderId) {
      parentFolderId = (await findDoraraFolderId()) as string;
    }
    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fileName,
        mimeType: 'text/markdown',
        parents: [parentFolderId],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Drive API error:', errorData);

      if (response.status === 401) {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signInSilently();
        return { success: false, fileId: null };
      }

      return { success: false, fileId: null };
    }

    const json = await response.json();
    console.log('File created:', json);
    return { success: true, fileId: json.id };
  } catch (error) {
    console.error('Error creating file:', error);
    return { success: false, fileId: null };
  }
};
