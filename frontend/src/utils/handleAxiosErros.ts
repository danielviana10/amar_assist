import type { AxiosError } from 'axios'

export function handleAxiosError(
  error: unknown,
  knownMessage = '',
  fallbackMessage = 'Erro inesperado'
): Error {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<any>
    const serverMessage = axiosError.response?.data?.error || axiosError.response?.data?.message

    if (serverMessage) {
      return new Error(serverMessage)
    }
  }

  if (knownMessage) {
    return new Error(knownMessage)
  }

  return new Error(fallbackMessage)
}
