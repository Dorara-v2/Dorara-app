import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import SettingsScreen from 'screens/Settings';
import { Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import NoteEditor from 'screens/NoteEditor';
import { MaterialIcon } from 'components/MaterialIcon';
import TermsOfServiceScreen from 'screens/TermsOfService';
import { useSQLiteContext } from 'expo-sqlite';
import { useTodoStore } from 'store/todoStore';
import { Category, Todo } from 'utils/types';
import { useEffect } from 'react';
import { requestNotificationPermission, setNotificationChannelAsync } from 'utils/NotificationPerms';


export type MainStackParamList = {
  Drawer: undefined;
  Settings: undefined;
  NoteEditor: {
    filename: string;
    content: string;
    path: string
  }
  TermsOfServices: undefined
}
const Stack = createStackNavigator<MainStackParamList>();


export default function MainNavigator() {

  useEffect(() => {
    loadTodo();
    requestNotificationPermission()
    setNotificationChannelAsync();
  }, [])
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='NoteEditor'
        component={NoteEditor}
        options={{
          headerShown: false,
          title: 'Note Editor',
          headerTitleAlign: 'center',
          
        }}
        />
        <Stack.Screen
          name='TermsOfServices'
          component={TermsOfServiceScreen}
          options={{
            headerShown: true,
            title: 'Terms of Service',
          }}
          />
    </Stack.Navigator>
  );
}

export const loadTodo = async () => {
  const db = useSQLiteContext();
  const { setTodo, setCategory } = useTodoStore();
  const todos: Todo[] = await db.getAllAsync('SELECT * FROM todos');
  const categories: Category[] = await db.getAllAsync('SELECT * FROM categories');
  setTodo(todos);
  setCategory(categories);
}