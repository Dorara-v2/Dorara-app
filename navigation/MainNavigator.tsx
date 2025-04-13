import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import SettingsScreen from 'screens/Settings';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();

export default function MainNavigator() {
  

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: 'Settings',
          headerTitleAlign: 'center',
          headerLeft: () => {
            const navigation = useNavigation();
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Stack.Navigator>
  );
}
