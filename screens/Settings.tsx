import { Image, ScrollView, Switch, TouchableOpacity, View } from 'react-native';
import { MaterialIcon } from 'components/MaterialIcon';
import { Typo } from 'components/Typo';
import ScreenContent from 'components/ScreenContent';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { useUserStore } from 'store/userStore';
import { MainStackParamList } from 'navigation/MainNavigator';
import { useState } from 'react';
import { MaterialIconName } from 'utils/types';

export default function Settings() {
    const navigation = useNavigation<NavigationProp<MainStackParamList>>();
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const { user, signOut } = useUserStore();
    const [syncTime, setSyncTime] = useState('5 mins ago');
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

    const handleForceSync = async () => {
        setSyncTime('Just now');
    };

    return (
        <ScreenContent>
            <View className="flex-row items-center p-4">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="mr-4 p-2 rounded-full"
                >
                    <MaterialIcon name="arrow-back" size={24} />
                </TouchableOpacity>
                <Typo className="text-2xl font-bold">Settings</Typo>
            </View>

            <ScrollView className="flex-1 px-4">
                {/* Profile Card */}
                <View className="mb-6 rounded-xl overflow-hidden bg-white dark:bg-[#1f1f1f]">
                    <View className="p-6">
                        <View className="flex-row items-center justify-between mb-4">
                            <Image 
                                source={{ uri: user.photoURL }} 
                                className="w-20 h-20 rounded-full"
                                defaultSource={require('../assets/adaptive-icon.png')}
                            />
                            <TouchableOpacity 
                                className="bg-[#f3a49d] px-4 py-2 rounded-lg flex-row items-center"
                            >
                                <MaterialIcon name="edit" size={20} color="white" />
                                <Typo className="ml-2 text-white font-medium">Edit Profile</Typo>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Typo className="text-2xl font-bold mb-1">{user.displayName}</Typo>
                            <Typo className="text-gray-500">{user.email || 'Guest User'}</Typo>
                        </View>
                    </View>
                </View>

                <SectionTitle icon="cloud" title="Sync & Backup" />
                <View className="mb-6 rounded-xl overflow-hidden bg-white dark:bg-[#1f1f1f]">
                    <SettingItem
                        icon="cloud-done"
                        label="Google Drive"
                        value={user.isGuest ? 'Not Connected' : 'Connected'}
                        valueColor={user.isGuest ? '#f44336' : '#4CAF50'}
                    />
                    <Divider />
                    <SettingItem
                        icon="folder"
                        label="Folder"
                        value="dorara-v2"
                    />
                    <Divider />
                    <SettingItem
                        icon="access-time"
                        label="Last Sync"
                        value={syncTime}
                    />
                    {!user.isGuest && (
                        <>
                            <Divider />
                            <TouchableOpacity
                                onPress={handleForceSync}
                                className="flex-row items-center justify-center p-4 bg-[#f3a49d]/10"
                            >
                                <MaterialIcon name="sync" size={20} color="#f3a49d" />
                                <Typo className="ml-2 text-[#f3a49d] font-medium">Force Sync Now</Typo>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <SectionTitle icon="settings" title="App Settings" />
                <View className="mb-6 rounded-xl overflow-hidden bg-white dark:bg-[#1f1f1f]">
                    <SettingItem
                        icon="dark-mode"
                        label="Dark mode"
                        right={
                            <Switch
                                value={colorScheme === 'dark'}
                                onValueChange={toggleColorScheme}
                                trackColor={{ false: '#767577', true: '#f3a49d' }}
                                thumbColor={colorScheme === 'dark' ? '#fff' : '#f4f3f4'}
                            />
                        }
                    />
                    <Divider />
                    <SettingItem
                        icon="notifications"
                        label="Notifications"
                        right={
                            <Switch
                                value={isNotificationsEnabled}
                                onValueChange={setIsNotificationsEnabled}
                                trackColor={{ false: '#767577', true: '#f3a49d' }}
                                thumbColor={isNotificationsEnabled ? '#fff' : '#f4f3f4'}
                            />
                        }
                    />
                </View>

                <SectionTitle icon="account-circle" title="Account" />
                <View className="mb-6 rounded-xl overflow-hidden bg-white dark:bg-[#1f1f1f]">
                    <TouchableOpacity
                        onPress={signOut}
                        className="flex-row items-center p-4"
                    >
                        <MaterialIcon name="logout" size={24} color="#f44336" />
                        <Typo className="ml-3 text-red-500">Logout</Typo>
                    </TouchableOpacity>
                    {!user.isGuest && (
                        <>
                            <Divider />
                            <TouchableOpacity 
                                className="flex-row items-center p-4"
                                onPress={() => {
                                    // TODO: Implement delete account
                                }}
                            >
                                <MaterialIcon name="delete-forever" size={24} color="#f44336" />
                                <Typo className="ml-3 text-red-500">Delete Account</Typo>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        </ScreenContent>
    );
}

const SectionTitle = ({ icon, title }: { icon: string; title: string }) => (
    <View className="flex-row items-center mb-2 px-2">
        <MaterialIcon name={icon as MaterialIconName} size={18} color="#666" />
        <Typo className="ml-2 text-sm font-semibold text-gray-500">{title}</Typo>
    </View>
);

const SettingItem = ({ 
    icon, 
    label, 
    value, 
    valueColor = "#666",
    right 
}: { 
    icon: string; 
    label: string; 
    value?: string;
    valueColor?: string;
    right?: React.ReactNode;
}) => (
    <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center">
            <MaterialIcon name={icon as MaterialIconName} size={24} color="#f3a49d" />
            <Typo className="ml-3">{label}</Typo>
        </View>
        {right || (value && (
            <Typo>{value}</Typo>
        ))}
    </View>
);

const Divider = () => (
    <View className="h-[1px] bg-gray-100 dark:bg-gray-800" />
);