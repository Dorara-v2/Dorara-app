import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { Image, TouchableOpacity, View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserStore } from 'store/userStore';
import { offlineFlow } from 'utils/offlineFlow';
import { onlineFlow } from 'utils/onlineFlow';
import { MaterialIcon } from 'components/MaterialIcon';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { OnboardingStackParamList } from 'navigation/OnboardingNavigator';
import { useSQLiteContext } from 'expo-sqlite';

export default function OnboardingSecond() {
  const db = useSQLiteContext();
  const { setAuthState, setUser } = useUserStore();
  const containerAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp<OnboardingStackParamList>>();
  useEffect(() => {
    Animated.spring(containerAnim, {
      toValue: 1,
      damping: 15,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScreenContent>
      <Animated.View
        className="flex-1 px-6"
        style={{
          opacity: containerAnim,
          transform: [
            {
              translateY: containerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}>
        <View className="mb-8 items-center">
          <Image
            source={require('../assets/puffCloud.png')}
            className="h-64 w-64"
            resizeMode="contain"
          />
          <Typo className="mb-3 text-center text-3xl font-bold">
            Use{' '}
            <Typo color="#f3a49d" className="text-4xl font-bold">
              Dorara
            </Typo>{' '}
            your way
          </Typo>
          <Typo color="#666666" className="text-center text-lg">
            Manage everything offline on your device — or sign in and sync with Google Drive for
            backup and cross-device access.
          </Typo>
        </View>

        {/* Options Section */}
        <View className="flex-1 justify-center">
          {/* Offline Option */}
          <View
            className="mb-4 rounded-xl bg-[#F5F5F5] p-6 shadow-sm dark:bg-[#212121]"
            // activeOpacity={0.8}
            // onPress={() => offlineFlow(setAuthState, setUser)}
          >
            <View className="mb-3 flex-row items-center">
              <MaterialIcons name="phone-android" size={24} color="#f3a49d" />
              <Typo className="ml-2 text-xl font-bold">Totally Offline</Typo>
            </View>
            <View className="ml-8">
              <Typo color="#949191" className="mb-1">
                → Keep everything on your device, private and fast.
              </Typo>
              <Typo color="#949191">→ No sign-in required.</Typo>
            </View>
            <TouchableOpacity
              onPress={() => offlineFlow(setAuthState, setUser)}
              className="mt-4 flex flex-row items-center justify-center gap-x-3 rounded-xl bg-[#f3a49d] p-3">
              <MaterialIcon name="phone-android" size={24} />
              <Typo className="text-lg font-bold ">Continue Offline</Typo>
            </TouchableOpacity>
          </View>

          {/* Online Option */}
          <View
            className="rounded-xl bg-[#F5F5F5] p-6 shadow-sm dark:bg-[#212121]"
            // activeOpacity={0.8}
            // onPress={onlineFlow}
          >
            <View className="mb-3 flex-row items-center">
              <MaterialIcon name="cloud-queue" size={24} color="#f3a49d" />
              <Typo className="ml-2 text-xl font-bold">Sync with Google</Typo>
            </View>
            <View className="ml-8">
              <Typo color="#949191" className="mb-1">
                → Backup your data to Google Drive.
              </Typo>
              <Typo color="#949191">→ Access your data across devices.</Typo>
            </View>
            <TouchableOpacity
              onPress={() => onlineFlow()}
              className="mt-4 flex flex-row items-center justify-center gap-x-3 rounded-xl bg-[#f3a49d] p-3">
              <Image source={require('../assets/googleIcon.png')} className="h-6 w-6" />
              <Typo className="text-lg font-bold ">Sign in with Google</Typo>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TermsOfService');
            }}>
            <Typo className="mt-4 text-center text-sm font-semibold">
              By continuing, you agree to our{' '}
              <Typo color="#f3a49d" className="font-bold">
                Terms of Service
              </Typo>
            </Typo>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScreenContent>
  );
}
