import { NavigationContainer } from '@react-navigation/native';
import GlobalLoading from 'components/GlobalLoading';
import OnboardingNavigator from './OnboardingNavigator';
import MainNavigator from './MainNavigator';
import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { GUEST_USER, useUserStore } from 'store/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenContent from 'components/ScreenContent';
import { Image } from 'react-native';
import BackupScreen from 'screens/BackupScreen';

export const RootNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const { setUser, authState, setAuthState } = useUserStore();
  const [needsBackup, setNeedsBackup] = useState(false);

  const onAuthStateChanged = async (user: any) => {
    if (user) {
      const hasBackup = await AsyncStorage.getItem(`${user.uid}-backupDone`);
      setNeedsBackup(!hasBackup);
      setUser(user);
      setAuthState('authenticated');
    }
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    AsyncStorage.getItem('userUsagePref').then((value) => {
      if (value === 'offline') {
        setUser(GUEST_USER);
        setAuthState('guest');
        setInitializing(false);
        return;
      }
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  if (authState === 'unauthenticated' && !initializing) {
    return (
      <NavigationContainer>
        <OnboardingNavigator />
        <GlobalLoading />
      </NavigationContainer>
    );
  } else if (!initializing)
    return (
      <NavigationContainer>
        {needsBackup ? (
          <BackupScreen onBackupComplete={() => setNeedsBackup(false)} />
        ) : (
          <MainNavigator />
        )}

        <GlobalLoading />
      </NavigationContainer>
    );
  else if (initializing)
    return (
      <ScreenContent className="flex flex-row items-center justify-center">
        <Image
          source={require('../assets/puffBlink.gif')}
          className="mb-2 h-64 w-64"
          resizeMode="contain"
        />
      </ScreenContent>
    );
};
