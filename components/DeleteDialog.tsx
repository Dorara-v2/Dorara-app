import { Modal, View, TouchableOpacity } from 'react-native';
import { Typo } from './Typo';
import { useColorScheme } from 'nativewind';
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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View
          className="w-[80%] rounded-lg p-4"
          style={{
            backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : 'white',
          }}>
          <View className="mb-4 flex-row items-center">
            <MaterialIcon name="warning" size={24} color="#f3a49d" />
            <Typo className="ml-2 text-xl font-semibold">Delete Item</Typo>
          </View>

          <Typo className="mb-4">
            Are you sure you want to delete "{itemName}"? This action cannot be undone.
          </Typo>

          <View className="flex-row justify-end space-x-2">
            <TouchableOpacity onPress={onClose} className="px-4 py-2">
              <Typo>Cancel</Typo>
            </TouchableOpacity>

            <TouchableOpacity onPress={onDelete} className="rounded-lg bg-[#f3a49d] px-4 py-2">
              <Typo className="text-white">Delete</Typo>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
