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
      const savedUserStr = localStorage.getItem('admin_user') || localStorage.getItem('user');
      let savedUser = null;
      if (savedUserStr) {
        try { savedUser = JSON.parse(savedUserStr); } catch (e) {}
      }

      const payload = parseJwt(token);
      const savedOverride = localStorage.getItem('active_role_override');

      if (payload) {
        const userObj = {
          email: payload.sub || savedUser?.email || 'admin@king24x7.com',
          role: savedOverride || payload.role || savedUser?.role || 'SUPER_ADMIN',
          id: payload.userId || savedUser?.id || 1,
          permissions: payload.permissions || savedUser?.permissions || []
        };
        setUser(userObj);
        localStorage.setItem('admin_user', JSON.stringify(userObj));
        localStorage.setItem('user', JSON.stringify(userObj));
      } else if (savedUser) {
        if (savedOverride) savedUser.role = savedOverride;
        setUser(savedUser);
      } else {
        const defaultUser = {
          email: 'admin@king24x7.com',
          role: savedOverride || 'SUPER_ADMIN',
          id: 1,
          permissions: []
        };
        setUser(defaultUser);
        localStorage.setItem('admin_user', JSON.stringify(defaultUser));
        localStorage.setItem('user', JSON.stringify(defaultUser));
      }
    } catch (error) {
      console.error("Failed to restore user session", error);
    } finally {
      setLoading(false);
    }
  };

  const parseJwt = (t) => {
    try {
      if (!t || typeof t !== 'string' || !t.includes('.')) return null;
      const base64Url = t.split('.')[1];
      if (!base64Url) return null;
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
      const { accessToken, token: resToken, user: userData } = response.data; 
      
      const realToken = accessToken || resToken || (typeof response.data === 'string' ? response.data : null); 
      
      if (realToken && typeof realToken === 'string') {
        localStorage.setItem('admin_token', realToken);
        localStorage.setItem('token', realToken); // also for api.js
        setToken(realToken);
        
        const payload = parseJwt(realToken);
        const userDataObj = {
          email: userData?.email || payload?.sub || email,
          role: userData?.role || payload?.role || 'SUPER_ADMIN',
          id: userData?.id || payload?.userId || 1,
          permissions: payload ? (payload.permissions || []) : []
        };
        setUser(userDataObj);
        localStorage.setItem('admin_user', JSON.stringify(userDataObj));
        localStorage.setItem('user', JSON.stringify(userDataObj));
        return { success: true, role: userDataObj.role };
      } else {
        throw new Error("Invalid token format");
      }
    } catch (error) {
      if (!error.response) {
        return {
          success: false,
          message: 'Unable to connect to backend server. Please verify backend server is running.'
        };
      }
      if (error.response.status >= 500) {
        return {
          success: false,
          message: `Backend server error (${error.response.status}). Please check backend deployment.`
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('token');
    localStorage.removeItem('admin_user');
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
