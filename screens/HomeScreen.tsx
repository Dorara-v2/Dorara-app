import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { Image, TouchableOpacity } from 'react-native';
import { useLoadingStore } from 'store/loadingStore';
import { useUserStore } from 'store/userStore';
import { signInWithGoogle } from 'utils/googleOauth';

export default function HomeScreen() {
  const { setLoading, setContent } = useLoadingStore();
  const { user, signOut } = useUserStore();
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
        onPress={signInWithGoogle}
        className="mb-4 rounded-xl bg-[#f3a49d] px-6 py-4">
        <Typo color="#000" className="text-center text-lg font-bold text-white">
          Sign in
        </Typo>
      </TouchableOpacity>
    </ScreenContent>
  );
}
