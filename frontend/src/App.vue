<template>
  <v-app>
    <default-layout v-if="isAuthenticated" />
    <router-view v-else />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAuthStore } from '@/stores/auth/authStore'
import DefaultLayout from './layouts/DefaultLayout.vue'

export default defineComponent({
  name: 'App',
  components: {
    DefaultLayout
  },
  setup() {
    const authStore = useAuthStore()
    const isAuthenticated = computed(() => authStore.isAuthenticated)

    return {
      isAuthenticated
    }
  }
})
</script>