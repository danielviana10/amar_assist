<template>
    <div class="products-page">
        <h1>Produtos</h1>
        <div class="product-card" v-for="product in products" :key="product.id">
            <img :src="product.image" alt="Imagem do produto" />
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <strong>R$ {{ product.price.toFixed(2) }}</strong>
        </div>
    </div>
</template>

<script setup lang="ts">
const products = [
    {
        id: 1,
        name: 'Produto 1',
        description: 'Descrição do produto 1',
        price: 99.9,
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 2,
        name: 'Produto 2',
        description: 'Descrição do produto 2',
        price: 199.9,
        image: 'https://via.placeholder.com/150'
    }
]
</script>

<style scoped>
.products-page {
    padding: 2rem;
    background-color: #f3f3f3;
}

.product-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
}

.product-card img {
    max-width: 100%;
    border-radius: 8px;
}
</style>