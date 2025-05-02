import axios from 'axios';
import type { PaginatedResponse, Product } from '@/types/products/products';
import { api } from '../api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ProductService {
    /**
     * Busca todos os produtos
     */
    static async getProducts(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Product>> {
        try {
            const response = await api.get('/products', {
                params: {
                    page,
                    per_page: perPage
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.status === 404
                    ? 'Nenhum produto encontrado'
                    : error.response?.data?.message || 'Falha ao buscar produtos';

                throw new Error(message);
            }
            throw new Error('Ocorreu um erro inesperado ao buscar produtos');
        }
    }

    /**
     * Cria um novo produto
     */
    static async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
        try {
            const response = await api.post(`${API_BASE_URL}/products`, productData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.status === 400
                    ? 'Dados do produto inválidos'
                    : error.response?.data?.message || 'Falha ao criar produto';

                throw new Error(message);
            }
            throw new Error('Ocorreu um erro inesperado ao criar produto');
        }
    }

    /**
     * Atualiza um produto existente
     */
    static async updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
        try {
            const response = await api.put(`${API_BASE_URL}/products/${productId}`, productData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.status === 404
                    ? 'Produto não encontrado'
                    : error.response?.data?.message || 'Falha ao atualizar produto';

                throw new Error(message);
            }
            throw new Error('Ocorreu um erro inesperado ao atualizar produto');
        }
    }

    /**
     * Altera o status de ativação do produto
     */
    static async toggleProductStatus(productId: string, status: boolean): Promise<Product> {
        try {
            const response = await api.patch(`${API_BASE_URL}/products/${productId}/status`, { active: status }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.status === 404
                    ? 'Produto não encontrado'
                    : error.response?.data?.message || 'Falha ao alterar status do produto';

                throw new Error(message);
            }
            throw new Error('Ocorreu um erro inesperado ao alterar status do produto');
        }
    }
}