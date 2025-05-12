<template>
    <v-layout>
        <v-app-bar color="#E5560E" prominent>
            <v-app-bar-nav-icon @click="drawer = !drawer" />

            <v-img :src="icon_amar" alt="Logo da Empresa" contain height="40" class="mx-4" />

            <v-btn @click="handleLogout" icon>
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer">
            <v-list>
                <v-list-item v-for="(item, i) in items" :key="i" :value="item" :to="item.to" color="primary">
                    <template v-slot:prepend>
                        <v-icon :icon="item.icon" />
                    </template>

                    <v-list-item-title v-text="item.text" />
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid>
                <router-view />
            </v-container>
        </v-main>
    </v-layout>

    <AppSnackbar v-model:show="snackbar.show" :message="snackbar.message" :color="snackbar.color" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '@/stores/auth/authStore'
import { useRouter } from 'vue-router'
import type { SnackbarState } from '@/types/snackbar/Snackbar'
import icon_amar from '@/assets/imgs/icon_amar.png'

export default defineComponent({
    name: 'DefaultLayout',
    setup() {
        const drawer = ref(true)
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

        const items = [
            { text: 'Dashboard', icon: 'mdi-view-dashboard', to: '/products' }
        ]

        const handleLogout = async () => {
            try {
                console.log("[1] Iniciando logout...");
                drawer.value = false;

                console.log("[2] Chamando authStore.logout()");
                await authStore.logout();

                console.log("[3] Logout completo - navegando para /login");
                localStorage.setItem('logoutSuccessMessage', 'true');
                await router.push('/login'); // Await é crucial aqui

                console.log("[4] Navegação concluída");
            } catch (error) {
                console.error("[ERROR] Falha no logout:", error);
                showSnackbar('Erro ao fazer logout', 'error');
            }
        };



        return {
            drawer,
            items,
            handleLogout,
            icon_amar,
            snackbar,
            showSnackbar
        }
    }
})
</script>