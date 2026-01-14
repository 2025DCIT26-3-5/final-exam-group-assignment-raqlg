import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  SafeAreaView, StatusBar, ActivityIndicator 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pill, Activity, User, Home as HomeIcon } from 'lucide-react-native';

// Import Supabase Client
import { supabase } from './src/lib/supabase'; 

// Import Screens
import MedsScreen from './src/screen/MedsScreen'; 
import VitalsScreen from './src/screen/VitalsScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import HomeScreen from './src/screen/HomeScreen';
import AuthScreen from './src/screen/AuthScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session status pagka-bukas ng app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Makinig sa auth changes (Login, Logout, Signup)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Loading state habang tinitingnan kung naka-login o hindi
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      
      {/* CONDITIONAL RENDERING: Kung walang session, ipakita ang AuthScreen */}
      {!session ? (
        <AuthScreen />
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Home') return <HomeIcon color={color} size={size} />;
              if (route.name === 'Meds') return <Pill color={color} size={size} />;
              if (route.name === 'Vitals') return <Activity color={color} size={size} />;
              if (route.name === 'Profile') return <User color={color} size={size} />;
            },
            tabBarActiveTintColor: '#4F46E5',
            tabBarInactiveTintColor: '#94A3B8',
            headerShown: false,
            tabBarStyle: { height: 65, paddingBottom: 10, paddingTop: 10 }
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Meds" component={MedsScreen} />
          <Tab.Screen name="Vitals" component={VitalsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // ... (保留 yung iba mo pang styles sa baba)
});