import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { User, AuthStatus, UserProfileUpdate } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  login: (identifier: string, passwordAttempt: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Omit<User, 'id' | 'username' | 'isAdmin' | 'isVerified' | 'balance' | 'notifications' | 'profilePictureUrl'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  verifyEmail: (email: string) => Promise<boolean>;
  refreshUser: () => void;
  updateProfile: (updatedData: UserProfileUpdate) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.LOADING);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    setStatus(currentUser ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (identifier: string, passwordAttempt: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    const result = await authService.login(identifier, passwordAttempt);
    if (result.user) {
      setUser(result.user);
      setStatus(AuthStatus.AUTHENTICATED);
      setIsLoading(false);
      return { success: true };
    } else {
      const errorMsg = result.error || 'Invalid credentials or unverified account.';
      setError(errorMsg);
      setStatus(AuthStatus.UNAUTHENTICATED);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const register = async (userData: Omit<User, 'id' | 'username' | 'isAdmin' | 'isVerified' | 'balance' | 'notifications' | 'profilePictureUrl'> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    const result = await authService.register(userData);
    if (result.user) {
      setIsLoading(false);
      return { success: true };
    } else {
      const errorMsg = result.error || 'Registration failed. Email might be taken or password too weak.';
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const clearError = () => setError(null);

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setStatus(AuthStatus.UNAUTHENTICATED);
    setError(null);
  };

  const verifyEmail = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    const success = await authService.verifyEmail(email);
    if (success) {
      refreshUser();
    } else {
      setError('Email verification failed. User not found.');
    }
    setIsLoading(false);
    return success;
  };

  const updateProfile = async (updatedData: UserProfileUpdate): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    if (!user) {
      setError("No user logged in to update profile.");
      setIsLoading(false);
      return false;
    }
    try {
      await authService.updateUserInfo({ ...updatedData, id: user.id });
      refreshUser();
      setIsLoading(false);
      return true;
    } catch (e: any) {
      setError(e.message || "Failed to update profile.");
      setIsLoading(false);
      return false;
    }
  };

  const value = {
    user,
    status,
    login,
    register,
    logout,
    isLoading,
    error,
    clearError,
    verifyEmail,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
