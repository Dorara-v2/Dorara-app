import { createStackNavigator } from "@react-navigation/stack";
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