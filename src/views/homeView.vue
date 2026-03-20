<template>
    <div class="home">
        <section class="hero">
            <div class="scent-aura aura-1"></div>
            <div class="scent-aura aura-2"></div>

            <div class="hero-content">
                <span class="subtitle">Nueva Colección</span>
                <h1>Esencia de<br>Serenidad</h1>
                <p>Descubre nuestra nueva línea de aromas botánicos diseñados para traer paz y equilibrio a tu hogar.
                </p>
                <div class="hero-actions">
                    <button class="btn-primary">Descubrir</button>
                    <button class="btn-outline">Ver Colección</button>
                </div>
            </div>
            <div class="hero-image">
                <div class="image-wrapper">
                    <img src="https://images.unsplash.com/photo-1602928321679-560bb453f190?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Velas aromáticas">
                </div>
            </div>
        </section>

        <section class="products-section container">
            <div class="section-header">
                <h2>Nuestros Productos</h2>
                <div class="header-line"></div>
            </div>

            <div v-if="loading" class="loader-container">
                <div class="elegant-loader"></div>
            </div>

            <div v-else-if="filteredProducts.length > 0" class="product-grid">
                <div v-for="(product, index) in filteredProducts" :key="product.id" class="product-card group staggered-fade"
                    :class="{ 'out-of-stock': product.stock === 0 }"
                    :style="{ animationDelay: `${index * 0.1}s` }">
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

            <div v-else class="no-results">
                <p>No se encontraron productos que coincidan con "{{ searchStore.searchQuery }}"</p>
                <button class="btn-outline" @click="searchStore.clearSearch()">Limpiar búsqueda</button>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import tiendaApi from '../api/tiendaApi';
import { useCartStore } from '../stores/cart';
import { useSearchStore } from '../stores/search';

const cartStore = useCartStore();
const searchStore = useSearchStore();

const products = ref([]);
const loading = ref(true);

const filteredProducts = computed(() => {
    if (!searchStore.searchQuery) return products.value;
    const query = searchStore.searchQuery.toLowerCase();
    return products.value.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query)
    );
});

onMounted(async () => {
    try {
        const { data } = await tiendaApi.get('/products');
        products.value = data.data;
    } catch (error) {
        console.error("Error al traer productos:", error);
    } finally {
        loading.value = false;
    }
});

const addToCart = (product) => {
    cartStore.addItem(product);
};

const formatPrice = (value) => {
    if (!value) return "0";
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
</script>

<style scoped>
.home {
    padding-top: 80px;
}

/* Hero Section */
.hero {
    display: flex;
    min-height: 85vh;
    /* A bit more breathing space */
    padding: 0 5%;
    max-width: 1600px;
    margin: 0 auto;
    align-items: center;
    gap: 5%;
    position: relative;
    overflow: hidden;
    /* For aura elements */
}

/* Scent Haze / Aura Background Elements */
.scent-aura {
    position: absolute;
    width: 600px;
    height: 600px;
    filter: blur(100px);
    border-radius: 50%;
    z-index: -1;
    pointer-events: none;
    opacity: 0.2;
}

.aura-1 {
    top: -100px;
    left: -100px;
    background: radial-gradient(circle, var(--sage) 0%, transparent 70%);
    animation: drift 25s infinite alternate ease-in-out;
}

.aura-2 {
    bottom: -150px;
    right: -100px;
    background: radial-gradient(circle, var(--taupe) 0%, transparent 70%);
    animation: drift 20s infinite alternate-reverse ease-in-out;
}

@keyframes drift {
    0% {
        transform: translate(0, 0) scale(1);
    }

    100% {
        transform: translate(100px, 50px) scale(1.1);
    }
}

.hero-content {
    flex: 1;
    max-width: 600px;
    padding-right: 40px;
    opacity: 0;
    animation: fade-up 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    animation-delay: 2.3s;
    /* Sync with splash fade to start as splash is ending */
}

/* Staggered entrance animation for products */
.staggered-fade {
    opacity: 0;
    animation: fade-up 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
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

.hero-image {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    opacity: 0;
    animation: fade-up 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    animation-delay: 2.5s;
}

.subtitle {
    font-size: 0.85rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-muted);
    display: block;
    margin-bottom: 20px;
}

.hero-content h1 {
    font-size: 4.5rem;
    line-height: 1.1;
    margin-bottom: 24px;
    color: var(--charcoal);
}

.hero-content p {
    font-size: 1.1rem;
    color: var(--text-muted);
    margin-bottom: 40px;
    max-width: 450px;
}

.hero-actions {
    display: flex;
    gap: 16px;
}

.hero-image {
    flex: 1;
    display: flex;
    justify-content: flex-end;
}

.image-wrapper {
    width: 100%;
    max-width: 600px;
    height: 65vh;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 20px 20px 60px var(--shadow-soft);
}

.image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Products Section */
.products-section {
    padding: 100px 24px;
}

.section-header {
    text-align: center;
    margin-bottom: 60px;
}

.section-header h2 {
    font-size: 2.5rem;
    margin-bottom: 16px;
}

.header-line {
    width: 60px;
    height: 1px;
    background-color: var(--charcoal);
    margin: 0 auto;
}

/* Loader */
.loader-container {
    display: flex;
    justify-content: center;
    padding: 40px 0;
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

/* Grid */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 40px;
}

.product-card {
    text-align: center;
}

.image-container {
    position: relative;
    width: 100%;
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
    border-radius: 2px;
}

.add-btn:hover {
    background: var(--taupe);
    color: var(--charcoal);
}

.product-info h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    font-family: var(--font-serif);
}

.description {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.price {
    font-family: var(--font-sans);
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--charcoal);
}

.product-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}

.stock-count {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.stock-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 6px 12px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 2px;
    z-index: 2;
}

.stock-badge.out {
    background: #e63946;
    color: white;
}

.stock-badge.low {
    background: var(--taupe);
    color: var(--charcoal);
}

.out-of-stock {
    opacity: 0.7;
}

.add-btn:disabled {
    background: var(--gray-200);
    color: var(--text-muted);
    cursor: not-allowed;
}

.no-results {
    text-align: center;
    padding: 60px 0;
    color: var(--text-muted);
}

.no-results p {
    margin-bottom: 20px;
    font-size: 1.1rem;
}

@media (max-width: 900px) {
    .hero {
        flex-direction: column;
        padding-top: 40px;
        text-align: center;
        gap: 40px;
    }

    .hero-content {
        padding-right: 0;
    }

    .hero-actions {
        justify-content: center;
    }
}
</style>