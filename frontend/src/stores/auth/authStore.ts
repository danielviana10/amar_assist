import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthService } from '@/services/auth/auth.service'
import type { LoginForm } from '@/types/auth/auth'
import axios from 'axios'
import { handleAxiosError } from '@/utils/handleAxiosErros'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token'))
    const user = ref<any | null>(null)
    const isAuthenticated = ref(!!token.value)

    if (token.value) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    }

    const login = async (formData: LoginForm) => {
        try {
            const response = await AuthService.login(formData)
            token.value = response.token
            user.value = response.user
            isAuthenticated.value = true

            if (formData.remember) {
                localStorage.setItem('token', response.token)
            } else {
                sessionStorage.setItem('token', response.token)
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`
        } catch (error) {
            throw error
        }
    }


    const logout = async (): Promise<void> => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            token.value = null;
            user.value = null;
            isAuthenticated.value = false;
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    }




    return {
        token,
        user,
        isAuthenticated,
        login,
        logout
    }
})