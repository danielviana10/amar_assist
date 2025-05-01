export interface LoginForm {
    email: string
    password: string
    remember: boolean
}

export interface LoginResponse {
    token: string
    user: {
        id: string
        name: string
        email: string
    }
}

export interface AuthState {
    token: string | null
    user: User | null
    isAuthenticated: boolean
}

export interface User {
    id: string
    name: string
    email: string
}