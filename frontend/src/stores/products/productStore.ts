import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PaginatedResponse, Pagination, Product, ProductImage, ProductResponse } from '@/types/products/products';
import { ProductService } from '@/services/products/products.service';
import { api } from '@/services/api';

export const useProductStore = defineStore('product', () => {
  const products = ref<Array<Omit<Product, 'images'> & { image?: ProductImage | null }>>([]);
  const pagination = ref<Pagination>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProducts = async (page?: number, perPage?: number, search?: string): Promise<PaginatedResponse<Product>> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await ProductService.getProducts(page, perPage, search);
      products.value = response.data;
      pagination.value = {
        current_page: response.current_page,
        per_page: response.per_page,
        total: response.total,
        last_page: response.last_page
      };
      return response; 
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido';
      throw err; 
    } finally {
      loading.value = false;
    }
  };

  const fetchProductsById = async (productId: Product['id']): Promise<Product> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await ProductService.getProductById(productId);
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Error fetching product by ID:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  const createProduct = async (productData: Omit<Product, 'id'>): Promise<ProductResponse> => {
    try {
      const response = await api.post('/products', {
        title: productData.title,
        description: productData.description,
        price: productData.price,
        cost: productData.cost,
        active: productData.active
      });
      return response.data;
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  };

  const updateProduct = async (productData: Product): Promise<Product> => {
    loading.value = true;
    error.value = null;
    try {
      const updatedProduct = await ProductService.updateProduct(productData.id, productData);
      const index = products.value.findIndex(p => p.id === productData.id);
      if (index !== -1) {
        products.value.splice(index, 1, updatedProduct);
      }
      return updatedProduct;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Error updating product:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleProductStatus = async (productId: Product['id'], status: Product['active']): Promise<Product> => {
    try {
      const response = await api.patch(`/products/${productId}/status`, { active: status });
      const index = products.value.findIndex(p => p.id === productId);
      if (index !== -1) {
        products.value[index] = { ...products.value[index], active: response.data.active };
      }
      return response.data;
    } catch (err) {
      console.error('Error toggling status:', err);
      throw err;
    }
  };

  return {
    products,
    pagination,
    loading,
    error,

    fetchProducts,
    fetchProductsById,
    createProduct,
    updateProduct,
    toggleProductStatus
  };
});