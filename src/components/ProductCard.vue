<template>
    <div class="product-card staggered-fade"
        :class="[`product-card--${viewMode}`, { 'product-card--out-of-stock': product.stock === 0 }]"
    >
        <div class="product-card__image-container">
            <div v-if="product.stock === 0" class="product-card__badge product-card__badge--out">Agotado</div>
            <div v-else-if="product.stock <= 5" class="product-card__badge product-card__badge--low">¡Últimas unidades!</div>
            
            <img :src="`http://localhost:3021/public/${product.image_url}`" :alt="product.name" class="product-card__img">
            
            <div v-if="viewMode === 'grid'" class="product-card__overlay">
                <BaseButton @click="handleAddToCart" :disabled="product.stock === 0" size="full">
                    <span v-if="product.stock > 0">+ Añadir al carrito</span>
                    <span v-else>Sin stock</span>
                </BaseButton>
            </div>
        </div>

        <div class="product-card__info">
            <h3 class="product-card__title">{{ product.name }}</h3>
            <p class="product-card__description">{{ product.description }}</p>
            
            <div class="product-card__meta">
                <span class="product-card__price">${{ formatPrice(product.price) }}</span>
                <span v-if="product.stock > 0" class="product-card__stock-count">{{ product.stock }} disponibles</span>
            </div>
            
            <div v-if="viewMode === 'list'" class="product-card__list-action">
                <BaseButton @click="handleAddToCart" :disabled="product.stock === 0" variant="primary">
                    <span v-if="product.stock > 0">+ Añadir al carrito</span>
                    <span v-else>Sin stock</span>
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatPrice } from '../utils/format';
import { useCartStore } from '../stores/cart';
import BaseButton from './BaseButton.vue';

const props = defineProps({
    product: { type: Object, required: true },
    viewMode: { type: String, default: 'grid' }
});

const cartStore = useCartStore();

const handleAddToCart = () => {
    cartStore.addItem(props.product);
};
</script>

<style lang="scss" src="../assets/styles/components/_product-card.scss" scoped></style>
