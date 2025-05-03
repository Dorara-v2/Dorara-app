import { View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Typo } from 'components/Typo';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';

interface CreateDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  type: 'file' | 'folder';
  label: string;
  placeholder: string;
  success: string;
}

export const CreateDialog = ({
  visible,
  onClose,
  onSubmit,
  type,
  label,
  placeholder,
  success,
}: CreateDialogProps) => {
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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <View
          className="w-[80%] rounded-lg p-4"
          style={{
            backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : 'white',
          }}>
          <Typo className="mb-4 text-xl font-semibold">{label}</Typo>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={placeholder}
            className="mb-4 rounded-lg border border-gray-300 p-2 dark:border-gray-700"
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            style={{
              color: colorScheme === 'dark' ? '#fff' : '#000',
            }}
            autoFocus
          />

          <View className="flex-row justify-end space-x-2">
            <TouchableOpacity onPress={onClose} className="px-4 py-2">
              <Typo>Cancel</Typo>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit} className="rounded-lg bg-[#f3a49d] px-4 py-2">
              <Typo className="text-white">{success}</Typo>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
