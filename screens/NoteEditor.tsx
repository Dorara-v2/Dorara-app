import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { createRef, LegacyRef, useRef, useState } from 'react';
import { NOTES_BASE_PATH } from 'utils/offlineDirectory/createDoraraFolder';
import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MainStackParamList } from 'navigation/MainNavigator';
import { useColorScheme } from 'nativewind';
import { MaterialIcon } from 'components/MaterialIcon';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import { updateDriveFileContent } from 'utils/driveDirectory/updateFile';
import { useSQLiteContext } from 'expo-sqlite';

type NoteEditorRouteProp = RouteProp<MainStackParamList, 'NoteEditor'>;
export default function NoteEditor() {
    const db = useSQLiteContext();
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const route = useRoute<NoteEditorRouteProp>();
  const { filename, content, path, file } = route.params;
  const [noteContent, setNoteContent] = useState(content);
  const [menuVisible, setMenuVisible] = useState(false);
  console.log(file)
  const saveContent = async () => {
    try {
      const filePath = `${path}/${filename}.html`;
      if(_editor.current) {
         _editor.current.getHtml().then(async (html) => {
            FileSystem.writeAsStringAsync(filePath, html)
            const updatedInDrive = await updateDriveFileContent(file.driveId!, html)
            if(!updatedInDrive) {
              console.log("Error updating file in Drive");
              await db.runAsync(`
                INSERT INTO note_sync (id, operation, updatedAt, source) VALUES (?, ?, ?, ?)
                `, [file.id, 'update', Date.now(), 'local'])
            }
        })
      }
      ToastAndroid.show('File saved successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error saving file:', error);
    }
    
  };

  const _editor = useRef<QuillEditor>(null);
  const _toolbar = useRef<QuillToolbar>(null);

  return (
    <SafeAreaView className={`flex-1 ${colorScheme === "dark" ? 'bg-neutral-900' : 'bg-white'}`}>
      <View className="mb-5 flex-row items-center justify-between px-4">
        <View className="flex-row items-center gap-x-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcon name="arrow-back" size={24} />
          </TouchableOpacity>
          <Typo className="text-2xl font-bold">{filename}</Typo>
        </View>

        <View className="flex-row items-center justify-between gap-x-2">
          <TouchableOpacity onPress={saveContent} className="rounded-full p-2">
            <MaterialIcon name="done-all" size={24} color="#f3a49d" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMenuVisible(true)} className="rounded-full p-2">
            <MaterialIcon name="more-vert" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {menuVisible && (
        <View
          className="absolute right-4 top-16 z-10 w-48 rounded-lg"
          style={{
            backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : 'white',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
          <TouchableOpacity
            className="flex-row items-center p-3"
            onPress={() => {
              // Add menu action here
              setMenuVisible(false);
            }}>
            <MaterialIcon name="content-copy" size={24} color="#f3a49d" />
            <Typo className="ml-2">Copy Content</Typo>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200" />

          <TouchableOpacity
            className="flex-row items-center p-3"
            onPress={() => {
              setMenuVisible(false);
            }}>
            <MaterialIcon name="share" size={24} color="#f3a49d" />
            <Typo className="ml-2">Share</Typo>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200" />

          <TouchableOpacity
            className="flex-row items-center p-3"
            onPress={() => setMenuVisible(false)}>
            <MaterialIcon name="close" size={24} color="#f3a49d" />
            <Typo className="ml-2">Close</Typo>
          </TouchableOpacity>
        </View>
      )}

     <QuillToolbar ref={_toolbar} container="avoiding-view" editor={_editor} options="full" theme={colorScheme === "dark" ? "light": "dark"} />
      <QuillEditor
          theme={{background: colorScheme === 'dark' ? '#171717' : 'white', color: colorScheme === 'dark' ? 'white': 'black', placeholder: "gray"}}
        ref={_editor}
        initialHtml={content}
        defaultFontFamily='Monospace'
      />

      </SafeAreaView>
  );
}

