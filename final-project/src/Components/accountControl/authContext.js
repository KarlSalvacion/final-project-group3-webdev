import { createContext, useContext, useState } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the authentication context
export const useAuth = () => useContext(AuthContext);

// AuthProvider to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const login = (user) => {
    setIsLoggedIn(true);
    setUsername(user.username);
    localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store in localStorage
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('loggedInUser'); // Remove from localStorage
  };

  const setAuthState = ({ isLoggedIn, username }) => {
    setIsLoggedIn(isLoggedIn);
    setUsername(username);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};