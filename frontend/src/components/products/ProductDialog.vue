<template>
  <v-dialog v-model="internalDialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">Novo produto</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="handleSave">
          <v-container>
            <v-text-field
              v-model="localProduct.title"
              label="Título*"
              :rules="titleValidate"
              variant="outlined"
              required
              counter
              maxlength="40"
              class="mb-2"
            ></v-text-field>

            <v-textarea
              v-model="localProduct.description"
              label="Descrição*"
              rows="3"
              @input="sanitizeValidade"
              :rules="descriptionValidate"
              variant="outlined"
              required
              counter
              maxlength="200"
            ></v-textarea>

            <v-card v-if="localProduct.description" variant="outlined" class="pa-4 mb-4">
              <div class="text-caption">Preview:</div>
              <div v-html="localProduct.description"></div>
            </v-card>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="localProduct.price"
                  label="Preço*"
                  prefix="R$"
                  type="number"
                  min="0"
                  step="10"
                  :rules="priceValidate"
                  required
                  class="mb-2"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="localProduct.cost"
                  label="Custo*"
                  prefix="R$"
                  type="number"
                  min="0"
                  step="10"
                  :rules="costValidate"
                  required
                  class="mb-2"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-file-input
              v-model="newImages"
              :rules="imageValidate"
              label="Adicionar imagens (apenas JPG/PNG/JPEG)"
              multiple
              prepend-icon=""
              prepend-inner-icon="mdi-camera"
              accept="image/jpeg,image/png,image/jpg"
              show-size
              counter
              hint="Padrão: produto-1.jpg, produto-2.png"
              persistent-hint
              variant="outlined"
            />

            <v-row v-if="previewImages.length" class="mt-2">
              <v-col cols="12">
                <div class="d-flex flex-wrap gap-2 justify-center">
                  <v-card
                    v-for="(image, index) in previewImages"
                    :key="index"
                    width="100"
                    class="position-relative"
                  >
                    <v-img :src="image.url" height="100" cover />
                    <v-btn
                      @click="removePreviewImage(index)"
                      icon
                      size="x-small"
                      color="error"
                      class="position-absolute"
                      style="top: 4px; right: 4px"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <div class="text-caption text-center pa-1">
                      Ordem: {{ getImageOrder(image.file.name) }}
                    </div>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="text" @click="closeDialog" :disabled="loading">
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          @click="handleSave"
          :loading="loading"
          :disabled="!isFormValid || loading"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <AppSnackbar v-model:show="snackbar.show" :message="snackbar.message" :color="snackbar.color" />
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { useProductDialog } from '../../scripts/ProductDialog'
import type { Product } from '../../types/products/Products'

export default defineComponent({
  name: 'ProductDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
  emits: ['update:modelValue', 'product-created'],
  setup(props, { emit }) {
    return {
      ...useProductDialog(props, emit),
    }
  },
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}
</style>
