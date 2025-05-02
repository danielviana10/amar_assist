import axios from 'axios'
import type { LoginForm, LoginResponse } from '@/types/auth/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class AuthService {
    static async login(credentials: LoginForm): Promise<LoginResponse> {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            localStorage.setItem('authToken', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Login error:', error);
                throw new Error(error.response?.data?.error || 'Login failed');
            }
            throw new Error('An unexpected error occurred during login');
        }
    }

    static async logout(): Promise<void> {
        try {
            // Remove o token ao fazer logout
            localStorage.removeItem('authToken');
            delete axios.defaults.headers.common['Authorization'];

            await axios.post(`${API_BASE_URL}/logout`);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    static initAuthToken(): void {
        const token = localStorage.getItem('authToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    static async getCurrentUser(): Promise<any> {
        try {
            const response = await axios.get(`${API_BASE_URL}/user`)
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Failed to fetch user')
            }
            throw new Error('An unexpected error occurred')
        }
    }
}