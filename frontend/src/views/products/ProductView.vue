<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center mt-2 mb-2">
        <span>Lista de Produtos</span>
        <v-btn
          color="#E5560E"
          class="pa-0 ma-0"
          style="width: 40px; height: 35px; min-width: 0"
          @click="openCreateDialog"
        >
          <v-icon size="20">mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Buscar produtos"
          variant="outlined"
          @click:append-inner="onIconClick"
          @keydown.enter="onEnterPress"
          class="mb-4 pointer-icon"
        >
        </v-text-field>

        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          v-model:page="currentPage"
          :headers="headers"
          :items="products"
          :items-length="totalItems"
          :loading="loading"
          @update:options="loadProducts"
          class="elevation-1"
          :items-per-page-options="[10, 20, 35, 50]"
        >
          <template v-slot:item.img="{ item }: { item: Product }">
            <template v-if="item.images && item.images.length > 0">
              <v-img
                :src="getFirstImageUrl(item.images)"
                max-height="50"
                max-width="50"
                class="my-1"
                contain
              />
            </template>
            <template v-else>
              <v-icon>mdi-image-off</v-icon>
            </template>
          </template>

          <template v-slot:item.description="{ item }">
            <v-tooltip :text="item.description" location="top">
              <template v-slot:activator="{ props }">
                <span v-bind="props" class="text-truncate">
                  {{ truncateText(item.description, 40) }}
                </span>
              </template>
            </v-tooltip>
          </template>

          <template v-slot:item.price="{ item }"> R$ {{ Number(item.price).toFixed(2) }} </template>

          <template v-slot:item.cost="{ item }"> R$ {{ Number(item.cost).toFixed(2) }} </template>

          <template v-slot:item.active="{ item }">
            <v-tooltip :text="item.active ? 'Desativar' : 'Ativar'">
              <template v-slot:activator="{ props }">
                <div class="position-relative" style="width: 24px; height: 24px">
                  <v-progress-circular
                    v-if="item.isLoading"
                    indeterminate
                    size="24"
                    width="2"
                    color="primary"
                  />
                  <v-icon
                    v-else
                    v-bind="props"
                    :color="item.active ? 'success' : 'grey'"
                    @click="toggleStatus(item)"
                  >
                    {{ item.active ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off' }}
                  </v-icon>
                </div>
              </template>
            </v-tooltip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  small
                  class="mr-2"
                  @click="editProduct(item)"
                  :disabled="loadingImages"
                  :loading="loadingImages"
                >
                  mdi-pencil
                </v-icon>
              </template>
            </v-tooltip>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>

    <ProductDialog v-model="dialog" :product="editedItem" @product-created="handleProductUpdated" />
    <ProductEditDialog
      v-model="editDialog"
      :product="editingProduct"
      @product-updated="handleProductUpdated"
    />

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useProductStore } from '../../stores/products/productStore'
import ProductDialog from '../../components/products/ProductDialog.vue'
import ProductEditDialog from '../../components/products/ProductEditDialog.vue'
import { debounce } from 'lodash'
import type { Product, ProductImage } from '../../types/products/Products'

export default defineComponent({
  name: 'ProductsView',
  components: { ProductDialog, ProductEditDialog },
  setup() {
    const productStore = useProductStore()
    const baseImgUrl = 'http://localhost:8000/storage/'

    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const search = ref('')
    const loading = ref(false)
    const loadingImages = ref(false)

    const dialog = ref(false)
    const editDialog = ref(false)
    const editingProduct = ref<Product>({
      id: '',
      title: '',
      price: 0,
      cost: 0,
      description: '',
      active: false,
      images: [],
    })

    const editedIndex = ref(-1)
    const editedItem = ref<Product>({
      id: '',
      title: '',
      price: 0,
      cost: 0,
      description: '',
      active: false,
      images: [],
    })

    const snackbar = ref({
      show: false,
      message: '',
      color: 'success',
    })

    const headers = ref([
      { title: 'Imagem', key: 'img', sortable: false, width: '80px', align: 'center' as const },
      { title: 'Título', key: 'title', sortable: false },
      { title: 'Descrição', key: 'description', width: '30%', sortable: false },
      { title: 'Preço (R$)', key: 'price', sortable: false, align: 'end' as const },
      { title: 'Custo (R$)', key: 'cost', sortable: false, align: 'end' as const },
      { title: 'Status', key: 'active', sortable: false, align: 'center' as const },
      { title: 'Ações', key: 'actions', sortable: false, align: 'center' as const },
    ])

    const products = computed(() => productStore.products)
    const totalItems = computed(() => productStore.pagination.total)

    const debouncedFetchProducts = debounce(() => {
      currentPage.value = 1
      loadProducts({ page: 1, itemsPerPage: itemsPerPage.value, search: search.value.trim() })
    }, 300)

    const onIconClick = () => {
      debouncedFetchProducts()
    }

    const onEnterPress = () => {
      debouncedFetchProducts()
    }

    const loadProducts = async (params: {
      page: number
      itemsPerPage: number
      search?: string
    }) => {
      loading.value = true
      try {
        const page = params.page || 1
        const perPage = params.itemsPerPage || 10
        const search = params.search
        await productStore.fetchProducts(page, perPage, search)
        currentPage.value = page
        itemsPerPage.value = perPage
      } catch (error) {
        showSnackbar('Erro ao carregar produtos', 'error')
      } finally {
        loading.value = false
      }
    }

    const openCreateDialog = () => {
      editedItem.value = {
        id: '',
        title: '',
        description: '',
        price: 0,
        cost: 0,
        active: true,
        images: [],
      }
      editedIndex.value = -1
      dialog.value = true
    }

    const editProduct = async (product: Product) => {
      editingProduct.value = { ...product }
      editDialog.value = true
    }

    const handleProductUpdated = async () => {
      try {
        await loadProducts({
          page: currentPage.value,
          itemsPerPage: itemsPerPage.value,
        })
      } catch (error) {
        console.error('Erro ao atualizar lista:', error)
        showSnackbar('Erro ao atualizar lista de produtos', 'error')
      }
    }

    const toggleStatus = async (item: Product) => {
      const originalStatus = item.active
      item.isLoading = true

      try {
        item.active = !originalStatus

        await productStore.toggleProductStatus(item.id, !originalStatus)

        await productStore.fetchProducts()

        showSnackbar(`Produto ${!originalStatus ? 'ativado' : 'inativado'} com sucesso`)
      } catch (error) {
        item.active = originalStatus
        showSnackbar(error instanceof Error ? error.message : 'Erro ao alterar status', 'error')
      } finally {
        item.isLoading = false
      }
    }

    const showSnackbar = (message: string, color = 'success') => {
      snackbar.value = {
        show: true,
        message,
        color,
      }
    }

    const getFirstImageUrl = (images: any[]) => {
      const ordered = [...images].sort((a, b) => a.order - b.order)
      return ordered[0] ? getFullImageUrl(ordered[0].path) : ''
    }

    const getFullImageUrl = (path: string) => {
      return `${baseImgUrl}${path}`
    }

    const truncateText = (text: string, maxLength: number) => {
      if (!text) return ''
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    return {
      currentPage,
      itemsPerPage,
      search,
      loading,
      loadingImages,
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

.pointer-icon >>> .v-icon {
  cursor: pointer;
}

@media (max-width: 600px) {
  .text-truncate {
    max-width: 100px;
  }
}
</style>
