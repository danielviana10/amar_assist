import { ref, computed, watch } from 'vue'
import { useProductStore } from '@/stores/products/productStore'
import { useImageStore } from '@/stores/images/imageStore'
import type { ProductCreate } from '@/types/products/Products'
import type { SnackbarState } from '@/types/snackbar/Snackbar'
import {
    titleRules,
    descriptionRules,
    costRules,
    priceRules,
    imageRules,
    sanitizeDescription,
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


    const titleValidate = computed(() => titleRules)
    const descriptionValidate = computed(() => descriptionRules)
    const priceValidate = computed(() => priceRules(localProduct.value.cost))
    const costValidate = computed(() => costRules(localProduct.value.price))
    const imageValidate = computed(() => imageRules)
    const isFormValid = computed(() => form.value?.isValid || false)
    const title = computed(() => props.product.id ? 'Editar Produto' : 'Novo Produto')


    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg']


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



    const sanitizeValidade = () => {
        localProduct.value.description = sanitizeDescription(localProduct.value.description)
    }

    const getImageOrder = (fileName: string): number => {
        const match = fileName.match(/-(\d+)\.\w+$/)
        return match ? parseInt(match[1]) : 0
    }

    const isValidImage = (file: File): boolean => {
        const namePattern = /^[a-zA-Z0-9_-]+-[1-9]\d*\.(jpe?g|png)$/i
        return namePattern.test(file.name) && allowedImageTypes.includes(file.type)
    }

    const removePreviewImage = (index: number) => {
        previewImages.value.splice(index, 1)
        newImages.value.splice(index, 1)
        fileInputKey.value++
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
        }
    )

    watch(
        newImages,
        (files) => {
            previewImages.value = []
            if (!files || files.length === 0) return

            const validFiles = files.filter(isValidImage)
            if (validFiles.length !== files.length) {
                newImages.value = validFiles
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
        priceValidate,
        titleValidate,
        descriptionValidate,
        costValidate,
        imageValidate,
        previewImages,
        fileInputKey,
        isFormValid,
        snackbar,
        showSnackbar,
        getImageOrder,
        removePreviewImage,
        closeDialog,
        handleSave,
        sanitizeValidade
    }
}