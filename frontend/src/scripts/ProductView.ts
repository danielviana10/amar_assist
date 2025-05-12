import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products/productStore'
import { debounce } from 'lodash'
import type { Product } from '@/types/products/products'
import { useAuthStore } from '@/stores/auth/authStore'

export function useProductView() {
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

  onMounted(() => {
    if (sessionStorage.getItem('showWelcomeMessage')) {
      showSnackbar('Usuário logado com sucesso!', 'success')
      sessionStorage.removeItem('showWelcomeMessage')
    }
  })

  const headers = ref([
    { title: 'Imagem', key: 'img', sortable: false, align: 'center' as const },
    { title: 'Título', key: 'title', sortable: false },
    { title: 'Descrição', key: 'description', sortable: false },
    { title: 'Preço (R$)', key: 'price', sortable: false, align: 'start' as const },
    { title: 'Custo (R$)', key: 'cost', sortable: false, align: 'start' as const },
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

  const loadProducts = async (params: { page: number; itemsPerPage: number; search?: string }) => {
     if (!useAuthStore().isAuthenticated) return;
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
    const url = ordered[0] ? getFullImageUrl(ordered[0].path) : ''
    return url
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
}
