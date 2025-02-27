import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../hooks/UseAuth';
import { styles } from '../Styles/Styles';

export const ProfileScreen = ({ navigate }) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('login');
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('chat')}>
          <Text style={styles.headerButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.headerButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileContent}>
        <Image 
          source={{ uri: currentUser?.avatar }} 
          style={styles.profileAvatar} 
        />
        <Text style={styles.profileName}>{currentUser?.name}</Text>
        <Text style={styles.profileUsername}>@{currentUser?.username}</Text>

        <View style={styles.profileStats}>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>
              {Math.floor(Math.random() * 50)}
            </Text>
            <Text style={styles.profileStatLabel}>Chats</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>
              {Math.floor(Math.random() * 1000)}
            </Text>
            <Text style={styles.profileStatLabel}>Messages</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>
              {Math.floor(Math.random() * 30) + 1}
            </Text>
            <Text style={styles.profileStatLabel}>Days</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};