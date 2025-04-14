import AsyncStorage from "@react-native-async-storage/async-storage"


export const setUserUsagePref = async (pref: string) => {
    await AsyncStorage.setItem('userUsagePref', pref);
}