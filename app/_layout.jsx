import React, { useEffect } from 'react';
import { Stack, useNavigation } from 'expo-router';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScanHistoryProvider } from './fun/ScanHistoryContext'; // Import your provider

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

let customFonts = {
  'Roboto-Regular': require('@/assets/fonts/Roboto-Regular.ttf'),
  'Roboto-Bold': require('@/assets/fonts/Roboto-Bold.ttf'),
  'Inter28': require('@/assets/fonts/Inter_28pt-Black.ttf'),
  'Inter18': require('@/assets/fonts/Inter_18pt-Black.ttf'),
  'AlegreyaR': require('@/assets/fonts/Alegreya-Regular.ttf'),
  'AlegreyaSans': require('@/assets/fonts/AlegreyaSans-Black.ttf'),
  'AlegreyaRegular': require('@/assets/fonts/AlegreyaSans-Regular.ttf'),
};

export default function RootLayout() {
  const navigation = useNavigation();
  const [loaded] = Font.useFonts(customFonts);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Display nothing until fonts are loaded
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScanHistoryProvider> 
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="screens/SplashScreen" />
          <Stack.Screen name="screens/LoginScreen" />
          <Stack.Screen name="screens/SignupScreen" />
          <Stack.Screen name="screens/Onboardingscreen" />
          <Stack.Screen name="screens/ForgotPassword" />
          <Stack.Screen name="screens/ResetPassword" />
          <Stack.Screen name="screens/VerificationPage" />
        </Stack>
      </ScanHistoryProvider>
    </GestureHandlerRootView>
  );
}
