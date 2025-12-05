// App.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  Text
} from 'react-native';

// --- Impor Navigasi & Safe Area ---
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// --- Impor Layar & Servis Anda ---
import LoginScreen from './src/screens/LoginScreen';
import StudentsScreen from './src/screens/StudentsScreen';
// PENTING: Gunakan penulisan huruf besar/kecil yang benar (MMKV)
let AuthService = {};
try {
  // use require inside try/catch to avoid top-level crash if module fails to initialize
  // this also makes Metro cache issues easier to recover from
  // eslint-disable-next-line global-require
  AuthService = require('./src/services/AuthService');
} catch (e) {
  // keep AuthService as empty object; we'll guard calls later
  // console.warn('AuthService require failed', e);
}

const Stack = createNativeStackNavigator();

// --- Komponen Utama Aplikasi ---
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

// --- Komponen yang Menangani Logika Otentikasi dan Routing ---
function AppContent() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    // 1. Ambil status user dari MMKV
    const getCurrentUser =
      (AuthService && (AuthService.getCurrentUserMMKV || (AuthService.default && AuthService.default.getCurrentUserMMKV))) ||
      null;
    const sessionUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    
    // 2. Set status user
    setUser(sessionUser); 
    
    // 3. Hentikan status initializing
    setInitializing(false);
  }, []);

  // Tampilkan layar loading saat MMKV sedang dibaca
  if (initializing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Memeriksa Sesi...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {__DEV__ && (
        <View style={{ position: 'absolute', top: 36, left: 8, right: 8, zIndex: 9999 }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: 6, borderRadius: 6 }}>
            <Text style={{ color: '#fff', fontSize: 12 }}>
              {`init:${initializing ? 'true' : 'false'} user:${user ? JSON.stringify(user) : 'null'}`}
            </Text>
          </View>
        </View>
      )}
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={user ? 'Mahasiswa' : 'Login'}
      >
        {/* Always register both screens so navigation actions (replace/navigate) work
            even when the other screen is not currently active. initialRouteName
            chooses which screen is shown first based on session. */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Mahasiswa"
          component={StudentsScreen}
          options={{ headerShown: true, title: 'Data Mahasiswa' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;