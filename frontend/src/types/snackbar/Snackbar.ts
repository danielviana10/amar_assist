export interface SnackbarState {
    show: boolean
    message: string
    color: 'success' | 'error' | 'warning' | 'info'
}