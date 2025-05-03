import { createStackNavigator } from '@react-navigation/stack';
import OnboardingFirst from 'screens/OnboardingFirst';
import OnboardingSecond from 'screens/OnboardingSecond';
import TermsOfServiceScreen from 'screens/TermsOfService';

const Stack = createStackNavigator<OnboardingStackParamList>();
export type OnboardingStackParamList = {
  OnboardingFirst: undefined;
  OnboardingSecond: undefined;
  TermsOfService: undefined;
};

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OnboardingFirst" component={OnboardingFirst} />
      <Stack.Screen name="OnboardingSecond" component={OnboardingSecond} />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
