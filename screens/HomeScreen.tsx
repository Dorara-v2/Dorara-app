import { NavigationProp, useNavigation } from '@react-navigation/native';
import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { MainStackParamList } from 'navigation/MainNavigator';
import { Image, TouchableOpacity } from 'react-native';
import { useLoadingStore } from 'store/loadingStore';
import { useUserStore } from 'store/userStore';
import { onlineFlow } from 'utils/onlineFlow';
import { useSQLiteContext } from 'expo-sqlite';
import { useNotesStore } from 'store/notesStore';
import { scheduleNotification } from 'utils/notificationManager';
export default function HomeScreen() {
  const { setLoading, setContent } = useLoadingStore();
  const { user, signOut } = useUserStore();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const db = useSQLiteContext();
  const { folders } = useNotesStore();
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
      <TouchableOpacity
        onPress={() => signOut()}
        className="mb-4 rounded-xl bg-[#f3a49d] px-6 py-4">
        <Typo color="#000" className="text-center text-lg font-bold text-white">
          Sign Out
        </Typo>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onlineFlow()}
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
      <TouchableOpacity
        onPress={async () => await scheduleNotification('hi', 'hello', Date.now() + 1000)}
        className="mb-4 rounded-xl bg-[#f3a49d] px-6 py-4">
        <Typo color="#000" className="text-center text-lg font-bold text-white">
          Schedule Notification
        </Typo>
      </TouchableOpacity>
      <Image alt='image' className='w-full h-full' src='file:///data/user/0/com.calc.dorara/cache/ImagePicker/7a36d658-0208-4674-a930-a8f1dd27fa6a.jpeg' />
    </ScreenContent>
  );
}
