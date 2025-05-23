import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthState } from 'store/userStore';

export const deleteDriveFileFolder = async (id: string, authState: AuthState): Promise<boolean> => {
  if(authState !== 'authenticated') {
    return false;
  }
  const token = (await GoogleSignin.getTokens()).accessToken;
  if (!token) {
    console.log('No token found');
    return false;
  }
  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 204) {
      console.log('Folder deleted successfully');
      return true;
    } else {
      console.log('Error deleting folder:', response.status);
      return false;
    }
  } catch (error) {
    console.log('Error deleting folder:', error);
    return false;
  }
};
