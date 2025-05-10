import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { useEffect, useRef, useState } from 'react';
import { Typo } from 'components/Typo';
import { _Text, Alert, Image, Modal, SafeAreaView, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { MainStackParamList } from 'navigation/MainNavigator';
import { useColorScheme } from 'nativewind';
import { MaterialIcon } from 'components/MaterialIcon';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import { updateDriveFileContent } from 'utils/driveDirectory/updateFile';
import { useSQLiteContext } from 'expo-sqlite';
import { useLoadingStore } from 'store/loadingStore';
import * as ImagePicker from 'expo-image-picker';

type NoteEditorRouteProp = RouteProp<MainStackParamList, 'NoteEditor'>;
export default function NoteEditor() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const route = useRoute<NoteEditorRouteProp>();
  const { filename, content, path, file } = route.params;
  const { setContent, setLoading } = useLoadingStore();
  const [menuVisible, setMenuVisible] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('https://');
  const [linkPosition, setLinkPosition] = useState<{ index: number } | null>(null);

  const saveContent = async () => {
    try {
      const filePath = `${path}/${filename}.html`;
      if (_editor.current) {
        _editor.current.getHtml().then(async (html) => {
          FileSystem.writeAsStringAsync(filePath, html);
          const updatedInDrive = await updateDriveFileContent(file.driveId!, html);
          if (!updatedInDrive) {
            console.log('Error updating file in Drive');
            await db.runAsync(
              `
                INSERT INTO note_sync (id, operation, updatedAt, source) VALUES (?, ?, ?, ?)
                `,
              [file.id, 'update', Date.now(), 'local']
            );
          }
        });
      }
      ToastAndroid.show('File saved successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const _editor = useRef<QuillEditor>(null);
  const _toolbar = useRef<QuillToolbar>(null);

  const customHandler = async (name: string) => {
    if (name === 'image') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        console.log(result.assets[0].uri);
        if (_editor.current) {
          try {
            _editor.current.getSelection().then((range) => {
              _editor.current?.insertEmbed(range.index, 'image', 'file:///data/user/0/com.calc.dorara/cache/ImagePicker/65923008-af0d-4799-9a67-f85bb24fa7ba.jpeg');
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    } else if (name === 'link') {
      if (_editor.current) {
        try {
          _editor.current.getSelection().then((range) => {
            if (range) {
              setLinkPosition({ index: range.index });
              _editor.current?.getText(range.index, range.length).then((selectedText) => {
                setLinkText(selectedText || '');
                setLinkModalVisible(true);
              });
            } else {
              setLinkPosition({ index: 0 });
              setLinkText('');
              setLinkModalVisible(true);
            }
          });
        } catch (error) {
          console.log('Error getting selection:', error);
        }
      }
    }
  };

  const handleInsertLink = () => {
    if (!linkPosition) return;

    if (_editor.current) {
      const index = linkPosition.index;

      if (linkText.trim()) {
        if (linkText) {
          _editor.current.deleteText(index, linkText.length);
        }

        _editor.current.insertEmbed(index, 'link', linkUrl)
      
      } else {
        _editor.current.insertEmbed(index, 'link', linkUrl)
      }

      setLinkModalVisible(false);
      setLinkText('');
      setLinkUrl('https://');
    }
  };

  useEffect(() => {
    setContent('Loading...');
    if (_editor.current) {
      _editor.current.on('editor-change', () => {
        setEditorReady(true);
        setLoading(false);
      });
    }
  }, [_editor]);
  return (
    <SafeAreaView className={`flex-1 ${colorScheme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
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

      <QuillToolbar
        ref={_toolbar}
        container="avoiding-view"
        editor={_editor}
        options={[
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          [{ header: 1 }, { header: 2 }, { header: 3 }],
          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
        ]}
        theme={colorScheme === 'dark' ? 'light' : 'dark'}
        custom={{
          handler: customHandler,
          actions: ['image', 'link'],
        }}
      />
      <QuillEditor
        theme={{
          background: colorScheme === 'dark' ? '#171717' : 'white',
          color: colorScheme === 'dark' ? 'white' : 'black',
          placeholder: 'gray',
        }}
        ref={_editor}
        initialHtml={content}
        defaultFontFamily="Monospace"
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={linkModalVisible}
        onRequestClose={() => setLinkModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            className="w-11/12 max-w-md p-4 rounded-lg"
            style={{ backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : 'white' }}
          >
            <Typo className="text-xl font-bold mb-4">Insert Link</Typo>

            <View className="mb-4">
              <Typo className="mb-2">Text to display:</Typo>
              <TextInput
                className="border p-2 rounded-md mb-2"
                style={{
                  borderColor: colorScheme === 'dark' ? '#444' : '#ccc',
                  color: colorScheme === 'dark' ? 'white' : 'black',
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
                }}
                placeholder="Link text (optional)"
                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                value={linkText}
                onChangeText={setLinkText}
              />
            </View>

            <View className="mb-6">
              <Typo className="mb-2">URL:</Typo>
              <TextInput
                className="border p-2 rounded-md"
                style={{
                  borderColor: colorScheme === 'dark' ? '#444' : '#ccc',
                  color: colorScheme === 'dark' ? 'white' : 'black',
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
                }}
                placeholder="https://example.com"
                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                value={linkUrl}
                onChangeText={setLinkUrl}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            <View className="flex-row justify-end gap-x-2">
              <TouchableOpacity
                className="px-4 py-2 rounded-md"
                style={{ backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0' }}
                onPress={() => {
                  setLinkModalVisible(false);
                  setLinkText('');
                  setLinkUrl('https://');
                }}
              >
                <Typo>Cancel</Typo>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-4 py-2 rounded-md"
                style={{ backgroundColor: '#f3a49d' }}
                onPress={handleInsertLink}
              >
                <Typo className="text-white">Insert</Typo>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
