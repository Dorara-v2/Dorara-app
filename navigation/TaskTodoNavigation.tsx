import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcon } from 'components/MaterialIcon';
import { useColorScheme } from 'nativewind';
import { TaskScreen } from 'screens/Task';
import { TodoScreen } from 'screens/Todo';
import { getTodoScreenColors } from 'utils/colors';

const Tabs = createBottomTabNavigator();

export const TaskTodoNavigation = () => {
  const { colorScheme } = useColorScheme();
  const colors = getTodoScreenColors(colorScheme);
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActiveTint,
        tabBarInactiveTintColor: colors.tabInactiveTint,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 0,
          height: 50,
          borderRadius: 10,
        },
      }}>
      <Tabs.Screen
        name="Scheduled"
        component={TodoScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcon name="schedule" size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Unscheduled"
        component={TaskScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialIcon name="check-circle" size={30} color={color} />,
        }}
      />
    </Tabs.Navigator>
  );
};
