<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <h3>My peace</h3>
        <p>Aromas que transforman tu espacio en un hogar. Creados artesanalmente con ingredientes naturales.</p>
      </div>
      <div class="footer-links">
        <div class="link-group">
          <h4>Tienda</h4>
          <a href="#">Velas Aromáticas</a>
          <a href="#">Difusores</a>
          <a href="#">Sprays</a>
        </div>
        <div class="link-group">
          <h4>Ayuda</h4>
          <a href="#">Envíos y Devoluciones</a>
          <a href="#">FAQ</a>
          <a href="#">Contacto</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} My peace. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--charcoal);
  color: var(--white);
  padding: 80px 40px 24px;
  margin-top: 80px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 60px;
}

.footer-brand {
  max-width: 400px;
}

.footer-brand h3 {
  color: var(--white);
  letter-spacing: 4px;
  margin-bottom: 24px;
  font-size: 1.5rem;
  font-family: var(--font-serif);
}

.footer-brand p {
  color: #a0a0a0;
  font-size: 0.95rem;
}

.footer-links {
  display: flex;
  gap: 80px;
}

.link-group h4 {
  color: var(--white);
  font-size: 0.85rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.link-group a {
  display: block;
  color: #a0a0a0;
  margin-bottom: 12px;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.link-group a:hover {
  color: var(--white);
  transform: translateX(5px);
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 24px;
  text-align: center;
  color: #777;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 48px;
  }
}
</style>
