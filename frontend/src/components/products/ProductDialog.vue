<template>
    <v-dialog v-model="internalDialog" max-width="600px" persistent>
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ title }}</span>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" @submit.prevent="handleSave">
                    <v-container>
                        <!-- Campos do produto (mantidos iguais) -->
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="product.title" label="Título*"
                                    :rules="[v => !!v || 'Título é obrigatório']" required></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-textarea v-model="product.description" label="Descrição" rows="3"
                                    @input="sanitizeDescription" :rules="[
                                        v => !!v || 'Este campo é obrigatório',
                                        v => validateDescription(v) || 'Apenas as tags <p>, <br>, <b>, <strong> são permitidas'
                                    ]" required></v-textarea>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="6">
                                <v-text-field v-model="product.price" label="Preço*" prefix="R$" type="number" min="0"
                                    step="0.01" :rules="priceRules" required></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="product.cost" label="Custo*" prefix="R$" type="number" min="0"
                                    step="0.01" :rules="costRules" required></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-switch v-model="product.active" label="Produto ativo" color="success"></v-switch>
                            </v-col>
                        </v-row>

                        <!-- Upload de Imagens -->
                        <v-row>
                            <v-col cols="12">
                                <v-file-input v-model="newImages" label="Adicionar imagens" multiple
                                    prepend-icon="mdi-camera" accept="image/jpeg,image/png" :rules="imageRules"
                                    show-size counter @change="handleImageUpload">
                                    <template v-slot:message="{ message }">
                                        <small class="text-caption text-grey">
                                            Padrão: produto-1.jpg, produto-2.jpg (Máx. 5 imagens)
                                        </small>
                                    </template>
                                </v-file-input>
                            </v-col>
                        </v-row>

                        <v-snackbar v-model="errorSnackbar.show" :color="errorSnackbar.color" :timeout="3000"
                            location="top right">
                            {{ errorSnackbar.message }}
                            <template v-slot:actions>
                                <v-btn variant="text" @click="errorSnackbar.show = false">Fechar</v-btn>
                            </template>
                        </v-snackbar>

                        <!-- Pré-visualização -->
                        <v-row v-if="product.images && product.images.length > 0">
                            <v-col cols="12">
                                <div class="d-flex flex-wrap gap-2">
                                    <v-card v-for="(image, index) in product.images" :key="image.id || index"
                                        width="100" class="position-relative">
                                        <v-img :src="image.url" height="100" cover></v-img>
                                        <v-btn icon size="x-small" color="error" class="position-absolute"
                                            style="top: 4px; right: 4px;" @click="removeImage(image, index)">
                                            <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                        <div class="text-caption text-center pa-1">
                                            Ordem: {{ getImageOrder(image) }}
                                        </div>
                                    </v-card>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" variant="text" @click="closeDialog" :disabled="loading">
                    Cancelar
                </v-btn>
                <v-btn color="primary" variant="text" @click="handleSave" :loading="loading">
                    Salvar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import { api } from '@/services/api';
import type { Product, ProductImage } from '@/types/products/products';
import { useProductStore } from '@/stores/products/productStore';

