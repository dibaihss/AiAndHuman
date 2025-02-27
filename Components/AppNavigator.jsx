import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/UseAuth';


import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import { ChatScreen } from './ChatScreen';
import { ProfileScreen } from './ProfileScreen';

export const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentScreen('chat');
    } else {
      setCurrentScreen('login');
    }
  }, [isAuthenticated]);

  const navigate = (screenName) => {
    setCurrentScreen(screenName);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen navigate={navigate} />;
      case 'register':
        return <RegisterScreen navigate={navigate} />;
      case 'chat':
        return <ChatScreen navigate={navigate} />;
      case 'profile':
        return <ProfileScreen navigate={navigate} />;
      default:
        return <LoginScreen navigate={navigate} />;
    }
  };

  return renderScreen();
};