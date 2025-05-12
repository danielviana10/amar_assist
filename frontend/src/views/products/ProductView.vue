<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center mt-2 mb-2">
        <span>Lista de Produtos</span>
        <v-btn color="#E5560E" class="pa-0 ma-0" style="width: 40px; height: 35px; min-width: 0"
          @click="openCreateDialog">
          <v-icon size="20">mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Buscar produtos por título ou descrição" variant="outlined"
          @click:append-inner="onIconClick" @keydown.enter="onEnterPress" class="mb-4 pointer-icon">
        </v-text-field>

        <ProductTable :headers="headers" :products="products" :total-items="totalItems" :current-page="currentPage"
          :items-per-page="itemsPerPage" :loading="loading" :get-first-image-url="getFirstImageUrl"
          :truncate-text="truncateText" @update:options="loadProducts" @toggle-status="toggleStatus"
          @edit-product="editProduct" />
      </v-card-text>
    </v-card>

    <ProductDialog v-model="dialog" :product="editedItem" @product-created="handleProductUpdated" />
    <ProductEditDialog v-model="editDialog" :product="editingProduct" @product-updated="handleProductUpdated" />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top right">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useProductView } from '@/scripts/ProductView'
import ProductDialog from '../../components/products/ProductDialog.vue'
import ProductEditDialog from '../../components/products/ProductEditDialog.vue'
import ProductTable from '../../components/products/ProductTable.vue'

export default defineComponent({
  name: 'ProductsView',
  components: { ProductDialog, ProductEditDialog, ProductTable },
  setup() {
    const {
      currentPage,
      itemsPerPage,
      search,
      loading,
      dialog,
      editedItem,
      snackbar,
      truncateText,
      editProduct,
      editDialog,
      editingProduct,
      headers,
      products,
      totalItems,
      onIconClick,
      onEnterPress,
      loadProducts,
      debouncedFetchProducts,
      openCreateDialog,
      toggleStatus,
      getFirstImageUrl,
      showSnackbar,
      handleProductUpdated,
      getFullImageUrl,
    } = useProductView()

    return {
      currentPage,
      itemsPerPage,
      search,
      loading,
      dialog,
      editedItem,
      snackbar,
      truncateText,
      editProduct,
      editDialog,
      editingProduct,
      headers,
      products,
      totalItems,
      onIconClick,
      onEnterPress,
      loadProducts,
      debouncedFetchProducts,
      openCreateDialog,
      toggleStatus,
      getFirstImageUrl,
      showSnackbar,
      handleProductUpdated,
      getFullImageUrl,
    }
  },
})
</script>

<style scoped>
.v-data-table {
  margin-top: 16px;
}

.v-data-table :deep(th) {
  font-weight: bold;
  background-color: #f5f5f5;
}

.v-data-table :deep(td) {
  vertical-align: middle;
}

.toggle-icon {
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-icon:hover {
  transform: scale(1.2);
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.8);
  opacity: 0.5;
}

.text-truncate {
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pointer-icon>>>.v-icon {
  cursor: pointer;
}

@media (max-width: 600px) {
  .text-truncate {
    max-width: 100px;
  }
}
</style>
