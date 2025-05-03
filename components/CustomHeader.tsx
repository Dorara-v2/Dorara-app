import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useGlobalSearchStore } from 'store/globalSearchStore';
import { useColorScheme } from 'nativewind';
import { getCustomHeaderColors } from 'utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomHeader = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { searchText, setSearchText, clearSearchText } = useGlobalSearchStore();
  const { colorScheme, setColorScheme } = useColorScheme();
  const Colors = getCustomHeaderColors(colorScheme);

  const toggleColorScheme = async () => {
    try {
      const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
      await AsyncStorage.setItem('colorScheme', newScheme);
      setColorScheme(newScheme);
    } catch (error) {
      console.error('Error saving color scheme:', error);
    }
  };
  return (
    <View
      className="flex-row items-center px-4 py-3 shadow-lg"
      style={{ backgroundColor: Colors.bg }}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()} className="mr-3 p-1">
        <MaterialIcons name="menu" size={30} color={Colors.icon} />
      </TouchableOpacity>

      <View className="relative flex-1">
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search"
          placeholderTextColor="#999"
          style={{
            backgroundColor: Colors.searchBg,
            color: Colors.text,
          }}
          className="h-10 rounded-lg bg-neutral-100 pl-3 pr-10  text-black "
        />

        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => clearSearchText()}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform">
            <Text className="text-3xl font-bold text-gray-500">×</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={toggleColorScheme}>
        <MaterialIcons
          name={colorScheme === 'dark' ? 'sunny' : 'dark-mode'}
          size={30}
          color={Colors.icon}
          className="ml-3"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;
