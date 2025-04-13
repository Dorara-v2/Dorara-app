import ScreenContent from "components/ScreenContent";
import { Typo } from "components/Typo";
import { Text, Touchable, TouchableOpacity, View } from "react-native";
import { useLoadingStore } from "store/loadingStore";


export default function HomeScreen() {
    const { setLoading, setContent } = useLoadingStore();

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
                    bruh
                </Typo>
        </ScreenContent>
    )
}