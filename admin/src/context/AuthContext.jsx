import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token / fetch current user info
      fetchUserProfile();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const payload = parseJwt(token);
      if (payload) {
        // Expiration check: if token has expired, log out immediately
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          console.warn("Session token expired. Logging out.");
          logout();
          return;
        }
        const savedOverride = localStorage.getItem('active_role_override');
        setUser({
          email: payload.sub,
          role: savedOverride || payload.role || 'SUPER_ADMIN',
          id: payload.userId,
          permissions: payload.permissions || []
        });
      }
    } catch (error) {
      console.error("Failed to parse token", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const parseJwt = (t) => {
    try {
      const base64Url = t.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      // Use the configured api client (which points to port 8080)
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, token, user: userData } = response.data; 
      
      const realToken = accessToken || token || response.data; 
      
      if (typeof realToken === 'string') {
        localStorage.setItem('admin_token', realToken);
        localStorage.setItem('token', realToken); // also for api.js
        setToken(realToken);
        
        const payload = parseJwt(realToken);
        setUser({
          email: userData?.email || email,
          role: userData?.role || payload?.role || 'SUPER_ADMIN',
          id: userData?.id || payload?.userId || 1,
          permissions: payload ? (payload.permissions || []) : []
        });
        const userRole = userData?.role || payload?.role || 'SUPER_ADMIN';
        return { success: true, role: userRole };
      } else {
        throw new Error("Invalid token format");
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('active_role_override');
    setToken(null);
    setUser(null);
  };

  const switchRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('active_role_override', newRole);
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return user.permissions ? user.permissions.includes(permission) : true;
  };

  const hasAnyRole = (roles) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    if (!roles) return true;
    return Array.isArray(roles) ? roles.includes(user.role) : roles === user.role;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasPermission, hasAnyRole, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
