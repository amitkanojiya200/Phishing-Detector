import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
//import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
//import { colors, fonts } from '@/src/theme/theme';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import Checkbox from 'expo-checkbox';
import { useNavigation, useRouter } from 'expo-router';
//import RootStackParamList, { NavigationProp } from "../(tabs)/index"
import axios from 'axios';
import { db } from '../config/config'; // Adjust this path to your Firebase configuration
import { collection, query, where, getDocs } from 'firebase/firestore';


const SignUpScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields');
      return false;
    }

    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password should be at least 8 characters long');
      return false;
    }
    
    // At least one uppercase letter
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      Alert.alert('Weak Password', 'Password should have at least one uppercase letter');
      return false;
    }

    // At least one lowercase letter
    const lowercaseRegex = /[a-z]/;
    if (!lowercaseRegex.test(password)) {
      Alert.alert('Weak Password', 'Password should have at least one lowercase letter');
      return false;
    }

    // At least one number
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(password)) {
      Alert.alert('Weak Password', 'Password should have at least one numeric digit');
      return false;
    }

    // At least one special character
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      Alert.alert('Weak Password', 'Password should have at least one special character');
      return false;
    }


    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true; 
  };

  const signUp = async () => {
    console.log('Sign Up initiated');
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Invalid Password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
     // Disable button during loading
     setIsLoading(true);
    try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty){
          console.log('Creating user...');
          // Send OTP to the email via Flask backend
          console.log('Sending OTP to:', email);
          navigation.navigate("screens/VerificationPage", { email:email, fullName:fullName, password:password});
        }
        else{
          Alert.alert("Email Alredy Exists","this Email is alredy in use");
        }
    } catch (err) {
      console.error('Error during sign up:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setIsLoading(false); // Re-enable button
    }
  };
  
  return (
    <LinearGradient colors={['#2F353A', '#0D0D0D']} style={styles.container}>
        <Stack.Screen options={{headerShown:false}}/>
      <Text style={styles.signup}>Sign Up</Text>
      <Text style={styles.tagline}>Join PhishGuard: Secure Your Online Experience</Text>

      <View style={styles.input}>
        <FontAwesome5 name="user-alt" size={16} color="#FFFFFF" style={{marginLeft:7}}/>
        <TextInput 
          placeholder="Full Name" 
          placeholderTextColor={'#FFFFFF'} 
          style={styles.inputtext}
          onChangeText={(fullName) => setFullName(fullName)}
        />
      </View>
      <View style={styles.input}>
        <MaterialIcons name="email" size={16} color="#FFFFFF" style={{marginLeft:5}}  />
        <TextInput 
          placeholder="Email"  
          keyboardType="email-address" 
          placeholderTextColor={'#FFFFFF'} 
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(email) => setEmail(email)} 
          style={styles.inputtext}/>
      </View>
      <View style={styles.input}>
        <FontAwesome5 name="lock" size={16} color="#FFFFFF" style={{marginLeft:7}} />
        <TextInput 
          placeholder="Password"  
          secureTextEntry={!showPassword} 
          placeholderTextColor={'#FFFFFF'} 
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(password) => setPassword(password)}
          style={styles.inputtext}/>
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Entypo name={showPassword ? "eye-with-line" : "eye"} size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.input}>
        <FontAwesome5 name="key" size={16} color="#FFFFFF" style={{marginLeft:5}}/>
        <TextInput 
          placeholder="Confirm Password"  
          secureTextEntry={!showConfirmPassword} 
          placeholderTextColor={'#FFFFFF'} 
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
          style={styles.inputtext}/>
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          <Entypo name={showConfirmPassword ? "eye-with-line" : "eye"} size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/*<TouchableOpacity style={styles.checkboxContainer}>
          <Checkbox
            style={{margin:8,borderColor:'#FFFFFF'}}
            //value={isChecked}
            //onValueChange={setChecked}
            //color={isChecked ? '#4630EB' : undefined}
          />
          <Text style={styles.checkboxText}>
          I agree to the <Text style={styles.link}>Terms and Conditions</Text>
          </Text>
      </TouchableOpacity>*/}

      <TouchableOpacity style={styles.signUpButton} onPress={signUp}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginRedirect}>Already have an account? <Text style={styles.link}>Login</Text></Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 25,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    //backgroundColor: '#253334',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
    alignSelf:'center',
  },
  signup:{
    fontSize:30,
    //fontWeight:'light',
    color:'#FFFFFF',
    fontFamily:'Inter28'
  },
  tagline: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily: 'Inter18',
    marginTop:10,
    fontWeight:'400',
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
  inputtext:{
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1, // Ensures the text input takes up the available space
    marginLeft: 10,
  },
  eyeIcon: {
    padding: 5, // Adjusts the clickable area around the eye icon
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent:'center',
  },
  checkboxText: {
    color:'#FFFFFF',
    fontFamily: 'AlegreyaRegular',
    fontSize:20,
  },
  link: {
    color: '#FFFFFF',
    fontFamily: 'Inter18',
    fontSize:16,
  },
  signUpButton: {
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
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter18',
    paddingHorizontal:20,
  },
  loginRedirect: {
    color: '#FFFFFF',
    fontFamily: 'Inter18',
    alignSelf:'center',
    marginTop:30,
    fontSize:16,
    },
});

export default SignUpScreen;
