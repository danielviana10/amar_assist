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
                <v-list-item v-for="(item, i) in items" :key="i" :value="item" :to="item.to" active-color="primary">
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '@/stores/auth/authStore'
import { useRouter } from 'vue-router'
import icon_amar from '@/assets/imgs/icon_amar.png'

export default defineComponent({
    name: 'DefaultLayout',
    setup() {
        const drawer = ref(true)
        const router = useRouter()
        const authStore = useAuthStore()

        const items = [
            { text: 'Dashboard', icon: 'mdi-view-dashboard', to: '/products' }
        ]

        const handleLogout = async () => {
            await authStore.logout()
            router.push('/login')
        }

        return {
            drawer,
            items,
            handleLogout,
            icon_amar
        }
    }
})
</script>