export default defineComponent({
    name: 'ProductDialog',
    methods: {
        getImageOrder(image: ProductImage) {
            if (image.file && image.file.name) {
                const match = image.file.name.match(/-(\d+)(?=\.\w+$)/);
                return match ? match[1] : 'Desconhecido';
            }
            return 'Desconhecido';
        }
    },
    props: {
        modelValue: {
            type: Boolean,
            required: true
        },
        product: {
            type: Object as PropType<Product>,
            required: true
        }
    },
    emits: ['update:modelValue', 'save'],
    setup(props, { emit }) {
        const productStore = useProductStore();
        const internalDialog = ref(props.modelValue);
        const form = ref();
        const newImages = ref<File[]>([]);
        const loading = ref(false);
        const errorSnackbar = ref({
            show: false,
            message: '',
            color: 'error'
        });

        watch(() => props.modelValue, val => internalDialog.value = val);
        watch(() => internalDialog.value, val => emit('update:modelValue', val));

        // Regras de validação
        const priceRules = [
            (v: any) => !!v || 'Preço é obrigatório',
            (v: number) => v >= 0 || 'Preço não pode ser negativo',
            (v: number) => v >= props.product.cost || 'Preço deve ser ≥ Custo'
        ];

        const costRules = [
            (v: any) => !!v || 'Custo é obrigatório',
            (v: number) => v >= 0 || 'Custo não pode ser negativo'
        ];

        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const imageRules = [
            (files: File[]) => !files || files.length === 0 ||
                Array.from(files).every(file => allowedImageTypes.includes(file.type))
        ];

        const title = computed(() => props.product.id ? 'Editar Produto' : 'Novo Produto');

        const handleImageUpload = () => {
            if (!newImages.value || newImages.value.length === 0) return;

            props.product.images = [];
            const validFiles: File[] = [];
            const invalidFiles: { file: File, reason: string }[] = [];

            newImages.value.forEach(file => {
                const name = file.name.split('.')[0];
                const isNameValid = /^[a-zA-Z0-9_]+-\d+$/.test(name);

                const isTypeValid = allowedImageTypes.includes(file.type);

                if (!isNameValid || !isTypeValid) {
                    let reason = '';
                    if (!isNameValid && !isTypeValid) {
                        reason = 'Nome e formato inválidos';
                    } else if (!isNameValid) {
                        reason = 'Nome inválido';
                    } else {
                        reason = 'Formato não permitido';
                    }
                    invalidFiles.push({ file, reason });
                } else {
                    validFiles.push(file);

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (!props.product.images) props.product.images = [];

                        props.product.images.push({
                            id: '',
                            url: e.target?.result as string,
                            order: props.product.images.length + 1,
                            deleted: false,
                            file
                        } as ProductImage & { file: File });
                    };
                    reader.readAsDataURL(file);
                }
            });

            if (invalidFiles.length > 0) {
                errorSnackbar.value = {
                    show: true,
                    message: `Arquivos inválidos (${invalidFiles.length}): ` +
                        invalidFiles.map(f => `${f.file.name} (${f.reason})`).join(', '),
                    color: 'error'
                };
            }

            newImages.value = validFiles;
        };

        const removeImage = (image: ProductImage, index: number) => {
            props.product.images?.splice(index, 1);
        };

        const closeDialog = () => {
            internalDialog.value = false;
        };

        const handleSave = async () => {
            sanitizeDescription();

            const { valid } = await form.value.validate();
            if (!valid) return;

            loading.value = true;

            try {
                const productData = {
                    title: props.product.title,
                    description: props.product.description,
                    price: Number(props.product.price),
                    cost: Number(props.product.cost),
                    active: props.product.active
                };

                const savedProduct = props.product.id
                    ? await productStore.updateProduct(props.product)
                    : await productStore.createProduct(productData);

                if (newImages.value.length > 0) {
                    await uploadImages(Number(savedProduct.id), newImages.value);
                }
                emit('save', savedProduct);
                closeDialog();
            } catch (error) {
                console.error('Erro ao salvar produto:', error);
            } finally {
                loading.value = false;
            }
        };

        const uploadImages = async (productId: number, images: File[]) => {
            const formData = new FormData();
            images.forEach(image => {
                formData.append('images[]', image);
            });

            await api.post(`/products/${productId}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        };

        const sanitizeDescription = () => {
            if (!props.product.description) return;

            props.product.description = props.product.description.replace(
                /<(?!\/?(p|br|b|strong)(\s[^>]*)?>)[^>]+>/gi,
                ''
            );

            props.product.description = props.product.description.replace(
                /<(p|b|strong)\s+[^>]*>/gi,
                '<$1>'
            );
        };

        const validateDescription = (description: string): boolean => {
            const forbiddenTagsRegex = /<(?!\/?(p|br|b|strong)(\s[^>]*)?>)[^>]+>/gi;
            return !forbiddenTagsRegex.test(description);
        };


        return {
            internalDialog,
            form,
            title,
            newImages,
            loading,
            priceRules,
            costRules,
            imageRules,
            errorSnackbar,
            handleImageUpload,
            removeImage,
            closeDialog,
            handleSave,
            validateDescription,
            sanitizeDescription,
        };
    }
});
</script>

<style scoped>
.gap-2 {
    gap: 8px;
}

.position-relative {
    position: relative;
}

.position-absolute {
    position: absolute;
}
</style>