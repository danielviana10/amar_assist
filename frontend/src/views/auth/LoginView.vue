<template>
    <v-container class="fill-height" fluid>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card class="elevation-12 rounded-lg">
                    <v-card-text class="pa-5">
                        <v-img :src="logo" alt="Logo da Empresa" contain height="100" class="mb-2" />

                        <LoginForm v-model="form" @submit="handleSubmit" :isSubmitting="isSubmitting" />

                        <v-snackbar v-model="showToast" location="top right" color="error" timeout="5000"
                            :multi-line="false">
                            {{ errorMessage }}
                        </v-snackbar>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'
import logo from '@/assets/imgs/logo.png'
import LoginForm from '@/components/auth/LoginForm.vue'

interface LoginFormData {
    email: string
    password: string
    remember: boolean
}

export default defineComponent({
    name: 'LoginView',
    components: { LoginForm },

    setup() {
        const router = useRouter()
        const authStore = useAuthStore()

        const form = reactive<LoginFormData>({
            email: '',
            password: '',
            remember: false
        })

        const isSubmitting = ref(false)
        const errorMessage = ref('')
        const showToast = ref(false)

        const handleSubmit = async (data: LoginFormData) => {
            errorMessage.value = ''
            isSubmitting.value = true

            try {
                await authStore.login(data)
                router.push('/products')
            } catch (error) {
                errorMessage.value = error instanceof Error
                    ? getErrorMessage(error)
                    : 'Erro inesperado'
                showToast.value = true
            } finally {
                isSubmitting.value = false
            }
        }

        const getErrorMessage = (error: Error): string => {
            const message = error.message.toLowerCase()
            if (message.includes('credencial') || message.includes('inválid'))
                return 'E-mail ou senha incorretos'
            if (message.includes('validation'))
                return 'Por favor, preencha todos os campos corretamente'
            return error.message || 'Falha ao realizar login'
        }

        return {
            form,
            handleSubmit,
            errorMessage,
            showToast,
            logo,
            isSubmitting
        }
    }
})
</script>