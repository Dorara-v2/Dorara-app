import { NavigationProp, useNavigation } from '@react-navigation/native';
import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { MainStackParamList } from 'navigation/MainNavigator';
import { Image, TouchableOpacity } from 'react-native';
import { useLoadingStore } from 'store/loadingStore';
import { useUserStore } from 'store/userStore';
import { signInWithGoogle } from 'utils/googleOauth';
import { onlineFlow } from 'utils/onlineFlow';
import auth from '@react-native-firebase/auth';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
export default function HomeScreen() {
  const { setLoading, setContent } = useLoadingStore();
  const { user, signOut } = useUserStore();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  // console.log(auth().currentUser);
  const db = useSQLiteContext();

  
  return (
    <ScreenContent>
      <TouchableOpacity
        onPress={() => {
          setContent('setting things up for you');
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }}>
        <Typo className={'text-2xl font-semibold'}>Loading</Typo>
      </TouchableOpacity>
      <Typo className="text-center text-3xl font-bold">{user.displayName}</Typo>
      <Image src={user.photoURL} className="mx-auto mt-4 h-24 w-24 rounded-full" />
      <TouchableOpacity onPress={signOut} className="mb-4 rounded-xl bg-[#f3a49d] px-6 py-4">
        <Typo color="#000" className="text-center text-lg font-bold text-white">
          Sign Out
        </Typo>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onlineFlow}
        className="mb-4 rounded-xl bg-[#f3a49d] px-6 py-4">
        <Typo color="#000" className="text-center text-lg font-bold text-white">
          Sign in
        </Typo>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('TermsOfServices')}
        className="mb-4 rounded-xl bg-[#f3a49d] px-6 py-4">
        <Typo color="#000" className="text-center text-lg font-bold text-white">
          Terms of services
        </Typo>
      </TouchableOpacity>
    </ScreenContent>
  );
}
