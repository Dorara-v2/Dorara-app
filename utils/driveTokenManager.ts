import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const ACCESS_TOKEN_KEY = 'googleAccessToken';
const EXPIRES_AT_KEY = 'googleAccessTokenExpiresAt';

export async function setDriveAccessToken() {
  try {
    const tokens = await GoogleSignin.getTokens();
    const accessToken = tokens.accessToken;
    const expiresAt = Date.now() + 3600 * 1000;
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString());

    return accessToken;
  } catch (err) {
    console.error('Error setting Google access token:', err);
    return null;
  }
}

export async function getDriveAccessToken(): Promise<string | null> {
  const isExpired = await isAccessTokenExpired();

  if (isExpired) {
    return await setDriveAccessToken();
  }

  return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function isAccessTokenExpired(): Promise<boolean> {
  const expiresAtStr = await AsyncStorage.getItem(EXPIRES_AT_KEY);
  if (!expiresAtStr) return true;

  const expiresAt = parseInt(expiresAtStr, 10);
  return Date.now() >= expiresAt;
}

export async function deleteAcessToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(EXPIRES_AT_KEY);
  } catch (err) {
    console.error('Error deleting Google access token:', err);
  }
}
