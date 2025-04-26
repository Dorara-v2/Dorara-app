import { NavigationContainer } from "@react-navigation/native"
import GlobalLoading from "components/GlobalLoading"
import OnboardingNavigator from "./OnboardingNavigator"
import MainNavigator from "./MainNavigator"
import { useEffect, useState } from "react"
import auth from "@react-native-firebase/auth"
import { GUEST_USER, useUserStore } from "store/userStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ScreenContent from "components/ScreenContent"
import { Image } from "react-native"


export const RootNavigator = () => {
    const [initializing, setInitializing] = useState(true);
    const {user, setUser, authState, setAuthState} = useUserStore()

    const onAuthStateChanged = (user: any) => {
        if(user){
            setUser(user);
            setAuthState('authenticated')
        } 
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        AsyncStorage.getItem('userUsagePref').then((value) => {
            // console.log('userUsagePref', value)
            if(value === 'offline'){
                setUser(GUEST_USER)
                setAuthState('guest')
                setInitializing(false)
                return
            }
        })
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
      }, []);
    if(authState === 'unauthenticated' && !initializing) {
        return (
            <NavigationContainer>
                <OnboardingNavigator />
                <GlobalLoading />
            </NavigationContainer>
        )
    }
    else if(!initializing) return (
        <NavigationContainer>
            <MainNavigator />
            <GlobalLoading />
        </NavigationContainer>
    )
    else if(initializing) return(
        <ScreenContent className="flex flex-row items-center justify-center">
            <Image source={require('../assets/puffBlink.gif')} className='w-64 h-64 mb-2' resizeMode='contain' />
        </ScreenContent>
    )
    
}




