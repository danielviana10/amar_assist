import axios from 'axios';
import { AuthService } from './auth/auth.service';
import router from '@/router';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            if (!error.config.url?.includes('/auth/logout')) {
                await AuthService.logout();
                router.push('/login'); 
            }
        }
        return Promise.reject(error);
    }
);

AuthService.initAuthToken();

export { api };