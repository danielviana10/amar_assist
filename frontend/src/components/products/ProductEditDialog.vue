<template>
  <v-dialog v-model="modelValue" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">Editar Produto</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="saveProductChanges">
          <v-container>
            <v-text-field
              v-model="editingProduct.title"
              label="Título*"
              :rules="[(v) => !!v || 'Título é obrigatório']"
              required
              counter
              maxlength="40"
              variant="outlined"
              class="mb-2"
            />
            <v-textarea
              v-model="editingProduct.description"
              label="Descrição*"
              rows="3"
              @input="sanitizeDescription"
              :rules="[(v) => !!v || 'Descrição é obrigatória']"
              variant="outlined"
              required
              counter
              maxlength="200"
              class="mb-2"
            ></v-textarea>

            <v-card v-if="editingProduct.description" variant="outlined" class="pa-4 mb-4">
              <div class="text-caption">Preview:</div>
              <div v-html="editingProduct.description"></div>
            </v-card>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="editingProduct.price"
                  label="Preço*"
                  type="number"
                  prefix="R$"
                  min="0"
                  step="10"
                  :rules="[
                    (v) => !!v || 'Preço é obrigatório',
                    (v) => v > 0 || 'Preço deve ser positivo',
                    () =>
                      validatePrice(editingProduct.price, editingProduct.cost) ||
                      'Preço deve ser ≥ custo + 10%',
                  ]"
                  required
                  class="mb-2"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="editingProduct.cost"
                  label="Custo*"
                  type="number"
                  prefix="R$"
                  min="0"
                  step="10"
                  :rules="[
                    (v) => !!v || 'Custo é obrigatório',
                    (v) => v >= 0 || 'Custo não pode ser negativo',
                    () =>
                      validateCost(editingProduct.cost, editingProduct.price) ||
                      'Custo deve ser ≤ preço + 10%',
                  ]"
                  required
                  class="mb-2"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-file-input
              v-model="newImages"
              multiple
              accept="image/jpeg,image/png,image/jpg"
              label="Adicionar imagens (apenas JPG/PNG/JPEG)"
              prepend-icon=""
              prepend-inner-icon="mdi-camera"
              show-size
              counter
              hint="Padrão: produto-1.jpg, produto-2.png"
              persistent-hint
              variant="outlined"
              :rules="[
                () => validateImageType(newImages) || 'Apenas imagens JPG e PNG são permitidas',
              ]"
            />

            <v-row>
              <v-col cols="12">
                <div v-if="loadingImages" class="text-center py-6">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="50"
                    width="4"
                  ></v-progress-circular>
                </div>

                <template v-else>
                  <v-row
                    v-if="productImages.length > 0"
                    class="d-flex flex-wrap gap-2 justify-center mt-0"
                  >
                    <v-col v-for="(image, index) in productImages" :key="image.id" cols="3">
                      <v-card width="100" class="position-relative">
                        <v-overlay
                          :model-value="image.isDeleting"
                          contained
                          class="align-center justify-center"
                          scrim="black"
                          persistent
                        >
                          <v-progress-circular
                            indeterminate
                            color="white"
                            size="30"
                          ></v-progress-circular>
                        </v-overlay>

                        <v-img
                          :src="getFullImageUrl(image.path)"
                          height="100"
                          cover
                          :style="{ opacity: image.isDeleting ? 0.5 : 1 }"
                        />

                        <v-btn
                          icon
                          size="x-small"
                          color="error"
                          class="position-absolute"
                          style="top: 4px; right: 4px"
                          @click="deleteImage(image.id)"
                          :disabled="image.isDeleting"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>

                        <div class="text-caption text-center pa-1">Ordem: {{ image.order }}</div>
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-alert v-else type="info" class="mt-4">
                    Nenhuma imagem cadastrada para este produto
                  </v-alert>
                </template>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn
          color="primary"
          variant="text"
          @click="saveProductChanges"
          :loading="loadingSave"
          :disabled="loadingSave || !isFormValid"
        >
          <template v-slot:loader>
            <v-progress-circular indeterminate size="28" color="orange"></v-progress-circular>
          </template>
          Salvar Alterações
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <AppSnackbar v-model:show="snackbar.show" :message="snackbar.message" :color="snackbar.color" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useProductEditDialog } from '@/scripts/ProductEditDialog'
import type { Product } from '@/types/products/Products'

export default defineComponent({
  name: 'ProductEditDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    product: {
      type: Object as () => Product,
      required: true,
    },
  },
  emits: ['update:modelValue', 'product-updated', 'show-snackbar'],
  setup(props, { emit }) {
    return {
      ...useProductEditDialog(props, emit),
    }
  },
})
</script>
