import { MaterialIcons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "components/CustomDrawer";
import CustomHeader from "components/CustomHeader";
import { MaterialIcon } from "components/MaterialIcon";
import { useColorScheme } from "nativewind";
import HomeScreen from "screens/HomeScreen";
import NotesScreen from "screens/NotesScreen";
import { getDrawerColors } from "utils/colors";
import { TaskTodoNavigation } from "./TaskTodoNavigation";
import { useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useTodoStore } from "store/todoStore";
import { Category, Folder, Note, Todo } from "utils/types";
import { useNotesStore } from "store/notesStore";




const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const { colorScheme } = useColorScheme()
    const Colors = getDrawerColors(colorScheme)
    const db = useSQLiteContext();
    const { setTodo, setCategory } = useTodoStore();
    const { setNotes, setFolders } = useNotesStore();
    const loadTodo = async () => {
      const todos: Todo[] = await db.getAllAsync('SELECT * FROM todos');
      const categories: Category[] = await db.getAllAsync('SELECT * FROM categories');
      setTodo(todos);
      setCategory(categories);
    }
    const loadNotes = async () => {
      const notes: Note[] = await db.getAllAsync('SELECT * FROM notes');
      const folders: Folder[] = await db.getAllAsync('SELECT * FROM folders');
      setNotes(notes);
      setFolders(folders);
    }
    useEffect(() => {
        loadTodo()
        loadNotes()
    },[db])
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
      <Drawer.Screen name="Todo" component={TaskTodoNavigation} 
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

