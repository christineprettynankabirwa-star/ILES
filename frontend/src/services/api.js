import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('iles_access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token refresh on 401
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('iles_refresh');
      if (refresh) {
        try {
          const res = await axios.post(
            `${api.defaults.baseURL}/token/refresh/`,
            { refresh }
          );
          const { access } = res.data;
          localStorage.setItem('iles_access', access);
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          original.headers.Authorization = `Bearer ${access}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
