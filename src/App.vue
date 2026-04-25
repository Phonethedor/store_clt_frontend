<script set up>
import { ref, onMounted } from 'vue';
import ToastNotification from './shared/components/ToastNotification.vue';
import MainLayout from './shared/layouts/MainLayout.vue';
import { APP_CONSTANTS } from './core/constants/app.constants';

const hasVisited = sessionStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.APP_INITIALIZED);
const showSplash = ref(!hasVisited);
const isExtinguished = ref(false);
const startFade = ref(false);

onMounted(() => {
  if (showSplash.value) {
    setTimeout(() => {
      isExtinguished.value = true;
    }, APP_CONSTANTS.SPLASH_SCREEN.EXTINGUISH_DELAY);
    setTimeout(() => {
      startFade.value = true;
    }, APP_CONSTANTS.SPLASH_SCREEN.FADE_DELAY);

    setTimeout(() => {
      showSplash.value = false;
      sessionStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.APP_INITIALIZED, 'true');
    }, APP_CONSTANTS.SPLASH_SCREEN.TOTAL_DURATION);
  }
});
</script>

<template>
  <!-- Global Splash Screen -->
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

  <!-- App Wrapper (Layout + Router) -->
  <MainLayout>
    <router-view />
  </MainLayout>

  <!-- Global Modals/Toasts -->
  <ToastNotification />
</template>

<style lang="scss"></style>