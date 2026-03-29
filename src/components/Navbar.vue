<template>
  <header class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-container">
      <div class="nav-links">
        <router-link to="/" class="nav-link">Shop</router-link>
        <div class="dropdown">
          <span class="nav-link dropdown-trigger">Categorías</span>
          <div class="dropdown-menu">
            <router-link v-for="cat in categories" :key="cat.id" :to="`/categoria/${cat.id}`" class="dropdown-item">
              {{ cat.name }}
            </router-link>
          </div>
        </div>
        <router-link to="/nosotros" class="nav-link">Nosotros</router-link>
        <router-link to="/contacto" class="nav-link">Contacto</router-link>
      </div>

      <div class="logo">
        <router-link to="/" class="logo-text">My peace</router-link>
      </div>

      <div class="nav-actions">
        <!-- Theme Toggle -->
        <button class="icon-btn theme-toggle" @click="toggleTheme" :title="isDark ? 'Modo Claro' : 'Modo Oscuro'">
          <svg v-if="isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.5">
            <circle cx="12" cy="12" r="5"></circle>
            <path
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42">
            </path>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <div class="search-container" :class="{ 'active': isSearchActive }">
          <input v-if="isSearchActive" type="text" v-model="searchStore.searchQuery" placeholder="Buscar productos..."
            class="search-input" @keydown.esc="isSearchActive = false" ref="searchInput">
          <button class="icon-btn" aria-label="Buscar" @click="toggleSearch">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21L16.65 16.65"></path>
            </svg>
          </button>
        </div>
        <router-link v-if="!authStore.isAuthenticated" to="/login" class="icon-btn" title="Iniciar Sesión">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </router-link>
        <div v-else class="user-menu dropdown">
          <span class="user-link dropdown-trigger">
            <span class="user-name">{{ authStore.userName }}</span>
          </span>
          <div class="dropdown-menu">
            <router-link to="/cuenta" class="dropdown-item">Mi Perfil</router-link>
            <router-link to="/mis-pedidos" class="dropdown-item">Mis Compras</router-link>
            <div class="dropdown-divider"></div>
            <button @click="authStore.logout" class="dropdown-item logout-link">Cerrar Sesión</button>
          </div>
        </div>
        <button class="icon-btn" aria-label="Carrito" @click="cartStore.toggleCart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"></path>
            <path d="M3 6H21"></path>
            <path d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10"></path>
          </svg>
          <span v-if="cartStore.totalItems > 0" class="cart-count">{{ cartStore.totalItems }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useCartStore } from '../stores/cart';
import { useSearchStore } from '../stores/search';
import { useAuthStore } from '../stores/auth';
import tiendaApi from '../api/tiendaApi';

const cartStore = useCartStore();
const searchStore = useSearchStore();
const authStore = useAuthStore();

const isScrolled = ref(false);
const isDark = ref(false);
const isSearchActive = ref(false);
const searchInput = ref(null);
const categories = ref([]);

const toggleSearch = async () => {
  isSearchActive.value = !isSearchActive.value;
  if (isSearchActive.value) {
    await nextTick();
    searchInput.value?.focus();
  } else {
    searchStore.clearSearch();
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);

  // Check preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true;
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // Fetch categories
  try {
    const { data } = await tiendaApi.get('/categories');
    categories.value = data.data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 24px 0;
  transition: all 0.3s ease;
  z-index: 1000;
  background: transparent;
}

.navbar.scrolled {
  background: var(--sand);
  opacity: 0.98;
  backdrop-filter: blur(10px);
  padding: 16px 0;
  box-shadow: 0 1px 3px var(--border-color);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
}

.nav-link {
  font-size: 0.85rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--charcoal);
  position: relative;
  text-decoration: none;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: var(--charcoal);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* Dropdown */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--sand);
  min-width: 180px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 12px 0;
  border-radius: 4px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 100;
  border: 1px solid var(--border-color);
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 10px 20px;
  color: var(--charcoal);
  text-decoration: none;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--taupe);
}

[data-theme='dark'] .dropdown-menu {
  background: #1a1a1a;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.search-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-color);
  color: var(--charcoal);
  padding: 4px 8px;
  font-size: 0.9rem;
  width: 150px;
  outline: none;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }

  to {
    width: 150px;
    opacity: 1;
  }
}

.logo {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-text {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  letter-spacing: 4px;
  color: var(--charcoal);
  text-transform: uppercase;
  text-decoration: none;
}

.nav-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--charcoal);
  border: none;
  background: transparent;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.icon-btn:hover {
  transform: scale(1.05);
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--charcoal);
  color: var(--white);
  font-size: 0.65rem;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-link {
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.user-link:hover {
  opacity: 0.7;
}

.user-name {
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--charcoal);
  font-weight: 500;
}

.logout-btn {
  padding: 4px;
}
</style>
