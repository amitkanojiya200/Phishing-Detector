import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler, Alert, Image } from 'react-native';
//import { useNavigation } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation,useRouter } from 'expo-router';

const MainScreen = () => {
  const navigation = useNavigation();
  const route = useRouter();

  // Handle Android Back Button press
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener on unmount
  }, []);

  return (
    <LinearGradient colors={['#2F353A', '#0D0D0D']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image source={require('@/assets/images/shield.png')} style={styles.logo} />
          <Text style={{ color: '#FFFFFF', fontSize: 25 }}>PhishGuard</Text>
        </View>
        <View style={styles.content}>
          <Text style={{ color: '#FFFFFF', marginBottom: 10 }}>Welcome to the Home Screen!</Text>
        </View>
        {/* Detection Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>You're Protected</Text>
          <FontAwesome name="shield" size={50} color="#00e676" />
          {/*<TouchableOpacity style={styles.scanButton}>
            <Text style={styles.scanButtonText}>View Details</Text>
          </TouchableOpacity>*/}
        </View>

        {/* Recent Scans Section */}
        <ScrollView style={styles.recentScans}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          {/* Example scan items */}
          <TouchableOpacity style={styles.scanItem} onPress={()=>route.replace("/screens/EmailHistory")}>
            <MaterialIcons name="email" size={24} color="white" />
            <Text style={styles.scanText}>Email</Text>
            {/*<Text style={styles.timeText}>2 mins ago</Text>*/}
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanItem} onPress={()=>route.replace("/screens/SmsHistory")}>
            <MaterialIcons name="message" size={24} color="white" />
            <Text style={styles.scanText}>SMS</Text>
            {/*<Text style={styles.timeText}>10 mins ago</Text>*/}
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanItem} onPress={()=>route.replace("/screens/urlHistory")}>
            <MaterialIcons name="message" size={24} color="white" />
            <Text style={styles.scanText}>URL</Text>
            {/*<Text style={styles.timeText}>10 mins ago</Text>*/}
          </TouchableOpacity>
        </ScrollView>

        {/* Quick Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => route.replace('screens/scan')}>
            <FontAwesome name="refresh" size={24} color="white" />
            <Text style={styles.actionText}>Scan Now</Text>
          </TouchableOpacity>
          {/* QR Scan button removed */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#253334',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    gap: 3,
  },
  logo: {
    width: 30,
    height: 30,
  },
  statusCard: {
    backgroundColor: '#3b5050',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  scanButton: {
    backgroundColor: '#00e676',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  scanButtonText: {
    color: '#253334',
    fontWeight: 'bold',
  },
  recentScans: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3b5050',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  timeText: {
    color: '#a9a9a9',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#00e676',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
  },
});

export default MainScreen;
