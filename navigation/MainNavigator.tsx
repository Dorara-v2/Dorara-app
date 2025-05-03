import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import SettingsScreen from 'screens/Settings';
import NoteEditor from 'screens/NoteEditor';
import TermsOfServiceScreen from 'screens/TermsOfService';
import { useEffect } from 'react';
import {
  requestNotificationPermission,
  setNotificationChannelAsync,
} from 'utils/NotificationPerms';
import { Note } from 'utils/types';

export type MainStackParamList = {
  Drawer: undefined;
  Settings: undefined;
  NoteEditor: {
    filename: string;
    content: string;
    path: string;
    file: Note;
  };
  TermsOfServices: undefined;
};
const Stack = createStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  useEffect(() => {
    requestNotificationPermission();
    setNotificationChannelAsync();
  }, []);
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
        name="NoteEditor"
        component={NoteEditor}
        options={{
          headerShown: false,
          title: 'Note Editor',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="TermsOfServices"
        component={TermsOfServiceScreen}
        options={{
          headerShown: true,
          title: 'Terms of Service',
        }}
      />
    </Stack.Navigator>
  );
}
