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
import { Pill, Plus, Clock, CheckCircle2, Circle, Trash2 } from 'lucide-react-native';
import AddMedModal from '../components/AddMedModal';
import { supabase } from '../lib/supabase'; 

const { width, height } = Dimensions.get('window');

export default function MedsScreen() {
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  useEffect(() => {
    fetchMeds();
  }, []);

  const fetchMeds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMeds(data || []);
    } catch (error) {
      console.error('Error fetching meds:', error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleAddMed = async (name, time) => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .insert([{ name, time, is_taken: false }])
        .select();

      if (error) throw error;
      
      if (data) {
        setMeds([data[0], ...meds]);
        setIsModalOpen(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };


  const toggleTaken = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('medications')
        .update({ is_taken: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
 
      setMeds(meds.map(m => m.id === id ? { ...m, is_taken: !currentStatus } : m));
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

 
  const deleteMed = async (id) => {
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMeds(meds.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting med:', error.message);
    }
  };

  const completed = meds.filter(m => m.is_taken).length;
  const total = meds.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.medHeader}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.medTitle}>MEDICINE</Text>
          <Text style={styles.medSubtitle} numberOfLines={1}>
            {loading ? "Loading..." : total === 0 ? "No Schedule" : `${completed} out of ${total} medicines taken today`}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addIconBtn} 
          onPress={() => setIsModalOpen(true)}
          activeOpacity={0.7}
        >
          <Plus color="#4F46E5" size={26} />
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
          {total > 0 && (
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Daily Progress</Text>
                <Text style={styles.progressValue}>
                  {total > 0 ? Math.round((completed / total) * 100) : 0}%
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${(completed / total) * 100}%` }]} />
              </View>
            </View>
          )}

          <View style={styles.listSection}>
            {meds.length > 0 ? (
              meds.map((item) => (
                <View key={item.id} style={[styles.modernMedCard, item.is_taken && styles.medCardDone]}>
                  <TouchableOpacity 
                    onPress={() => toggleTaken(item.id, item.is_taken)}
                    style={styles.checkArea}
                    activeOpacity={0.6}
                  >
                    {item.is_taken ? 
                      <CheckCircle2 color="#10B981" size={24} /> : 
                      <Circle color="#CBD5E1" size={24} />
                    }
                  </TouchableOpacity>

                  <View style={styles.medDetails}>
                    <Text 
                      style={[styles.medNameText, item.is_taken && styles.textStrikethrough]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <View style={styles.timeInfo}>
                      <Clock size={12} color="#64748B" />
                      <Text style={styles.medTimeText}>{item.time}</Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    onPress={() => deleteMed(item.id)} 
                    style={styles.deleteBtn}
                  >
                    <Trash2 color="#FDA4AF" size={18} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Pill size={50} color="#E2E8F0" />
                <Text style={styles.emptyText}>Tap the + to add a medicine</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      <AddMedModal 
        visible={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddMed} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  medHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, 
    paddingBottom: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  headerTextGroup: { flex: 1, marginRight: 15 },
  medTitle: { fontSize: width > 400 ? 28 : 24, fontWeight: '800', color: '#1E293B' },
  medSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  addIconBtn: { backgroundColor: '#EEF2FF', padding: 10, borderRadius: 12 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  progressCard: { 
    backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, marginBottom: 25, 
    borderWidth: 1, borderColor: '#F1F5F9',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 } })
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  progressLabel: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  progressValue: { fontSize: 16, fontWeight: '800', color: '#4F46E5' },
  progressBarContainer: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4F46E5', borderRadius: 3 },
  listSection: { marginTop: 5 },
  modernMedCard: { 
    backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', 
    padding: 14, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' 
  },
  medCardDone: { backgroundColor: '#F8FAFC', opacity: 0.7 },
  checkArea: { paddingRight: 12 },
  medDetails: { flex: 1 },
  medNameText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  timeInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  medTimeText: { fontSize: 12, color: '#94A3B8', marginLeft: 5 },
  textStrikethrough: { textDecorationLine: 'line-through', color: '#CBD5E1' },
  deleteBtn: { padding: 8 },
  emptyState: { alignItems: 'center', marginTop: height * 0.15 },
  emptyText: { color: '#94A3B8', marginTop: 15, fontSize: 14, fontWeight: '500' }
});