import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';


const Main = () => {
    return(
      <Tabs 
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle:{
            backgroundColor:"#0D0D0D",
            height:60
        },
        tabBarLabelStyle:{
            fontSize: 12,  
            marginBottom: 5,
        },
        tabBarItemStyle:{
            flexDirection:"column",
            alignItems:"center"
        },
        tabBarIconStyle: {
            marginBottom: -5, 
        },
      }}>
        <Tabs.Screen name='HomeScreen' options={{
            headerShown:false,
            title:"Home",
            tabBarIcon:({color,focused})=>(
                <Ionicons name="home-outline" size={24} color={color} />
            )
        }}/>
        <Tabs.Screen name='ProfileScreen'  options={{
            headerShown:false,
            title:"Profile",
            tabBarIcon:({color,focused})=>(
                <Ionicons name="person" size={24} color={color} />
            )
        }}/>
        <Tabs.Screen name='Settings'  options={{
            headerShown:false,
            title:"Settings",
            tabBarIcon:({color,focused})=>(
                <Ionicons name="settings" size={24} color={color} />
            )
        }}/>
      </Tabs>
    )
  }

export default Main;