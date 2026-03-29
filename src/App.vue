<script setup>
import { ref, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import CartDrawer from './components/CartDrawer.vue';
import Footer from './components/Footer.vue';
import ToastNotification from './components/ToastNotification.vue';

const showSplash = ref(true);
const isExtinguished = ref(false);
const startFade = ref(false);

onMounted(() => {
  setTimeout(() => {
    isExtinguished.value = true;
  }, 1500);
  setTimeout(() => {
    startFade.value = true;
  }, 2200);

  setTimeout(() => {
    showSplash.value = false;
  }, 3500);
});
</script>

<template>
  <div class="app-layout">
    <div v-if="showSplash" class="splash-screen" :class="{ 'fade-out': startFade }">
      <div class="candle-container">
        <div class="smoke" :class="{ 'active': isExtinguished }"></div>
        <div class="flame" :class="{ 'extinguished': isExtinguished }"></div>
        <div class="wick"></div>
        <div class="wax">
          <div class="wax-top"></div>
          <div class="wax-melt"></div>
        </div>
        <div class="shadow"></div>
      </div>
      <h2 class="splash-text" :class="{ 'faded': isExtinguished }">My peace</h2>
    </div>

    <Navbar />
    <CartDrawer />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <ToastNotification />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
}

/* Splash Screen (Animación de vela) */
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #161210;
  /* Dark background for cinematic candle intro */
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 1s cubic-bezier(0.25, 1, 0.5, 1);
}

.splash-screen.fade-out {
  opacity: 0;
  pointer-events: none;
}

.candle-container {
  position: relative;
  width: 60px;
  height: 140px;
  margin-bottom: 40px;
}

/* Cera de la vela */
.wax {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 90px;
  background: linear-gradient(to right, #d4cab5, #f5ecd8, #d4cab5);
  border-radius: 6px 6px 4px 4px;
  box-shadow: inset 0 -15px 20px rgba(0, 0, 0, 0.1);
}

.wax-top {
  position: absolute;
  top: -8px;
  left: 0;
  width: 100%;
  height: 16px;
  background: radial-gradient(ellipse at center, #c2b59e 0%, #e2d1bc 100%);
  border-radius: 50%;
  z-index: 2;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}

.wax-melt {
  position: absolute;
  top: 2px;
  left: 10px;
  width: 12px;
  height: 25px;
  background: #f5ecd8;
  border-radius: 10px;
  box-shadow: 20px 5px 0 -2px #f5ecd8;
  z-index: 3;
}

/* Pabilo */
.wick {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 16px;
  background: #1a1a1a;
  border-radius: 2px;
  z-index: 1;
}

/* Llama */
.flame {
  position: absolute;
  top: -55px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 48px;
  background: #ffb400;
  border-radius: 50% 50% 20% 20%;
  box-shadow:
    0 0 20px 5px rgba(255, 180, 0, 0.8),
    0 0 50px 10px rgba(255, 100, 0, 0.6),
    0 -15px 60px 20px rgba(255, 80, 0, 0.3);
  animation: flicker 0.12s infinite alternate, sway 2s infinite alternate;
  transform-origin: bottom center;
  transition: all 0.2s cubic-bezier(1, 0, 0.5, 1);
  z-index: 3;
}

/* Llama apagada */
.flame.extinguished {
  transform: translateX(-50%) scale(0) skewX(15deg);
  opacity: 0;
  box-shadow: none;
}

/* Humo */
.smoke {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: transparent;
  pointer-events: none;
  z-index: 4;
  opacity: 0;
}

.smoke.active {
  animation: blow-smoke 2.5s ease-out forwards;
}

/* Sombra en la base */
.shadow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 12px;
  background: rgba(0, 0, 0, 0.6);
  filter: blur(5px);
  border-radius: 50%;
  z-index: -1;
}

/* Texto de introducción */
.splash-text {
  color: #fff;
  font-family: var(--font-serif);
  font-size: 2.5rem;
  letter-spacing: 6px;
  text-transform: uppercase;
  font-weight: 400;
  margin-top: 20px;
  opacity: 0.9;
  transition: opacity 1.5s ease;
}

.splash-text.faded {
  opacity: 0;
}

/* Animaciones */
@keyframes flicker {
  0% {
    transform: translateX(-50%) scale(1) skewX(2deg);
    opacity: 0.9;
  }

  100% {
    transform: translateX(-50%) scale(1.05) skewX(-2deg);
    opacity: 1;
  }
}

@keyframes sway {
  0% {
    margin-left: -2px;
  }

  100% {
    margin-left: 2px;
  }
}

@keyframes blow-smoke {
  0% {
    top: -20px;
    box-shadow: 0 0 10px 8px rgba(200, 200, 200, 0.8);
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }

  30% {
    opacity: 0.8;
  }

  100% {
    top: -120px;
    box-shadow: 0 0 30px 25px rgba(200, 200, 200, 0);
    opacity: 0;
    transform: translateX(-150%) scale(5);
    /* humo se va de lado simulando viento */
  }
}
</style>
