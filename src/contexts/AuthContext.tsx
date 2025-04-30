import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User, AuthContextType} from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      // We don't have a specific user endpoint in our NestJS API
      // So we'll use the my-urls endpoint as a proxy to check if the token is valid
      await api.get('/url/my-urls');
      // If we got here, the token is valid, so we can consider the user authenticated
      // Set user to a placeholder - in a real app, we might make a /me endpoint to get user details
      setUser({
        id: 'authenticated',
        email: 'user@example.com',
        name: 'Authenticated User',
      });
    } catch (error) {
      // If there's an error, the token is invalid or expired
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    console.log({
      email,password
    }, 'cred')
    const response = await api.post('/auth/login', { email, password });

    console.log(response, 'response from server')

    const { accessToken } = response.data;
    localStorage.setItem('token', accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

  
    
    // // Set user to a placeholder - in a real app, we'd make a /me endpoint to get user details
    setUser({
      id: response.data._id,
      email: response.data.email,
      name: response.data.name,
    });
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const response = await api.post('/auth/register', { name, email, password });
    console.log(response , 'response registration')
    // After registration, login automatically
    await login(email, password);
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};