<script setup>
</script>

<style lang="scss" src="../../assets/styles/components/_footer.scss" scoped></style>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__top">
        <div class="footer__brand brand">
          <router-link to="/" class="brand__logo">My peace</router-link>
          <p class="brand__tagline">Esencias botánicas para el equilibrio diario.</p>
        </div>

        <nav class="footer__nav nav">
          <router-link to="/categorias" class="nav__link">Colecciones</router-link>
          <router-link to="/nosotros" class="nav__link">Nosotros</router-link>
          <router-link to="/contacto" class="nav__link">Contacto</router-link>
        </nav>
      </div>

      <div class="footer__bottom">
        <div class="footer__social social">
          <a href="#" class="social__link" aria-label="Instagram">Instagram</a>
          <a href="#" class="social__link" aria-label="Facebook">Facebook</a>
        </div>
        <p class="footer__copyright">&copy; {{ new Date().getFullYear() }} My peace</p>
      </div>
    </div>
  </footer>
</template>