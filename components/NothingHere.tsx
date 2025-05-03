import { Image } from 'react-native';
import ScreenContent from './ScreenContent';
import { Typo } from './Typo';

export const NothingHere = () => {
  return (
    <ScreenContent className="h-full flex-1 items-center justify-center py-8">
      <Image
        source={require('../assets/puffLick.png')}
        className="h-64 w-64 "
        resizeMode="contain"
      />
      <Typo className="mt-4 text-xl">Nothing Here</Typo>
    </ScreenContent>
  );
};
