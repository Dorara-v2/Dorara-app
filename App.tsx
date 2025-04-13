import { RootNavigator } from 'navigation/RootNavigator';
import './global.css';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme } from 'nativewind';
import { useEffect } from 'react';
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p"
import { DMSans_400Regular } from "@expo-google-fonts/dm-sans"
import { useFonts } from 'expo-font';



export default function App() {
  const [loaded, error] = useFonts({
    PressStart2P_400Regular, 
    DMSans_400Regular
  })
  
  useEffect(() => {
  const getColorScheme = async () => {
    try{
      const Scheme = await AsyncStorage.getItem('colorScheme')
      if(!Scheme){
        console.log('No color scheme found')
        colorScheme.set('system')
        return
      }
      colorScheme.set(Scheme as "light" | "dark" | "system")
    }
    catch (error) {
      colorScheme.set('system')
      console.error('Error getting color scheme:', error);
    }
  }
  getColorScheme()
  // colorScheme.set('light')
}, [])
if (!loaded) {
  return null;
}
  return (
    <>
    <RootNavigator />
  </>
  );
}
