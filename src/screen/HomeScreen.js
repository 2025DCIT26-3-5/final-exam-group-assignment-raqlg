import React, { useState, useCallback, useEffect } from 'react'; // Added useCallback
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Platform,
  Dimensions,
  ActivityIndicator,
  Modal,
  Pressable
} from 'react-native';
import { 
  Bell, 
  Heart, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  User,
  X
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Ensure useFocusEffect is here
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [latestVital, setLatestVital] = useState({ bp: '--/--', hr: '--' });
  const [medProgress, setMedProgress] = useState(0);
  const [upcomingMeds, setUpcomingMeds] = useState([]);
  const [remainingMeds, setRemainingMeds] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  // FETCH FUNCTION
  const fetchDashboardData = async (showSpinner = false) => {
    try {
      if (showSpinner) setLoading(true);
      
      // Fetch Vitals
      const { data: vitalsData } = await supabase
        .from('vitals')
        .select('*')
        .order('created_at', { ascending: false });

      if (vitalsData) {
        const latestBP = vitalsData.find(v => v.type === 'BP')?.value || '--/--';
        const latestHR = vitalsData.find(v => v.type === 'HR')?.value || '--';
        setLatestVital({ bp: latestBP, hr: latestHR });
      }

      // Fetch Meds
      const { data: medsData } = await supabase.from('medications').select('*');

      if (medsData) {
        const total = medsData.length;
        const remaining = medsData.filter(m => !m.is_taken);
        setMedProgress(total > 0 ? Math.round(((total - remaining.length) / total) * 100) : 0);
        setRemainingMeds(remaining);
        setUpcomingMeds(remaining.slice(0, 2));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 1. AUTO-RELOAD ON FOCUS (Tuwing babalik sa page na ito)
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData(); // Reload data when screen is focused
    }, [])
  );

  // 2. REAL-TIME LISTENER (Habang nakabukas ang page)
  useEffect(() => {
    const subscription = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'short', day: 'numeric' 
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* NOTIFICATION DROPDOWN MODAL */}
      <Modal visible={showNotif} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowNotif(false)}>
          <View style={styles.notifDropdown}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotif(false)}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={true}>
              {remainingMeds.length > 0 ? (
                remainingMeds.map(med => (
                  <TouchableOpacity 
                    key={med.id} 
                    style={styles.notifItem}
                    onPress={() => { setShowNotif(false); navigation.navigate('Meds'); }}
                  >
                    <View style={styles.notifDot} />
                    <View>
                      <Text style={styles.notifMedName}>need to take: {med.name}</Text>
                      <Text style={styles.notifTime}>{med.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyNotifText}>no pending medicines.</Text>
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.userCircle}>
             <User size={20} color="#64748B" />
          </View>
          <View style={styles.topBarActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowNotif(true)}>
              <Bell color="#64748B" size={22} strokeWidth={1.5} />
              {remainingMeds.length > 0 && <View style={styles.dotBadge} />}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.dateLabel}>{currentDate}</Text>
            <Text style={styles.welcomeText} numberOfLines={1}>Hello, Dave</Text>
          </View>

          <View style={styles.miniInsight}>
            <Text style={styles.insightText}>
              You've taken <Text style={styles.highlightText}>{medProgress}%</Text> of your meds today.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Overview</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity style={styles.minimalStatCard} onPress={() => navigation.navigate('Vitals')}>
              <View style={[styles.statusDot, {backgroundColor: '#EF4444'}]} />
              <Text style={styles.statLabel}>Heart Rate</Text>
              <View style={styles.valueRow}>
                <Text style={styles.statValue}>{latestVital.hr}</Text>
                <Text style={styles.unit}>bpm</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.minimalStatCard} onPress={() => navigation.navigate('Vitals')}>
              <View style={[styles.statusDot, {backgroundColor: '#3B82F6'}]} />
              <Text style={styles.statLabel}>Blood Pressure</Text>
              <View style={styles.valueRow}>
                <Text style={styles.statValue}>{latestVital.bp}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Upcoming</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Meds')}>
              
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            {loading && <ActivityIndicator size="small" color="#4F46E5" />}
            {upcomingMeds.map((med) => (
              <TouchableOpacity key={med.id} style={styles.activityItem} onPress={() => navigation.navigate('Meds')}>
                <View style={styles.activityIcon}>
                  <CheckCircle2 size={18} color="#94A3B8" strokeWidth={1.5} />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.activityTitle}>{med.name}</Text>
                  <Text style={styles.activityTime}>{med.time}</Text>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingRight: 20, paddingTop: 60 },
  notifDropdown: { width: 250, backgroundColor: 'white', borderRadius: 15, padding: 15, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 5 },
  notifTitle: { fontWeight: '700', color: '#1E293B', fontSize: 14 },
  notifItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#F8FAFC' },
  notifDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444', marginRight: 10 },
  notifMedName: { fontSize: 12, fontWeight: '600', color: '#1E293B' },
  notifTime: { fontSize: 10, color: '#94A3B8' },
  emptyNotifText: { fontSize: 12, color: '#94A3B8', textAlign: 'center', padding: 10 },
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 10 },
  userCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  topBarActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8, position: 'relative' },
  dotBadge: { position: 'absolute', top: 10, right: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  scrollContent: { paddingBottom: 30 },
  welcomeSection: { paddingHorizontal: 25, marginTop: 20 },
  dateLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  welcomeText: { fontSize: 28, fontWeight: '700', color: '#1E293B', marginTop: 4 },
  miniInsight: { marginHorizontal: 25, marginTop: 20, padding: 16, backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  insightText: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  highlightText: { fontWeight: '700', color: '#4F46E5' },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 25, marginTop: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 25 },
  viewAll: { fontSize: 12, color: '#4F46E5', fontWeight: '600', marginTop: 30 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginTop: 12 },
  minimalStatCard: { width: (width - 65) / 2, padding: 16, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginBottom: 8 },
  statLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  unit: { fontSize: 10, color: '#94A3B8', marginLeft: 4 },
  listContainer: { paddingHorizontal: 25, marginTop: 10 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  activityIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  flex1: { flex: 1 },
  activityTitle: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  activityTime: { fontSize: 12, color: '#94A3B8', marginTop: 2 }
});