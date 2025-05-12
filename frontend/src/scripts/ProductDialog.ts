import { ref, computed, watch } from 'vue'
import { useProductStore } from '@/stores/products/productStore'
import { useImageStore } from '@/stores/images/imageStore'
import type { ProductCreate } from '@/types/products/products'
import type { SnackbarState } from '@/types/snackbar/snackbar'
import {
    titleRules,
    descriptionRules,
    costRules,
    priceRules,
    imageRules,
    validateUniqueOrders,
    validateImageFormat,
    getImageOrder,
    sanitizeDescription
} from '@/utils/formRules'

export function useProductDialog(props: any, emit: any) {

    const productStore = useProductStore()
    const imageStore = useImageStore()
    const internalDialog = ref(props.modelValue)
    const form = ref()
    const fileInputKey = ref(0)
    const newImages = ref<File[]>([])
    const previewImages = ref<Array<{ url: string; file: File }>>([])
    const loading = ref(false)
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
    const localProduct = ref<ProductCreate>({
        ...props.product,
        title: props.product.title || '',
        description: props.product.description || '',
        price: Number(props.product.price) || 0,
        cost: Number(props.product.cost) || 0
    })
    const isFormValid = computed(() => form.value?.isValid || false)
    const title = 'Novo Produto'
    const resetForm = () => {
        localProduct.value = {
            title: '',
            description: '',
            price: 0,
            cost: 0,
        }
        newImages.value = []
        previewImages.value = []
        fileInputKey.value++
        form.value?.reset()
    }

    const removePreviewImage = (fileName: string) => {
        const index = newImages.value.findIndex(file => file.name === fileName)
        if (index !== -1) {
            newImages.value.splice(index, 1)
            previewImages.value = previewImages.value.filter(img => img.file.name !== fileName)
            fileInputKey.value++
        }
    }

    const closeDialog = () => {
        resetForm()
        emit('update:modelValue', false)
    }
    const handleSave = async () => {
        if (!form.value) return

        const { valid } = await form.value.validate()
        if (!valid) return

        loading.value = true

        try {
            const productData = {
                title: localProduct.value.title.trim(),
                description: localProduct.value.description.trim(),
                price: Number(localProduct.value.price),
                cost: Number(localProduct.value.cost),
                active: true
            }

            const response = await productStore.createProduct(productData)

            if (newImages.value.length > 0 && response.data?.id) {
                await imageStore.uploadImages(response.data.id, newImages.value)
            }

            emit('product-created', response)
            showSnackbar('Produto salvo com sucesso!', 'success')
            closeDialog()
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Falha ao salvar produto'
            showSnackbar(errorMessage, 'error', 5000)
        } finally {
            loading.value = false
        }
    }

    watch(
        () => props.modelValue,
        (val) => {
            internalDialog.value = val
            if (val) {
                localProduct.value = {
                    ...props.product,
                    title: props.product.title || '',
                    description: props.product.description || '',
                    price: Number(props.product.price) || 0,
                    cost: Number(props.product.cost) || 0
                }
            }
        },
    )

    watch(
        newImages,
        (files) => {
            previewImages.value = []
            if (!files || files.length === 0) return

            const validFiles = files.filter(file => validateImageFormat(file))
            if (validFiles.length !== files.length) {
                const invalidCount = files.length - validFiles.length
                const message = invalidCount === 1
                    ? '1 imagem inválida foi removida.'
                    : `${invalidCount} imagens inválidas foram removidas.`
                showSnackbar(message, 'error')
                newImages.value = validFiles
                return
            }

            if (!validateUniqueOrders(validFiles)) {
                showSnackbar('Não é permitido ter imagens com a mesma ordem numérica', 'error')
                newImages.value = []
                return
            }

            validFiles.forEach((file) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                    previewImages.value.push({
                        url: e.target?.result as string,
                        file: file
                    })
                }
                reader.readAsDataURL(file)
            })
        },
        { deep: true }
    )

    return {
        internalDialog,
        localProduct,
        form,
        title,
        newImages,
        loading,
        titleRules,
        descriptionRules,
        priceRules,
        costRules,
        imageRules,
        previewImages,
        fileInputKey,
        isFormValid,
        snackbar,
        showSnackbar,
        getImageOrder,
        removePreviewImage,
        closeDialog,
        handleSave,
        sanitizeDescription
    }
}