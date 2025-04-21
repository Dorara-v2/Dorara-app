import { MaterialIcons } from "@expo/vector-icons"
import { useColorScheme } from "nativewind"
import { MaterialIconName } from "utils/types"



type MaterialIconParams = {
    size: number
    name: MaterialIconName
    color?: string
}


export const MaterialIcon = ({size, name, color}: MaterialIconParams) => {
    const { colorScheme } = useColorScheme()
    return (
        <MaterialIcons name={name} size={size} color={color ? color : colorScheme === 'dark' ? 'white' : 'black'} />
    )
}