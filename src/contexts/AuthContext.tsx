import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'demo_teacher',
    name: 'Demo Teacher',
    email: 'demo@teacher.com',
    role: 'teacher'
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading] = useState(false);

  const login = async (email: string) => {
    // Mock login - always succeeds
    const mockUser = { id: 'demo-user', name: 'Demo Teacher', email, role: 'teacher' };
    const mockToken = 'demo-token';
    
    localStorage.setItem('token', mockToken);
    setToken(mockToken);
    setUser(mockUser);
  };

  const register = async (name: string, email: string) => {
    // Mock registration - always succeeds
    const mockUser = { id: 'demo-user', name, email, role: 'teacher' };
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