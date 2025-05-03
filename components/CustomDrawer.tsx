import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { getDrawerColors } from 'utils/colors';

const CustomDrawer = (props: any) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const Colors = getDrawerColors(colorScheme);
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View className="flex-1 pt-4">
        <DrawerItemList {...props} />
      </View>

      <View className="border-t border-gray-200 p-4 dark:border-neutral-700">
        <TouchableOpacity
          onPress={() => {
            setTimeout(() => {
              navigation.navigate('Settings');
            }, 200);
          }}
          className="flex-row items-center justify-between space-x-2">
          <Text style={{ color: Colors.inactiveTint }} className="text-lg font-semibold">
            Settings
          </Text>
          <MaterialIcons name="settings" size={24} color={Colors.inactiveTint} />
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
