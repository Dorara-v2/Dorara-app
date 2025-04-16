import { MaterialIcons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "components/CustomDrawer";
import CustomHeader from "components/CustomHeader";
import { MaterialIcon } from "components/MaterialIcon";
import { useColorScheme } from "nativewind";
import HomeScreen from "screens/HomeScreen";
import NotesScreen from "screens/NotesScreen";
import { getDrawerColors } from "utils/colors";




const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const { colorScheme } = useColorScheme()
    const Colors = getDrawerColors(colorScheme)
  return (
    <Drawer.Navigator
        screenOptions={{
            header: () => <CustomHeader />,
            headerShown: true,
            drawerActiveTintColor: Colors.activeTint,
            drawerInactiveTintColor: Colors.inactiveTint,
            drawerStyle: {
                width: 250,
                backgroundColor: Colors.bg
                
            }
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} 
        options={{
            drawerIcon: ({ color }) => (
                <MaterialIcon name="home" size={30} color={color} />
            ),
        }}
      />
      <Drawer.Screen name="Todo/Tasks" component={HomeScreen} 
        options={{
            drawerIcon: ({ color }) => (
                <MaterialIcon name="checklist" size={30} color={color} />
            ),
        }}
      />
      <Drawer.Screen name="Notes" component={NotesScreen} 
        options={{
            drawerIcon: ({ color }) => (
                <MaterialIcon name="notes" size={30} color={color} />
            ),
        }}
      />
      <Drawer.Screen name="Bookmarks" component={HomeScreen} 
        options={{
            drawerIcon: ({ color }) => (
                <MaterialIcon name="bookmark" size={30} color={color} />
            ),
        }}
      />
      <Drawer.Screen name="Routines" component={HomeScreen} 
        options={{
            drawerIcon: ({color}) => (
                <MaterialIcon name="schedule" size={30} color={color} />
            )
        }}
      />
      <Drawer.Screen name="Expense" component={HomeScreen} 
        options={{
            drawerIcon: ({color}) => (
                <MaterialIcon name="currency-rupee" size={30} color={color} />
            )

        }}
        />
    </Drawer.Navigator>
  );
}