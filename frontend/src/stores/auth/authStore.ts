import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthService } from '@/services/auth/auth.service'
import type { LoginForm } from '@/types/auth/auth'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token'))
    const user = ref<any | null>(null)

    const isAuthenticated = ref(!!token.value)

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
        } catch (error) {
            throw error
        }
    }

    const logout = () => {
        token.value = null
        user.value = null
        isAuthenticated.value = false
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
    }

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout
    }
})