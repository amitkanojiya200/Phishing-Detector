import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // For phishing and safe icons
import { useRouter } from 'expo-router';

const EmailHistoryScreen = () => {
  const router = useRouter();
  const [emailHistory, setEmailHistory] = useState([]);

  useEffect(() => {
    const loadEmailHistory = async () => {
      const history = await fetchEmailHistory();
      setEmailHistory(history);
    };

    loadEmailHistory();
  }, []);

  const fetchEmailHistory = async () => {
    try {
      const existingHistory = await AsyncStorage.getItem('emailHistory');
      return existingHistory ? JSON.parse(existingHistory) : [];
    } catch (error) {
      console.error('Failed to fetch email history:', error);
      return [];
    }
  };

  const deleteHistoryItem = async (index) => {
    const updatedHistory = emailHistory.filter((_, i) => i !== index);
    setEmailHistory(updatedHistory);
    await AsyncStorage.setItem('emailHistory', JSON.stringify(updatedHistory));
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
        <Text style={styles.itemText}>{item.email}</Text>
        <View style={styles.resultContainer}>
          {item.result === 'Phishing Email' ? (
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
      <View style={{flexDirection:'row',alignItems:'center',gap:7,marginTop:20,marginBottom:10,}}>
      <TouchableOpacity onPress={() => router.replace('/HomeScreen')} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>Email Scan History</Text>
      </View>
      {emailHistory.length === 0 ? (
          <Text style={styles.emptyMessage}>No email history available.</Text>
        ) : (
          <FlatList
            data={emailHistory}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    //textAlign: 'center',
    //marginBottom: 20,
    //marginTop: 25,
    //marginLeft: 15,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#444',
    marginBottom: 10,
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 5,
  },
  timestampText: {
    color: '#888888',
    fontSize: 12,
  },
  backButton: {
    //position: 'absolute',
    //top: 40,
    //left: 15,
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

export default EmailHistoryScreen;
