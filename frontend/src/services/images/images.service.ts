import type { Product, ProductImage } from '@/types/products/products';
import { api } from '../api';
import { handleAxiosError } from '@/utils/handleAxiosErros';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ImagesService {
    static async getProductImages(productId: Product['id']): Promise<ProductImage[]> {
        try {
            const response = await api.get(`/images/${productId}`)
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

    static async deleteImage(imageId: ProductImage['id']): Promise<ProductImage> {
        try {
            const response = await api.delete(`${API_BASE_URL}/images/${imageId}`);
            return response.data.deleted;
        } catch (error) {
            throw handleAxiosError(error, 'Falha ao remover imagem', 'Imagem não encontrada');
        }
    }

}