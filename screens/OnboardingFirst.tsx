import { useEffect, useRef } from 'react';
import { Animated, Image, TouchableOpacity, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import ScreenContent from 'components/ScreenContent';
import { Typo } from 'components/Typo';
import { OnboardingStackParamList } from 'navigation/OnboardingNavigator';

export default function OnboardingFirst() {
  const navigation = useNavigation<NavigationProp<OnboardingStackParamList>>();
  const imageAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(descAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenContent>
      <View className="flex-1 items-center justify-center">
        <Animated.View
          className="flex-1 items-center justify-start pt-10"
          style={{
            opacity: imageAnim,
            transform: [
              {
                scale: imageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }}>
          <Image
            source={require('../assets/puffHello.png')}
            className="h-96 w-96"
            resizeMode="contain"
          />
          <Animated.View
            className="px-6"
            style={{
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}>
            <Typo className="text-center text-4xl font-bold">
              Welcome to{' '}
              <Typo color="#f3a49d" className="text-5xl font-extrabold">
                Dorara
              </Typo>
            </Typo>

            <Animated.View
              style={{
                opacity: descAnim,
                transform: [
                  {
                    translateY: descAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              }}>
              <Typo color="#949191" className="mt-6 text-center text-2xl font-semibold">
                Manage your tasks, notes, expenses, and more — all with the help of Puff, your smart
                local assistant
              </Typo>
            </Animated.View>
          </Animated.View>
        </Animated.View>

        <Animated.View
          className="w-full px-6 pb-8"
          style={{
            opacity: buttonAnim,
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          }}>
          <TouchableOpacity
            className="rounded-xl bg-[#f3a49d] px-6 py-4"
            activeOpacity={0.8}
            onPress={() => navigation.navigate('OnboardingSecond')}>
            <Typo className="text-center text-lg font-bold text-white">Get Started</Typo>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScreenContent>
  );
}
