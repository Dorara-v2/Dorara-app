import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDriveAccessToken } from 'utils/driveTokenManager';

export async function findDoraraFolderId(): Promise<string | null> {
  const token = await getDriveAccessToken();
  if (!token) return null;

  const query = encodeURIComponent(
    "name = 'dorara-v2' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
  );
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  return json?.files?.[0]?.id || null;
}

export async function createDoraraFolder(): Promise<string | null> {
  const token = await getDriveAccessToken();
  if (!token) return null;

  const response = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'dorara-v2',
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  const json = await response.json();
  return json.id || null;
}

const DORARA_FOLDER_ID_KEY = 'doraraFolderId';

export async function setDoraraFolderId(folderId: string) {
  await AsyncStorage.setItem(DORARA_FOLDER_ID_KEY, folderId);
}

export async function deleteDoraraFolderId() {
  await AsyncStorage.removeItem(DORARA_FOLDER_ID_KEY);
}

export async function getDoraraFolderId() {
  return await AsyncStorage.getItem(DORARA_FOLDER_ID_KEY);
}

export async function setupOnlineDrive() {
  let folderId = await findDoraraFolderId();

  if (!folderId) {
    folderId = await createDoraraFolder();
  }

  if (folderId) {
    await setDoraraFolderId(folderId);
    console.log('Dorara Drive folder is ready:', folderId);
  } else {
    console.warn('Failed to setup Dorara folder');
  }
}
