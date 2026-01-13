import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const AddMedModal = ({ visible, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');

  const handleSave = () => {
    if (name && time) {
      onSave(name, time);
      setName(''); // Clear input
      setTime(''); 
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Magdagdag ng Gamot</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="Pangalan ng Gamot (e.g. Biogesic)" 
            value={name}
            onChangeText={setName}
          />

          <TextInput 
            style={styles.input} 
            placeholder="Oras (e.g. 8:00 AM)" 
            value={time}
            onChangeText={setTime}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>I-save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  content: { backgroundColor: 'white', borderRadius: 20, padding: 25 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#1E293B' },
  input: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 10, marginBottom: 15 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { flex: 1, alignItems: 'center', padding: 15 },
  saveBtn: { flex: 2, backgroundColor: '#4F46E5', padding: 15, borderRadius: 12, alignItems: 'center' },
  cancelText: { color: '#64748B', fontWeight: 'bold' },
  saveText: { color: 'white', fontWeight: 'bold' }
});

export default AddMedModal;