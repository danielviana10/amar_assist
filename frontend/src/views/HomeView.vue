<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h4 mb-4">Bem-vindo, {{ user?.name || 'Usuário' }}!</h1>
                <v-card>
                    <v-card-text>
                        <p>Você está autenticado no sistema.</p>
                        <v-btn color="error" @click="handleLogout">
                            Sair
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAuthStore } from '../stores/auth/authStore'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'HomeView',
    setup() {
        const authStore = useAuthStore()
        const router = useRouter()

        const user = computed(() => authStore.user)

        const handleLogout = async () => {
            authStore.logout()
            router.push('/login')
        }

        return {
            user,
            handleLogout
        }
    }
})
</script>