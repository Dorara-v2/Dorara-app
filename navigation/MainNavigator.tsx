import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import SettingsScreen from 'screens/Settings';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import NoteEditor from 'screens/NoteEditor';


export type MainStackParamList = {
  Drawer: undefined;
  Settings: undefined;
  NoteEditor: {
    filename: string;
    content: string;
    path: string
  }
}
const Stack = createStackNavigator<MainStackParamList>();


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
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Stack.Screen
        name='NoteEditor'
        component={NoteEditor}
        options={{
          headerShown: true,
          title: 'Note Editor',
          headerTitleAlign: 'center',
          headerLeft: () => {
            const navigation = useNavigation();
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            );
          },
        }}
        />
    </Stack.Navigator>
  );
}
