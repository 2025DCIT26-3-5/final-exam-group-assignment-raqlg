import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Pill, Activity, User, Plus } from 'lucide-react-native';

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

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Kumusta!</Text>
          <Text style={styles.subGreeting}>Dashboard ng iyong kalusugan.</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <User color="#4F46E5" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={styles.sectionTitle}>Health Status</Text>
        <View style={styles.statsGrid}>
          <HealthStatCard label="Blood Pressure" value="120/80" unit="mmHg" color="#EF4444" icon={<Activity size={20} color="#EF4444" />} />
          <HealthStatCard label="Heart Rate" value="72" unit="bpm" color="#3B82F6" icon={<Activity size={20} color="#3B82F6" />} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gamot Ngayong Araw</Text>
        </View>

        <View style={styles.medCard}>
          <View style={styles.medInfo}>
            <View style={styles.pillIcon}><Pill color="#10B981" size={24} /></View>
            <View>
              <Text style={styles.medName}>Paracetamol</Text>
              <Text style={styles.medTime}>8:00 AM • Pagkatapos kumain</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.checkBtn}><Text style={{ color: 'white', fontWeight: 'bold' }}>Inom na</Text></TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}><Plus color="white" size={30} /></TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  subGreeting: { fontSize: 14, color: '#64748B' },
  profileBtn: { padding: 10, backgroundColor: '#EEF2FF', borderRadius: 12 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1E293B' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { backgroundColor: 'white', padding: 15, borderRadius: 15, width: '48%', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 8 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginTop: 4 },
  statUnit: { fontSize: 12, color: '#94A3B8' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  medCard: { backgroundColor: 'white', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  medInfo: { flexDirection: 'row', alignItems: 'center' },
  pillIcon: { backgroundColor: '#D1FAE5', padding: 10, borderRadius: 12, marginRight: 15 },
  medName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  medTime: { fontSize: 12, color: '#64748B' },
  checkBtn: { backgroundColor: '#10B981', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10 },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#4F46E5', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
});