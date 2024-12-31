import React, { useState } from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, Pressable } from 'react-native';
import { Directions, Gesture, GestureHandlerRootView, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from "expo-router";

const onboardingsteps = [
  {
    title: 'Welcome to PhishGuard',
    description: "Manually check your URLs, messages, and emails to stay safe from phishing threats.",
    image: require('@/assets/images/shield.png'),
  },
  {
    title: 'Manual Phishing Detection',
    description: 'Easily copy and paste URLs, messages, and emails into PhishGuard for phishing detection. No need for real-time scanning.',
    image: require('@/assets/images/realm.png'),
  },
  {
    title: 'Your Privacy is Our Priority',
    description: 'PhishGuard performs all checks locally on your device, keeping your data private. Let’s get started!',
    image: require('@/assets/images/privacy.png'),
  }
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [screenIndex, setScreenIndex] = useState(0);
  const data = onboardingsteps[screenIndex];

  const onContinue = () => {
    const isLastScreen = screenIndex === onboardingsteps.length - 1;
    if (isLastScreen) {
      router.push('screens/LoginScreen');
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex - 1);
    }
  };

  const endOnboarding = () => {
    router.replace('LoginScreen');
  };

  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      onContinue();
    });

  const swipeRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      onBack();
    });

  return (
        <LinearGradient colors={['#2F353A', '#0D0D0D']} style={styles.page}>
          <View style={styles.page}>
            <StatusBar style="light" />
            <View style={styles.stepIndicatorContainer}>
              {onboardingsteps.map((step, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepIndicator,
                    { backgroundColor: index === screenIndex ? '#FFFFFF' : '#AAAFA8' }
                  ]}
                />
              ))}
            </View>
            <View style={styles.pagecontent} key={screenIndex}>
              <Animated.View entering={FadeIn.duration(500).delay(500)} exiting={FadeOut.duration(500).delay(500)}>
                <Image source={data.image} style={styles.image} resizeMode="contain" />
              </Animated.View>
              <View style={styles.footer}>
                <Animated.Text entering={SlideInRight} exiting={SlideOutLeft} style={styles.title}>
                  {data.title}
                </Animated.Text>
                <Animated.Text entering={SlideInRight.delay(50)} exiting={SlideOutLeft} style={styles.description}>
                  {data.description}
                </Animated.Text>
                <View style={styles.buttonRow}>
                  {screenIndex < onboardingsteps.length - 1 && (
                    <Text onPress={endOnboarding} style={{ color: '#FFFFFF', fontWeight: 'bold', marginVertical: 20 }}>
                      Skip
                    </Text>
                  )}
                  <Pressable onPress={onContinue} style={styles.button}>
                    <Text style={styles.buttonText}>
                      {screenIndex === onboardingsteps.length - 1 ? 'Get Started' : 'Continue'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagecontent: {
    padding: 20,
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 50,
    fontFamily: 'Inter28',
    marginVertical: 7,
    textAlign: 'center',
    marginTop: 10,
  },
  image: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: 200,
    width: '80%',
    marginTop: 50,
    marginHorizontal: 30,
    marginBottom: 'auto',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    fontFamily: 'Inter18',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    backgroundColor: '#333333',
    borderRadius: 25,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    padding: 15,
    paddingHorizontal: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    marginTop: 40,
    marginHorizontal: 20,
    gap: 8,
    justifyContent: 'center',
  },
  stepIndicator: {
    height: 3,
    width: 10,
    backgroundColor: '#AAAFA8',
    borderRadius: 10,
  }
});
