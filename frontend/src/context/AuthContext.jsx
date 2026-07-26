import React, { createContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    return localStorage.getItem('king24x7_token') || sessionStorage.getItem('king24x7_token') || null;
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem('king24x7_refresh_token') || sessionStorage.getItem('king24x7_refresh_token') || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize and fetch user profile
  useEffect(() => {
    const initializeAuth = async () => {
      const activeToken = token;
      if (activeToken) {
        try {
          const profile = await userService.getProfile(activeToken);
          setUser(profile);
          setIsAuthenticated(true);
          
          // Re-sync backward compatibility session
          const compatSession = {
            token: activeToken,
            username: profile.fullName || profile.email.split('@')[0],
            role: profile.role.toLowerCase(),
            displayName: profile.fullName,
            isLoggedIn: true,
            loggedInAt: new Date().toISOString()
          };
          localStorage.setItem('king24x7_session', JSON.stringify(compatSession));
        } catch (err) {
          console.error("Failed to initialize session profile", err);
          logoutUser();
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const loginUser = (userData, accessToken, refreshTokenValue, persist) => {
    setToken(accessToken);
    setRefreshToken(refreshTokenValue);
    setUser(userData);
    setIsAuthenticated(true);

    const storage = persist ? localStorage : sessionStorage;
    storage.setItem('king24x7_token', accessToken);
    storage.setItem('king24x7_refresh_token', refreshTokenValue);

    // Save backward compatibility session
    const compatSession = {
      token: accessToken,
      username: userData.fullName || userData.email.split('@')[0],
      role: userData.role.toLowerCase(),
      displayName: userData.fullName,
      isLoggedIn: true,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem('king24x7_session', JSON.stringify(compatSession));
  };

  const logoutUser = async () => {
    const activeRefreshToken = refreshToken;
    if (activeRefreshToken) {
      try {
        await authService.logout(activeRefreshToken);
      } catch (err) {
        console.warn("Failed to call logout api on server", err);
      }
    }

    // Reset states
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Clear all storage mechanisms
    localStorage.removeItem('king24x7_token');
    localStorage.removeItem('king24x7_refresh_token');
    sessionStorage.removeItem('king24x7_token');
    sessionStorage.removeItem('king24x7_refresh_token');
    localStorage.removeItem('king24x7_session');
    localStorage.removeItem('firebase_id_token');
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedData };
      
      // Update compatibility session
      const compatSession = JSON.parse(localStorage.getItem('king24x7_session') || '{}');
      compatSession.username = merged.fullName;
      compatSession.displayName = merged.fullName;
      localStorage.setItem('king24x7_session', JSON.stringify(compatSession));

      return merged;
    });
  };

  const value = {
    user,
    token,
    refreshToken,
    isAuthenticated,
    loading,
    login: loginUser,
    logout: logoutUser,
    updateUser: updateUserProfile,
    // Keep old mock methods for fallback
    session: user ? {
      isLoggedIn: true,
      username: user.fullName,
      role: user.role.toLowerCase(),
      displayName: user.fullName
    } : null
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
