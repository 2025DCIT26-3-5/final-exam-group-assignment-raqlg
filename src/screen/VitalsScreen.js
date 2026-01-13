import React, { useState, useEffect } from 'react';
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
  Alert
} from 'react-native';
import { Heart, Activity, Plus, Trash2 } from 'lucide-react-native';
import AddVitalModal from '../components/AddVitalModal';
import { supabase } from '../lib/supabase'; // Siguraduhing tama ang path

const { width, height } = Dimensions.get('window');

export default function VitalsScreen() {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Load vitals data mula sa Supabase
  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVitals(data || []);
    } catch (error) {
      console.error('Error fetching vitals:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. I-save ang bagong vital record
  const onSave = async (type, value) => {
    try {
      const { data, error } = await supabase
        .from('vitals')
        .insert([{ type, value }])
        .select();

      if (error) throw error;

      if (data) {
        setVitals([data[0], ...vitals]);
        setIsModalOpen(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // 3. Burahin ang vital record
  const deleteVital = async (id) => {
    try {
      const { error } = await supabase
        .from('vitals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVitals(vitals.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error deleting vital:', error.message);
    }
  };

  // Helper function para sa formatting ng date/time mula sa database
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.title}>Vitals 📊</Text>
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => setIsModalOpen(true)}
          activeOpacity={0.7}
        >
          <Plus color="white" size={width > 400 ? 26 : 22} />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {vitals.length > 0 ? (
            vitals.map(item => (
              <View key={item.id} style={styles.card}>
                <View style={styles.iconContainer}>
                  {item.type === 'BP' ? <Heart color="#EF4444" size={24} /> : <Activity color="#3B82F6" size={24} />}
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.typeText} numberOfLines={1}>
                    {item.type === 'BP' ? 'Blood Pressure' : 'Heart Rate'}
                  </Text>
                  <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{item.value}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => deleteVital(item.id)}
                  style={styles.deleteBtn}
                  activeOpacity={0.5}
                >
                  <Trash2 color="#FDA4AF" size={20} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Activity size={50} color="#E2E8F0" />
              <Text style={styles.emptyText}>No records yet. Tap + to add.</Text>
            </View>
          )}
        </ScrollView>
      )}

      <AddVitalModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={onSave} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, 
    paddingBottom: 20, 
    backgroundColor: '#FFFFFF', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  title: { fontSize: width > 400 ? 28 : 24, fontWeight: '800', color: '#1E293B' },
  addBtn: { 
    backgroundColor: '#4F46E5', padding: 10, borderRadius: 12, elevation: 2,
    shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4
  },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: { 
    backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, flexDirection: 'row', 
    alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 } }),
  },
  iconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  infoContainer: { flex: 1, marginLeft: 15 },
  typeText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  timeText: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  valueContainer: { marginRight: 10, alignItems: 'flex-end' },
  valueText: { fontSize: width > 400 ? 18 : 16, fontWeight: '800', color: '#1E293B' },
  deleteBtn: { padding: 8 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: height * 0.2 },
  emptyText: { color: '#94A3B8', marginTop: 10, fontSize: 14, fontWeight: '500' }
});