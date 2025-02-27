import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useChat } from '../hooks/UseChat';
import { useAuth } from '../hooks/UseAuth';
import { styles } from '../Styles/Styles';

export const ChatScreen = ({ navigate }) => {
    const { currentUser, logout, initialUsers } = useAuth();
    const { messages, sendMessage } = useChat();
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        sendMessage(newMessage);
        setNewMessage('');
    };

    const renderItem = ({ item }) => {
        const isUser = item.sender === 'user';
        const messageTime = new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    
        return (
            <View style={[
                styles.messageBubble,
                isUser ? styles.userMessage : styles.botMessage
            ]}>
                {!isUser && (
                    <Image source={{ uri: initialUsers[1].avatar }} style={styles.avatar} />
                )}
                <View style={isUser ? styles.userBubble : styles.botBubble}>
                    <Text style={isUser ? styles.userMessageText : styles.botMessageText}>
                        {item.text}
                    </Text>
                    <Text style={styles.timestamp}>{messageTime}</Text>
                </View>
                {isUser && (
                    <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
                )}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={100}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chat</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => navigate('profile')} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesContainer}
            />
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor="#888"
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSend}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};