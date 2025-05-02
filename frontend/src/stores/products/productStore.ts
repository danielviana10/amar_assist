import { defineStore } from 'pinia';
import type { Product } from '@/types/products/products';
import { ProductService } from '@/services/products/products.service';
import { api } from '@/services/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    pagination: {
      current_page: 1,
      per_page: 10,
      total: 0,
      last_page: 1
    },
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchProducts(page: number = 1, perPage: number = 10) {
      this.loading = true;
      this.error = null;
      try {
        const response = await ProductService.getProducts(page, perPage);
        console.log('Fetched products:', response);
        this.products = response.data;
        this.pagination = {
          current_page: response.current_page,
          per_page: response.per_page,
          total: response.total,
          last_page: response.last_page
        };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro desconhecido';
      } finally {
        this.loading = false;
      }
    },
    async createProduct(productData: any): Promise<Product> {
      try {
        const response = await api.post('/products', {
          title: productData.title,
          description: productData.description,
          price: productData.price,
          cost: productData.cost,
          active: productData.active
        });
        const newProduct = response.data.data;
        return newProduct;

      } catch (error) {
        console.error('Error creating product:', error);
        throw error;
      }
    },
    async updateProduct(productData: Product) {
      this.loading = true;
      this.error = null;
      try {
        const updatedProduct = await ProductService.updateProduct(productData.id, productData);
        const index = this.products.findIndex(p => p.id === productData.id);
        if (index !== -1) {
          this.products.splice(index, 1, updatedProduct);
        }
        return updatedProduct;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Error updating product:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async toggleProductStatus(productId: string, status: boolean) {
      try {
        const response = await api.patch(`/products/${productId}/status`, { active: status });

        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
          this.products[index] = { ...this.products[index], active: response.data.active };
        }

        return response.data;
      } catch (error) {
        console.error('Error toggling status:', error);
        throw error;
      }
    }
  }
});