<script setup>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import CartDrawer from '../../modules/cart/components/CartDrawer.vue';
</script>

<template>
    <div class="app-layout">
        <Navbar />
        <CartDrawer />
        <main class="app-layout__main">
            <slot />
        </main>
        <Footer />
    </div>
</template>
