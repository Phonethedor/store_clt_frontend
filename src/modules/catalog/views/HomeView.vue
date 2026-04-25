<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import productService from '../services/product.service';
import { useSearchStore } from '../../../shared/stores/search';
import { useAsync } from '../../../shared/composables/useAsync';

const router = useRouter();
const searchStore = useSearchStore();

const { data: products, isLoading: loading, execute: fetchProducts } = useAsync(productService.getAll, []);
const viewMode = ref(localStorage.getItem('viewMode') || 'grid');
const hasVisited = ref(!!sessionStorage.getItem('app_initialized'));

const heroStyle = computed(() => ({
    '--hero-delay-content': hasVisited.value ? '0.3s' : '2.3s',
    '--hero-delay-image': hasVisited.value ? '0.4s' : '2.5s'
}));

const setViewMode = (mode) => {
    viewMode.value = mode;
    localStorage.setItem('viewMode', mode);
};

const scrollToProducts = () => {
    const el = document.querySelector('.products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const sortedProducts = computed(() => {
    const query = searchStore.searchQuery.toLowerCase();

    // 1. Filtrar por búsqueda
    const filtered = products.value.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
    );

    // 2. Ordenar por categoría (alfabéticamente por nombre de categoría)
    return [...filtered].sort((a, b) => {
        const catA = a.categorie?.name || '';
        const catB = b.categorie?.name || '';
        return catA.localeCompare(catB);
    });
});

onMounted(() => {
    fetchProducts();
});
</script>

<style lang="scss" src="../../../assets/styles/views/_home.scss" scoped></style>

<template>
    <div class="home-view" :style="heroStyle">
        <section class="home-view__hero hero">
            <div class="hero__aura hero__aura--1"></div>
            <div class="hero__aura hero__aura--2"></div>

            <div class="hero__content">
                <span class="hero__subtitle">Nueva Colección</span>
                <h1 class="hero__title">Esencia de<br>Serenidad</h1>
                <p class="hero__text">Descubre nuestra nueva línea de aromas botánicos diseñados para traer paz y
                    equilibrio a tu hogar.
                </p>
                <div class="hero__actions">
                    <BaseButton @click="scrollToProducts" variant="primary">Descubrir</BaseButton>
                    <BaseButton @click="router.push('/categorias')" variant="outline">Ver Colección</BaseButton>
                </div>
            </div>

            <div class="hero__image-container">
                <div class="hero__image-wrapper">
                    <img src="https://images.unsplash.com/photo-1602928321679-560bb453f190?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Velas aromáticas" class="hero__img">
                </div>
            </div>
        </section>

        <section class="home-view__products products-section container">
            <div class="products-section__header header">
                <h2 class="header__title">Nuestros Productos</h2>
                <div class="header__line"></div>

                <div class="header__controls controls">
                    <div class="controls__search local-search">
                        <svg class="local-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.5">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="M21 21L16.65 16.65"></path>
                        </svg>
                        <input type="text" v-model="searchStore.searchQuery" placeholder="Filtrar colección..."
                            class="local-search__input">
                    </div>

                    <div class="controls__view-toggle view-toggle">
                        <button class="view-toggle__btn" :class="{ 'view-toggle__btn--active': viewMode === 'grid' }"
                            @click="setViewMode('grid')" title="Vista Cuadrícula">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </button>
                        <button class="view-toggle__btn" :class="{ 'view-toggle__btn--active': viewMode === 'list' }"
                            @click="setViewMode('list')" title="Vista Lista">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="8" y1="6" x2="21" y2="6"></line>
                                <line x1="8" y1="12" x2="21" y2="12"></line>
                                <line x1="8" y1="18" x2="21" y2="18"></line>
                                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                <line x1="3" y1="18" x2="3.01" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="loading" class="products-section__loader">
                <div class="elegant-loader"></div>
            </div>

            <div v-else-if="sortedProducts.length > 0" class="products-section__display"
                :class="[`products-section__display--${viewMode}`]">
                <ProductCard v-for="(product, index) in sortedProducts" :key="product.id" :product="product"
                    :viewMode="viewMode"
                    :style="{ animationDelay: hasVisited ? `${index * 0.05}s` : `${index * 0.1}s` }" />
            </div>

            <div v-else class="products-section__no-results no-results">
                <p class="no-results__text">No se encontraron productos que coincidan con "{{ searchStore.searchQuery
                    }}"</p>
                <BaseButton variant="outline" @click="searchStore.clearSearch()">Limpiar búsqueda</BaseButton>
            </div>
        </section>
    </div>
</template>