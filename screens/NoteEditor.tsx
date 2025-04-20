import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { NOTES_BASE_PATH } from 'utils/offlineDirectory/createDoraraFolder';
import ScreenContent from "components/ScreenContent";
import { Typo } from "components/Typo";
import { TextInput } from 'react-native-gesture-handler';
import { Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MainStackParamList } from 'navigation/MainNavigator';
import { useColorScheme } from 'nativewind';
import { MaterialIcon } from 'components/MaterialIcon';

type NoteEditorRouteProp = RouteProp<MainStackParamList, 'NoteEditor'>;
export default function NoteEditor() {
    const navigation = useNavigation();
    const { colorScheme } = useColorScheme();
    const route = useRoute<NoteEditorRouteProp>();
    const { filename, content, path } = route.params;
    const [noteContent, setNoteContent] = useState(content);
    const [menuVisible, setMenuVisible] = useState(false);

    const saveContent = async () => {
        try {
            const filePath = `${NOTES_BASE_PATH}${path}/${filename}`;
            await FileSystem.writeAsStringAsync(filePath, noteContent);
            ToastAndroid.show('File saved successfully', ToastAndroid.SHORT);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    return (
        <ScreenContent>
            <View className="flex-row items-center justify-between mb-5 px-4">
                <View className="flex-row items-center gap-x-4">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcon name='arrow-back' size={24} />
                    </TouchableOpacity>
                    <Typo className="text-2xl font-bold">
                        {filename.slice(0, filename.lastIndexOf('.'))}
                    </Typo>
                </View>
                
                <View className="flex-row items-center justify-between gap-x-2">
                    <TouchableOpacity
                        onPress={saveContent}
                        className="p-2 rounded-full"
                    >
                        <MaterialIcon name="done-all" size={24} color="#f3a49d" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress={() => setMenuVisible(true)}
                        className="p-2 rounded-full"
                    >
                        <MaterialIcon name="more-vert" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            {menuVisible && (
                <View
                    className="absolute z-10 right-4 top-16 rounded-lg w-48"
                    style={{
                        backgroundColor: colorScheme === "dark" ? "#1f1f1f" : "white",
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                    }}
                >
                    <TouchableOpacity
                        className="flex-row items-center p-3"
                        onPress={() => {
                            // Add menu action here
                            setMenuVisible(false);
                        }}
                    >
                        <MaterialIcon name="content-copy" size={24} color="#f3a49d" />
                        <Typo className="ml-2">Copy Content</Typo>
                    </TouchableOpacity>

                    <View className="h-[1px] bg-gray-200" />

                    <TouchableOpacity
                        className="flex-row items-center p-3"
                        onPress={() => {
                            // Add menu action here
                            setMenuVisible(false);
                        }}
                    >
                        <MaterialIcon name="share" size={24} color="#f3a49d" />
                        <Typo className="ml-2">Share</Typo>
                    </TouchableOpacity>

                    <View className="h-[1px] bg-gray-200" />

                    <TouchableOpacity
                        className="flex-row items-center p-3"
                        onPress={() => setMenuVisible(false)}
                    >
                        <MaterialIcon name="close" size={24} color="#f3a49d" />
                        <Typo className="ml-2">Close</Typo>
                    </TouchableOpacity>
                </View>
            )}

            <TextInput multiline onChangeText={setNoteContent}>
                <Typo>{noteContent}</Typo>
            </TextInput>
        </ScreenContent>
    );
}

