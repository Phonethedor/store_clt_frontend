<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../../modules/cart/store/cart.store';
import { useSearchStore } from '../stores/search';
import { useAuthStore } from '../../modules/auth/store/auth.store';
import productService from '../../modules/catalog/services/product.service';

const cartStore = useCartStore();
const searchStore = useSearchStore();
const authStore = useAuthStore();

const route = useRoute();

const isScrolled = ref(false);
const isDark = ref(false);
const isSearchActive = ref(false);
const isMobileMenuOpen = ref(false);
const searchInput = ref(null);
const categories = ref([]);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : '';
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

watch(route, closeMobileMenu);

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

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true;
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  try {
    categories.value = await productService.getCategories();
  } catch (error) {
    console.error("Error al obtener categorías:", error);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = '';
});
</script>

<style lang="scss" src="../../assets/styles/components/_navbar.scss" scoped></style>

<template>
  <header class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar__container">
      <div class="navbar__links">
        <router-link to="/" class="navbar__link">Shop</router-link>
        <div class="navbar__dropdown dropdown">
          <router-link to="/categorias" class="navbar__link dropdown__trigger">Categorías</router-link>
          <div class="dropdown__menu">
            <router-link v-for="cat in categories" :key="cat.id" :to="`/categoria/${cat.id}`" class="dropdown__item">
              {{ cat.name }}
            </router-link>
          </div>
        </div>
        <router-link to="/nosotros" class="navbar__link">Nosotros</router-link>
        <router-link to="/contacto" class="navbar__link">Contacto</router-link>
      </div>

      <div class="navbar__logo logo">
        <router-link to="/" class="logo__link">My peace</router-link>
      </div>

      <div class="navbar__actions">
        <!-- Theme Toggle -->
        <button class="navbar__icon-btn" @click="toggleTheme" :title="isDark ? 'Modo Claro' : 'Modo Oscuro'">
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

        <div class="navbar__search search" :class="{ 'search--active': isSearchActive }">
          <input v-if="isSearchActive" type="text" v-model="searchStore.searchQuery" placeholder="Buscar productos..."
            class="search__input" @keydown.esc="isSearchActive = false" ref="searchInput">
          <button class="navbar__icon-btn" aria-label="Buscar" @click="toggleSearch">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21L16.65 16.65"></path>
            </svg>
          </button>
        </div>

        <router-link v-if="!authStore.isAuthenticated" to="/login" class="navbar__icon-btn" title="Iniciar Sesión">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </router-link>

        <div v-else class="navbar__user-menu user-menu dropdown">
          <span class="user-menu__trigger dropdown__trigger">
            <span class="user-menu__name">{{ authStore.userName }}</span>
          </span>
          <div class="dropdown__menu">
            <router-link to="/cuenta" class="dropdown__item">Mi Perfil</router-link>
            <router-link to="/mis-pedidos" class="dropdown__item">Mis Compras</router-link>
            <div class="dropdown__divider"></div>
            <button @click="authStore.logout" class="dropdown__item dropdown__item--logout">Cerrar Sesión</button>
          </div>
        </div>

        <button class="navbar__icon-btn navbar__icon-btn--cart" aria-label="Carrito" @click="cartStore.toggleCart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"></path>
            <path d="M3 6H21"></path>
            <path d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10"></path>
          </svg>
          <span v-if="cartStore.totalItems > 0" class="navbar__cart-count">{{ cartStore.totalItems }}</span>
        </button>

        <!-- Hamburger (mobile only) -->
        <button
          class="navbar__hamburger"
          :class="{ 'navbar__hamburger--open': isMobileMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Navigation Drawer -->
  <Transition name="mobile-nav">
    <div v-if="isMobileMenuOpen" class="mobile-nav" @click="closeMobileMenu">
      <nav class="mobile-nav__panel" @click.stop>
        <!-- Brand -->
        <div class="mobile-nav__brand">
          <router-link to="/" class="mobile-nav__brand-link" @click="closeMobileMenu">My peace</router-link>
          <button class="mobile-nav__close" @click="closeMobileMenu" aria-label="Cerrar menú">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Main links -->
        <div class="mobile-nav__links">
          <router-link to="/" class="mobile-nav__link" @click="closeMobileMenu">Shop</router-link>

          <div class="mobile-nav__group">
            <router-link to="/categorias" class="mobile-nav__link" @click="closeMobileMenu">Categorías</router-link>
            <div v-if="categories.length" class="mobile-nav__subcategories">
              <router-link
                v-for="cat in categories"
                :key="cat.id"
                :to="`/categoria/${cat.id}`"
                class="mobile-nav__sublink"
                @click="closeMobileMenu"
              >{{ cat.name }}</router-link>
            </div>
          </div>

          <router-link to="/nosotros" class="mobile-nav__link" @click="closeMobileMenu">Nosotros</router-link>
          <router-link to="/contacto" class="mobile-nav__link" @click="closeMobileMenu">Contacto</router-link>
        </div>

        <!-- Auth section -->
        <div class="mobile-nav__auth">
          <template v-if="authStore.isAuthenticated">
            <span class="mobile-nav__username">{{ authStore.userName }}</span>
            <router-link to="/cuenta" class="mobile-nav__auth-link" @click="closeMobileMenu">Mi Perfil</router-link>
            <router-link to="/mis-pedidos" class="mobile-nav__auth-link" @click="closeMobileMenu">Mis Compras</router-link>
            <button class="mobile-nav__auth-link mobile-nav__auth-link--logout" @click="() => { authStore.logout(); closeMobileMenu(); }">Cerrar Sesión</button>
          </template>
          <router-link v-else to="/login" class="mobile-nav__auth-link" @click="closeMobileMenu">Iniciar Sesión</router-link>
        </div>
      </nav>
    </div>
  </Transition>
</template>