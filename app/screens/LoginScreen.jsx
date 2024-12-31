import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView,Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter, useNavigation} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../config/config';

const LoginScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Minimum length requirement
  };

  const signIn = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      let found = false;

      querySnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.email === email && user.password === password) {
          found = true;
           AsyncStorage.setItem('isLoggedIn', 'true');
           AsyncStorage.setItem('userEmail', email);
           router.replace("/HomeScreen");
        }
      });

      if (!found) {
        Alert.alert('Invalid Email or Password');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust the behavior based on the platform
      style={{ flex: 1 }}
      >
    <LinearGradient colors={['#2F353A', '#0D0D0D']} style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Log in to protect your accounts and stay safe from phishing attacks.</Text>
      
      <View style={styles.input}>
        <MaterialIcons name="email" size={16} color="#FFFFFF" style={{ marginLeft: 5 }} />
        <TextInput 
          placeholder={'Email'} 
          placeholderTextColor={'#FFFFFF'} 
          keyboardType="email-address"
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={setEmail} 
          style={styles.inputtext}
        />
      </View>
      
      <View style={styles.input}>
        <FontAwesome5 name="lock" size={16} color="#FFFFFF" style={{ marginLeft: 7 }} />
        <TextInput 
          placeholder={'Password'} 
          placeholderTextColor={'#FFFFFF'} 
          secureTextEntry={!showPassword} 
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={setPassword}
          style={styles.inputtext}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Entypo name={showPassword ? "eye-with-line" : "eye"} size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.replace("/screens/ForgotPassword")}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={signIn}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/screens/SignupScreen")}>
        <Text style={styles.signUpRedirect}>Don’t have an account? <Text style={{ color: '#FFFFFF' }}>Sign up</Text></Text>
      </TouchableOpacity>
    </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 50,
    marginTop: 80,
    fontFamily: 'Inter28',
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'Inter18',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap:7,
  },
  inputtext: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1, // Ensures the text input takes up the available space
    marginLeft: 10,
  },
  loginButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#2F353A',
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 20,
  },
  eyeIcon: {
    padding: 5, // Adjusts the clickable area around the eye icon
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter18',
  },
  signUpRedirect: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    fontFamily: 'Inter18',
  },
  forgotPassword: {
    alignSelf: 'center',
    color: '#FFFFFF',
    marginVertical: 10,
    fontFamily:'Inter18',
    fontSize:16,
  },
});

export default LoginScreen;
