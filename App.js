import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  SafeAreaView, StatusBar 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pill, Activity, User, Plus, Home as HomeIcon, Heart } from 'lucide-react-native';


import MedsScreen from './src/screen/MedsScreen'; 
import VitalsScreen from './src/screen/VitalsScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import HomeScreen from './src/screen/HomeScreen';


const HealthStatCard = ({ label, value, unit, icon, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 5 }]}>
    {icon}
    <Text style={styles.statLabel}>{label}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statUnit}> {unit}</Text>
    </View>
  </View>
);



const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
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
    </NavigationContainer>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', paddingTop: 50 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  subGreeting: { fontSize: 14, color: '#64748B' },
  profileBtn: { padding: 10, backgroundColor: '#EEF2FF', borderRadius: 12 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1E293B', marginTop: 10 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { backgroundColor: 'white', padding: 15, borderRadius: 15, width: '48%', elevation: 2 },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 8 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginTop: 4 },
  statUnit: { fontSize: 12, color: '#94A3B8' },
  medCard: { backgroundColor: 'white', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, elevation: 2 },
  medInfo: { flexDirection: 'row', alignItems: 'center' },
  pillIcon: { backgroundColor: '#D1FAE5', padding: 10, borderRadius: 12, marginRight: 15 },
  medName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  medTime: { fontSize: 12, color: '#64748B' },
  checkBtn: { backgroundColor: '#10B981', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#4F46E5', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
});