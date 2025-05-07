import axios from 'axios';
import type { Product, ProductImage } from '@/types/products/Products';
import { api } from '../api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function handleAxiosError(error: unknown, defaultMessage: string, notFoundMessage?: string) {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 404 && notFoundMessage) return new Error(notFoundMessage);
        return new Error(error.response?.data?.message || defaultMessage);
    }
    return new Error('Ocorreu um erro inesperado');
}

export class ImagesService {
    static async getProductImages(productId: Product['id']): Promise<ProductImage[]> {
        try {
            const response = await api.get(`/images/product/${productId}`)
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error, 'Falha ao buscar imagens do produto', 'Produto não encontrado');
        }
    }

    static async uploadImages(productId: Product['id'], images: File[]): Promise<ProductImage[]> {
        try {
            const formData = new FormData();
            images.forEach(image => {
                formData.append('images[]', image);
            });

            const response = await api.post(`/products/${productId}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error, 'Falha ao enviar imagens', 'Produto não encontrado');
        }
    }

    static async updateImageOrder(imageId: string, order: number): Promise<ProductImage> {
        try {
            const response = await api.put(`${API_BASE_URL}/images/${imageId}`, { order });
            return response.data.data;
        } catch (error) {
            throw handleAxiosError(error, 'Falha ao atualizar ordem da imagem', 'Imagem não encontrada');
        }
    }

    static async deleteImage(imageId: string): Promise<ProductImage> {
        try {
            const response = await api.delete(`${API_BASE_URL}/images/${imageId}`);
            return response.data.deleted;
        } catch (error) {
            throw handleAxiosError(error, 'Falha ao remover imagem', 'Imagem não encontrada');
        }
    }

}