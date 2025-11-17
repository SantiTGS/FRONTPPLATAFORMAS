import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import authService from '@/services/auth.service';
import { User, AuthContextType, RegisterData } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  };

  // Computed value
  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      
      // Redirigir según el rol
      if (response.user.role === 'driver') {
        router.push('/driver/dashboard');
      } else if (response.user.role === 'passenger') {
        router.push('/passenger/dashboard');
      } else if (response.user.role === 'admin') {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      
      // Redirigir según el rol
      if (response.user.role === 'driver') {
        router.push('/driver/dashboard');
      } else if (response.user.role === 'passenger') {
        router.push('/passenger/dashboard');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated,  // ← AGREGADO aquí
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};