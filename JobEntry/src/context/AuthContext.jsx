import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Manages user authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Load user profile on mount if token exists
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, []);

  /**
   * Fetch user profile
   */
  const fetchProfile = async () => {
    setLoading(true);
    const response = await authAPI.getProfile(token);
    setLoading(false);

    if (response.success) {
      // Safely extract user from potential nested structures
      const userData = response.data?.data?.user || response.data?.user || response.data?.data || response.data;
      setUser(userData);
    } else {
      // Token invalid, logout
      logout();
    }
  };

  /**
   * Register new user
   */
  const register = async (userData) => {
    setLoading(true);
    const response = await authAPI.register(userData);
    setLoading(false);

    if (response.success) {
      const { token: newToken, user: newUser } = response.data.data;
      
      // Override role with the one requested if the mock backend drops it or sets it to default
      if (userData.role) {
        newUser.role = userData.role;
      }

      setAuthToken(newToken);
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      
      // Return the updated user object so caller components get the correct role
      const updatedData = { ...response.data.data, user: newUser };
      return { success: true, data: updatedData };
    }

    return { success: false, error: response.error };
  };

  /**
   * Login user
   */
 const login = async (credentials) => {
  setLoading(true);
  const response = await authAPI.login(credentials);
  setLoading(false);

  if (response.success) {
    const { token: newToken, user: newUser } = response.data.data; // ← thêm .data
    setAuthToken(newToken);
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    return { success: true, data: response.data.data }; // ← thêm .data
  }

  return { success: false, error: response.error };
};

  /**
   * Logout user
   */
  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Update user profile
   */
  const updateProfile = async (profileData) => {
    setLoading(true);
    const response = await authAPI.updateProfile(profileData, token);
    setLoading(false);

    if (response.success) {
      setUser(response.data);
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error };
  };

  /**
   * Change password
   */
  const changePassword = async (passwordData) => {
    setLoading(true);
    const response = await authAPI.changePassword(passwordData, token);
    setLoading(false);

    if (response.success) {
      return { success: true };
    }

    return { success: false, error: response.error };
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use Auth Context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
