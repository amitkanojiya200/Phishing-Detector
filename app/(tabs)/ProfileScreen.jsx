import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('User Name');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [profileImage, setProfileImage] = useState(null);
  const defaultProfileImage = 'https://via.placeholder.com/150';

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('userEmail');
        const image = await AsyncStorage.getItem('profileImage');
        if (name) setUserName(name);
        if (email) setUserEmail(email);
        if (image) setProfileImage(image);
      } catch (error) {
        console.log('Failed to load user data', error);
      }
    };
    loadUserData();
  }, []);

  const logOut = async () => {
    try {
      await AsyncStorage.multiRemove(['isLoggedIn', 'userEmail']);
      router.replace('screens/LoginScreen');
    } catch (e) {
      console.log('Failed to remove token', e);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await AsyncStorage.setItem('userName', userName);
      await AsyncStorage.setItem('userEmail', userEmail);
      if (profileImage) {
        await AsyncStorage.setItem('profileImage', profileImage);
      }
      setModalVisible(false);
    } catch (error) {
      console.log('Failed to update profile', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      setProfileImage(pickerResult.assets[0].uri);
    }
  };

  return (
    <LinearGradient colors={['#2F353A', '#0D0D0D']} style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: profileImage || defaultProfileImage }} style={styles.profileImage} />
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.sectionItem} onPress={() => setModalVisible(true)}>
          <Ionicons name="person-outline" size={24} color="#FFFFFF" />
          <Text style={styles.sectionItemText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
        <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Modal for Editing Profile */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Text style={styles.imagePickerText}>Change Profile Picture</Text>
            </TouchableOpacity>

            <Image source={{ uri: profileImage }} style={styles.profileImage} />

            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#888"
              value={userName}
              onChangeText={setUserName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#888"
              value={userEmail}
              onChangeText={setUserEmail}
            />

            <TouchableOpacity style={styles.updateButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 50,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#4CAF50', // Updated color to match the theme
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold', // Added bold for emphasis
  },
  userEmail: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    opacity: 0.8, // Added slight opacity for a subtle effect
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    marginBottom: 10,
    fontWeight: 'bold', // Increased font weight for titles
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  sectionItemText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 30,
    justifyContent: 'center',
    //backgroundColor: '#F44336', // Updated to red for a clear 'Logout' indication
    //borderRadius: 8, // Rounded corners
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark overlay for contrast
  },
  modalView: {
    width: '80%',
    backgroundColor: '#1C1C1C',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Android shadow effect
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // Darker color for title
  },
  imagePicker: {
    padding: 10,
    backgroundColor: '#4CAF50', // Green background for visibility
    borderRadius: 8,
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50', // Border color
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
    color: '#FFFFFF', // Text color
  },
  updateButton: {
    backgroundColor: '#4CAF50', // Green for 'Update'
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 10,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: '#007BFF', // Blue for 'Close'
    fontSize: 16,
  },
});

export default ProfileScreen;
