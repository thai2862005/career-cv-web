import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

// Role definitions with IDs
export const ROLES = {
  JOB_SEEKER: { id: 1, name: 'JOB_SEEKER', display: 'Job Seeker' },
  HR: { id: 2, name: 'HR', display: 'HR / Recruiter' },
  ADMIN: { id: 3, name: 'ADMIN', display: 'Admin' },
};

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

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    removeAuthToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Fetch user profile
   */
  const fetchProfile = useCallback(async (authToken) => {
    if (!authToken) return;
    
    try {
      setLoading(true);
      const response = await authAPI.getProfile(authToken);
      setLoading(false);

      if (response.success) {
        // Safely extract user from potential nested structures
        const userData = response.data?.data?.user || response.data?.user || response.data?.data || response.data;
        
        // Ensure user has role data
        if (userData) {
          const userRole = userData?.role || userData?.Role || 'JOB_SEEKER';
          const roleKey = String(userRole).toUpperCase().trim();
          const roleObj = ROLES[roleKey] || ROLES.JOB_SEEKER;
          
          userData.roleId = userData.roleId || roleObj.id;
          userData.role = userData.role || roleObj.name;
          userData.roleDisplay = userData.roleDisplay || roleObj.display;
          
          setUser(userData);
        }
      } else {
        // Token invalid, logout
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setLoading(false);
      logout();
    }
  }, [logout]);

  // Load user profile on mount if token exists
  useEffect(() => {
    if (token) {
      fetchProfile(token);
    }
  }, []);

  /**
   * Register new user
   */
  const register = async (userData) => {
    // Validate role is provided
    if (!userData.role) {
      return { success: false, error: 'Role is required' };
    }

    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      setLoading(false);

      if (response.success) {
        const { token: newToken, user: newUser } = response.data.data;
        
        // Get role object from ROLES mapping
        const roleKey = userData.role;
        const roleObj = ROLES[roleKey] || ROLES.JOB_SEEKER;
        
        // Ensure user has role ID and role name
        newUser.roleId = roleObj.id;
        newUser.role = roleObj.name;
        newUser.roleDisplay = roleObj.display;

        setAuthToken(newToken);
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        
        // Store in localStorage for persistence
        localStorage.setItem('user_info', JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          fullname: newUser.Fullname || newUser.fullname,
          role: newUser.role,
          roleId: newUser.roleId,
          roleDisplay: newUser.roleDisplay,
          createdAt: new Date().toISOString()
        }));
        
        return { success: true, data: { ...response.data.data, user: newUser } };
      }

      return { success: false, error: response.error || 'Registration failed' };
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  /**
   * Login user
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      setLoading(false);

      if (response.success) {
        const { token: newToken, user: newUser } = response.data.data;
        
        // Get role object from ROLES mapping
        const userRole = newUser?.role || newUser?.Role || 'JOB_SEEKER';
        const roleKey = userRole.toUpperCase();
        const roleObj = ROLES[roleKey] || ROLES.JOB_SEEKER;
        
        // Ensure user has role ID and role name
        newUser.roleId = roleObj.id;
        newUser.role = roleObj.name;
        newUser.roleDisplay = roleObj.display;
        
        setAuthToken(newToken);
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        
        // Store in localStorage for persistence
        localStorage.setItem('user_info', JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          fullname: newUser.Fullname || newUser.fullname,
          role: newUser.role,
          roleId: newUser.roleId,
          roleDisplay: newUser.roleDisplay,
          loginAt: new Date().toISOString()
        }));
        
        return { success: true, data: { ...response.data.data, user: newUser } };
      }

      return { success: false, error: response.error || 'Login failed' };
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(profileData, token);
      setLoading(false);

      if (response.success) {
        setUser(response.data);
        
        // Update localStorage
        localStorage.setItem('user_info', JSON.stringify({
          ...user,
          ...response.data,
          updatedAt: new Date().toISOString()
        }));
        
        return { success: true, data: response.data };
      }

      return { success: false, error: response.error || 'Update failed' };
    } catch (error) {
      setLoading(false);
      console.error('Update profile error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  /**
   * Change password
   */
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const response = await authAPI.changePassword(passwordData, token);
      setLoading(false);

      if (response.success) {
        return { success: true };
      }

      return { success: false, error: response.error || 'Password change failed' };
    } catch (error) {
      setLoading(false);
      console.error('Change password error:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  /**
   * Enhanced logout with cleanup
   */
  const handleLogout = useCallback(() => {
    logout();
    localStorage.removeItem('user_info');
  }, [logout]);

  /**
   * Get user info from localStorage
   */
  const getUserInfo = () => {
    try {
      const stored = localStorage.getItem('user_info');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting user info from localStorage:', error);
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout: handleLogout,
    updateProfile,
    changePassword,
    getUserInfo,
    ROLES,
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
