import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
//import { colors, fonts } from '@/src/theme/theme';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import OTPTextView from 'react-native-otp-textinput';
import axios from 'axios';
import { useNavigation , useRouter, useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import {app,db,storage} from '../config/config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const VerificationScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [count, setCount] = useState(60);
  const route = useRoute();
  const { email, fullName, password } = route.params;
  const [Otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [backendOtp,setBackendOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const defaultImageUri = Image.resolveAssetSource(require('../../assets/images/profile.jpg')).uri;
  useEffect(() => {
    const timer = count > 0 && setInterval(() => setCount(count - 1), 1000);
    return () => clearInterval(timer);
  }, [count]);

  const sendDataToBackend = async () => {
    try {
      const response =  await axios.post('http://192.168.254.229:5000/send-otp', { email:email });
      console.log('Response from backend:', response.data);
      setBackendOtp(response.data.message);
    } catch (error) {
      console.error('Error sending data:', error);
      Alert.alert("Server Error");
    }
  };
  
  const getOtp = () => {
    if (count == 0) {
      console.log("otp sent");
      Alert.alert("otp has been send");
      sendDataToBackend();
      setCount(60);
    }
    else {
      Alert.alert("wait for timer");
    }
  };

  const verifyOtp = async () => {
    if (Otp == backendOtp) {
      console.log("otp verified")
      setLoading(true);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      {/*const response = await fetch(defaultImageUri);
      const blob = await response.blob();
      console.log("Blob:", blob);
      const filename = email; // Use email or any unique identifier as the filename

      const storageRef = ref(storage,'profile_images/${filename}-profile.jpg');*/}

      try {
        {/*await uploadBytes(storageRef, blob);
        const imageUrl = await getDownloadURL(storageRef);*/}
        // Store user data in Firestore
        await setDoc(doc(db, 'users', email), {
          fullName,
          email,
          password,
          //profileImage: imageUrl,
        });
        Alert.alert("successfully register");
        router.navigate('screens/LoginScreen')

      } catch (error) {
        Alert.alert("error:" + error.message);
        console.log(error.message);
      }
      finally {
        setLoading(false); // Stop loading
      }
    }
    else {
      Alert.alert("Invalid OTP");
    }
  };
  useEffect(() => {
    sendDataToBackend();
    console.log("hello");
  }, []);


  
  const logoOpacity = useSharedValue(0);
  const codeOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 1000 });
    codeOpacity.value = withTiming(1, { duration: 1500 });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  const codeStyle = useAnimatedStyle(() => ({
    opacity: codeOpacity.value,
  }));

  return (
    <LinearGradient colors={['#2F353A', '#0D0D0D']} style={styles.container}>
        <Stack.Screen options={{headerShown:false}}/>
      <Animated.Image source={require('@/assets/images/otp.png')} style={[styles.logo, logoStyle]} />
      <Text style={styles.message}>CODE VERIFICATION</Text>
      <Text style={styles.description}>Enter one time password sent on your {email}</Text>
      <Animated.View style={[styles.codeContainer, codeStyle]}>
        <OTPTextView
          textInputStyle={styles.codeInput}
          inputCount={6}
          tintColor={'#90d5ff'}
          handleTextChange={setOtp}
        />
      </Animated.View>

      <TouchableOpacity style={styles.submitButton} onPress={verifyOtp}>
          <Text style={styles.submitButtonText}>Verify</Text>
      </TouchableOpacity>
       
      <TouchableOpacity onPress={getOtp}>
        <Text style={styles.resendCode}>Resend Code</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    //backgroundColor: colors.background,
    padding: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    alignSelf:'center',
  },
  message: {
    fontSize: 40,
    color: '#FFFFFF',
    marginBottom: 3,
    fontFamily: 'Inter28',
    textAlign:'center',
  },
  description:{
    color:'#FFFFFF',
    fontSize:20,
    textAlign:'center',
    marginBottom:50,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap:5,
    alignSelf:'center'
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Inter18',
    color:'#FFFFFF'
  },
  submitButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#2F353A',
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontFamily: 'Inter18',
  },
  resendCode: {
    color: '#BEC2C2',
    fontFamily: 'Inter18',
    textAlign:'center',
    marginTop:50,
    fontSize:25,
  },
});

export default VerificationScreen;
