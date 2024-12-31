import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // For phishing and safe icons
import { useRouter } from 'expo-router';

const MessageHistoryScreen = () => {
  const router = useRouter();
  const [messageHistory, setMessageHistory] = useState([]);

  useEffect(() => {
    const loadMessageHistory = async () => {
      const history = await fetchMessageHistory();
      setMessageHistory(history);
    };

    loadMessageHistory();
  }, []);

  const fetchMessageHistory = async () => {
    try {
      const existingHistory = await AsyncStorage.getItem('messageHistory');
      return existingHistory ? JSON.parse(existingHistory) : [];
    } catch (error) {
      console.error('Failed to fetch message history:', error);
      return [];
    }
  };

  const deleteHistoryItem = async (index) => {
    const updatedHistory = messageHistory.filter((_, i) => i !== index);
    setMessageHistory(updatedHistory);
    await AsyncStorage.setItem('messageHistory', JSON.stringify(updatedHistory));
  };

  const confirmDelete = (index) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => deleteHistoryItem(index) },
    ]);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text style={styles.itemText}>{item.message}</Text>
        <View style={styles.resultContainer}>
          {item.result === 'PHISHING' ? (
            <MaterialIcons name="warning" size={20} color="#FF5733" />
          ) : (
            <AntDesign name="checkcircle" size={20} color="#28A745" />
          )}
          <Text style={styles.resultText}>{item.result}</Text>
        </View>
        <Text style={styles.timestampText}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => confirmDelete(index)}>
        <AntDesign name="delete" size={24} color="#FF5733" />
      </TouchableOpacity>
    </View>
  );

  return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 20, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => router.replace('/HomeScreen')} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Message Scan History</Text>
        </View>
        {messageHistory.length === 0 ? (
          <Text style={styles.emptyMessage}>No message history available.</Text>
        ) : (
          <FlatList
            data={messageHistory}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2F353A',
    //justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  itemContent: {
    flex: 1,
    marginRight: 10,
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  resultText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 5,
  },
  timestampText: {
    color: '#888',
    fontSize: 12,
  },
  backButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyMessage: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },  
});

export default MessageHistoryScreen;
