import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/UseAuth';
import { styles } from '../Styles/Styles';

export const LoginScreen = ({ navigate }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        const result = login(username, password);
        if (!result.success) {
            setError(result.error);
        }
    };

    return (
        <View style={styles.authContainer}>
            <Text style={styles.authTitle}>Login to Chat</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

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

            <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
                <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigate('register')}>
                <Text style={styles.authLink}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
};