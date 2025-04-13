import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from "./DrawerNavigator";
import SettingsScreen from "screens/Settings";
import { Touchable, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";



const Stack = createStackNavigator()


export default function MainNavigator() {
    const navigation = useNavigation()
    return (
        <Stack.Navigator
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen
                name="Drawer"
                component={DrawerNavigator}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        headerShown: true,
                        title: "Settings",
                        headerTitleAlign: "center",
                        headerLeft: () => (
                            <TouchableOpacity
                                
                                onPress={() => {
                                    navigation.goBack()
                                }}
                            >
                                <Ionicons name="arrow-back" size={24} color="black" />
                                </TouchableOpacity>
                        )
                    }}
                />
        </Stack.Navigator>
    )
}