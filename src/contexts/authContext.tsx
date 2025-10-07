"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  userName: string;
  number: string;
  address?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: { number: string }) => Promise<void>;
  register: (userData: { userName: string; number: string; address?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin phone number constant
const ADMIN_PHONE_NUMBER = '0534686069';

// Helper to explain network errors
const explainError = (error: unknown) => {
  const message = (error as Error)?.message || '';
  if (message.includes('aborted')) return 'Request timed out. Please try again.';
  if (message.includes('Failed to fetch')) return 'Could not connect to server. Please check your internet connection.';
  return message || 'An unexpected error occurred. Please try again.';
};

// Fetch with timeout
async function fetchWithTimeout(input: RequestInfo, init?: RequestInit, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

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
      const response = await fetchWithTimeout('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const userWithAdminFlag = {
          ...data.data,
          isAdmin: data.data.number === ADMIN_PHONE_NUMBER
        };
        setUser(userWithAdminFlag);
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
      const response = await fetchWithTimeout('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMessage = `${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {}
        
        if (response.status === 400) throw new Error('Phone number is required');
        if (response.status === 401) throw new Error('Invalid phone number');
        throw new Error(`Login failed: ${errorMessage}`);
      }

      const data = await response.json();
      if (!data?.success || !data?.data?.token) {
        throw new Error('Invalid server response');
      }

      const { token, user: userData } = data.data;
      const userWithAdminFlag = {
        ...userData,
        isAdmin: userData.number === ADMIN_PHONE_NUMBER
      };

      localStorage.setItem('authToken', token);
      setUser(userWithAdminFlag);
    } catch (error) {
      throw new Error(explainError(error));
    }
  };

  const register = async (userData: { userName: string; number: string; address?: string }) => {
    try {
      const response = await fetchWithTimeout('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMessage = `${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {}
        
        if (response.status === 409) throw new Error('Phone number already registered');
        if (response.status === 400) throw new Error('Name and phone number are required');
        throw new Error(`Registration failed: ${errorMessage}`);
      }

      const data = await response.json();
      if (!data?.success || !data?.data?.token) {
        throw new Error('Invalid server response');
      }

      const { token, user: newUser } = data.data;
      const userWithAdminFlag = {
        ...newUser,
        isAdmin: newUser.number === ADMIN_PHONE_NUMBER
      };

      localStorage.setItem('authToken', token);
      setUser(userWithAdminFlag);
    } catch (error) {
      throw new Error(explainError(error));
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
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