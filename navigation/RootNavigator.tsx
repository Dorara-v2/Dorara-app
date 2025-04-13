import { NavigationContainer } from "@react-navigation/native"
import GlobalLoading from "components/GlobalLoading"
import DrawerNavigator from "./DrawerNavigator"
import OnboardingNavigator from "./OnboardingNavigator"
import { StatusBar } from "expo-status-bar"
import MainNavigator from "./MainNavigator"


export const RootNavigator = () => {
    const loggedIn = false
    return (
        <NavigationContainer>
        
        {
            loggedIn ? <MainNavigator /> : <OnboardingNavigator />
        }
        <GlobalLoading />
        </NavigationContainer>
    )
    }



