import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UrlCheckScreen = () => {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [animations] = useState({
    phishing: new Animated.Value(0),
    safe: new Animated.Value(0),
  });
  const [loading, setLoading] = useState(false);
  const [isBlinking, setIsBlinking] = useState({ phishing: false, safe: false });

  const handleCheckUrl = async () => {
    if (!url) {
      Alert.alert('Please enter a URL');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `http://192.168.254.229:5000/check-url`; // Update this to your actual Flask backend URL
      
      const response = await axios.post(apiUrl, { url }); // Adjust payload as per your Flask API requirements
      console.log(response.data)
      const { prediction, message } = response.data;
      await saveUrlHistory(url, prediction);
      if (prediction === 'good') {
        setResult('Safe');
        startBlinking('safe'); // Start blinking animation for safe
        stopBlinking('phishing'); // Stop blinking animation for phishing
      } else {
        setResult('Phishing');
        startBlinking('phishing'); // Start blinking animation for phishing
        stopBlinking('safe'); // Stop blinking animation for safe
      }

      //Alert.alert('Result', message); // Display the message from your backend
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to check the URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveUrlHistory = async (url, prediction) => {
    try {
      const existingHistory = await AsyncStorage.getItem('urlHistory');
      const newHistory = existingHistory ? JSON.parse(existingHistory) : [];

      const newEntry = {
        url,
        result: prediction === 'good' ? 'Safe' : 'Phishing',
        timestamp: Date.now(),
      };
      newHistory.push(newEntry);

      await AsyncStorage.setItem('urlHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save URL history:', error);
    }
  };

  const startBlinking = (type) => {
    if (isBlinking[type]) return; // Prevent starting if already blinking
    setIsBlinking((prev) => ({ ...prev, [type]: true })); // Set blinking state to true
    animations[type].setValue(0); // Reset before starting

    Animated.loop(
      Animated.sequence([
        Animated.timing(animations[type], {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animations[type], {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopBlinking = (type) => {
    if (!isBlinking[type]) return; // Prevent stopping if not blinking
    setIsBlinking((prev) => ({ ...prev, [type]: false })); // Set blinking state to false
    animations[type].setValue(0); // Reset after stopping
  };

  const blinkOpacityPhishing = animations.phishing.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // Fade from transparent to opaque
  });

  const blinkOpacitySafe = animations.safe.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // Fade from transparent to opaque
  });

  return (
    <LinearGradient colors={['#2F353A', '#0D0D0D']} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace('/screens/scan')} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Check URL for Phishing</Text>

      {/* URL Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your URL"
        placeholderTextColor="#888"
        value={url}
        onChangeText={setUrl}
      />

      {/* Check Button */}
      <TouchableOpacity style={styles.checkButton} onPress={handleCheckUrl}>
        <Text style={styles.checkButtonText}>Check URL</Text>
      </TouchableOpacity>

      {/* Result Display */}
      {result === 'Phishing' && (
        <Animated.View style={[styles.resultContainer, { opacity: blinkOpacityPhishing }]}>
          <Icon name="exclamation-triangle" size={50} color="red" />
          <Text style={styles.phishingWarning}>Phishing</Text>
        </Animated.View>
      )}
      {result === 'Safe' && (
        <Animated.View style={[styles.resultContainer, { opacity: blinkOpacitySafe }]}>
          <Icon name="check-circle" size={50} color="green" />
          <Text style={styles.safeWarning}>Safe</Text>
        </Animated.View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#555',
    borderWidth: 1,
  },
  checkButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phishingWarning: {
    marginTop: 20,
    fontSize: 22,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
  safeWarning: {
    marginTop: 20,
    fontSize: 22,
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
  },
});

export default UrlCheckScreen;
