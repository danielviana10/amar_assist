<template>
    <v-data-table-server :items-per-page="itemsPerPageLocal" @update:items-per-page="val => itemsPerPageLocal = val"
        :page="currentPageLocal" @update:page="val => currentPageLocal = val" :headers="headers" :items="products"
        :items-length="totalItems" :loading="loading" @update:options="loadProducts" class="elevation-1"
        :items-per-page-options="[10, 20, 35, 50]">
        <template v-slot:item.img="{ item }: { item: Product }">
            <template v-if="item.images && item.images.length > 0">
                <v-img :src="getFirstImageUrl(item.images)" max-height="50" max-width="50" class="my-1" contain />
            </template>
            <template v-else>
                <v-icon>mdi-image-off</v-icon>
            </template>
        </template>

        <template v-slot:item.title="{ item }">
            <v-tooltip :text="item.title" location="top">
                <template v-slot:activator="{ props }">
                    <span v-bind="props" class="text-truncate">
                        {{ truncateText(item.title, 20) }}
                    </span>
                </template>
            </v-tooltip>
        </template>

        <template v-slot:item.description="{ item }">
            <v-tooltip :text="item.description" location="top">
                <template v-slot:activator="{ props }">
                    <span v-bind="props" class="text-truncate">
                        {{ truncateText(item.description, 40) }}
                    </span>
                </template>
            </v-tooltip>
        </template>

        <template v-slot:item.price="{ item }"> R$ {{ Number(item.price).toFixed(2) }} </template>

        <template v-slot:item.cost="{ item }"> R$ {{ Number(item.cost).toFixed(2) }} </template>

        <template v-slot:item.active="{ item }">
            <v-tooltip :text="item.active ? 'Desativar' : 'Ativar'">
                <template v-slot:activator="{ props }">
                    <div class="position-relative" style="width: 24px; height: 24px">
                        <v-progress-circular v-if="item.isLoading" indeterminate size="24" width="2" color="primary" />
                        <v-icon v-else v-bind="props" :color="item.active ? 'success' : 'grey'"
                            @click="$emit('toggle-status', item)">
                            {{ item.active ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off' }}
                        </v-icon>
                    </div>
                </template>
            </v-tooltip>
        </template>

        <template v-slot:item.actions="{ item }">
            <v-tooltip text="Editar" location="top">
                <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" small class="mr-2" @click="$emit('edit-product', item)">
                        mdi-pencil
                    </v-icon>
                </template>
            </v-tooltip>
        </template>
    </v-data-table-server>
</template>

<script lang="ts" setup>
import type { Product } from '@/types/products/products'
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps<{
    headers: any[],
    products: Product[],
    totalItems: number,
    currentPage: number,
    itemsPerPage: number,
    loading: boolean,
    getFirstImageUrl: (images: any[]) => string,
    truncateText: (text: string, maxLength: number) => string,
}>()

const itemsPerPageLocal = ref(props.itemsPerPage);
const currentPageLocal = ref(props.currentPage);

const emits = defineEmits<{
    (e: 'toggle-status', item: Product): void
    (e: 'edit-product', item: Product): void
    (e: 'update:options', options: any): void
}>()

const loadProducts = (options: any) => {
    emits('update:options', options)
}
</script>