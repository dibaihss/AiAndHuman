import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ScrollView,
} from 'react-native';

// Initialize mock user data
const initialUsers = [
  { id: '1', username: 'demo', password: 'password', name: 'Demo User', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', username: 'chatbot', password: 'chatbot123', name: 'Chat Bot', avatar: 'https://i.pravatar.cc/150?img=2' }
];

// Create Contexts
const AuthContext = createContext();
const ChatContext = createContext();

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login function
  const login = (username, password) => {
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    );
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid username or password' };
    }
  };

  // Register function
  const register = (userData) => {
    const { username, password, name } = userData;
    
    // Check if username already exists
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already taken' };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      name,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    return { success: true };
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      users, 
      currentUser, 
      isAuthenticated, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Chat Provider Component
const ChatProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  // Initialize messages when user changes
  useEffect(() => {
    if (currentUser) {
      setMessages([
        { 
          id: '1', 
          text: "Hello there!", 
          sender: "bot", 
          timestamp: new Date().toISOString() 
        },
        { 
          id: '2', 
          text: `Welcome ${currentUser?.name || 'User'}! How can I help you today?`, 
          sender: "bot", 
          timestamp: new Date().toISOString() 
        }
      ]);
    }
  }, [currentUser]);

  // Send message function
  const sendMessage = (text) => {
    if (text.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Simulate a bot response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: `I received your message: "${text}"`,
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom Hooks
const useAuth = () => useContext(AuthContext);
const useChat = () => useContext(ChatContext);

// ChatAppp Component with Navigation
const ChatApp = () => {
  const [screen, setScreen] = useState('login');

  return (
    <AuthProvider>
      <ChatProvider>
        <SafeAreaView style={styles.container}>
          <AppNavigator initialScreen={screen} setScreen={setScreen} />
        </SafeAreaView>
      </ChatProvider>
    </AuthProvider>
  );
};

// Navigator Component
const AppNavigator = ({ initialScreen, setScreen }) => {
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const { isAuthenticated } = useAuth();

  // Update screen when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentScreen('chat');
    } else {
      setCurrentScreen('login');
    }
  }, [isAuthenticated]);

  // Update parent's screen state
  useEffect(() => {
    setScreen(currentScreen);
  }, [currentScreen, setScreen]);

  // Navigation functions
  const navigate = (screenName) => {
    setCurrentScreen(screenName);
  };

  // Render the appropriate screen
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

// Login Screen
const LoginScreen = ({ navigate }) => {
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

// Register Screen
const RegisterScreen = ({ navigate }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    // Basic validation
    if (!username || !password || !name) {
      setError('Please fill all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Register user
    const result = register({ username, password, name });
    
    if (result.success) {
      Alert.alert('Success', 'Account created successfully!');
      navigate('login');
    } else {
      setError(result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.authContainer}>
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
    </ScrollView>
  );
};

// Chat Screen
const ChatScreen = ({ navigate }) => {
  const { currentUser, logout } = useAuth();
  const { messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    sendMessage(newMessage);
    setNewMessage('');
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    const messageTime = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
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

// Profile Screen
const ProfileScreen = ({ navigate }) => {
  const { currentUser, logout } = useAuth();

  return (
    <View style={styles.profileContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('chat')}>
          <Text style={styles.headerButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.headerButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileContent}>
        <Image source={{ uri: currentUser.avatar }} style={styles.profileAvatar} />
        <Text style={styles.profileName}>{currentUser.name}</Text>
        <Text style={styles.profileUsername}>@{currentUser.username}</Text>
        
        <View style={styles.profileStats}>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>{Math.floor(Math.random() * 50)}</Text>
            <Text style={styles.profileStatLabel}>Chats</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>{Math.floor(Math.random() * 1000)}</Text>
            <Text style={styles.profileStatLabel}>Messages</Text>
          </View>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatNumber}>{Math.floor(Math.random() * 30) + 1}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
  },
  headerButtonText: {
    color: '#1e88e5',
    fontWeight: 'bold',
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 10,
  },
  messageBubble: {
    flexDirection: 'row',
    maxWidth: '80%',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#1e88e5',
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 5,
  },
  botBubble: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 5,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 5,
    color: 'rgba(0, 0, 0, 0.5)',
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Auth styles
  authContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  authInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  authButton: {
    backgroundColor: '#1e88e5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authLink: {
    color: '#1e88e5',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  // Profile styles
  profileContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileContent: {
    alignItems: 'center',
    padding: 20,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileUsername: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  editProfileButton: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatApp;