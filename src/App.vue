<script setup>
import { ref, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import CartDrawer from './components/CartDrawer.vue';
import Footer from './components/Footer.vue';
import ToastNotification from './components/ToastNotification.vue';

const hasVisited = sessionStorage.getItem('app_initialized');
const showSplash = ref(!hasVisited);
const isExtinguished = ref(false);
const startFade = ref(false);

onMounted(() => {
  if (showSplash.value) {
    setTimeout(() => {
      isExtinguished.value = true;
    }, 1500);
    setTimeout(() => {
      startFade.value = true;
    }, 2200);

    setTimeout(() => {
      showSplash.value = false;
      sessionStorage.setItem('app_initialized', 'true');
    }, 3500);
  }
});
</script>

<template>
  <div class="app-layout">
    <div v-if="showSplash" class="splash-screen" :class="{ 'splash-screen--fade-out': startFade }">
      <div class="splash-screen__candle candle">
        <div class="candle__smoke" :class="{ 'candle__smoke--active': isExtinguished }"></div>
        <div class="candle__flame" :class="{ 'candle__flame--extinguished': isExtinguished }"></div>
        <div class="candle__wick"></div>
        <div class="candle__wax wax">
          <div class="wax__top"></div>
          <div class="wax__melt"></div>
        </div>
        <div class="candle__shadow"></div>
      </div>
      <h2 class="splash-screen__text" :class="{ 'splash-screen__text--faded': isExtinguished }">My peace</h2>
    </div>

    <Navbar />
    <CartDrawer />
    <main class="app-layout__main">
      <router-view />
    </main>
    <Footer />
    <ToastNotification />
  </div>
</template>

<style lang="scss">
// Los estilos globales y el layout ahora se cargan desde src/assets/styles/main.scss importado en main.js
</style>
