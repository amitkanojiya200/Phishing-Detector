import { View, Text, StyleSheet, TextInput, Image, Alert, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter, useNavigation } from 'expo-router';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../config/config';

const ResetPassword = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const [email, setEmail] = useState('');

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleForgotPassword = async () => {
        console.log('Email:', email);
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }

        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            let found = false;

            querySnapshot.forEach((doc) => {
                const user = doc.data();
                if (user.email === email) {
                found = true;
                navigation.navigate("screens/ResetPassword",{email:email});
                }
            });
            if (!found) {
                Alert.alert('Email Not Found', 'This email is not registered.');
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to check email');
        }
    };
  return (
    <LinearGradient colors={['#2F353A', '#0D0D0D']}  style={styles.container}>
        <Image source={require('@/assets/images/password.png')} style={styles.image}/>
        <Text style={styles.title}>FORGOT PASSWORD</Text>
        <Text style={styles.description}>Provide you account's email for which you want to reset your password</Text>
        <View style={[styles.input]}>
            <MaterialIcons name="email" size={16} color="#FFFFFF" style={{marginLeft:5}} />
            <TextInput
                value={email}
                placeholder={'Email'}
                placeholderTextColor={'#FFFFFF'}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setEmail} // This should update the state correctly
                style={styles.inputtext}
            />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
            <Text style={styles.text}>NEXT</Text>
        </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        //alignItems:'center',
        padding:20,
    },
    image:{
        width:100,
        height:100,
        alignSelf:'center',
        marginBottom:50,
    },
    title:{
        color:'#FFFFFF',
        fontSize:50,
        fontFamily:'Inter28',
        textAlign:'center',
        marginBottom:3,
    },
    description:{
        color:'#FFFFFF',
        fontSize:20,
        textAlign:'center',
        marginBottom:30,
    },
    input:{
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
    text:{
        color:'#FFFFFF',
        fontSize: 20,
        fontFamily: 'Inter18',
    },
})

export default ResetPassword