<template>
    <div class="login-page">
        <div class="login-container">
            <img src="@/assets/imgs/logo.png" alt="Logo" class="login-logo" />
            <form class="login-form" @submit.prevent="handleLogin">
                <h2>Bem-vindo</h2>

                <div class="input-group">
                    <input type="email" id="email" required placeholder=" " />
                    <label for="email">Email</label>
                </div>

                <div class="input-group">
                    <input type="password" id="password" required placeholder=" " />
                    <label for="password">Senha</label>
                </div>

                <button type="submit">Entrar</button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth/authStore'

const router = useRouter()
const authStore = useAuthStore()

function handleLogin() {
    const email = (document.getElementById('email') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value

    fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            // Simulando login com um token e um usuário
            authStore.login(data.token)
            router.push('/produtos')  // Redireciona para a tela de produtos
        })
        .catch(error => {
            console.error('Erro no login:', error)
        })
}
</script>

<style scoped src="@/assets/css/login/style.css"></style>