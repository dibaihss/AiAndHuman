import React, { createContext, useState } from 'react';

const initialUsers = [
  { id: '1', username: 'demo', password: 'password', name: 'Demo User', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', username: 'chatbot', password: 'chatbot123', name: 'Chat Bot', avatar: 'https://i.pravatar.cc/150?img=2' }
];

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (username, password) => {
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    );
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const register = (userData) => {
    const { username, password, name } = userData;
    
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already taken' };
    }
    
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
      logout,
      initialUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};