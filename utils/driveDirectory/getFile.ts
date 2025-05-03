import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const getDriveFile = async (
  fileId: string
): Promise<{ success: boolean; file: string | null }> => {
  try {
    const { accessToken } = await GoogleSignin.getTokens();
    if (!accessToken) {
      console.log('No token found');
      return { success: false, file: null };
    }
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'text/html',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Drive API error:', errorData);

      if (response.status === 401) {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signInSilently();
        return { success: false, file: null };
      }

      return { success: false, file: null };
    }
    const fileContent = await response.text();
    console.log('File content retrieved successfully');
    return { success: true, file: fileContent };
  } catch (error) {
    console.log('Error retrieving file:', error);
    return { success: false, file: null };
  }
};
