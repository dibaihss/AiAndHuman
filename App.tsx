import React from 'react';
import { SafeAreaView } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { styles } from './Styles/Styles';
import { AppNavigator } from './Components/AppNavigator';


export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <SafeAreaView style={styles.container}>
          <AppNavigator />
        </SafeAreaView>
      </ChatProvider>
    </AuthProvider>
  );
}