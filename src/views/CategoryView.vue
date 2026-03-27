<template>
    <div class="category-view">
        <section class="category-hero" v-if="category">
            <div class="category-header container">
                <router-link to="/" class="back-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Volver a la tienda
                </router-link>
                <span class="category-label">Categoría</span>
                <h1>{{ category.name }}</h1>
                <p v-if="category.description">{{ category.description }}</p>
                <div class="header-line"></div>
            </div>
        </section>

        <section class="products-section container">
            <div v-if="loading" class="loader-container">
                <div class="elegant-loader"></div>
            </div>

            <div v-else-if="products.length > 0" class="product-grid">
                <div v-for="(product, index) in products" :key="product.id" class="product-card group staggered-fade"
                    :class="{ 'out-of-stock': product.stock === 0 }" :style="{ animationDelay: `${index * 0.1}s` }">
                    <div class="image-container">
                        <div v-if="product.stock === 0" class="stock-badge out">Agotado</div>
                        <div v-else-if="product.stock <= 5" class="stock-badge low">¡Últimas unidades!</div>
                        <img :src="`http://localhost:3021/public/${product.image_url}`" :alt="product.name">
                        <div class="product-overlay">
                            <button @click="addToCart(product)" class="add-btn" :disabled="product.stock === 0">
                                <span v-if="product.stock > 0">+ Añadir al carrito</span>
                                <span v-else>Sin stock</span>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>{{ product.name }}</h3>
                        <p class="description">{{ product.description }}</p>
                        <div class="product-meta">
                            <span class="price">${{ formatPrice(product.price) }}</span>
                            <span v-if="product.stock > 0" class="stock-count">{{ product.stock }} disponibles</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                    opacity="0.3">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                <p>No hay productos en esta categoría por el momento.</p>
                <router-link to="/" class="btn-outline">Explorar otros productos</router-link>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import tiendaApi from '../api/tiendaApi';
import { useCartStore } from '../stores/cart';

const route = useRoute();
const cartStore = useCartStore();

const props = defineProps(['id']);
const category = ref(null);
const products = ref([]);
const loading = ref(true);

const fetchData = async () => {
    loading.value = true;
    try {
        // Fetch Category Details
        const catRes = await tiendaApi.get(`/categories/${props.id}`);
        category.value = catRes.data.data;

        // Fetch Products by Category
        const prodRes = await tiendaApi.get(`/products/categorie/${props.id}`);
        products.value = prodRes.data.data;
    } catch (error) {
        console.error("Error fetching category data:", error);
    } finally {
        loading.value = false;
    }
};

// Re-fetch when the ID changes (e.g. switching between categories in the menu)
watch(() => props.id, fetchData);

onMounted(fetchData);

const addToCart = (product) => {
    cartStore.addItem(product);
};

const formatPrice = (value) => {
    if (!value) return "0";
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
</script>

<style scoped>
.category-view {
    padding-top: 120px;
    min-height: 100vh;
}

.category-header {
    text-align: center;
    margin-bottom: 60px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    text-decoration: none;
    margin-bottom: 40px;
    transition: color 0.3s ease;
}

.back-link:hover {
    color: var(--charcoal);
}

.category-label {
    display: block;
    font-size: 0.8rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 15px;
}

.category-header h1 {
    font-size: 3.5rem;
    font-family: var(--font-serif);
    margin-bottom: 20px;
    color: var(--charcoal);
}

.category-header p {
    font-size: 1.1rem;
    color: var(--text-muted);
    line-height: 1.6;
}

.header-line {
    width: 60px;
    height: 1px;
    background-color: var(--charcoal);
    margin: 30px auto 0;
}

.products-section {
    padding-bottom: 100px;
}

/* Grid logic compatible with existing design */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 40px;
}

.image-container {
    position: relative;
    aspect-ratio: 3/4;
    background-color: var(--card-bg);
    border-radius: 4px;
    border: 1px solid var(--border-color);
    overflow: hidden;
    margin-bottom: 20px;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.5s ease;
}

.product-card:hover .image-container img {
    transform: scale(1.05);
}

.product-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
    display: flex;
    justify-content: center;
}

.product-card:hover .product-overlay {
    opacity: 1;
    transform: translateY(0);
}

.add-btn {
    background: var(--charcoal);
    color: var(--sand);
    padding: 12px 24px;
    width: 100%;
    font-size: 0.85rem;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.product-info h3 {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    margin-bottom: 8px;
}

.description {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 12px;
}

.price {
    font-weight: 500;
}

.empty-state {
    text-align: center;
    padding: 100px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.loader-container {
    display: flex;
    justify-content: center;
    padding: 60px 0;
}

.elegant-loader {
    width: 40px;
    height: 40px;
    border: 1px solid var(--charcoal);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes fade-up {
    0% {
        opacity: 0;
        transform: translateY(40px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.staggered-fade {
    opacity: 0;
    animation: fade-up 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}
</style>
