import React, {useState,useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Stack,useNavigation,useRouter} from "expo-router";
import Onboardingscreen from './screens/Onboardingscreen';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './(tabs)/HomeScreen';
const App = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkLoggedInStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      console.log(isLoggedIn);
      if (isLoggedIn) {
        router.replace('/HomeScreen'); // Replace to prevent going back
      }else{
        router.replace('screens/Onboardingscreen');
      }
      setIsLoading(false);
    };
    checkLoggedInStatus();
  }, []);
  if (isLoading) {
    return <SplashScreen />; // Show SplashScreen while checking the status
  }
  return null;
}

export default App;