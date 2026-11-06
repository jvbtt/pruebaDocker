import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async (currentToken) => {
    const activeToken = currentToken || token;
    if (!activeToken) {
      setLoading(false);
      return null;
    }

    try {
      const response = await authService.getProfile(activeToken);
      setUser(response.user);
      return response.user;
    } catch {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (token) {
      refreshProfile(token);
    } else {
      setLoading(false);
    }
  }, [token, refreshProfile]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
}

