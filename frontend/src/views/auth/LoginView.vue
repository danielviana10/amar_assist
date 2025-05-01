<template>
    <v-container class="fill-height" fluid>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card class="elevation-12 rounded-lg">

                    <v-card-text class="pa-5">
                        <v-img :src="logo" alt="Logo da Empresa" contain height="100" class="mb-2" />
                        <v-form @submit.prevent="handleSubmit">
                            <v-text-field v-model="form.email" label="E-mail" name="email" prepend-icon="mdi-email"
                                type="email" :rules="emailRules" required variant="outlined" class="mb-2 rounded-lg" />

                            <v-text-field v-model="form.password" label="Senha" name="password" prepend-icon="mdi-lock"
                                type="password" :rules="passwordRules" required variant="outlined"
                                class="mb-2 rounded-lg" />

                            <v-snackbar v-model="showToast" location="top right" color="error" timeout="5000"
                                :multi-line="false">
                                {{ errorMessage }}
                            </v-snackbar>


                            <v-checkbox v-model="form.remember" label="Lembrar-me" class="mb-2" />

                            <v-btn type="submit" block :loading="isSubmitting" :disabled="!formValid"
                                class="mt-2 btn-gradient rounded-lg">
                                Entrar
                            </v-btn>

                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'
import logo from '@/assets/imgs/logo.png'

interface LoginForm {
    email: string
    password: string
    remember: boolean
}

export default defineComponent({
    name: 'LoginView',

    setup() {
        const router = useRouter()
        const authStore = useAuthStore()

        const form = reactive<LoginForm>({
            email: '',
            password: '',
            remember: false
        })

        const isSubmitting = ref(false)
        const errorMessage = ref('')
        const showToast = ref(false)

        const emailRules = [
            (v: string) => !!v || 'E-mail é obrigatório',
            (v: string) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido'
        ]

        const passwordRules = [
            (v: string) => !!v || 'Senha é obrigatória',
            (v: string) => (v && v.length >= 4) || 'Senha deve ter pelo menos 4 caracteres'
        ]

        const formValid = computed(() => {
            return form.email && form.password &&
                /.+@.+\..+/.test(form.email) &&
                form.password.length >= 4
        })

        const handleSubmit = async () => {
            errorMessage.value = ''

            if (!formValid.value) return

            isSubmitting.value = true

            try {
                await authStore.login(form)
                router.push('/')
            } catch (error) {
                if (error instanceof Error) {
                    errorMessage.value = getErrorMessage(error)
                    showToast.value = true
                } else {
                    errorMessage.value = 'Ocorreu um erro inesperado'
                }
            } finally {
                isSubmitting.value = false
            }
        }

        const getErrorMessage = (error: Error): string => {
            const message = error.message.toLowerCase()

            if (message.includes('credencial') || message.includes('inválid')) {
                return 'E-mail ou senha incorretos'
            }
            if (message.includes('validation')) {
                return 'Por favor, preencha todos os campos corretamente'
            }
            return error.message || 'Falha ao realizar login'
        }

        return {
            form,
            isSubmitting,
            errorMessage,
            emailRules,
            passwordRules,
            formValid,
            handleSubmit,
            logo,
            showToast
        }
    }
})
</script>

<style scoped>
.btn-gradient {
    background: linear-gradient(to bottom, #E5560E, #D23944, #751E76);
    color: white;
    font-weight: bold;
    transition: 0.3s ease;
}

.btn-gradient:hover {
    filter: brightness(1.1);
}
</style>