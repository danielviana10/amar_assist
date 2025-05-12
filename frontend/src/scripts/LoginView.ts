import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'
import type { LoginForm } from '@/types/auth/auth'

export function useLogin() {
  const router = useRouter()
  const authStore = useAuthStore()

  const form = reactive<LoginForm>({
    email: '',
    password: '',
    remember: false,
  })

  const isSubmitting = ref(false)
  const errorMessage = ref('')
  const showToast = ref(false)

  const handleSubmit = async (data: LoginForm) => {
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
    isSubmitting,
  }
}
