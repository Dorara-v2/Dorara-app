import { NavigationContainer } from "@react-navigation/native"
import GlobalLoading from "components/GlobalLoading"
import OnboardingNavigator from "./OnboardingNavigator"
import MainNavigator from "./MainNavigator"
import { useEffect, useState } from "react"
import auth from "@react-native-firebase/auth"
import { useUserStore } from "store/userStore"
import { useLoadingStore } from "store/loadingStore"
import AsyncStorage from "@react-native-async-storage/async-storage"


export const RootNavigator = () => {
    const [initializing, setInitializing] = useState(true);
    const {isLoading, setLoading, setContent} = useLoadingStore();
    const {user, setUser, isOffline, setIsOffline} = useUserStore()

    const onAuthStateChanged = (user: any) => {
        if(user){
            setUser(user);
        } 
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        AsyncStorage.getItem('userUsagePref').then((value) => {
            console.log('userUsagePref', value)
            if(value === 'offline'){
                setUser(null)
                setIsOffline(true)
                return
            }
        })
        
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
      }, []);
    if(!user && isOffline===false){
        return (
            <NavigationContainer>
                <OnboardingNavigator />
                <GlobalLoading />
            </NavigationContainer>
        )
    }
    if(user || isOffline===true) return (
        <NavigationContainer>
            <MainNavigator />
            <GlobalLoading />
        </NavigationContainer>
    )
    
}




