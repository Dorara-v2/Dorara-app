import { Modal, View, TouchableOpacity } from 'react-native';
import { Typo } from './Typo';
import { useColorScheme } from 'nativewind';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialIcon } from './MaterialIcon';

interface DeleteDialogProps {
    visible: boolean;
    onClose: () => void;
    onDelete: () => void;
    itemName: string;
}

export const DeleteDialog = ({ visible, onClose, onDelete, itemName }: DeleteDialogProps) => {
    const { colorScheme } = useColorScheme();

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
                    <View className="flex-row items-center mb-4">
                        <MaterialIcon name="warning" size={24} color="#f3a49d" />
                        <Typo className="text-xl font-semibold ml-2">
                            Delete Item
                        </Typo>
                    </View>
                    
                    <Typo className="mb-4">
                        Are you sure you want to delete "{itemName}"? This action cannot be undone.
                    </Typo>
                    
                    <View className="flex-row justify-end space-x-2">
                        <TouchableOpacity 
                            onPress={onClose}
                            className="px-4 py-2"
                        >
                            <Typo>Cancel</Typo>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={onDelete}
                            className="bg-[#f3a49d] px-4 py-2 rounded-lg"
                        >
                            <Typo className="text-white">Delete</Typo>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};