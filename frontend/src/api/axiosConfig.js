import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Auto-attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('iles_access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Request interceptor to add token
api.interceptors.request.use((config) => {

    const token = localStorage.getItem('access_token');

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }
    
    return config;
});

//Response interceptor to refresh token on 401
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken) {
                window.location.href = '/login';
                return Promise.reject("No refresh token found");
            }

            try {
                const { data } = await refreshApi.post('token/refresh/', {
                    refresh: refreshToken,
                });

                localStorage.setItem('access_token', data.access);

                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return api(originalRequest);

            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_role');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
    return Promise.reject(err);
  }
);

export default api;