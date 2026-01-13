import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Switch,
  Platform,
  Dimensions 
} from 'react-native';
import { User, ShieldAlert, Phone, LogOut, ChevronRight, Settings } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header - Responsive Design */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={width * 0.12} color="#4F46E5" />
            </View>
            <TouchableOpacity style={styles.editBadge} activeOpacity={0.8}>
              <Text style={styles.editText}>EDIT</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Dave Arnuco</Text>
          <Text style={styles.userID}>Patient ID: #2026-001</Text>
        </View>

        <View style={styles.content}>
          
          {/* Section: Medical Emergency Card */}
          <Text style={styles.sectionLabel}>Emergency Medical ID</Text>
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyRow}>
              <View style={styles.emItem}>
                <Text style={styles.emLabel}>Blood Type</Text>
                <Text style={styles.emValue}>O+</Text>
              </View>
              <View style={styles.emItem}>
                <Text style={styles.emLabel}>Allergies</Text>
                <Text style={styles.emValue}>Penicillin</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.emergencyRow}>
              <View style={styles.emItem}>
                <Text style={styles.emLabel}>Emergency Contact</Text>
                <Text style={styles.emValue}>Maria (Wife)</Text>
                <Text style={styles.emPhone}>0912-345-6789</Text>
              </View>
              <TouchableOpacity style={styles.callBtn} activeOpacity={0.7}>
                <Phone color="white" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: Settings */}
          <Text style={[styles.sectionLabel, { marginTop: 30 }]}>App Settings</Text>
          <View style={styles.settingsGroup}>
            <View style={styles.settingItem}>
              <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                <Settings color="#4F46E5" size={20} />
              </View>
              <Text style={styles.settingText}>Meds Reminder</Text>
              <Switch 
                value={notifications} 
                onValueChange={setNotifications}
                trackColor={{ false: "#CBD5E1", true: "#4F46E5" }}
                ios_backgroundColor="#CBD5E1"
                style={Platform.OS === 'ios' ? { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] } : {}}
              />
            </View>

            <TouchableOpacity style={styles.settingItem} activeOpacity={0.6}>
              <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                <ShieldAlert color="#10B981" size={20} />
              </View>
              <Text style={styles.settingText}>Privacy & Security</Text>
              <ChevronRight color="#CBD5E1" size={20} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.5}>
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>MyHealth App v1.2.0 (Stable)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  scrollContent: {
    paddingBottom: 40
  },
  header: { 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 40, 
    backgroundColor: 'white', 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarContainer: { 
    position: 'relative', 
    marginBottom: 15 
  },
  avatar: { 
    width: width * 0.25, 
    height: width * 0.25, 
    borderRadius: (width * 0.25) / 2, 
    backgroundColor: '#EEF2FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 4, 
    borderColor: '#F8FAFC' 
  },
  editBadge: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#4F46E5', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12, 
    borderWidth: 3, 
    borderColor: 'white' 
  },
  editText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: '800' 
  },
  userName: { 
    fontSize: width * 0.06, 
    fontWeight: 'bold', 
    color: '#1E293B' 
  },
  userID: { 
    fontSize: 13, 
    color: '#64748B', 
    marginTop: 4 
  },
  content: { 
    paddingHorizontal: 20,
    paddingTop: 25
  },
  sectionLabel: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: '#94A3B8', 
    textTransform: 'uppercase', 
    letterSpacing: 1.2, 
    marginBottom: 12 
  },
  emergencyCard: { 
    backgroundColor: '#FFF1F2', 
    padding: 20, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: '#FECDD3' 
  },
  emergencyRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  emItem: { 
    flex: 1 
  },
  emLabel: { 
    fontSize: 11, 
    color: '#E11D48', 
    fontWeight: '700' 
  },
  emValue: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#881337', 
    marginTop: 2 
  },
  emPhone: { 
    fontSize: 12, 
    color: '#BE123C', 
    marginTop: 2 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#FEE2E2', 
    marginVertical: 15 
  },
  callBtn: { 
    backgroundColor: '#E11D48', 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  settingsGroup: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden' 
  },
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F8FAFC' 
  },
  iconBox: { 
    padding: 10, 
    borderRadius: 12, 
    marginRight: 15 
  },
  settingText: { 
    flex: 1, 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#1E293B' 
  },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 30, 
    padding: 10 
  },
  logoutText: { 
    marginLeft: 10, 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#EF4444' 
  },
  versionText: { 
    textAlign: 'center', 
    color: '#CBD5E1', 
    fontSize: 12, 
    marginTop: 15 
  }
});