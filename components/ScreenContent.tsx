import { ReactNode } from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { useColorScheme } from 'nativewind';

interface ScreenContentProps {
  children: ReactNode;
  className?: string;
}

const ScreenContent = ({ children, className = '' }: ScreenContentProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#171717' : '#ffffff'}
      />
      <View className={`flex-1 p-4${className}`}>{children}</View>
    </SafeAreaView>
  );
};

export default ScreenContent;
