import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('iles_user');
    const token = localStorage.getItem('iles_access');
    if (stored && token) {
      setUser(JSON.parse(stored));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await api.post('/login/', { username, password });
    const { access, refresh, user: u } = res.data;
    localStorage.setItem('iles_access', access);
    localStorage.setItem('iles_refresh', refresh);
    localStorage.setItem('iles_user', JSON.stringify(u));
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const res = await api.post('/register/', data);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem('iles_refresh');
    try { if (refresh) await api.post('/logout/', { refresh }); } catch {}
    localStorage.removeItem('iles_access');
    localStorage.removeItem('iles_refresh');
    localStorage.removeItem('iles_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);