<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 rounded-lg">
          <v-card-text class="pa-5">
            <v-img :src="logo" alt="Logo da Empresa" contain height="100" class="mb-2" />
            <LoginForm v-model="form" @submit="handleSubmit" :isSubmitting="isSubmitting" />
            <v-snackbar v-model="showToast" location="top right" color="error" timeout="5000" :multi-line="false">
              {{ errorMessage }}
            </v-snackbar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <AppSnackbar v-model:show="snackbar.show" :message="snackbar.message" :color="snackbar.color" />


</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLogin } from '@/scripts/LoginView'
import logo from '@/assets/imgs/logo.png'
import LoginForm from '@/components/auth/LoginForm.vue'

export default defineComponent({
  name: 'LoginView',
  components: { LoginForm },

  setup() {
    const {
      form,
      handleSubmit,
      errorMessage,
      showToast,
      isSubmitting,
      snackbar,
      showSnackbar,
    } = useLogin()

    return {
      form,
      handleSubmit,
      errorMessage,
      showToast,
      logo,
      isSubmitting,
      snackbar,
      showSnackbar
    }
  }
})
</script>
