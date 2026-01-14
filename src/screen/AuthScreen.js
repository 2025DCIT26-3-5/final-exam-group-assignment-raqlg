import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    // Basic validation
    if (!email.trim() || !password.trim() || (isSignUp && !fullName.trim())) {
      Alert.alert('Error', 'Pakisagutan ang lahat ng fields.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // SIGN UP logic
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: { 
              full_name: fullName.trim(),
            }
          }
        });

        if (error) throw error;


        if (data.user && !data.session) {
          Alert.alert('Success!', 'Account created! Pakicheck ang iyong email para sa confirmation link bago mag-login.');
          setIsSignUp(false);
        } else {
          Alert.alert('Success!', 'Account created and logged in!');
        }

      } else {
        // LOGIN logic
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;
      }
    } catch (error) {

      console.error('Auth Error:', error.message);
      Alert.alert('Auth Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.logo}>💊 MedReminder</Text>
        <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
        
        {isSignUp && (
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
        )}

        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.mainBtn} 
          onPress={handleAuth} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => {
            setIsSignUp(!isSignUp);
            setFullName('');
          }} 
          style={styles.switchBtn}
        >
          <Text style={styles.switchText}>
            {isSignUp 
              ? 'Already have an account? Login' 
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  innerContainer: { flex: 1, justifyContent: 'center', padding: 25 },
  logo: { fontSize: 24, fontWeight: '800', color: '#4F46E5', textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: '700', color: '#1E293B', textAlign: 'center', marginBottom: 30 },
  input: { 
    backgroundColor: '#F8FAFC', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    color: '#1E293B'
  },
  mainBtn: { 
    backgroundColor: '#4F46E5', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 2
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  switchBtn: { marginTop: 25 },
  switchText: { color: '#64748B', textAlign: 'center', fontSize: 14, fontWeight: '500' }
});