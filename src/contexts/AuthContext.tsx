import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'demo-user',
    name: 'Demo Teacher',
    email: 'demo@teacher.com'
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // Mock login - always succeeds
    const mockUser = { id: 'demo-user', name: 'Demo Teacher', email };
    const mockToken = 'demo-token';
    
    localStorage.setItem('token', mockToken);
    setToken(mockToken);
    setUser(mockUser);
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration - always succeeds
    const mockUser = { id: 'demo-user', name, email };
    const mockToken = 'demo-token';
    
    localStorage.setItem('token', mockToken);
    setToken(mockToken);
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};