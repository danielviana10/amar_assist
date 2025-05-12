import axios from 'axios'
import type { LoginForm, LoginResponse, User } from '@/types/auth/auth'
import { handleAxiosError } from '@/utils/handleAxiosErros';

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

            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;


            return response.data;
        } catch (error) {
            throw handleAxiosError(error, 'Usuário ou senha inválidos', 'Falha ao realizar login');
        }
    }

    static async logout(): Promise<void> {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado');

            await axios.post(`${API_BASE_URL}/auth/logout`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            throw handleAxiosError(error, 'Falha ao realizar logout', 'Erro ao realizar logout');
        }
    }



    static initAuthToken(): void {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
}