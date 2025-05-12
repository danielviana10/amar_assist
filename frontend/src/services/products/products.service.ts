import type { PaginatedResponse, Product, ProductResponse } from '@/types/products/products';
import { api } from '../api';
import { handleAxiosError } from '@/utils/handleAxiosErros';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ProductService {

    static async getProducts(page?: number, perPage?: number, search?: string): Promise<PaginatedResponse<Product>> {
        try {
            const response = await api.get('/products', {
                params: {
                    page,
                    per_page: perPage,
                    search: search?.trim() || undefined
                }
            });
            return response.data;
        } catch (error) {
            throw handleAxiosError(error, 'Falha ao buscar produtos', 'Erro ao buscar produtos');
        }
    }

    static async getProductById(productId: Product['id']): Promise<Product> {
        try {
            const response = await api.get(`${API_BASE_URL}/products/${productId}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw handleAxiosError(error, 'Falha ao buscar produto', 'Produto não encontrado');
        }
    }

    static async createProduct(productData: Omit<Product, 'id'>): Promise<ProductResponse> {
        try {
            const response = await api.post(`${API_BASE_URL}/products`, productData, {
                withCredentials: true
            });

            return response.data as ProductResponse;

        } catch (error) {
            throw handleAxiosError(error, 'Falha ao criar produto', 'Erro ao criar produto');
        }
    }

    static async updateProduct(productId: Product['id'], productData: Partial<Product>): Promise<Product> {
        try {
            const response = await api.put(`${API_BASE_URL}/products/${productId}`, productData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw handleAxiosError(error, 'Falha ao atualizar produto', 'Produto não encontrado');
        }
    }

    static async toggleProductStatus(productId: Product['id'], status: Product['active']): Promise<Product> {
        try {
            const response = await api.patch(`${API_BASE_URL}/products/${productId}/status`, { active: status }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw handleAxiosError(error, 'Falha ao atualizar status do produto', 'Produto não encontrado');
        }
    }
}