<style lang="scss" src="../../assets/styles/views/_not-found.scss" scoped></style>

<template>
    <div class="not-found container">
        <div class="not-found-content animate-slide-up">
            <span class="error-code">404</span>
            <h1>Aroma No Encontrado</h1>
            <div class="header-line"></div>
            <p>
                Lo sentimos, la página que buscas parece haberse desvanecido en el aire.
                Tal vez el enlace sea incorrecto o el producto ya no esté disponible.
            </p>
            <div class="actions">
                <router-link to="/" class="btn-primary">Volver a la tienda</router-link>
                <router-link to="/contacto" class="btn-outline">Contactar soporte</router-link>
            </div>
        </div>

        <!-- Elementos decorativos (Scents) -->
        <div class="scent-aura aura-1"></div>
        <div class="scent-aura aura-2"></div>
    </div>
</template>