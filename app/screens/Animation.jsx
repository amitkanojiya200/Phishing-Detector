import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import LottieView from 'lottie-react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient';
//import { colors }  from '@/src/constants/color';

const AnimationScreen = () => {
  return (
    <LinearGradient
      style={{flex:1}}
      colors={['#e6eff5', '#a3b4c4']}
    >
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Stack.Screen options={{headerShown:false}}/>
        <StatusBar style='light'/>
        <View>
            <LottieView
                autoPlay
                style={{
                    width: 200,
                    height: 200,
                    marginBottom:60,
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require('@/assets/lottie/shield.json')}
            />
        </View>
      </View>
    </LinearGradient>
    
    
  )
}

export default AnimationScreen

const styles = StyleSheet.create({})