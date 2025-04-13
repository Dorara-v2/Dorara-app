import { NavigationContainer } from "@react-navigation/native"
import GlobalLoading from "components/GlobalLoading"
import OnboardingNavigator from "./OnboardingNavigator"
import MainNavigator from "./MainNavigator"
import { useEffect, useState } from "react"
import auth from "@react-native-firebase/auth"
import { useUserStore } from "store/userStore"
import { useLoadingStore } from "store/loadingStore"


export const RootNavigator = () => {
    const [initializing, setInitializing] = useState(true);
    const {isLoading, setLoading, setContent} = useLoadingStore();
    const {user, setUser} = useUserStore()

    const onAuthStateChanged = (user: any) => {
        if(user){
            setUser(user);
        } 
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
      }, []);
    if(!user) {
        return (
            <NavigationContainer>
                <OnboardingNavigator />
                <GlobalLoading />
            </NavigationContainer>
        )
    }
    return (
        <NavigationContainer>
            <MainNavigator />
            <GlobalLoading />
        </NavigationContainer>
    )
    }



