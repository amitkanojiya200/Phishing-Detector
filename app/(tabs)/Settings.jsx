import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
  //const navigation = useNavigation();
  const router= useRouter();
  const [browserProtection, setBrowserProtection] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);

  const toggleSwitch = (setter) => () => setter((prev) => !prev);

  return (
    <LinearGradient colors={['#2F353A', '#0D0D0D']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Account Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <TouchableOpacity style={styles.sectionItem} onPress={() => router.push('screens/ResetPassword')}>
              <Ionicons name="lock-closed-outline" size={24} color="#FFFFFF" />
              <Text style={styles.sectionItemText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionItem}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              <Text style={styles.sectionItemText}>Notification Settings</Text>
            </TouchableOpacity>
          </View>

          {/* App Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            <TouchableOpacity style={styles.sectionItem}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#FFFFFF" />
              <Text style={styles.sectionItemText}>Privacy Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionItem}>
              <Ionicons name="color-palette-outline" size={24} color="#FFFFFF" />
              <Text style={styles.sectionItemText}>Theme</Text>
            </TouchableOpacity>

            {/* Settings with Toggles */}
            {/*<View style={styles.setting}>
              <Text style={styles.settingText}>Browser Protection</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={browserProtection ? '#FFFFFF' : '#f4f3f4'}
                onValueChange={toggleSwitch(setBrowserProtection)}
                value={browserProtection}
              />
            </View>
            <View style={styles.setting}>
              <Text style={styles.settingText}>Data Encryption</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={dataEncryption ? '#FFFFFF' : '#f4f3f4'}
                onValueChange={toggleSwitch(setDataEncryption)}
                value={dataEncryption}
              />
            </View>*/}
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <TouchableOpacity style={styles.sectionItem}>
              <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
              <Text style={styles.sectionItemText}>Help Center</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionItem}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FFFFFF" />
              <Text style={styles.sectionItemText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 20,
  },
  section: {
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1C1C1C', // Dark background for sections
    elevation: 5, // Add shadow effect for depth
  },
  sectionTitle: {
    fontSize: 26,
    color: '#FFFFFF',
    fontFamily: 'Inter28',
    marginBottom: 10,
    textAlign: 'center', // Centered title
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50', // Green border for separation
  },
  sectionItemText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 15,
    fontFamily: 'Inter18',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
  },
  settingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter18',
  },
});

export default SettingsScreen;
