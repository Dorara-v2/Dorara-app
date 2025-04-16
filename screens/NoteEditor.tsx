import { RouteProp, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { NOTES_BASE_PATH } from 'utils/offlineDirectory/createDoraraFolder';
import ScreenContent from "components/ScreenContent";
import { Typo } from "components/Typo";
import { TextInput } from 'react-native-gesture-handler';
import { Text, ToastAndroid, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MainStackParamList } from 'navigation/MainNavigator';

type NoteEditorRouteProp = RouteProp<MainStackParamList, 'NoteEditor'>;
export default function NoteEditor() {
    const route = useRoute<NoteEditorRouteProp>();
    const { filename, content, path } = route.params
    const [noteContent, setNoteContent] = useState(content);

    const saveContent = async () => {
        try {
            const filePath = `${NOTES_BASE_PATH}${path}/${filename}`;
            await FileSystem.writeAsStringAsync(filePath, noteContent);
            ToastAndroid.show('File saved successfully', ToastAndroid.SHORT);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    const insertSyntax = (syntax: string, closing: string = syntax) => {
        setNoteContent(prev => prev + `${syntax}${closing}`);
      };

    return (
        <ScreenContent>
            <Typo className="text-2xl font-bold">
                {filename}
            </Typo>
            <TouchableOpacity
                onPress={saveContent}
                >
                    <MaterialIcons name="save" size={24} color="black" />
                    <Typo className="text-lg">Save</Typo>
                </TouchableOpacity> 
                {/* <TextInput
                    multiline
                    value={noteContent}
                    onChangeText={setNoteContent}
                    /> */}
                    <TextInput multiline onChangeText={setNoteContent}>
                        <Text>{noteContent}</Text>
                    </TextInput>

        </ScreenContent>
    );
}

