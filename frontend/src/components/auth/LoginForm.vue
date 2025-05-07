<template>
  <v-form ref="form" @submit.prevent="onSubmit">
    <v-text-field
      v-model="localForm.email"
      label="E-mail"
      prepend-icon="mdi-email"
      type="email"
      :rules="emailRules"
      required
      variant="outlined"
      class="mb-2"
    />

    <v-text-field
      v-model="localForm.password"
      label="Senha"
      prepend-icon="mdi-lock"
      type="password"
      :rules="passwordRules"
      required
      variant="outlined"
      class="mb-2"
    />

    <v-checkbox v-model="localForm.remember" label="Lembrar-me" />

    <v-btn
      type="submit"
      block
      class="btn-gradient rounded-lg btn-space"
      :loading="isSubmitting"
      :disabled="!isFormValid"
    >
      Entrar
    </v-btn>
  </v-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, watchEffect } from 'vue'

interface LoginFormData {
  email: string
  password: string
  remember: boolean
}

const props = defineProps<{
  modelValue: LoginFormData
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: LoginFormData): void
  (e: 'submit', value: LoginFormData): void
}>()

const localForm = reactive(toRefs(props.modelValue))

const isFormValid = ref(false)

watchEffect(() => {
  isFormValid.value =
    !!localForm.email &&
    !!localForm.password &&
    emailRules.every((rule) => rule(localForm.email) === true) &&
    passwordRules.every((rule) => rule(localForm.password) === true)
})

async function onSubmit() {
  emit('update:modelValue', localForm)
  emit('submit', localForm)
}
</script>

<style scoped>
.btn-gradient {
  background: linear-gradient(to bottom, #e5560e, #d23944, #751e76);
  color: white;
  font-weight: bold;
  transition: 0.3s ease;
}

.btn-gradient:hover {
  filter: brightness(1.1);
}

.btn-space {
  padding-block: 1.2rem;
}
</style>
