"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  userName: string;
  number: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { number: string }) => Promise<void>;
  register: (userData: { userName: string; number: string; address?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-two-chi-43.vercel.app';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user info
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
      } else {

        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { number: string }) => {
    try {
      console.log('Attempting login with URL:', `${API_BASE_URL}/api/auth/login`);
      console.log('Credentials:', credentials);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Login response data:', data);

      if (data.success && data.data) {
        const { token, user: userData } = data.data;
        localStorage.setItem('authToken', token);
        setUser(userData);
      } else {
        throw new Error(data.error || data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Could not connect to server. Please check your internet connection.');
      }
      throw error;
    }
  };

  const register = async (userData: { 
    userName: string; 
    number: string; 
    address?: string; 
  }) => {
    try {
      console.log('Attempting registration with URL:', `${API_BASE_URL}/api/auth/register`);
      console.log('User data:', userData);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Registration response status:', response.status);
      console.log('Registration response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration error response:', errorText);
        throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Registration response data:', data);

      if (data.success && data.data) {
        const { token, user: newUser } = data.data;
        localStorage.setItem('authToken', token);
        setUser(newUser);
      } else {
        throw new Error(data.error || data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Could not connect to server. Please check your internet connection.');
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};