import { NavigationProp, useNavigation } from '@react-navigation/native';
import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { MainStackParamList } from 'navigation/MainNavigator';
import { Image, TouchableOpacity } from 'react-native';
import { useLoadingStore } from 'store/loadingStore';
import { useUserStore } from 'store/userStore';
import { onlineFlow } from 'utils/onlineFlow';
import * as Notifications from 'expo-notifications';
import { useSQLiteContext } from 'expo-sqlite';
import { createDriveFolder } from 'utils/driveDirectory/createFolder';
import { getDoraraFolderId } from 'utils/driveDirectory/findOrCreateDoraraFolder';
import { useEffect } from 'react';
import { useNotesStore } from 'store/notesStore';
export default function HomeScreen() {
  const { setLoading, setContent } = useLoadingStore();
  const { user, signOut } = useUserStore();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  // console.log(auth().currentUser);
  const db = useSQLiteContext()

  
  // getDoraraFolderId().then(id => console.log(id))
  // useEffect(() => {
  //   createDriveFolder('new folder', '1B_fCdOUWG8TCTdiPE9CEF7Lwp3SnBYTz')
  // },[])
  const { folders } = useNotesStore();
  console.log(folders);
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
      <TouchableOpacity onPress={() => signOut(db)} className="mb-4 rounded-xl bg-[#f3a49d] px-6 py-4">
        <Typo color="#000" className="text-center text-lg font-bold text-white">
          Sign Out
        </Typo>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onlineFlow(db)} className="mb-4 rounded-xl bg-[#f3a49d] px-6 py-4">
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
      {/* <TouchableOpacity
        onPress={scheduleNotification}
        className="mb-4 rounded-xl bg-[#f3a49d] px-6 py-4">
        <Typo color="#000" className="text-center text-lg font-bold text-white">
          Schedule Notification
        </Typo>
      </TouchableOpacity> */}
    </ScreenContent>
  );
}
