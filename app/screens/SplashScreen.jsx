import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {  useNavigation, useRouter } from 'expo-router';

const SplashScreen = () => {
  const navigation =useNavigation();
  const router = useRouter();
  {/*useEffect(() => {
    // Simulate a loading process and then navigate to the main screen
    setTimeout(() => {
      router.push('/screens/Onboardingscreen'); // Replace with your actual main screen route
    }, 3000); // Show splash screen for 3 seconds
  }, [navigation]);*/}

  return (
    <LinearGradient
      colors={['#2F353A', '#0D0D0D']}
      style={styles.container}
    >
      <Image
        source={require('@/assets/images/shield.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>PhishGuard</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SplashScreen;