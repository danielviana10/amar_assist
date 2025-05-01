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

            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.status === 401
                    ? 'E-mail ou senha incorretos'
                    : error.response?.data?.message || 'Falha no login'

                throw new Error(message)
            }
            throw new Error('Ocorreu um erro inesperado')
        }
    }

    static async logout(): Promise<void> {
        try {
            await axios.post(`${API_BASE_URL}/logout`)
        } catch (error) {
            console.error('Logout error:', error)
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