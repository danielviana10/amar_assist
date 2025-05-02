<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Lista de Produtos</span>
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon start>mdi-plus</v-icon>
          Novo Produto
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar produtos" single-line hide-details
          class="mb-4" @input="debouncedFetchProducts"></v-text-field>

        <v-data-table-server v-model:items-per-page="itemsPerPage" v-model:page="currentPage" :headers="headers"
          :items="products" :items-length="totalItems" :loading="loading" :search="search"
          @update:options="loadProducts" class="elevation-1" :items-per-page-options="[10, 20, 35, 50]">
          <template v-slot:item.img="{ item }">
            <template v-if="item.images && item.images.length > 0">
              <v-img :src="getFirstImageUrl(item.images)" max-height="50" max-width="50" class="my-1" contain />
            </template>
            <template v-else>
              <v-icon>mdi-image-off</v-icon>
            </template>
          </template>

          <template v-slot:item.price="{ item }">
            R$ {{ Number(item.price).toFixed(2) }}
          </template>

          <template v-slot:item.cost="{ item }">
            R$ {{ Number(item.cost).toFixed(2) }}
          </template>

          <template v-slot:item.active="{ item }">
            <v-tooltip :text="item.active ? 'Desativar' : 'Ativar'">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" :color="item.active ? 'success' : 'grey'" @click="toggleStatus(item)">
                  {{ item.active ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off' }}
                </v-icon>
              </template>
            </v-tooltip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" small class="mr-2" @click="openEditDialog(item)">
                  mdi-pencil
                </v-icon>
              </template>
            </v-tooltip>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>

    <ProductDialog v-model="dialog" :product="editedItem" @save="save" />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top right">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useProductStore } from '../../stores/products/productStore';
import ProductDialog from '../../components/products/ProductDialog.vue';
import { debounce } from 'lodash';
import type { Product } from '@/types/products/products';

export default defineComponent({
  name: 'ProductsView',
  components: { ProductDialog },
  setup() {
    const productStore = useProductStore();

    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const search = ref('');
    const loading = ref(false);

    const dialog = ref(false);
    const editedIndex = ref(-1);
    const editedItem = ref({
      id: '',
      title: '',
      description: '',
      price: 0,
      cost: 0,
      active: true,
      images: []
    });

    const snackbar = ref({
      show: false,
      message: '',
      color: 'success'
    });

    const headers = ref([
      { title: 'Imagem', key: 'img', sortable: false, width: '80px', align: 'center' as const },
      { title: 'Título', key: 'title' },
      { title: 'Descrição', key: 'description', width: '30%' },
      { title: 'Preço (R$)', key: 'price', align: 'end' as const },
      { title: 'Custo (R$)', key: 'cost', align: 'end' as const },
      { title: 'Status', key: 'active', align: 'center' as const },
      { title: 'Ações', key: 'actions', sortable: false, align: 'center' as const }
    ]);

    const products = computed(() => productStore.products);
    const totalItems = computed(() => productStore.pagination.total);

    const debouncedFetchProducts = debounce(() => {
      loadProducts({ page: 1, itemsPerPage: itemsPerPage.value });
    });

    watch(itemsPerPage, (newVal) => {
      loadProducts({ page: 1, itemsPerPage: newVal });
    });

    const loadProducts = async ({ page, itemsPerPage }: { page: number, itemsPerPage: number }) => {
      loading.value = true;
      try {
        await productStore.fetchProducts(page, itemsPerPage);
      } catch (error) {
        showSnackbar('Erro ao carregar produtos', 'error');
      } finally {
        loading.value = false;
      }
    };

    const openCreateDialog = () => {
      editedItem.value = {
        id: '',
        title: '',
        description: '',
        price: 0,
        cost: 0,
        active: true,
        images: []
      };
      editedIndex.value = -1;
      dialog.value = true;
    };

    const openEditDialog = (item: any) => {
      editedIndex.value = products.value.findIndex(p => p.id === item.id);
      editedItem.value = {
        ...item,
        images: item.images ? [...item.images] : []
      };
      dialog.value = true;
    };

    const toggleStatus = async (item: Product) => {
      try {
        const originalStatus = item.active;

        item.active = !originalStatus;

        const updatedProduct = await productStore.toggleProductStatus(item.id, !originalStatus);

        item.active = updatedProduct.active;

        showSnackbar(`Produto ${updatedProduct.active ? 'ativado' : 'inativado'} com sucesso`);
      } catch (error) {
        // Reverte em caso de erro
        item.active = !item.active;
        showSnackbar(
          error instanceof Error ? error.message : 'Erro ao alterar status',
          'error'
        );
      }
    };

    const save = async (productData: any) => {
      try {
        const savedProduct = productData.id
          ? await productStore.updateProduct(productData)
          : await productStore.createProduct(productData);

        await loadProducts({
          page: currentPage.value,
          itemsPerPage: itemsPerPage.value
        });

        showSnackbar(productData.id
          ? 'Produto criado com sucesso'
          : 'Produto criado com sucesso');

      } catch (error) {
        showSnackbar('Erro ao salvar produto', 'error');
      }
    };

    const showSnackbar = (message: string, color = 'success') => {
      snackbar.value = {
        show: true,
        message,
        color
      };
    };

    const getFirstImageUrl = (images: any[]) => {
      const ordered = [...images].sort((a, b) => a.order - b.order);
      return ordered[0] ? getFullImageUrl(ordered[0].path) : '';
    };

    const getFullImageUrl = (path: string) => {
      return `http://localhost:8000/storage/${path}`;
    };

    loadProducts({ page: 1, itemsPerPage: itemsPerPage.value });

    return {
      currentPage,
      itemsPerPage,
      search,
      loading,
      dialog,
      editedItem,
      snackbar,

      headers,
      products,
      totalItems,

      loadProducts,
      debouncedFetchProducts,
      openCreateDialog,
      openEditDialog,
      toggleStatus,
      save,
      getFirstImageUrl
    };
  }
});
</script>

<style scoped>
/* Estilos personalizados */
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
</style>