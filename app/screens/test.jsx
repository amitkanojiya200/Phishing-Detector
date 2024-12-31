import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const URLChecker = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const checkUrl = async () => {
    if (!url) {
      Alert.alert('Please enter a URL');
      return;
    }

    setLoading(true);

    try {
      const apiKey = 'AIzaSyCNhDxgslrXbPTFW5OoRc1klQJ0TioySrY'; // Replace with your actual API key
      const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
      
      const response = await axios.post(apiUrl, {
        client: {
          clientId: "phishguard-app",
          clientVersion: "1.0.0"
        },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [
            { url }
          ]
        }
      });

      if (response.data && response.data.matches) {
        Alert.alert('Warning!', 'This URL is phishing.');
      } else {
        Alert.alert('Safe!', 'This URL is safe.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check the URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter URL to Check</Text>
      <TextInput
        style={styles.input}
        placeholder="https://example.com"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        keyboardType="url"
      />
      <Button title={loading ? "Checking..." : "Check URL"} onPress={checkUrl} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20
  }
});

export default URLChecker;
