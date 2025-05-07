<template>
  <v-snackbar
    v-model="internalShow"
    :color="color"
    :timeout="timeout"
    :location="location"
    multi-line
  >
    {{ message }}

    <template v-slot:actions>
      <v-btn variant="text" :color="textColor" @click="close"> Fechar </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import type { SnackbarState } from '@/types/snackbar/Snackbar'

export default defineComponent({
  name: 'AppSnackbar',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    color: {
      type: String as () => SnackbarState['color'],
      default: 'success',
    },
    timeout: {
      type: Number,
      default: 3000,
    },
    location: {
      type: String as () =>
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'center'
        | 'top left'
        | 'top right'
        | 'bottom left'
        | 'bottom right'
        | 'center center',
      default: 'top right',
    },
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const internalShow = ref(props.show)

    const textColor = computed(() => {
      return props.color === 'success' ? 'white' : 'white'
    })

    watch(
      () => props.show,
      (val) => {
        internalShow.value = val
      },
    )

    watch(internalShow, (val) => {
      if (!val) {
        emit('update:show', false)
      }
    })

    const close = () => {
      internalShow.value = false
    }

    return {
      internalShow,
      textColor,
      close,
    }
  },
})
</script>
