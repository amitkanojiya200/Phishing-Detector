import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScanScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#2F353A', '#0D0D0D']} style={styles.container}>
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)/HomeScreen')} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Screen Title */}
      <Text style={styles.title}>PhishGuard - Scan for Phishing</Text>

      {/* Scan Buttons */}
      <TouchableOpacity style={styles.scanButton} onPress={() => router.navigate('/screens/message')}>
        <Text style={styles.scanButtonText}>Scan Messages</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.scanButton} onPress={() => router.navigate('/screens/mail')}>
        <Text style={styles.scanButtonText}>Scan Emails</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.scanButton} onPress={() => router.navigate('/screens/url')}>
        <Text style={styles.scanButtonText}>Scan URLs</Text>
      </TouchableOpacity>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  scanButton: {
    backgroundColor: '#4CAF50', // Green button color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
