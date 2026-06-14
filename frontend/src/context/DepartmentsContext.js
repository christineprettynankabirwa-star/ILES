import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import api from '../services/api';

const DepartmentsContext = createContext(null);

export function DepartmentsProvider({ children }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const inFlight = useRef(null);

  const refresh = useCallback(async () => {
    if (inFlight.current) return inFlight.current;
    setLoading(true);
    const p = api.get('/departments/')
      .then(res => {
        setDepartments(res.data);
        setLoaded(true);
        return res.data;
      })
      .catch(() => {
        return departments;
      })
      .finally(() => {
        setLoading(false);
        inFlight.current = null;
      });
    inFlight.current = p;
    return p;
  }, [departments]);

  const ensureLoaded = useCallback(() => {
    if (!loaded && !loading) refresh();
  }, [loaded, loading, refresh]);

  const value = { departments, loading, loaded, refresh, ensureLoaded };

  return (
    <DepartmentsContext.Provider value={value}>
      {children}
    </DepartmentsContext.Provider>
  );
}

export function useDepartments() {
  const ctx = useContext(DepartmentsContext);
  if (!ctx) {
    throw new Error('useDepartments must be used within a DepartmentsProvider');
  }
  return ctx;
}