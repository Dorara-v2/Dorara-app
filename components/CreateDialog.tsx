import { View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Typo } from 'components/Typo';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';

interface CreateDialogProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
    type: 'file' | 'folder';
}

export const CreateDialog = ({ visible, onClose, onSubmit, type }: CreateDialogProps) => {
    const { colorScheme } = useColorScheme();
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onSubmit(name.trim());
            setName('');
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View 
                    className="w-[80%] rounded-lg p-4"
                    style={{ 
                        backgroundColor: colorScheme === "dark" ? "#1f1f1f" : "white"
                    }}
                >
                    <Typo className="text-xl font-semibold mb-4">
                        Create New {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Typo>
                    
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder={`Enter ${type} name`}
                        className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 mb-4"
                        placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
                        style={{ 
                            color: colorScheme === "dark" ? "#fff" : "#000"
                        }}
                        autoFocus
                    />
                    
                    <View className="flex-row justify-end space-x-2">
                        <TouchableOpacity 
                            onPress={onClose}
                            className="px-4 py-2"
                        >
                            <Typo>Cancel</Typo>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={handleSubmit}
                            className="bg-[#f3a49d] px-4 py-2 rounded-lg"
                        >
                            <Typo className="text-white">Create</Typo>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};