import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

const refreshApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

const { data } = await refreshApi.post('token/refresh/', {
    refresh,
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

            const refresh = localStorage.getItem('refresh_token');

            if (!refresh) {
                window.location.href = '/login';
                return Promise.reject("No refresh token found");
            }

            const { data } = await axios.post(
                'http://127.0.0.1:8000/api/token/refresh/',
                { refresh }
            );

            if (refresh) {
                try {
                    const { data } = await refreshApi.post('token/refresh/', {
                        refresh,
                    });

                    localStorage.setItem('access_token', data.access);

                    originalRequest.headers.Authorization = `Bearer ${data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');

                    window.location.href = '/login';

                    return Promise.reject(refreshError);
                }
            } 
            window.location.href = '/login';       
        }

        return Promise.reject(error);
    }
);

export default api;
  