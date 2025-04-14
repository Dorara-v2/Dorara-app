import ScreenContent from "components/ScreenContent";
import { Typo } from "components/Typo";
import { Image, TouchableOpacity } from "react-native";
import { useLoadingStore } from "store/loadingStore";
import { useUserStore } from "store/userStore";
import { googleSignOut } from "utils/googleOauth";


export default function HomeScreen() {
    
    const { setLoading, setContent } = useLoadingStore();
    const {user, signOut} = useUserStore();
    // createFolderInDrive('Dorara')
    return (
        <ScreenContent>
            <TouchableOpacity onPress={() => {
                setContent("setting things up for you")
                setLoading(true)
                setTimeout(() => {
                    setLoading(false)
                }, 2000);
            }}>
                <Typo className={"text-2xl font-semibold"}>
                    Loading
                </Typo>
                </TouchableOpacity>
                <Typo className="text-3xl font-bold text-center">
                    Welcome to Dorara
                </Typo>
                {/* <Image src={user.photoURL} className="w-24 h-24 rounded-full mx-auto mt-4" /> */}
                <TouchableOpacity onPress={signOut} className="bg-[#f3a49d] rounded-xl px-6 py-4 mb-4">
                    <Typo color="#000" className="text-white text-lg text-center font-bold">
                        Sign Out
                    </Typo>
                </TouchableOpacity>
        </ScreenContent>
    )
}