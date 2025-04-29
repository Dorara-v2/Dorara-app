import { getDriveAccessToken } from 'utils/driveTokenManager';

export const createDriveFolder = async (
  folderName: string,
  parentFolderId: string
): Promise<boolean> => {
  const token = await getDriveAccessToken();
  if (!token) {
    console.log('No token found');
    return false;
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
      return false;
    }
    console.log('Folder created:', json);
    return true;
  } catch (error) {
    console.log('Error creating folder:', error);
    return false;
  }
};
