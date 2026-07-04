import React, { createContext, useState } from 'react';
export const AuthContext = createContext();
const loadUserFromStorage = () => {
  try {
    const stored = sessionStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUserFromStorage);
  const [token, setToken] = useState(() => loadUserFromStorage()?.token || null);
  const login = (userData) => {
    setUser(userData);
    setToken(userData.token);
    sessionStorage.setItem('userInfo', JSON.stringify(userData));
  };
  const updateUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem('userInfo', JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('userInfo');
  };
  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};