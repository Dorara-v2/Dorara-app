import { useColorScheme } from 'nativewind';
import { ReactNode } from 'react';
import { Text } from 'react-native';

export const Typo = ({
  children,
  className,
  color,
}: {
  children: string | ReactNode;
  className?: string;
  color?: string;
}) => {
  const { colorScheme } = useColorScheme();
  return (
    <Text
      className={`${className}`}
      style={{
        color: color != undefined ? color : colorScheme === 'dark' ? '#ffffff' : '#000000',
        fontFamily: 'DMSans_400Regular',
      }}>
      {children}
    </Text>
  );
};
