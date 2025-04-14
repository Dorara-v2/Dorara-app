import { useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { useState, useEffect, createRef } from 'react';
import { NOTES_BASE_PATH } from 'utils/offlineDirectory/createDoraraFolder';
import ScreenContent from "components/ScreenContent";
import { Typo } from "components/Typo";
import { TextInput } from 'react-native-gesture-handler';
import { Text, ToastAndroid, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MarkdownTextInput, parseExpensiMark } from '@expensify/react-native-live-markdown';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import { StyleSheet } from 'react-native';

export default function NoteEditor() {
    const route = useRoute();
    const { fileName, content, path } = route.params as { 
        fileName: string;
        content: string;
        path: string;
    };
    const [noteContent, setNoteContent] = useState(content);

    const saveContent = async () => {
        try {
            const filePath = `${NOTES_BASE_PATH}${path}/${fileName}`;
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
                {fileName}
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

