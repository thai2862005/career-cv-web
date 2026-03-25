import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Get token from localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
        try {
            const { state } = JSON.parse(authStorage);
            if (state?.token) {
                config.headers.Authorization = `Bearer ${state.token}`;
            }
        } catch (e) {
            console.error('Error parsing auth storage:', e);
        }
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Return data directly if available
    if (response.data) return response.data;
    return response;
}, function (error) {
    // Handle 401 unauthorized - redirect to login
    if (error.response?.status === 401) {
        localStorage.removeItem('auth-storage');
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
    return Promise.reject(error.response?.data || error);
});

export default instance;