import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../hooks/UseAuth';
import { styles } from '../Styles/Styles';

export const RegisterScreen = ({ navigate }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!username || !password || !name) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = register({ username, password, name });
    if (result.success) {
      Alert.alert('Success', 'Account created successfully!');
      navigate('login');
    } else {
      setError(result.error);
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.authTitle}>Create Account</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TextInput
        style={styles.authInput}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.authInput}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.authInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={styles.authInput}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.authButton} onPress={handleRegister}>
        <Text style={styles.authButtonText}>Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigate('login')}>
        <Text style={styles.authLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};