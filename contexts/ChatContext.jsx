import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);

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

  const sendMessage = (text) => {
    if (text.trim() === '') return;
    
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
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
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};