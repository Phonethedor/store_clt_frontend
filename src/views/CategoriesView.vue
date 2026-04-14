<template>
    <div class="categories-view">
        <section class="categories-view__hero hero-categories-view">
            <div class="hero-categories-view__content container">
                <span class="hero-categories-view__subtitle">Explora nuestras esencias</span>
                <h1 class="hero-categories-view__title">Nuestras Colecciones</h1>
                <div class="hero-categories-view__divider"></div>
                <p class="hero-categories-view__text">Cada colección ha sido curada para evocar un estado de ánimo y transformar tu entorno.</p>
            </div>
        </section>

        <section class="categories-view__grid categories-grid-view container">
            <div v-if="loading" class="categories-grid-view__loader loader-state-view">
                <div class="loader-state-view__spinner"></div>
            </div>

            <div v-else class="categories-grid-view__layout">
                <router-link v-for="(cat, index) in categories" :key="cat.id" :to="`/categoria/${cat.id}`"
                    class="categories-grid-view__card category-card-view" :style="{ animationDelay: `${index * 0.1}s` }">
                    <div class="category-card-view__image-wrapper">
                        <img :src="getCategoryPlaceholder(cat.name)" :alt="cat.name" class="category-card-view__img">
                        <div class="category-card-view__overlay">
                            <span class="category-card-view__explore-btn">Explorar</span>
                        </div>
                    </div>
                    <div class="category-card-view__info">
                        <h3 class="category-card-view__name">{{ cat.name }}</h3>
                        <p v-if="cat.description" class="category-card-view__description">{{ cat.description }}</p>
                        <span class="category-card-view__link-text">Ver productos</span>
                    </div>
                </router-link>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import productService from '../services/productService';

const categories = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        categories.value = await productService.getCategories();
    } catch (error) {
        console.error("Error fetching categories:", error);
    } finally {
        loading.value = false;
    }
});

const getCategoryPlaceholder = (name) => {
    const term = name.toLowerCase();
    if (term.includes('vela')) return 'https://images.unsplash.com/photo-1596435707124-33109de80fc5?w=500&q=80';
    if (term.includes('aceite')) return 'https://images.unsplash.com/photo-1608571424278-f075d9e5be6b?w=500&q=80';
    if (term.includes('difusor')) return 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&q=80';
    return 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80';
};
</script>

<style lang="scss" src="../assets/styles/views/_categories.scss" scoped></style>
