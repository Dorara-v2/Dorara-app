import React from 'react'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerNavigationProp,
} from '@react-navigation/drawer'
import { View, Text, TouchableOpacity, Image, Switch } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import { useNavigation } from '@react-navigation/native'
import { getDrawerColors } from 'utils/colors'

const CustomDrawer = (props: any) => {
    const { colorScheme, setColorScheme } = useColorScheme()
    const navigation = useNavigation<DrawerNavigationProp<any>>()
    const Colors = getDrawerColors(colorScheme)
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
   
      <View className="flex-1 pt-4">
        <DrawerItemList {...props} />
      </View>

      <View className="border-t border-gray-200 dark:border-neutral-700 p-4">
        <TouchableOpacity
            onPress={() => {
                setTimeout(() => {
                    navigation.navigate("Settings")
                }, 200)
                
            }}
          className="flex-row items-center space-x-2 justify-between"
        >
          <Text style={{color: Colors.inactiveTint}} className="font-semibold text-lg">Settings</Text>
          <MaterialIcons name="settings" size={24} color={Colors.inactiveTint} />
        </TouchableOpacity>
        
      </View>
    </DrawerContentScrollView>
  )
}

export default CustomDrawer
