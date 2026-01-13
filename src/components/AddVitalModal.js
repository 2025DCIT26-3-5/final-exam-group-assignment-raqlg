import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const AddVitalModal = ({ visible, onClose, onSave }) => {
  const [type, setType] = useState('BP');
  const [val, setVal] = useState('');

  const handleSave = () => {
    if (val) {
      onSave(type, val);
      setVal('');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.content}>
        <Text style={styles.title}>Log Vital Sign</Text>
        <View style={styles.row}>
          {['BP', 'HR'].map(t => (
            <TouchableOpacity 
              key={t} 
              style={[styles.typeBtn, type === t && styles.activeBtn]} 
              onPress={() => {
                setType(t);
                setVal('');
              }}
            >
              <Text style={{color: type === t ? 'white' : 'black', fontWeight: '600'}}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput 
          style={styles.input} 

          placeholder={type === 'BP' ? "Halimbawa: 120/80 mmHg" : "Halimbawa: 75 BPM"} 
          placeholderTextColor="#94A3B8"
          value={val} 
          onChangeText={setVal} 
          keyboardType={type === 'BP' ? "default" : "numeric"} 
        />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{marginTop: 15, alignItems: 'center'}}>
            <Text style={{color: '#64748B'}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  content: { backgroundColor: 'white', padding: 25, borderRadius: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  typeBtn: { padding: 10, borderRadius: 10, width: '45%', alignItems: 'center', backgroundColor: '#E2E8F0' },
  activeBtn: { backgroundColor: '#4F46E5' },
  input: { backgroundColor: '#F1F5F9', padding: 15, borderRadius: 10, marginBottom: 15 },
  saveBtn: { backgroundColor: '#4F46E5', padding: 15, borderRadius: 10, alignItems: 'center' }
});

export default AddVitalModal;