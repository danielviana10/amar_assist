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
import { emailRules, passwordRules } from '@/utils/formRules';
import { reactive, ref, toRefs, watchEffect } from 'vue'
import type { LoginForm } from '@/types/auth/auth'

const props = defineProps<{
  modelValue: LoginForm
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: LoginForm): void
  (e: 'submit', value: LoginForm): void
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
