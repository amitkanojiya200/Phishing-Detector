import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import React, {useState,useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome5 } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { useNavigation, useRouter } from 'expo-router'
import { doc, updateDoc } from 'firebase/firestore'; // To update the password
import { db } from '../config/config';
import { useRoute } from '@react-navigation/native';

const ResetPassword = () => {
    const router = useRouter();
    const route = useRoute();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {email} = route.params;
  
    // Function to validate the password input
    const validatePassword = () => {
      if (!newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill out all fields');
        return false;
      }
  
      if (newPassword.length < 8) {
        Alert.alert('Weak Password', 'Password should be at least 8 characters long');
        return false;
      }
      
      // At least one uppercase letter
      const uppercaseRegex = /[A-Z]/;
      if (!uppercaseRegex.test(newPassword)) {
        Alert.alert('Weak Password', 'Password should have at least one uppercase letter');
        return false;
      }
  
      // At least one lowercase letter
      const lowercaseRegex = /[a-z]/;
      if (!lowercaseRegex.test(newPassword)) {
        Alert.alert('Weak Password', 'Password should have at least one lowercase letter');
        return false;
      }
  
      // At least one number
      const numberRegex = /[0-9]/;
      if (!numberRegex.test(newPassword)) {
        Alert.alert('Weak Password', 'Password should have at least one numeric digit');
        return false;
      }
  
      // At least one special character
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (!specialCharRegex.test(newPassword)) {
        Alert.alert('Weak Password', 'Password should have at least one special character');
        return false;
      }
  
  
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
  
      return true;
    };
  
    // Function to handle password reset
    const handleResetPassword = async () => {
      if (!validatePassword()) return;
  
      try {
        // Fetch the user document from Firestore using their email
        const userRef = doc(db, 'users', email); // Assuming user document ID is the email
  
        // Update the password field
        await updateDoc(userRef, { password: newPassword });
  
        Alert.alert('Success', 'Your password has been updated.');
        router.push('/screens/LoginScreen'); // Navigate back to login screen after successful update
      } catch (error) {
        console.error('Error updating password:', error);
        Alert.alert('Error', 'Failed to update password. Please try again.');
      }
    };
  
  return (
    <LinearGradient colors={['#2F353A', '#0D0D0D']}  style={styles.container}>
        <Image source={require('@/assets/images/reset-password.png')} style={styles.image}/>
        <Text style={styles.title}>NEW CREDENTIALS</Text>
        <Text style={styles.description}>Your identity has been verified! Set your new password</Text>
        <View style={styles.inputview}>
            <View style={styles.input}>
                <FontAwesome5 name="lock" size={16} color="#FFFFFF" style={{marginLeft:7}} />
                <TextInput 
                    placeholder={'Password'} 
                    placeholderTextColor={'#FFFFFF'} 
                    secureTextEntry={!showPassword} 
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={setNewPassword}
                    style={styles.inputtext}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Entypo name={showPassword ? "eye-with-line" : "eye"} size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
            <View style={styles.input}>
                <FontAwesome5 name="key" size={16} color="#FFFFFF" style={{marginLeft:5}}/>
                <TextInput 
                    placeholder={'Password'} 
                    placeholderTextColor={'#FFFFFF'} 
                    secureTextEntry={!showConfirmPassword} 
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={setConfirmPassword}
                    style={styles.inputtext}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    <Entypo name={showConfirmPassword ? "eye-with-line" : "eye"} size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.btntext}>UPDATE</Text>
        </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        padding:20,
    },
    image:{
        width:100,
        height:100,
        alignSelf:'center',
        marginBottom:50,
    },
    title:{
        color:"#FFFFFF",
        fontSize:50,
        fontFamily:"Inter28",
        marginBottom:2,
        textAlign:'center',
    },
    description:{
        color:"#FFFFFF",
        fontSize:20,
        textAlign:'center',
        marginBottom:30,
    },
    inputview:{
        marginTop:10,
        marginBottom:40,
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
      button:{
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
        //marginHorizontal:20,
    },
    btntext:{
        color:'#FFFFFF',
        fontSize: 20,
        fontFamily: 'Inter18',
    },
})
export default ResetPassword