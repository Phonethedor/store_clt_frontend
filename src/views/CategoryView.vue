<template>
    <div class="category-view">
        <section class="category-view__hero hero-category-view" v-if="category">
            <div class="hero-category-view__content container">
                <BaseButton variant="text" size="sm" @click="router.push('/')" class="hero-category-view__back">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Volver a la tienda
                </BaseButton>
                
                <div class="hero-category-view__meta">
                    <span class="hero-category-view__label">Categoría</span>
                    <h1 class="hero-category-view__title">{{ category.name }}</h1>
                    <p class="hero-category-view__description" v-if="category.description">{{ category.description }}</p>
                    <div class="hero-category-view__divider"></div>
                </div>
                
                <div class="hero-category-view__controls view-toggle-category">
                    <button 
                        class="view-toggle-category__btn"
                        :class="{ 'view-toggle-category__btn--active': viewMode === 'grid' }"
                        @click="setViewMode('grid')" 
                        title="Vista Cuadrícula"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </button>
                    <button 
                        class="view-toggle-category__btn"
                        :class="{ 'view-toggle-category__btn--active': viewMode === 'list' }"
                        @click="setViewMode('list')" 
                        title="Vista Lista"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
        </section>

        <section class="category-view__products products-grid-category container">
            <div v-if="loading" class="products-grid-category__loader loader-state-category">
                <div class="loader-state-category__spinner"></div>
            </div>

            <div v-else-if="products.length > 0" 
                class="products-grid-category__display" 
                :class="[`products-grid-category__display--${viewMode}`]"
            >
                <ProductCard 
                    v-for="(product, index) in products" 
                    :key="product.id" 
                    :product="product"
                    :viewMode="viewMode"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                />
            </div>

            <div v-else class="category-view__empty empty-category-view">
                <svg class="empty-category-view__icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                <p class="empty-category-view__text">No hay productos en esta categoría por el momento.</p>
                <BaseButton variant="outline" @click="router.push('/')">Explorar otros productos</BaseButton>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import BaseButton from '../components/BaseButton.vue';
import tiendaApi from '../api/tiendaApi';

const router = useRouter();
const props = defineProps(['id']);
const category = ref(null);
const products = ref([]);
const loading = ref(true);
const viewMode = ref(localStorage.getItem('viewMode') || 'grid');

const setViewMode = (mode) => {
    viewMode.value = mode;
    localStorage.setItem('viewMode', mode);
};

const fetchData = async () => {
    loading.value = true;
    try {
        const catRes = await tiendaApi.get(`/categories/${props.id}`);
        category.value = catRes.data.data;

        const prodRes = await tiendaApi.get(`/products/categorie/${props.id}`);
        products.value = prodRes.data.data;
    } catch (error) {
        console.error("Error fetching category data:", error);
    } finally {
        loading.value = false;
    }
};

watch(() => props.id, fetchData);
onMounted(fetchData);
</script>

<style lang="scss" src="../assets/styles/views/_category.scss" scoped></style>
