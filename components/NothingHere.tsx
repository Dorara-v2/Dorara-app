import { Image } from "react-native"
import ScreenContent from "./ScreenContent"
import { Typo } from "./Typo"




export const NothingHere = () => {
    return (
        <ScreenContent className="flex-1 items-center justify-center py-8 h-full">
                                    <Image source={require("../assets/puffLick.png")} className="w-64 h-64 " resizeMode="contain"/>
                                    <Typo className="text-xl mt-4">Nothing Here</Typo>
                                </ScreenContent>
    )
}