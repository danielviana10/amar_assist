import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore'
import type { LoginForm } from '@/types/auth/auth'
import type { SnackbarState } from '@/types/snackbar/Snackbar'

export function useLogin() {
  const router = useRouter()
  const authStore = useAuthStore()
  const snackbar = ref<SnackbarState>({
    show: false,
    message: '',
    color: 'success'
  })
  const showSnackbar = (
    message: string,
    color: SnackbarState['color'] = 'success',
    timeout: number = 3000
  ) => {
    snackbar.value = { show: true, message, color }
  }

  onMounted(() => {
    if (localStorage.getItem('logoutSuccessMessage')) {
      showSnackbar('Usuário deslogado com sucesso', 'info');
      localStorage.removeItem('logoutSuccessMessage');
    }
  });

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
      sessionStorage.setItem('showWelcomeMessage', 'true')
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
    snackbar,
    showSnackbar
  }
}
