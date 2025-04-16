import { MaterialIcons } from "@expo/vector-icons"
import { useColorScheme } from "nativewind"



type MaterialIconParams = {
    size: number
    name: keyof typeof MaterialIcons.glyphMap
    color?: string
}


export const MaterialIcon = ({size, name, color}: MaterialIconParams) => {
    const { colorScheme } = useColorScheme()
    return (
        <MaterialIcons name={name} size={size} color={color ? color : colorScheme === 'dark' ? 'white' : 'black'} />
    )
}