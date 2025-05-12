import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthState } from 'store/userStore';

export const updateDriveFileContent = async (
  fileId: string,
  content: string,
  authState: AuthState
): Promise<{ success: boolean }> => {
  if(authState !== 'authenticated') {
    return { success: false };
  }
  try {
    const { accessToken } = await GoogleSignin.getTokens();
    if (!accessToken) {
      console.log('No token found');
      return { success: false };
    }
    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'text/html',
        },
        body: content,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Drive API error:', errorData);

      if (response.status === 401) {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signInSilently();
        return { success: false };
      }

      return { success: false };
    }

    console.log('File updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating file:', error);
    return { success: false };
  }
};
