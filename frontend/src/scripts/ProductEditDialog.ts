import { useImageStore } from '@/stores/images/imageStore';
import { useProductStore } from '@/stores/products/productStore';
import type { Product, ProductImage } from '@/types/products/products';
import type { SnackbarState } from '@/types/snackbar/snackbar'
import { ref, computed, watch } from 'vue';
import {
    titleRules,
    descriptionRules,
    costRules,
    priceRules,
    imageRules,
    sanitizeDescription,
    validateUniqueOrders,
    validateImageFormat,
    getImageOrder
} from '@/utils/formRules'

export function useProductEditDialog(props: any, emit: any) {
    const imageStore = useImageStore();
    const productStore = useProductStore();
    const baseImgUrl = 'http://localhost:8000/storage/';
    const formRef = ref<HTMLFormElement | null>(null);
    const editingProduct = ref<Product>({ ...props.product });
    const newImages = ref<File[]>([]);
    const productImages = ref<ProductImage[]>([]);
    const loadingImages = ref(false);
    const loadingSave = ref(false);
    const snackbar = ref<SnackbarState>({
        show: false,
        message: '',
        color: 'success'
    })

    const showSnackbar = (
        message: string,
        color: SnackbarState['color'] = 'success',
        timeout: number = 3000
    ) => {
        snackbar.value = { show: true, message, color }
    }

    const isFormValid = computed(() => {
        if (!formRef.value) return false;
        return formRef.value.isValid;
    });

    const loadImages = async () => {
        if (!editingProduct.value.id) return;

        loadingImages.value = true;
        try {
            productImages.value = await imageStore.fetchProductImages(editingProduct.value.id);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Falha ao carregar imagens'
            productImages.value = [];
            showSnackbar(errorMessage, 'error', 5000)
        } finally {
            loadingImages.value = false;
        }
    };

    watch(() => props.product, (newProduct) => {
        editingProduct.value = { ...newProduct };
        if (props.modelValue) {
            loadImages();
        }
    });

    watch(() => props.modelValue, (isOpen) => {
        if (isOpen && props.product.id) {
            loadImages();
        } else {
            productImages.value = [];
            newImages.value = [];
        }
    });

    const deleteImage = async (imageId: string) => {
        const imageIndex = productImages.value.findIndex(img => img.id === imageId);
        if (imageIndex === -1) return;
        productImages.value[imageIndex].isDeleting = true;

        try {
            await imageStore.deleteImage(imageId);
            productImages.value = productImages.value.filter(img => img.id !== imageId);
            emit('product-updated');
            showSnackbar('Imagem excluída com sucesso!', 'success')
        } catch (error: any) {
            productImages.value[imageIndex].isDeleting = false;
            showSnackbar(error, 'error', 5000)
        }
    };

    const saveProductChanges = async () => {
        if (!isFormValid.value) return;

        loadingSave.value = true;
        try {

            if (newImages.value.length > 0) {
                await imageStore.uploadImages(editingProduct.value.id, newImages.value);
                showSnackbar('Imagem adicionada com sucesso!', 'success')
                newImages.value = [];
            }

            await loadImages();

            const response = await productStore.updateProduct(editingProduct.value);

            emit('product-updated', response);
            showSnackbar('Produto atualizado com sucesso!', 'success')
            closeDialog();
        } catch (error: any) {
            showSnackbar(error, 'error', 5000)
        } finally {
            loadingSave.value = false;
        }
    };

    const closeDialog = () => {
        emit('update:modelValue', false);
    };

    const getFullImageUrl = (path: string) => {
        return `${baseImgUrl}${path}`;
    };


    return {
        formRef,
        isFormValid,
        editingProduct,
        newImages,
        productImages,
        loadingImages,
        loadingSave,
        snackbar,
        showSnackbar,
        deleteImage,
        saveProductChanges,
        closeDialog,
        getFullImageUrl,
        titleRules,
        descriptionRules,
        costRules,
        priceRules,
        imageRules,
        sanitizeDescription,
        validateUniqueOrders,
        validateImageFormat,
        getImageOrder
    };

}