import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MessageCheckScreen = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const blinkAnimation = useState(new Animated.Value(0))[0]; // Keep the state as a constant

  const handleCheckMessage = async () => {
    try {
      const response = await fetch('http://192.168.254.229:5000/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      console.log(data.result);
      setResult(data.result);
      await saveToHistory(message, data.result);
      // Start blinking animation based on the result
      startBlinking();
    } catch (error) {
      Alert.alert('Error', 'Failed to check the message. Please try again.');
    }
  };

  const saveToHistory = async (message, result) => {
    const newEntry = {
      message,
      result,
      timestamp: Date.now(),
    };

    try {
      const existingHistory = await AsyncStorage.getItem('messageHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.push(newEntry);
      await AsyncStorage.setItem('messageHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save message history:', error);
    }
  };
  
  const startBlinking = () => {
    blinkAnimation.setValue(0); // Reset before starting
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const blinkOpacity = blinkAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0], // Fade from opaque to transparent
  });

  return (
    <LinearGradient colors={['#2F353A', '#0D0D0D']} style={styles.container}>
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace('/screens/scan')} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Check Message for Phishing</Text>

      {/* Message Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        placeholderTextColor="#888"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      {/* Check Button */}
      <TouchableOpacity style={styles.checkButton} onPress={handleCheckMessage}>
        <Text style={styles.checkButtonText}>Check Message</Text>
      </TouchableOpacity>

      {/* Result Display */}
      {result && (
        <Animated.View style={[styles.resultContainer, { opacity: blinkOpacity }]}>
          <Icon
            name={result === 'PHISHING' ? 'exclamation-triangle' : 'check-circle'}
            size={50}
            color={result === 'PHISHING' ? 'red' : 'green'}
          />
          <Text style={result === 'PHISHING' ? styles.phishingWarning:styles.safeWarning}>
            {result}
          </Text>
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
    textAlignVertical: 'top',
    borderColor: '#555',
    borderWidth: 1,
    height: 150,
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

export default MessageCheckScreen;
