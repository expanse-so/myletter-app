'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // This would typically be an API call to check the session
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // In a real app, you would validate the token with your API
          // For now, we'll simulate a successful auth with mock data
          setProfile({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
          });
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This would be your API call to sign in
      // For now, we'll simulate a successful sign-in with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful authentication
      localStorage.setItem('auth_token', 'mock_token');
      setProfile({
        id: '1',
        name: 'John Doe',
        email: email,
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Sign in failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This would be your API call to register a new user
      // For now, we'll simulate a successful registration with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration and auto sign-in
      localStorage.setItem('auth_token', 'mock_token');
      setProfile({
        id: '1',
        name: name,
        email: email,
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Sign up failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // This would be your API call to sign out
      // For now, we'll just remove the token from local storage
      localStorage.removeItem('auth_token');
      setProfile(null);
      router.push('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        isLoading,
        isAuthenticated: !!profile,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}