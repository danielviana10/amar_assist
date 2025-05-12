import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Product, ProductImage } from '@/types/products/products';
import { ImagesService } from '@/services/images/images.service';

export const useImageStore = defineStore('image', () => {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const productImages = ref<Record<string, ProductImage[]>>({});

    const fetchProductImages = async (productId: Product['id']): Promise<ProductImage[]> => {
        loading.value = true;
        error.value = null;
        try {

            if (productImages.value[productId]) {
                return productImages.value[productId];
            }

            const images = await ImagesService.getProductImages(productId);
            productImages.value[productId] = images;
            return images;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erro desconhecido';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const uploadImages = async (productId: Product['id'], files: File[]): Promise<ProductImage[]> => {
        loading.value = true;
        error.value = null;
        try {
            const uploadedImages = await ImagesService.uploadImages(productId, files);
            console.log('uploadedImages', uploadedImages);
            if (!productImages.value[productId]) {
                productImages.value[productId] = [];
            }

            productImages.value[productId] = [
                ...productImages.value[productId].filter(img => !uploadedImages.find(u => u.id === img.id)),
                ...uploadedImages
            ].sort((a, b) => a.order - b.order);

            return uploadedImages;

        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erro desconhecido';
            throw err;
        } finally {
            loading.value = false;
        }
    };


    const deleteImage = async (imageId: ProductImage['id']): Promise<ProductImage> => {
        loading.value = true;
        error.value = null;
        try {
            const deletedImage = await ImagesService.deleteImage(imageId);

            for (const productId in productImages.value) {
                productImages.value[productId] = productImages.value[productId]
                    .filter(img => img.id !== imageId);
            }

            return deletedImage;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erro desconhecido';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const getImagesByProductId = (productId: ProductImage['product_id']): ProductImage[] => {
        return productImages.value[productId] || [];
    };

    return {
        loading,
        error,
        productImages,
        fetchProductImages,
        uploadImages,
        deleteImage,
        getImagesByProductId
    };
});