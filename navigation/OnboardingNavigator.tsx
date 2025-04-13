import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "screens/HomeScreen";
import OnboardingFirst from "screens/OnboardingFirst";



const Stack = createStackNavigator();


export default function OnboardingNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                
            }}
        >
            <Stack.Screen
                name="home"
                component={OnboardingFirst}
                />

        </Stack.Navigator>
    );
    }