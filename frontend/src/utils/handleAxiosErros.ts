import axios from "axios";

export function handleAxiosError(error: unknown, defaultMessage: string, notFoundMessage?: string) {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 404 && notFoundMessage) return new Error(notFoundMessage);
        return new Error(error.response?.data?.message || defaultMessage);
    }
    return new Error('Ocorreu um erro inesperado');
}